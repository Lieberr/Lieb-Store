'use client';

import { useState } from "react";
import { Mail, ArrowLeft, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [pending, setIsPending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = () => {
        return;
    }

    return ( 
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium">
                        Email address
                    </Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        <Input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="h-11 pl-10" />
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Enter the email address associated with your account.
                    </p>
                </div>

                {error && (
                    <div className="rounded-lg border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <Button type='submit' disabled={pending} className="h-11 w-full font-semibold text-sm shadow-sm translate-all hover:shadow-md">
                    {pending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending reset link code...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            Send reset code
                        </>
                    )}
                </Button>

                <div className="text-center">
                    <Link href='sign-in' className="inline-flex items-center text-sm font-medium text-muted-foreground translate-colors hover:text-foreground">
                        <ArrowLeft className="mr-1.5 h-4 w-4" />
                        Back to sign in
                    </Link>
                </div>
            </div>
        </form>
     );
}
 
export default ForgotPasswordForm;