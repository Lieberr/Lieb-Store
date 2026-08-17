import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import CredentialsSignInForm from "./credentials-signin-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `Sign In | ${APP_NAME}`,
  description: `Sign in to your ${APP_NAME} account`,
};

const SignInPage = async (props: {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className="mx-auto w-full max-w-[430px]">
      <Card className="border-border/50 bg-background/95 shadow-xl backdrop-blur">
        <CardHeader className="space-y-5 pb-6">
          {/* Logo */}
          <Link
            href="/"
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border bg-background shadow-sm transition-transform hover:scale-105"
          >
            <Image
              src="/images/logo.svg"
              width={42}
              height={42}
              alt={`${APP_NAME} logo`}
              priority
            />
          </Link>

          {/* Heading */}
          <div className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Welcome back
            </CardTitle>

            <CardDescription className="text-sm leading-relaxed">
              Sign in to your {APP_NAME} account to continue.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <CredentialsSignInForm />
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        By signing in, you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};

export default SignInPage;