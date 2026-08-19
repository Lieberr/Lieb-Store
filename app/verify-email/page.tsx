'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { verifyEmailTokenAction } from "@/actions/auth.actions";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        startTransition(async () => {
            const res = await verifyEmailTokenAction(token);
            if (res.error) setError(res.error);
            if (res.success) setSuccess(res.success);
        });
    }, [token]);

    const displayError = !token ? "Token ausente na URL" : error;

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md rounded-lg border p-6 text-center shadow-sm">
                <h1 className="text-xl font-semibold mb-4">Confirmação de E-mail</h1>

                {/* 1. Estado de Carregamento */}
                {isPending && (
                    <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <p>Validating your email...</p>
                    </div>
                )}

                {/* 2. Estado de Sucesso */}
                {!isPending && success && (
                    <div>
                        <p className="text-emerald-600 font-medium mb-4">{success}</p>
                        <Link href="/sign-in" className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm">
                            Go to Sign In
                        </Link>
                    </div>
                )}

                {/* 3. Estado de Erro */}
                {!isPending && displayError && !success && (
                    <div>
                        <p className="text-red-500 font-medium mb-4">{displayError}</p>
                        <Link href="/sign-in" className="text-sm underline">
                            Return to the home page
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}