import { getAllCategories } from "@/actions/product.actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../select";
import { Input } from "../../input";
import { Button } from "../../button";
import { SearchIcon } from "lucide-react";

const Search = async () => {
    const categories = await getAllCategories();
    
    return ( <form action='/search' method="GET" className="w-full max-w-2xl">
        <div className="flex w-full items-center gap-2 rounded-lg border border-border/70 bg-muted/30 p-1 transition-colors focus-within:border-primary/50 focus-within:bg-background">
            <Select name="category">
                <SelectTrigger className="w-[110px] sm:w-[130px] border-0 bg-transparent shadow-none focus:ring-0">
                    <SelectValue placeholder='All' />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem key='All' value="all">
                        All
                    </SelectItem>
                    {categories.map((x) => (
                        <SelectItem key={x.category} value={x.category}>
                            {x.category}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Input
            name="q"
            type="text"
            placeholder="Search products..."
            className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button size='icon' className="rounded-lg shrink-0" aria-label="Search">
                <SearchIcon className="h-4 w-4" />
            </Button>
        </div>
    </form> );
}
 
export default Search;