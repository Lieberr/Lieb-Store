'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Menu as MenuIcon,
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
} from "lucide-react";
import React from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const links = [
    {
        title: "Overview",
        href: "/admin/overview",
        icon: LayoutDashboard,
    },
    {
        title: "Products",
        href: "/admin/products",
        icon: Package,
    },
    {
        title: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
    },
];

const MainNav = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) => {
    const pathname = usePathname();

    return (
        <>
            <nav
                className={cn("hidden items-center gap-1 md:flex", className)}
                {...props}
            >
                {links.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>

            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-background text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-label="Open admin navigation"
                    >
                        <MenuIcon className="h-5 w-5" />
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[85%] max-w-sm p-6">
                        <SheetTitle>Admin navigation</SheetTitle>
                        <SheetDescription className="mt-1">
                            Select a section to continue.
                        </SheetDescription>
                        <nav className="mt-6 grid gap-2">
                            {links.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    pathname === item.href ||
                                    pathname.startsWith(`${item.href}/`);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.title}
                                    </Link>
                                );
                            })}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
};

export default MainNav;