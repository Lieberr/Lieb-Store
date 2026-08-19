import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
    providers: [],
    callbacks: {
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
    },

} satisfies NextAuthConfig;