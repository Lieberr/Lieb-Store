import { getAllCategories } from "@/actions/product.actions";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../drawer";
import { Button } from "../../button";
import { ChevronRight, MenuIcon } from "lucide-react";
import Link from "next/link";

const CategoryDropDrawer = async () => {
    const categories = await getAllCategories();

    return ( <Drawer direction="left">

        <DrawerTrigger asChild>
            <Button variant='outline' size='icon' className="rounded-xl border-border/70
            bg-brackground hover:bg-muted transition-colors" aria-label="Open categories">
                <MenuIcon className="h-5 w-5" />
            </Button>
        </DrawerTrigger>

        <DrawerContent className="h-full max-w-sm rounded-r-2xl">
            <DrawerHeader className="border-b px-6 py-5 text-left">
                <DrawerTitle className="text-xl font-bold">Select a category</DrawerTitle>
                <DrawerDescription>
                    Explore our products by category.
                </DrawerDescription>

                <div className="flex flex-col gap-1 px-4 py-5">
                    {categories.map((x) => (
                        <Button variant='ghost' className="h-11 w-full justify-between rounded-lg px-3 font-medium hover:bg-muted" key={x.category} asChild>
                            <DrawerClose asChild>
                                <Link href={`/search?category=${x.category}`}>
                                    <span>{x.category}</span>

                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <span className="text-xs">
                                            {x._count}
                                        </span>

                                        <ChevronRight className="h-4 w-4" />
                                    </span>
                                </Link>
                            </DrawerClose>
                        </Button>
                    ))}
                </div>
            </DrawerHeader>
        </DrawerContent>
    </Drawer> );
}
 
export default CategoryDropDrawer;