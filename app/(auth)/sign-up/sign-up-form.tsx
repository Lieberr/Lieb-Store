"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signUpDefaultValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useActionState } from "react";
import { signUpUser, verifyUserEmailAction } from "@/actions/user.actions";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  KeyRound,
} from "lucide-react";

function SubmitButton({ isPending, text }: { isPending: boolean; text: string }) {
  return (
    <Button
      type="submit"
      disabled={isPending}
      className="h-11 w-full text-sm font-semibold shadow-sm transition-all hover:shadow-md"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        text
      )}
    </Button>
  );
}

const SignUpForm = () => {
  const [step, setStep] = useState<"register" | "verify">("register");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [code, setCode] = useState("");
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Action do formulário de cadastro
  const [data, action, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const res = await signUpUser(prevState, formData);

      if (res?.success) {
        setUserEmail(email);
        setUserPassword(password);
      }
      return res;
    },
    { success: false, message: "" }
  );

  const isVerificationStep =
    step === "verify" || Boolean(data?.success && userEmail);

  // Submissão do Código de Verificação
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingVerify(true);
    setVerificationError("");

    const res = await verifyUserEmailAction(
      userEmail,
      code.trim(),
      userPassword
    );

    setLoadingVerify(false);

    if (!res.success) {
      setVerificationError(res.message || "Invalid verification code.");
      toast({
        variant: "destructive",
        description: res.message || "Código inválido. Tente novamente.",
      });
      return;
    }

    toast({ description: "E-mail verificado com sucesso!" });
    router.push(callbackUrl);
  };

  // --- PASSO 2: Digitar o código enviado por e-mail ---
  if (isVerificationStep) {
    return (
      <form onSubmit={handleVerifyCode} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="code">Verification Code</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="Enter the code sent to your email"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="h-11 pl-10 text-center tracking-widest text-lg"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            We sent a verification code to <strong>{userEmail}</strong>.
          </p>
        </div>

        {verificationError && (
          <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {verificationError}
          </p>
        )}

        <SubmitButton isPending={loadingVerify} text="Verify & Complete Sign Up" />

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setUserEmail("");
              setUserPassword("");
              setStep("register");
            }}
            className="text-xs text-muted-foreground underline hover:text-foreground"
          >
            Back to registration
          </button>
        </div>
      </form>
    );
  }

  // --- PASSO 1: Form de Cadastro normal ---
  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              defaultValue={signUpDefaultValues.name}
              required
              className="h-11 pl-10"
            />
          </div>
        </div>

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
              autoComplete="email"
              defaultValue={signUpDefaultValues.email}
              required
              className="h-11 pl-10"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              defaultValue={signUpDefaultValues.password}
              required
              minLength={6}
              className="h-11 pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Use at least 6 characters.
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              defaultValue={signUpDefaultValues.password}
              required
              minLength={6}
              className="h-11 pl-10"
            />
          </div>
        </div>

        {/* Mensagem de Erro */}
        {data && !data.success && data.message && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{data.message}</span>
          </div>
        )}

        <SubmitButton isPending={isPending} text="Create account" />

        {/* Divider */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Already registered?
            </span>
          </div>
        </div>

        {/* Login */}
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;