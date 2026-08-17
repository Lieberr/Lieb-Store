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
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: `Create Account | ${APP_NAME}`,
  description: `Create your ${APP_NAME} account`,
};

const SignUpPage = async (props: {
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

          <div className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Create your account
            </CardTitle>

            <CardDescription className="text-sm leading-relaxed">
              Join {APP_NAME} today and start exploring everything we have to
              offer.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
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

export default SignUpPage;