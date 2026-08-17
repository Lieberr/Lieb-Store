'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { Home, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
    const router = useRouter();

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-6">
            <div className="flex w-full max-w-md flex-col items-center text-center">

                {/* Logo */}
                <Image
                    src="/images/logo.svg"
                    width={56}
                    height={56}
                    alt={`${APP_NAME} logo`}
                    priority
                    className="mb-8"
                />

                {/* 404 */}
                <span className="text-8xl font-black tracking-tight text-primary/15 sm:text-9xl">
                    404
                </span>

                <div className="mt-4">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Página não encontrada
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                        A página que você está procurando não existe
                        ou foi movida para outro endereço.
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar
                    </Button>

                    <Button
                        onClick={() => router.push("/")}
                        className="gap-2"
                    >
                        <Home className="h-4 w-4" />
                        Ir para o início
                    </Button>
                </div>

                {/* Footer */}
                <p className="mt-10 text-xs text-muted-foreground">
                    {APP_NAME}
                </p>
            </div>
        </main>
    );
};

export default NotFoundPage;