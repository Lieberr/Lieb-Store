'use client';

import { usePathname, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { useState } from "react";

const AdminSearch = () => {
    const pathname = usePathname();
    const formActionUrl = pathname.includes('/admin/orders') ? '/admin/orders' : pathname.includes('/admin/users') ? '/admin/users' : '/admin/products';
    const searchParams = useSearchParams();
    const [queryValue, setQueryValue] = useState(searchParams.get('query') || '');

    return ( <form action={formActionUrl} method="GET">
        <Input
        type="search"
        placeholder="Search..."
        name="query"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value) }
        className="md:w-[100px] lg:w-[300px]" />
        <button className="quey-only" type="submit">
            Search
        </button>
    </form> );
}
 
export default AdminSearch;