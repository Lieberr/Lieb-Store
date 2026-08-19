'use server';

import { prisma } from "@/db/prisma";
import { generateVerificationToken } from "@/lib/tokens";
import { resend } from "@/lib/resend";
import { APP_NAME, SENDER_EMAIL, SERVER_URL } from "@/lib/constants";

// Email for confirmation
export async function sendVerificationEmailAction(email: string) {
    try {
        const verificationToken = await generateVerificationToken(email);
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || SERVER_URL;
        const confirmLink = `${appUrl}/verify-email?token=${verificationToken.token}`;

        const { error } = await resend.emails.send({
            from: `${APP_NAME} <${SENDER_EMAIL}>`,
            to: email,
            subject: "COnfirme seu endereço de e-mail",
            html:`
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>Confirme seu e-mail</h2>
                <p>Obrigado por se cadastrar! Clique no botão abaixo para ativar sua conta:</p>
                <a href="${confirmLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Confirmar E-mail
                </a>
                </div>
            `,
        });

            if (error) {
                console.error("Resend verification email error:", error);
                return { error: error.message || "Erro ao enviar e-mail de verificação" };
            }

        return {success: "E-mail de verificação enviado com sucesso"}
        } catch (error) {
            console.error("Verification email error:", error);
        return {error: "Erro ao enviar e-mail de verificação"}
    }
}

// Validation token and update database user
export async function verifyEmailTokenAction(token: string) {
    try {
        const existingToken = await prisma.verificationToken.findFirst({
      where: { token },
        });

        if(!existingToken) {
            return {
                error: "Token invalido ou inexistente"
            }
        } 

        const hasExpired = new Date(existingToken.expires) < new Date();
        if(hasExpired) {
            return {
                error: "O token expirou. Solicete uma nova verificação"
            }
        }

        const existingUser = await prisma.user.findUnique({
            where: {email: existingToken.identifier}
        })

        if(!existingUser) {
            return {
                error: "Usuario nao encontrado para este e-mail"
            }
        }

        await prisma.user.update({
            where: {id: existingUser.id},
            data: {
                emailVerified: new Date(),
                email: existingToken.identifier,
            }
        })

        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: existingToken.identifier,
                    token: existingToken.token
                }
            }
        })

        return {
            success: "Email verificado com sucesso"
        }
    } catch {
        return {
            error: "Ocorreu um erro ao verificar o e-mail"
        }
    }
}