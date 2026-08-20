// lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(to: string, code: string) {
  await transporter.sendMail({
    from: `"LiebStore" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Password recovery code',
    html: `
      <div style="font-family: sans-serif;">
        <h2>Password recovery</h2>
        <p>Your code is:</p>
        <h1 style="letter-spacing: 4px;">${code}</h1>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
}

export async function sendVerificationEmail(to: string, code: string) {
    await transporter.sendMail({
        from: `"LiebStore" <${process.env.GMAIL_USER}>`,
        to,
        subject: 'Confirm your registration email',
        html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #333; text-align: center;">Welcome to LiebStore!</h2>
            <p>Thank you for signing up. To confirm your account, use the code below:</p>
            <div style="text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0070f3; background: #f0f7ff; padding: 10px 20px; border-radius: 6px; display: inline-block;">
                ${code}
            </span>
            </div>
            <p style="color: #666; font-size: 14px;">This code is valid for 15 minutes.</p>
            <p style="color: #888; font-size: 12px; margin-top: 20px;">If you did not create an account on LiebStore, please ignore this email.</p>
        </div>
        `,
    })
}