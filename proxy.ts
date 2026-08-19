import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const nextAuth = NextAuth(authConfig);

// Declare como uma função explícita exportada como default
export default function proxy(req: any, ctx: any) {
  return nextAuth.auth(req, ctx);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};