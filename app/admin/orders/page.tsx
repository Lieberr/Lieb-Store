import { requireAdmin } from "@/lib/auth-guard";
import { auth } from "@/auth";
import { DeleteOrder, getAllOrders } from "@/actions/order.actions";
import { Metadata } from "next";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
    formatCurrency,
    formatDateTime,
    formatId,
} from "@/lib/utils";
import Pagination from "@/components/ui/shared/pagination";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/ui/shared/delete-dialog";
import {
    CheckCircle2,
    Clock3,
    PackageCheck,
    ShoppingBag,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Admin Orders",
};

const AdminOrders = async (props: {
    searchParams: Promise<{
        page: string;
        query: string;
    }>;
}) => {
    await requireAdmin();

    const { page = "1", query: searchText } = await props.searchParams;

    const session = await auth();

    if (session?.user?.role !== "admin") {
        throw new Error("User is not authorized");
    }

    const orders = await getAllOrders({
        page: Number(page),
        query: searchText,
    });

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ShoppingBag className="h-5 w-5" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Orders
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage and track customer orders.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter */}
            {searchText && (
                <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm shadow-sm">
                    <span className="text-muted-foreground">
                        Filtered by
                    </span>

                    <span className="font-medium">
                        &quot;{searchText}&quot;
                    </span>

                    <Link href="/admin/orders">
                        <Button
                            variant="outline"
                            size="sm"
                            className="ml-1 rounded-lg"
                        >
                            Remove Filter
                        </Button>
                    </Link>
                </div>
            )}

            {/* Orders Card */}
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">

                {/* Card Header */}
                <div className="border-b px-6 py-4">
                    <div>
                        <h2 className="font-semibold">
                            Order Management
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            View, manage and update customer orders.
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                <TableHead className="px-6">
                                    Order
                                </TableHead>

                                <TableHead>
                                    Date
                                </TableHead>

                                <TableHead>
                                    Buyer
                                </TableHead>

                                <TableHead>
                                    Total
                                </TableHead>

                                <TableHead>
                                    Paid
                                </TableHead>

                                <TableHead>
                                    Delivered
                                </TableHead>

                                <TableHead className="px-6 text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {orders.data.map((order) => (
                                <TableRow
                                    key={order.id}
                                    className="transition-colors hover:bg-muted/30"
                                >
                                    {/* ID */}
                                    <TableCell className="px-6">
                                        <span className="font-semibold">
                                            #{formatId(order.id)}
                                        </span>
                                    </TableCell>

                                    {/* Date */}
                                    <TableCell>
                                        <div className="text-sm">
                                            {formatDateTime(
                                                order.createdAt
                                            ).dateTime}
                                        </div>
                                    </TableCell>

                                    {/* Buyer */}
                                    <TableCell>
                                        <div className="max-w-[180px] truncate font-medium">
                                            {order.user?.name ||
                                                "Deleted User"}
                                        </div>
                                    </TableCell>

                                    {/* Total */}
                                    <TableCell>
                                        <span className="font-semibold">
                                            {formatCurrency(order.totalPrice)}
                                        </span>
                                    </TableCell>

                                    {/* Paid */}
                                    <TableCell>
                                        {order.isPaid && order.paidAt ? (
                                            <div className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Paid
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">
                                                <Clock3 className="h-3.5 w-3.5" />
                                                Pending
                                            </div>
                                        )}
                                    </TableCell>

                                    {/* Delivered */}
                                    <TableCell>
                                        {order.isDelivered &&
                                        order.deliveredAt ? (
                                            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                                                <PackageCheck className="h-3.5 w-3.5" />
                                                Delivered
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                                <Clock3 className="h-3.5 w-3.5" />
                                                Processing
                                            </div>
                                        )}
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className="rounded-lg"
                                            >
                                                <Link
                                                    href={`/order/${order.id}`}
                                                >
                                                    View Details
                                                </Link>
                                            </Button>

                                            <DeleteDialog
                                                id={order.id}
                                                action={DeleteOrder}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {/* Empty state */}
                            {orders.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="h-48 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                                            </div>

                                            <h3 className="mt-4 font-semibold">
                                                No orders found
                                            </h3>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                No customer orders match your
                                                current search.
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {orders.totalPages > 1 && (
                    <div className="border-t px-6 py-4">
                        <Pagination
                            page={Number(page) || 1}
                            totalPages={orders.totalPages}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;