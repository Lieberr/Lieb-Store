import ModeToggle from "./mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    EllipsisVertical,
    ShoppingCartIcon,
} from "lucide-react";

import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from "@/components/ui/sheet";

import UserButton from "./user-button";

const Menu = () => {
    return (
        <div className="flex items-center justify-end">
            <nav className="hidden md:flex items-center gap-1">
                <ModeToggle />
                <Button asChild variant="ghost" className="gap-2 rounded-lg">
                    <Link href="/cart">
                        <ShoppingCartIcon className="h-5 w-5" />
                        <span>Cart</span>
                    </Link>
                </Button>
                <UserButton />
            </nav>
            <nav className="md:hidden">
                <Sheet>
                    <SheetTrigger
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-background text-foreground transition-colors
                        hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-label="Open menu"
                    >
                        <EllipsisVertical className="h-5 w-5" />
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className="flex w-[85%] max-w-sm flex-col gap-6 p-6">
                        <div>
                            <SheetTitle className="text-xl font-bold">
                                Menu
                            </SheetTitle>

                            <SheetDescription className="mt-1">
                                Manage your account and shopping options.
                            </SheetDescription>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border p-3">
                            <div>
                                <p className="text-sm font-semibold">
                                    Appearance
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    Change theme
                                </p>
                            </div>
                            <ModeToggle />
                        </div>
                        <Button
                            asChild
                            variant="ghost"
                            className="
                                h-11
                                w-full
                                justify-start
                                gap-3
                                rounded-xl
                            "
                        >
                            <Link href="/cart">
                                <ShoppingCartIcon className="h-5 w-5" />
                                <span>Shopping Cart</span>
                            </Link>
                        </Button>

                        <div className="border-t pt-4">
                            <UserButton />
                        </div>
                    </SheetContent>
                </Sheet>
            </nav>
        </div>
    );
};

export default Menu;