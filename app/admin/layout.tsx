import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/ui/shared/header/menu";
import MainNav from "./main-nav";
import AdminSearch from "@/components/admin/admin-search";
import { requireAdmin } from "@/lib/auth-guard";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    await requireAdmin();
    return (
        <div className="min-h-screen bg-background">

            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur">
                <div className="container mx-auto flex h-16 min-w-0 items-center px-4 sm:px-6">

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

                    <MainNav className="ml-8" />

                    <div className="ml-auto flex items-center gap-3">
                        <AdminSearch />
                        <Menu />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                {children}
            </main>

        </div>
    );
}