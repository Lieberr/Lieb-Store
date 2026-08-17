import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/ui/shared/header/menu";
import MainNav from "./main-nav";

export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-background">

            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur">
                <div className="container mx-auto flex h-16 items-center px-6 lg:px-8">

                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center transition-opacity hover:opacity-80"
                    >
                        <Image
                            src="/images/logo.svg"
                            height={42}
                            width={42}
                            alt={APP_NAME}
                            priority
                        />
                    </Link>

                    {/* User navigation */}
                    <MainNav className="ml-8" />

                    {/* Right side */}
                    <div className="ml-auto flex items-center">
                        <Menu />
                    </div>

                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-6 py-8 lg:px-8">
                {children}
            </main>

        </div>
    );
}