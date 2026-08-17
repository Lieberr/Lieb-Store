import { getMyCart } from "@/actions/cart.actions";
import { getUserById } from "@/actions/user.actions";
import { auth } from "@/auth";
import { shippingAddress } from "@/types";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import CheckoutSteps from "@/components/ui/shared/checkout-steps";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import PlaceOrderForm from "./place-order-form";
import { ShippingAddress } from "@stripe/stripe-js";
import { CreditCard, MapPin, Package, Pencil, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
    title: 'Place Order'
} 

const PlaceOrderPage = async () => {
    const cart = await getMyCart();
    const session = await auth();
    const userId = session?.user?.id;

    if(!userId) throw new Error('User not found');

    const user = await getUserById(userId);

    if(!cart || cart.items.length === 0) redirect('/cart');

    if(!user.address) redirect('/shipping-address');

    if(!user.paymentMethod) redirect('/payment-method');

    const userAddress = user.address as shippingAddress;

    const totalItems = cart.items.reduce(
        (acc, item) => acc + item.qty, 0
    )

    return (
        <div className="pb-12">

            <CheckoutSteps current={3} />

            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ShoppingBag className="h-5 w-5" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Review Your Order
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Check your information before placing your order.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-5 lg:col-span-2">
                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex items-center justify-between border-b px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <MapPin className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold">
                                            Shipping Address
                                        </h2>

                                        <p className="text-xs text-muted-foreground">
                                            Where your order will be delivered
                                        </p>
                                    </div>
                                </div>

                                <Link href='/shipping-address'>
                                    <Button variant='ghost' size='sm' className="gap-2">
                                        <Pencil className="h-3.5 w-3.5" />
                                        Edit
                                    </Button>
                                </Link>
                            </div>

                            <div className="px-5 py-5">
                                <p className="font-medium">
                                    {userAddress.fullName}
                                </p>

                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                    {userAddress.streetAddress}
                                    <br />
                                    {userAddress.city},{' '}
                                    {userAddress.postalCode}
                                    <br />
                                    {userAddress.country}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex items-center justify-between border-b px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <CreditCard className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold">
                                            Payment Method
                                        </h2>

                                        <p className="text-xs text-muted-foreground">
                                            Selected payment method
                                        </p>
                                    </div>
                                </div>

                                <Link href='/payment-method'>
                                    <Button variant='ghost' size='sm' className="gap-2">
                                        <Pencil className="h-3.5 w-3.5" />
                                        Edit
                                    </Button>
                                </Link>
                            </div>

                            <div className="px-5 py-5">
                                <div className="inline-flex items-center rounded-lg border bg-muted/40 px-3 py-2 text-sm font-medium">
                                    <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                                    {user.paymentMethod}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex items-center justify-between border-b px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Package className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold">
                                            Order Items
                                        </h2>
                                        
                                        <p className="text-xs text-muted-foreground">
                                            {totalItems}{' '}
                                            {totalItems === 1 ? 'item' : 'items'}{' '}
                                            in your order
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="divde-y">
                                {cart.items.map((item) => (
                                    <div className="flex items-center gap-4 px-5 py-4" key={item.slug}>
                                        <Link href={`/product/${item.slug}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted/30">
                                            <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                                        </Link>

                                        <div className="min-w-0 flex-1">
                                            <Link href={`product/${item.slug}`} className="line-clamp-2 text-sm font-medium hover:text-primary">
                                                {item.name}
                                            </Link>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Quantity: {item.qty}
                                            </p>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <p className="font-semibold">
                                                {formatCurrency(Number(item.price) * item.qty)}
                                            </p>

                                            {item.qty > 1 && (
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {formatCurrency(Number(item.price))} each
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:relative lg:self-start">
                    <Card className="h-fit overflow-hidden shadow-sm lg:sticky lg:top-24">
                        <CardContent className="p-0">
                            <div className="border-b px-5 py-5">
                                <h2 className="text-lg font-bold">
                                    Order Summary
                                </h2>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Review the total before placing your order.
                                </p>
                            </div>

                            <div className="space-y-3 px-5 py-5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Items
                                    </span>

                                    <span className="font-medium">
                                        {formatCurrency(cart.itemsPrice)}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Shipping
                                    </span>

                                    <span className="font-medium">
                                        {formatCurrency(cart.shippingPrice)}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Tax
                                    </span>

                                    <span className="font-medium">
                                        {formatCurrency(cart.taxPrice)}
                                    </span>
                                </div>

                                <div className="my-4 border-t" />

                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">
                                        Total
                                    </span>

                                    <span className="text-2xl font-bold">
                                        {formatCurrency(cart.totalPrice)}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t bg-muted/20 px-5 py-5">
                                <PlaceOrderForm />

                                <p className="mt-3 text-center text-[11px] leading-4 text-muted-foreground">
                                    By placing your order, you agree to our terms and conditions.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
 
export default PlaceOrderPage;