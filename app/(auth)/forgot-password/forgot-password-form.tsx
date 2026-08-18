'use client';

import { useState, useTransition } from "react";
import { Mail, ArrowLeft, Send, Loader2, KeyRound, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendResetCodeAction, verifyResetCodeAction, resetPasswordAction } from "@/actions/password-reset.actions";

type Step = 'request_email' | 'verify_code' | 'reset_password' | 'completed';

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>('request_email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', email);

      const result = await sendResetCodeAction(null, formData);

      if (result.success) {
        setStep('verify_code');
      } else {
        setError(result.message || 'Failed to send reset code');
      }
    });
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      const result = await  verifyResetCodeAction(email, code);

      if (result?.success) {
        setStep('reset_password');
      } else {
        setError(result.message || 'Invalid code');
      }
    });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('code', code);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);

      const result = await resetPasswordAction(null, formData);

      if (result.success) {
        setStep('completed');
      } else {
        setError(result.message || 'Failed to reset password');
      }
    });
  };

  if (step === 'completed') {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Password updated!</h3>
          <p className="text-sm text-muted-foreground">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
        </div>
        <Button asChild className="w-full h-11 font-semibold">
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          {error}
        </div>
      )}

      {step === 'request_email' && (
        <form onSubmit={handleSendCode} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 pl-10"
              />
            </div>
          </div>

          <Button type="submit" disabled={isPending} className="h-11 w-full font-semibold text-sm">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset code...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send reset code
              </>
            )}
          </Button>
        </form>
      )}

      {step === 'verify_code' && (
        <form onSubmit={handleVerifyCode} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="code" className="text-sm font-medium">Verification Code</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="code"
                type="text"
                maxLength={6}
                placeholder="123456"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-11 pl-10 tracking-widest font-mono text-lg"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the 6-digit code sent to <span className="font-medium text-foreground">{email}</span>.
            </p>
          </div>

          <Button type="submit" disabled={isPending} className="h-11 w-full font-semibold text-sm">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying code...
              </>
            ) : (
              'Verify Code'
            )}
          </Button>
        </form>
      )}

      {step === 'reset_password' && (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 pl-10"
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isPending} className="h-11 w-full font-semibold text-sm">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      )}

      <div className="text-center">
        <Link href="/sign-in" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}