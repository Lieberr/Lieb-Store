import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from "@/db/prisma";
import CredentialsProvider from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import LinkedinProvider from 'next-auth/providers/linkedin';
import { compare } from './lib/encrypt';
import { authConfig } from './auth.config';

export const config = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in'
    },
    session: {
        strategy: 'jwt' as const,
        maxAge: 30 * 24 * 60 * 60 // 30 dias
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        LinkedinProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
            authorization: {
                params: { scope: 'openid profile email' }
            }
        }),
        CredentialsProvider({
            credentials: {
                email: { type: 'email' },
                password: { type: 'password' }
            },
            async authorize(credentials) {
                if (credentials == null) return null;

                const user = await prisma.user.findFirst({
                    where: { email: credentials.email as string }
                });

                if (user && user.password) {
                    const isMatch = await compare(credentials.password as string, user.password);

                    if (isMatch) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            image: user.image,
                        };
                    }
                }
                return null;
            }
        })
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user, trigger, session }: any) {
            if (user) {
                token.id = user.id;
                token.role = user.role || 'user';
                token.picture = user.image;

                if (!user.name || user.name === "NO_NAME") {
                    token.name = user.email!.split('@')[0];

                    await prisma.user.update({
                        where: { id: user.id },
                        data: { name: token.name }
                    });
                }

                if (trigger === 'signIn' || trigger === 'signUp') {
                    const cookiesObject = await cookies();
                    const sessionCartId = cookiesObject.get('sessionCartId')?.value;

                    if (sessionCartId) {
                        const sessionCart = await prisma.cart.findFirst({
                            where: { sessionCartId }
                        });

                        if (sessionCart) {
                            await prisma.cart.deleteMany({
                                where: { userId: user.id }
                            });

                            await prisma.cart.update({
                                where: { id: sessionCart.id },
                                data: { userId: user.id }
                            });
                        }
                    }
                }
            }

            // Garante a busca da role caso o token exista mas a role ainda esteja nula/indefinida
            if (token.id && !token.role) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id },
                    select: { role: true, image: true }
                });
                if (dbUser) {
                    token.role = dbUser.role;
                    if (dbUser.image) token.picture = dbUser.image;
                }
            }

            if (trigger === 'update') {
                if (session?.user?.name) {
                    token.name = session.user.name;
                }
                if(session?.user?.image !== undefined) {
                    token.picture = session.user.image;
                }
                if (token.id) {
                    const updatedUser = await prisma.user.findUnique({
                        where: { id: token.id },
                        select: { role: true, image: true }
                    });
                    if (updatedUser) {
                        token.role = updatedUser.role;
                        token.picture = updatedUser.image;
                    }
                }
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user && token.id) {
                session.user.id = token.id;
            }
            if (token.role) {
                session.user = {
                    ...session.user,
                    role: token.role,
                    name: token.name,
                    image: token.picture ?? null
                };
            }
            return session;
        },
    }
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);