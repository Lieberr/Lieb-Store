'use client';
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { 
    DropdownMenu, 
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuGroup
} from "@/components/ui/dropdown-menu";

import {SunIcon, MoonIcon, SunMoon} from 'lucide-react'
import { Button } from "@/components/ui/button";

const ModeToggle = () => {

    const [mounted, setMounted] = useState(false);
    const {theme, setTheme} = useTheme();


    useEffect(() => {
        setMounted(true)
    }, []);


    if(!mounted) {
        return null;
    }

    return ( 
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant='ghost' className='focus-visible:ring-0 focus-visible:ring-offset-0'>
                    {theme === 'system' ? (
                        <SunMoon />
                    ) : theme === 'dark' ? (
                        <MoonIcon />
                    ) : (
                        <SunIcon />
                    )}
                </Button> 
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>
                        Appearance
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked={theme === 'system'} onClick={() => setTheme('system')}>
                        System
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={theme === 'dark'} onClick={() => setTheme('dark')}>
                        Dark
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={theme === 'light'} onClick={() => setTheme('light')}>
                        Light
                    </DropdownMenuCheckboxItem>
                    </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
     );
}
 
export default ModeToggle;