'use client';

import { usePathname, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "../ui/button";

const AdminSearch = () => {
    const pathname = usePathname();

    const formActionUrl = pathname.includes('/admin/orders')
        ? '/admin/orders'
        : pathname.includes('/admin/users')
        ? '/admin/users'
        : '/admin/products';

    const searchParams = useSearchParams();

    const [queryValue, setQueryValue] = useState(
        searchParams.get('query') || ''
    );

    return (
        <form
            action={formActionUrl}
            method="GET"
            className="flex items-center gap-2"
        >
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    type="search"
                    placeholder="Search..."
                    name="query"
                    value={queryValue}
                    onChange={(e) => setQueryValue(e.target.value)}
                    className="h-9 w-[180px] pl-9 lg:w-[260px]"
                />
            </div>

            <Button
                type="submit"
                size="sm"
                className="h-9"
            >
                Search
            </Button>
        </form>
    );
};

export default AdminSearch;