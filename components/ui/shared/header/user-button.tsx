import Link from "next/link";
import { auth } from "@/auth";
import { signOutUser } from "@/actions/user.actions";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Package, ShieldCheck, UserIcon, UserRound } from "lucide-react";

const UserButton = async () => {
    const session = await auth();

    if (!session) {
       return (
         <Button asChild className="rounded-lg gap-2">
            <Link href='/sign-in'>
                <UserIcon className="h-4 w-4"/>
                <span>Sign In</span>
            </Link>
        </Button>
       );
    }

    const firstInitial = session?.user?.name?.charAt(0).toUpperCase() ?? '';

    return ( 
        <div className="flex items-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild> 
                   <Button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground
                   text-sm font-semibold transition-colors hover:scale-105 focus:outline-none focus-visible:ring-2
                   focus-visible:ring-primary focus-visible:ring-offset-2" aria-label="User menu">
                    {firstInitial}
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-60' sideOffset={8} align="end">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel className='font-normal'>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                                        {firstInitial}
                                    </div>
                                     <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold">
                                            {session?.user?.name}
                                        </p>

                                        <p className="truncate text-xs text-muted-foreground">
                                            {session?.user?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                       <DropdownMenuItem asChild>
                            <Link
                                href="/user/profile"
                                className="cursor-pointer"
                            >
                                <UserRound className="mr-2 h-4 w-4" />
                                User Profile
                            </Link>
                        </DropdownMenuItem>

                         <DropdownMenuItem asChild>
                            <Link
                                href="/user/orders"
                                className="cursor-pointer"
                            >
                                <Package className="mr-2 h-4 w-4" />
                                Order History
                            </Link>
                        </DropdownMenuItem>

                        {session?.user?.role === 'admin' && (
                            <DropdownMenuItem asChild>
                                <Link
                                    href="/admin/overview"
                                    className="cursor-pointer"
                                >
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Admin
                                </Link>
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuItem className="mt-1 p-0">
                            <form
                                action={signOutUser}
                                className="w-full"
                            >
                                <Button
                                    type="submit"
                                    variant="ghost"
                                    className="
                                        h-9
                                        w-full
                                        justify-start
                                        px-2
                                        font-normal
                                        text-destructive
                                        hover:bg-destructive/10
                                        hover:text-destructive
                                    "
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </Button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
 
export default UserButton;