'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer} from '@paypal/react-paypal-js'
import { createdPaypalOrder, approvePaypalOrder, updateOrderToPaidCOD, deliverOrder } from "@/actions/order.actions";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import StripePayment from "./stripe-payment";

const OrderDetailsTable = ({order, paypalClientId, isAdmin, stripeClientSecret}: {order: Omit<Order, 'paymentResult'>, paypalClientId: string, isAdmin: boolean, stripeClientSecret: string | null}) => {
    const {
        id,
        shippingAddress,
        orderitems = [],
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentMethod,
        isPaid,
        isDelivered,
        paidAt,
        deliveredAt
    } = order;

    const {toast} = useToast();

    const PrintLoadingState = () => {
        const [{isPending, isRejected}] = usePayPalScriptReducer();
        let status = '';

        if(isPending) {
            status = 'Loading PayPal...'
        } else if(isRejected) {
            status = 'Error Loading PayPal'
        }
        return status
    }

    const handleCreatePaypalOrder = async () => {
        const res = await createdPaypalOrder(order.id);

        if (!res.success) {
            toast({
                variant: 'destructive',
                description: res.message,
            });
            throw new Error(res.message);
        }

        if (!res.data) {
            const errorMessage = 'PayPal order not created';
            toast({
                variant: 'destructive',
                description: errorMessage,
            });
            throw new Error(errorMessage);
        }

        return res.data;
    };

    const handleApprovePaypalOrder = async (data: {orderID: string}) => {
        const res = await approvePaypalOrder(order.id, data);

        if (!res.success) {
            toast({
                variant: 'destructive',
                description: res.message,
            });
            throw new Error(res.message);
        }

        toast({
            variant: 'default',
            description: res.message,
        });
    };
    
    // Button to mark order as paid
    const MarkAsPaidButton = () => {
        const [isPending, startTransition] = useTransition();
        const {toast} = useToast();

        return (
            <Button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(async () => {
                const res = await updateOrderToPaidCOD(order.id);
                toast({
                    variant: res.success ? 'default' : 'destructive',
                    description: res.message
                })
            })}>
                {isPending ? 'Processing...' : 'Mark As Paid'}
            </Button>
        )
    }

     // Button to mark order as delivered
    const MarkAsDeliveredButton = () => {
        const [isPending, startTransition] = useTransition();
        const {toast} = useToast();

        return (
            <Button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(async () => {
                const res = await deliverOrder(order.id);
                toast({
                    variant: res.success ? 'default' : 'destructive',
                    description: res.message
                })
            })}>
                {isPending ? 'Processing...' : 'Mark As Delivered'}
            </Button>
        )
    }
    return (
    <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col gap-2 border-b pb-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        Order details
                    </p>

                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Order {formatId(order.id)}
                    </h1>
                </div>

                <div className="flex flex-col items-end gap-2">
                    {isPaid ? (
                        <Badge className="rounded-full px-3 py-1 bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400">
                            Paid
                        </Badge>
                    ) : (
                        <Badge variant="destructive" className="rounded-full px-3 py-1">
                            Payment pending
                        </Badge>
                    )}

                    {isDelivered ? (
                        <Badge className="rounded-full px-3 py-1 bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400">
                            Delivered
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="rounded-full px-3 py-1">
                            Processing
                        </Badge>
                    )}
                </div>
            </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

            {/* LEFT SIDE */}
            <div className="space-y-6 lg:col-span-2">

                {/* Payment */}
                <Card className="overflow-hidden">
                    <CardContent className="p-0">

                        <div className="border-b px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        Payment Method
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Payment information for this order
                                    </p>
                                </div>

                                <Badge variant="outline" className="rounded-full">
                                    {paymentMethod}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-6 py-5">
                            <div>
                                <p className="font-medium">
                                    {paymentMethod}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    {isPaid
                                        ? `Paid on ${formatDateTime(paidAt!).dateTime}`
                                        : "Payment has not been completed yet"}
                                </p>
                            </div>

                            {isPaid ? (
                                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400">
                                    Paid
                                </Badge>
                            ) : (
                                <Badge variant="destructive">
                                    Not Paid
                                </Badge>
                            )}
                        </div>

                    </CardContent>
                </Card>


                {/* Shipping Address */}
                <Card className="overflow-hidden">
                    <CardContent className="p-0">

                        <div className="border-b px-6 py-5">
                            <h2 className="text-lg font-semibold">
                                Shipping Address
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Delivery information
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <p className="font-semibold">
                                    {shippingAddress.fullName}
                                </p>

                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                    {shippingAddress.streetAddress},{" "}
                                    {shippingAddress.city},{" "}
                                    {shippingAddress.postalCode},{" "}
                                    {shippingAddress.country}
                                </p>
                            </div>

                            {isDelivered ? (
                                <div className="text-left sm:text-right">
                                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400">
                                        Delivered
                                    </Badge>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {formatDateTime(deliveredAt!).dateTime}
                                    </p>
                                </div>
                            ) : (
                                <Badge variant="outline">
                                    Not Delivered
                                </Badge>
                            )}

                        </div>

                    </CardContent>
                </Card>


                {/* Order Items */}
                <Card className="overflow-hidden">
                    <CardContent className="p-0">

                        <div className="border-b px-6 py-5">
                            <h2 className="text-lg font-semibold">
                                Order Items
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Products included in this order
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>

                                <TableHeader>
                                    <TableRow className="bg-muted/40">
                                        <TableHead className="pl-6">
                                            Product
                                        </TableHead>

                                        <TableHead>
                                            Quantity
                                        </TableHead>

                                        <TableHead className="pr-6 text-right">
                                            Price
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>

                                    {orderitems.map((item) => (
                                        <TableRow key={item.slug}>

                                            <TableCell className="pl-6">
                                                <Link
                                                    href={`/product/${item.slug}`}
                                                    className="group flex min-w-[220px] items-center gap-4"
                                                >
                                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted/30">
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            width={64}
                                                            height={64}
                                                            className="h-full w-full object-contain p-1 transition-transform group-hover:scale-105"
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="font-medium transition-colors group-hover:text-primary">
                                                            {item.name}
                                                        </p>

                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            Product
                                                        </p>
                                                    </div>
                                                </Link>
                                            </TableCell>

                                            <TableCell>
                                                <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-muted px-2.5 py-1 text-sm font-medium">
                                                    {item.qty}
                                                </span>
                                            </TableCell>

                                            <TableCell className="pr-6 text-right font-medium">
                                                {formatCurrency(Number(item.price))}
                                            </TableCell>

                                        </TableRow>
                                    ))}

                                </TableBody>

                            </Table>
                        </div>

                    </CardContent>
                </Card>

            </div>


            {/* RIGHT SIDE */}
            <div className="lg:sticky lg:top-6 lg:self-start">

                <Card className="overflow-hidden border-primary/10 shadow-sm">

                    <CardContent className="p-0">

                        {/* Summary header */}
                        <div className="border-b bg-muted/20 px-6 py-5">
                            <h2 className="text-lg font-semibold">
                                Order Summary
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Payment summary
                            </p>
                        </div>


                        {/* Prices */}
                        <div className="space-y-4 px-6 py-6">

                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Items
                                </span>

                                <span className="font-medium">
                                    {formatCurrency(itemsPrice)}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Shipping
                                </span>

                                <span className="font-medium">
                                    {formatCurrency(shippingPrice)}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Tax
                                </span>

                                <span className="font-medium">
                                    {formatCurrency(taxPrice)}
                                </span>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <p className="font-semibold">
                                            Total
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            Final order amount
                                        </p>
                                    </div>

                                    <span className="text-2xl font-bold">
                                        {formatCurrency(totalPrice)}
                                    </span>
                                </div>
                            </div>

                        </div>


                        {/* Payment actions */}
                        {!isPaid && paymentMethod === "PayPal" && (
                            <div className="border-t px-6 py-6">
                                <p className="mb-3 text-sm font-medium">
                                    Complete your payment
                                </p>

                                <PayPalScriptProvider
                                    options={{ clientId: paypalClientId }}
                                >
                                    <PrintLoadingState />

                                    <PayPalButtons
                                        createOrder={handleCreatePaypalOrder}
                                        onApprove={handleApprovePaypalOrder}
                                    />
                                </PayPalScriptProvider>
                            </div>
                        )}

                        {!isPaid &&
                            paymentMethod === "Stripe" &&
                            stripeClientSecret && (
                                <div className="border-t px-6 py-6">
                                    <p className="mb-3 text-sm font-medium">
                                        Complete your payment
                                    </p>

                                    <StripePayment
                                        priceInCents={Number(order.totalPrice) * 100}
                                        orderId={order.id}
                                        clientSecret={stripeClientSecret}
                                    />
                                </div>
                            )}

                        {/* Admin actions */}
                        {isAdmin &&
                            !isPaid &&
                            paymentMethod === "CashOnDelivery" && (
                                <div className="border-t px-6 py-6">
                                    <p className="mb-3 text-sm font-medium">
                                        Order management
                                    </p>

                                    <MarkAsPaidButton />
                                </div>
                            )}

                        {isAdmin &&
                            isPaid &&
                            !isDelivered && (
                                <div className="border-t px-6 py-6">
                                    <p className="mb-3 text-sm font-medium">
                                        Order management
                                    </p>

                                    <MarkAsDeliveredButton />
                                </div>
                            )}

                    </CardContent>

                </Card>

            </div>

        </div>

    </div>
);
}
 
export default OrderDetailsTable;