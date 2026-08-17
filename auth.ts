import NextAuth from 'next-auth';
import {PrismaAdapter} from '@auth/prisma-adapter';
import {prisma} from "@/db/prisma"
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


export const config = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in'
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
           credentials: {
            email: {type: 'email'},
            password: {type: 'password'}
           },
           async authorize(credentials) {
            if (credentials == null) return null;

            //find user in database
            const user = await prisma.user.findFirst({
                where: {
                    email: credentials.email as string
                }
            });

            //check if user exists
            if(user && user.password) {
                const isMatch = compareSync(credentials.password as string, user.password)
                
                //if password is correct return user
                if (isMatch) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    }
                }
            }

            // if user does not exist or password does not match return null
            return null;
           }
        })
    ],
    callbacks: {
  
        async jwt({token, user, trigger, session}: any) {
            // assign user fields to token
            if (user) {
                token.id = user.id;
                token.role = user.role;

                // if user has no nome then use the email
                if (user.name === 'NO_NAME') {
                    token.name = user.email!.split('@')[0];

                    // Update database to reflect the token name
                    await prisma.user.update({
                        where: {id: user.id},
                        data: {name: token.name}
                    })
                }
                if(trigger === 'signIn' || trigger === 'signUp') {
                    const cookiesObject = await cookies();
                    const sessionCartId = cookiesObject.get('sessionCartId')?.value;

                    if(sessionCartId) {
                        const sessionCart = await prisma.cart.findFirst({
                            where: {sessionCartId}
                        });

                        if(sessionCart) {
                            await prisma.cart.deleteMany({
                                where: {userId: user.id}
                            });

                            await prisma.cart.update({
                                where: {id: sessionCart.id},
                                data: {userId: user.id}
                            })
                        }
                    }
                }
            }

            if(trigger === 'update') {
                if(session?.user.name) {
                    token.name = session.user.name;
                }
                // Atualizar role do banco de dados quando houver update de sessão
                if(token.id) {
                    const updatedUser = await prisma.user.findUnique({
                        where: {id: token.id},
                        select: {role: true}
                    });
                    if(updatedUser) {
                        token.role = updatedUser.role;
                    }
                }
            }
            return token;
        },
        async session({session, token}: any) {
            if (session.user && token.id) {
                session.user.id = token.id;
            }
            if (token.role) {
                session.user = {
                    ...session.user,
                    role: token.role,
                };
            }
            return session;
        },
        authorized({request, auth}: any) {
            // Rotas protegidas dentro de um array
            const protectedPaths = [
                /\/shipping-address/,
                /\/payment-method/,
                /\/place-order/,
                /\/profile/,
                /\/user\/(.*)/,
                /\/order\/(.*)/,
                /\/admin/,
            ];

            // Pegar o pathname ex; rota1/145/oi
            const {pathname} = request.nextUrl;

            // verifica se usuario esta logado e se a rota que ele esta tentando acessar é uma das protegidas
            if(!auth && protectedPaths.some((p) => p.test(pathname))) return false;

            // Validação de admin - impedir acesso se role não for admin
            if(/\/admin/.test(pathname) && auth?.user?.role !== 'admin') {
                return false;
            }

            // Check for session cart cookie
            if(!request.cookies.get('sessionCartId')) {
                //generate new session cart id cookie
                const sessionCartId = crypto.randomUUID();

                //Clone the request headers
                const newRequestheaders = new Headers(request.headers)

                // Create new responde and add the new header
                const response = NextResponse.next({
                    request: {
                        headers: newRequestheaders
                    }
                });

                //Set newly generated sessionCartId in the responde cookies
                response.cookies.set('sessionCartId', sessionCartId);

                return response;
            } else {
                return true;
            }
        }
    }
} satisfies NextAuthConfig;

export const {handlers, auth, signIn, signOut} = NextAuth(config)