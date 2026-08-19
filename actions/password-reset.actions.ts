'use server';

import { 
  forgotPasswordSchema, 
  verifyCodeSchema, 
  resetPasswordSchema 
} from "@/lib/validators";
import { 
  generateResetCode, 
  hashResetCode, 
  getResetCodeExpiration 
} from "@/lib/password-reset"; 
import { resend } from "@/lib/resend"; 
import { prisma } from "@/db/prisma"; 
import { hash } from "@/lib/encrypt";
import { formatError } from "@/lib/utils";
import { APP_NAME, SENDER_EMAIL } from "@/lib/constants";

// Action 1
export async function sendResetCodeAction(prevState: unknown, formData: FormData) {
  try {
    const email = formData.get("email");
    const validation = forgotPasswordSchema.safeParse({ email });

    if (!validation.success) {
      return {
        success: false,
        message: validation.error.flatten().fieldErrors.email?.[0] || "Invalid email",
      };
    }

    const user = await prisma.user.findUnique({
      where: { email: validation.data.email },
    });

    if (!user) {
      return { success: true, message: "If account exists, code was sent." };
    }

    const code = generateResetCode();
    const tokenHash = hashResetCode(code);
    const expiresAt = getResetCodeExpiration();

    await prisma.passwordResetTokenUser.deleteMany({
      where: { email: validation.data.email },
    });

    await prisma.passwordResetTokenUser.create({
      data: {
        email: validation.data.email,
        tokenHash,
        expiresAt,
      },
    });

    await resend.emails.send({
      from: `${APP_NAME} <${SENDER_EMAIL}>`,
      to: validation.data.email,
      subject: "Password Reset Code",
      html: `<p>Your password reset code is: <strong>${code}</strong></p><p>This code expires in 15 minutes.</p>`,
    });

    return { success: true, message: "Code sent successfully" };
  } catch (error) {
    return { success: false, message: await formatError(error) };
  }
}

// Action 2
export async function verifyResetCodeAction(email: string, code: string) {
  try {
    const validation = verifyCodeSchema.safeParse({ email, code });

    if (!validation.success) {
      return {
        success: false,
        message: validation.error.flatten().fieldErrors.code?.[0] || "Invalid code format",
      };
    }

    const tokenHash = hashResetCode(code);

    const tokenRecord = await prisma.passwordResetTokenUser.findFirst({
      where: { email, tokenHash },
    });

    if (!tokenRecord) {
      return { success: false, message: "Invalid reset code" };
    }

    if (tokenRecord.expiresAt < new Date()) {
      return { success: false, message: "Code has expired. Please request a new one." };
    }

    return { success: true, message: "Code verified successfully" };
  } catch (error) {
    return { success: false, message: await formatError(error) };
  }
}

export async function resetPasswordAction(prevState: unknown, formData: FormData) {
  try {
    const rawData = {
      email: formData.get("email"),
      code: formData.get("code"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const validation = resetPasswordSchema.parse(rawData);

    const tokenHash = hashResetCode(validation.code);
    const tokenRecord = await prisma.passwordResetTokenUser.findFirst({
      where: { email: validation.email, tokenHash },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return { success: false, message: "Session expired. Request a new code." };
    }

    const hashedPassword = await hash(validation.password);

    await prisma.user.update({
      where: { email: validation.email },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetTokenUser.deleteMany({
      where: { email: validation.email },
    });

    return { success: true, message: "Password updated successfully" };
  } catch (error) {
    return { success: false, message: await formatError(error) };
  }
}