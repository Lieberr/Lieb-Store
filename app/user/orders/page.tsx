import { Metadata } from "next";
import { getMyOrders } from "@/actions/order.actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/ui/shared/pagination";
import {
    CheckCircle2,
    Clock3,
    PackageCheck,
    ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "My Orders",
};

const OrdersPage = async (props: {
    searchParams: Promise<{ page: string }>;
}) => {
    const { page } = await props.searchParams;

    const orders = await getMyOrders({
        page: Number(page) || 1,
    });

    return (
        <div className="space-y-8">

            {/* Page Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShoppingBag className="h-5 w-5" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        My Orders
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        View and track your recent orders.
                    </p>
                </div>
            </div>

            {/* Orders Card */}
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">

                {/* Card Header */}
                <div className="border-b px-6 py-4">
                    <div>
                        <h2 className="font-semibold">
                            Order History
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {orders.data.length}{" "}
                            {orders.data.length === 1
                                ? "order"
                                : "orders"}{" "}
                            on this page
                        </p>
                    </div>
                </div>

                {/* Orders Table */}
                {orders.data.length > 0 && (
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
                                        Total
                                    </TableHead>

                                    <TableHead>
                                        Payment
                                    </TableHead>

                                    <TableHead>
                                        Delivery
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

                                        {/* Order ID */}
                                        <TableCell className="px-6">
                                            <span className="font-semibold">
                                                #{formatId(order.id)}
                                            </span>
                                        </TableCell>

                                        {/* Date */}
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">
                                                {formatDateTime(
                                                    order.createdAt
                                                ).dateTime}
                                            </span>
                                        </TableCell>

                                        {/* Total */}
                                        <TableCell>
                                            <span className="font-semibold">
                                                {formatCurrency(
                                                    order.totalPrice
                                                )}
                                            </span>
                                        </TableCell>

                                        {/* Payment Status */}
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

                                        {/* Delivery Status */}
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

                                        {/* Action */}
                                        <TableCell className="px-6 text-right">
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
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Empty State */}
                {orders.data.length === 0 && (
                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                        </div>

                        <h3 className="mt-4 font-semibold">
                            No orders yet
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Your orders will appear here once you make a
                            purchase.
                        </p>
                    </div>
                )}

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

export default OrdersPage;