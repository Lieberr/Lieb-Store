"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

import {
    SunIcon,
    MoonIcon,
    SunMoon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const ModeToggle = () => {
    const [mounted, setMounted] = useState(false);

    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                    aria-label="Change theme"
                >
                    {theme === "system" ? (
                        <SunMoon className="h-5 w-5" />
                    ) : theme === "dark" ? (
                        <MoonIcon className="h-5 w-5" />
                    ) : (
                        <SunIcon className="h-5 w-5" />
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>

                    <DropdownMenuLabel>
                        Appearance
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuCheckboxItem
                        checked={theme === "system"}
                        onClick={() => setTheme("system")}
                    >
                        System
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuCheckboxItem
                        checked={theme === "dark"}
                        onClick={() => setTheme("dark")}
                    >
                        Dark
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuCheckboxItem
                        checked={theme === "light"}
                        onClick={() => setTheme("light")}
                    >
                        Light
                    </DropdownMenuCheckboxItem>

                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ModeToggle;