import { prisma } from "@/db/prisma";
import crypto from 'crypto';

export async function generateVerificationToken(email: string) {
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 3600 * 1000) // Expires in 1 hopur

    const existingToken = await prisma.verificationToken.findFirst({
        where: { identifier: email },
    });

    if (existingToken) {
        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: email,
                    token: existingToken.token
                }
            }
        })
    }

    return await prisma.verificationToken.create({
        data: {
            identifier: email,
            token,
            expires
        }
    })
}