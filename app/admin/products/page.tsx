import Link from "next/link";
import { getAllProducts, deleteProduct } from "@/actions/product.actions";
import { formatCurrency, formatId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import Pagination from "@/components/ui/shared/pagination";
import DeleteDialog from "@/components/ui/shared/delete-dialog";
import { requireAdmin } from "@/lib/auth-guard";
import {
    Package,
    Plus,
    Search,
    Star,
    AlertCircle
} from "lucide-react";

const AdminProductsPage = async (props: {
    searchParams: Promise<{
        page: string;
        query: string;
        category: string;
    }>;
}) => {
    await requireAdmin();

    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const searchText = searchParams.query || "";
    const category = searchParams.category || "";

    const products = await getAllProducts({
        query: searchText,
        page,
        category
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Package className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Products
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage your store products, prices and inventory.
                        </p>
                    </div>
                </div>

                <Button asChild className="rounded-lg">
                    <Link href="/admin/products/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Product
                    </Link>
                </Button>

            </div>

            {searchText && (
                <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2 text-sm">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            Filtered by
                        </span>

                        <span className="font-medium">
                            &quot;{searchText}&quot;
                        </span>
                    </div>

                    <Link href="/admin/products">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg"
                        >
                            Remove Filter
                        </Button>
                    </Link>

                </div>
            )}

            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className="border-b px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold">
                                Product Catalog
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {products.data.length}{" "}
                                {products.data.length === 1
                                    ? "product"
                                    : "products"}{" "}
                                displayed
                            </p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                <TableHead className="px-6">
                                    ID
                                </TableHead>

                                <TableHead>
                                    Product
                                </TableHead>

                                <TableHead className="text-right">
                                    Price
                                </TableHead>

                                <TableHead>
                                    Category
                                </TableHead>

                                <TableHead>
                                    Stock
                                </TableHead>

                                <TableHead>
                                    Rating
                                </TableHead>

                                <TableHead className="px-6 text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {products.data.map((product) => {
                                const lowStock =
                                    product.stock > 0 &&
                                    product.stock <= 5;

                                const outOfStock =
                                    product.stock === 0;

                                return (
                                    <TableRow
                                        key={product.id}
                                        className="transition-colors hover:bg-muted/30"
                                    >

                                        <TableCell className="px-6">
                                            <span className="font-mono text-xs text-muted-foreground">
                                                #{formatId(product.id)}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            <div className="font-medium">
                                                {product.name}
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <span className="font-semibold">
                                                {formatCurrency(product.price)}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                                                {product.category}
                                            </span>
                                        </TableCell>

                                        <TableCell>

                                            {outOfStock ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                    Out of stock
                                                </span>
                                            ) : lowStock ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">
                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                    {product.stock} left
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                                                    {product.stock} in stock
                                                </span>
                                            )}

                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-1">

                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

                                                <span className="font-medium">
                                                    {product.rating}
                                                </span>

                                            </div>
                                        </TableCell>

                                        <TableCell className="px-6">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-lg"
                                                >
                                                    <Link
                                                        href={`/admin/products/${product.id}`}
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>

                                                <DeleteDialog
                                                    id={product.id}
                                                    action={deleteProduct}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {products.data.length === 0 && (
                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                            <Package className="h-6 w-6 text-muted-foreground" />
                        </div>

                        <h3 className="mt-4 font-semibold">
                            No products found
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Try changing your search or create a new product.
                        </p>

                        <Button
                            asChild
                            className="mt-5 rounded-lg"
                        >
                            <Link href="/admin/products/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Product
                            </Link>
                        </Button>

                    </div>
                )}

                {products.totalPages > 1 && (
                    <div className="border-t px-6 py-4">
                        <Pagination
                            page={page}
                            totalPages={products.totalPages}
                        />
                    </div>
                )}

            </div>

        </div>
    );
};

export default AdminProductsPage;