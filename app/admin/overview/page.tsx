import { getOrderSummary } from "@/actions/order.actions";
import { auth } from "@/auth";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    formatCurrency,
    formatDateTime,
    formatNumber,
} from "@/lib/utils";
import {
    BadgeDollarSign,
    Barcode,
    CreditCard,
    Users,
    ArrowUpRight,
    ShoppingCart,
    Package,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import Charts from "./charts";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
    title: "Admin Dashboard",
};

const AdminOverviewPage = async () => {
    await requireAdmin();

    const session = await auth();

    if (session?.user?.role !== "admin") {
        throw new Error("User is not authorized");
    }

    const summary = await getOrderSummary();

    const stats = [
        {
            title: "Total Revenue",
            value: formatCurrency(
                summary.totalSales._sum.totalPrice?.toString() || 0
            ),
            description: "Total revenue generated",
            icon: BadgeDollarSign,
        },
        {
            title: "Total Sales",
            value: formatNumber(summary.ordersCount),
            description: "Orders placed",
            icon: CreditCard,
        },
        {
            title: "Customers",
            value: formatNumber(summary.usersCount),
            description: "Registered customers",
            icon: Users,
        },
        {
            title: "Products",
            value: formatNumber(summary.productsCount),
            description: "Products available",
            icon: Barcode,
        },
    ];

    return (
        <div className="space-y-4">

            {/* Header */}
            <div className="flex flex-col gap-2">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Overview of your store performance and activity.
                    </p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <Card
                            key={stat.title}
                            className="rounded-2xl shadow-sm transition-shadow hover:shadow-md"
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Icon className="h-5 w-5" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="text-2xl font-bold tracking-tight">
                                    {stat.value}
                                </div>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Analytics */}
            <div className="grid min-w-0 gap-6 lg:grid-cols-7">

                {/* Sales Chart */}
                <Card className="min-w-0 rounded-2xl shadow-sm lg:col-span-4">
                    <CardHeader className="border-b">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">
                                    Sales Overview
                                </CardTitle>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Monthly sales performance
                                </p>
                            </div>

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <ShoppingCart className="h-4 w-4" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="min-w-0 pt-6">
                        <Charts
                            data={{
                                salesData: summary.salesData,
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Recent Sales */}
                <Card className="rounded-2xl shadow-sm lg:col-span-3">
                    <CardHeader className="border-b">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">
                                    Recent Sales
                                </CardTitle>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Latest orders from customers
                                </p>
                            </div>

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Package className="h-4 w-4" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                                        <TableHead className="pl-6">
                                            Customer
                                        </TableHead>

                                        <TableHead>
                                            Date
                                        </TableHead>

                                        <TableHead className="text-right">
                                            Total
                                        </TableHead>

                                        <TableHead className="pr-6 text-right">
                                            Action
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {summary.latestSales.map((order) => (
                                        <TableRow
                                            key={order.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <TableCell className="pl-6">
                                                <div className="max-w-[120px] truncate font-medium">
                                                    {order?.user?.name ||
                                                        "Deleted User"}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <span className="text-sm text-muted-foreground">
                                                    {
                                                        formatDateTime(
                                                            order.createdAt
                                                        ).dateOnly
                                                    }
                                                </span>
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <span className="font-semibold">
                                                    {formatCurrency(
                                                        order.totalPrice
                                                    )}
                                                </span>
                                            </TableCell>

                                            <TableCell className="pr-6 text-right">
                                                <Link
                                                    href={`/order/${order.id}`}
                                                    className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline"
                                                >
                                                    Details
                                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {summary.latestSales.length === 0 && (
                            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                    <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                                </div>

                                <p className="mt-3 font-medium">
                                    No recent sales
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    New orders will appear here.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminOverviewPage;