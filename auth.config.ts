import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
    providers: [],
    callbacks: {
        authorized({ request, auth }: any) {
            const protectedPaths = [
                /\/shipping-address/,
                /\/payment-method/,
                /\/place-order/,
                /\/profile/,
                /\/user\/(.*)/,
                /\/order\/(.*)/,
                /\/admin/,
            ];

            const { pathname } = request.nextUrl;
            const isProtected = protectedPaths.some((p) => p.test(pathname));

            // 1. Não logado tentando acessar rota protegida -> manda para login (return false)
            if (!auth && isProtected) return false;

            // 2. Logado tentando acessar /admin sem ser admin -> redireciona para a home (evita o loop com /sign-in)
            if (/\/admin/.test(pathname) && auth?.user?.role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url));
            }

            // 3. Cookie de carrinho
            if (!request.cookies.get('sessionCartId')) {
                const sessionCartId = crypto.randomUUID();
                const newRequestheaders = new Headers(request.headers);

                const response = NextResponse.next({
                    request: {
                        headers: newRequestheaders,
                    },
                });

                response.cookies.set('sessionCartId', sessionCartId);
                return response;
            }

            return true;
        },
    },
} satisfies NextAuthConfig;