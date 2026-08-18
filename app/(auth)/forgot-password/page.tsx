import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { redirect } from "next/navigation";
import ForgotPasswordForm from "./forgot-password-form";
import { auth } from "@/auth";

export const metadata:Metadata = {
    title: `Forgot Password`,
    description: `Reset your ${APP_NAME} account password`
}

const ForgotPasswordPage = async () => {
    const session = await auth();

    if(session) {
        redirect('/');
    }

    return ( <div className="mx-auto w-full max-w-[430px]">
        <Card className="border-border/50 bg-background/95 shadow-xl backdrop-blur-0">
            <CardHeader className="space-y-5 pb-6">
                <Link href='/' className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border bg-background shadow-sm translate-transform hover:scale-105">
                    <Image src='/images/logo.svg' width={42} height={42} alt={`${APP_NAME} logo`} priority />
                </Link>
                <div className="space-y-2 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Forgot your password?
                    </CardTitle>

                    <CardDescription className="mx-auto max-w-sm text-sm leading-relaxed">
                        No worries. Enter your email address and we&apos;ll send you a 
                        code to reset your password.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <ForgotPasswordForm />
            </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
            Remeber your password?{' '}
            <Link href='/sign-in' className="font-medium text-primary underline-offset-4 hover:underline">
                Back to sign in
            </Link>
        </p>
    </div> );
}
 
export default ForgotPasswordPage;