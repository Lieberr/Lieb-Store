import ModeToggle from "./mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EllipsisVertical, ShoppingCartIcon, UserIcon } from "lucide-react";
import {Sheet, SheetTrigger,SheetContent, SheetDescription, SheetTitle} from '@/components/ui/sheet'
import UserButton from "./user-button";

const Menu = () => {
    return ( 
        <div className="flex justify-end gap-3">
            <nav className="hidden md:flex w-full max-w-xs gap-1">
                <ModeToggle />
                    <Button asChild variant='ghost'>
                        <Link href='/cart'>
                            <ShoppingCartIcon /> Cart
                        </Link>
                    </Button>

                   <UserButton />
            </nav>
            <nav className="md:hidden">
                <Sheet>
                    <SheetTrigger className='align-middle'>
                        <EllipsisVertical />
                    </SheetTrigger>
                    <SheetContent className='flex flex-col items-start gap- p-6'>
                        <SheetTitle>
                            Menu
                        </SheetTitle>
                        
                        <ModeToggle />
                        <Button asChild variant='ghost'>
                            <Link href='/cart'> 
                                <ShoppingCartIcon /> Cart
                            </Link>
                        </Button>

                        <UserButton />


                        <SheetDescription>

                        </SheetDescription>
                    </SheetContent>
                </Sheet>
            </nav>
        </div>
     );
}
 
export default Menu;