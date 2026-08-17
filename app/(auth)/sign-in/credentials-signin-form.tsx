"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signInDefaultValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithCredentials } from "@/actions/user.actions";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Loader2,
  AlertCircle,
} from "lucide-react";

const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full text-sm font-semibold shadow-sm transition-all hover:shadow-md"
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input
        type="hidden"
        name="callbackUrl"
        value={callbackUrl}
      />

      <div className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              defaultValue={signInDefaultValues.email}
              className="h-11 pl-10"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>

            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              defaultValue={signInDefaultValues.password}
              className="h-11 pl-10"
            />
          </div>
        </div>

        {/* Error */}
        {data && !data.success && data.message && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

            <span>{data.message}</span>
          </div>
        )}

        {/* Submit */}
        <SignInButton />

        {/* Divider */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>

          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              New here?
            </span>
          </div>
        </div>

        {/* Sign Up */}
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;