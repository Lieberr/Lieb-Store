'use client';

import { Cart } from '@/types';
import { useRouter } from 'next/navigation';
import { useTransition, useState } from 'react';
import { addItemToCart, removeItemFromCart } from '@/actions/cart.actions';
import {
    ArrowRight,
    Loader2,
    Minus,
    Plus,
    ShoppingCart,
    Trash2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CartTable = ({ cart }: { cart?: Cart }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const totalItems =
        cart?.items.reduce((acc, item) => acc + item.qty, 0) ?? 0;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <Card className="w-full max-w-md border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-14 text-center">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <ShoppingCart className="h-7 w-7 text-muted-foreground" />
                        </div>

                        <h2 className="text-xl font-semibold">
                            Your cart is empty
                        </h2>

                        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                            Looks like you haven&apos;t added anything to your
                            cart yet.
                        </p>

                        <Button asChild className="mt-6 rounded-xl">
                            <Link href="/">
                                Start Shopping
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleRemove = (productId: string) => {
        startTransition(async () => {
            setError(null);

            const res = await removeItemFromCart(productId);

            if (!res.success) {
                setError(res.message);
                return;
            }

            router.refresh();
        });
    };

    const handleAdd = (item: typeof cart.items[number]) => {
        startTransition(async () => {
            setError(null);

            const res = await addItemToCart(item);

            if (!res.success) {
                setError(res.message);
                return;
            }

            router.refresh();
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Shopping Cart
                </h1>

                <p className="text-sm text-muted-foreground">
                    {totalItems}{' '}
                    {totalItems === 1 ? 'item' : 'items'} in your cart
                </p>
            </div>

            {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-3 lg:col-span-2">
                    {cart.items.map((item) => (
                        <Card
                            key={item.slug}
                            className="overflow-hidden rounded-2xl transition-shadow hover:shadow-md"
                        >
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex gap-4">
                                    <Link
                                        href={`/product/${item.slug}`}
                                        className="shrink-0"
                                    >
                                        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-muted sm:h-28 sm:w-28">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={140}
                                                height={140}
                                                className="h-full w-full object-contain p-2 transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                    </Link>

                                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                                        <div>
                                            <Link
                                                href={`/product/${item.slug}`}
                                                className="line-clamp-2 text-sm font-semibold transition-colors hover:text-primary sm:text-base"
                                            >
                                                {item.name}
                                            </Link>

                                            <p className="mt-1 text-sm font-medium text-muted-foreground">
                                                {formatCurrency(
                                                    Number(item.price)
                                                )}{' '}
                                                each
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center rounded-xl border bg-muted/30 p-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={isPending}
                                                    onClick={() =>
                                                        handleRemove(
                                                            item.productId
                                                        )
                                                    }
                                                    className="h-8 w-8 rounded-lg"
                                                >
                                                    {isPending ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : item.qty === 1 ? (
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    ) : (
                                                        <Minus className="h-4 w-4" />
                                                    )}
                                                </Button>

                                                <span className="min-w-8 text-center text-sm font-semibold">
                                                    {item.qty}
                                                </span>

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={isPending}
                                                    onClick={() =>
                                                        handleAdd(item)
                                                    }
                                                    className="h-8 w-8 rounded-lg"
                                                >
                                                    {isPending ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Plus className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>

                                            <p className="text-base font-bold sm:text-lg">
                                                {formatCurrency(
                                                    Number(item.price) *
                                                        item.qty
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="h-fit rounded-2xl lg:sticky lg:top-24">
                    <CardHeader className="border-b">
                        <CardTitle className="text-lg">
                            Order Summary
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-5 p-5">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Items
                                </span>

                                <span className="font-medium">
                                    {totalItems}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Subtotal
                                </span>

                                <span className="font-medium">
                                    {formatCurrency(cart.itemsPrice)}
                                </span>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex items-end justify-between gap-4">
                                <span className="font-semibold">
                                    Total
                                </span>

                                <span className="text-2xl font-bold">
                                    {formatCurrency(cart.itemsPrice)}
                                </span>
                            </div>
                        </div>

                        <Button
                            className="h-12 w-full rounded-xl text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                            disabled={isPending}
                            onClick={() =>
                                startTransition(() =>
                                    router.push('/shipping-address')
                                )
                            }
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Proceed to Checkout
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>

                        <p className="text-center text-xs text-muted-foreground">
                            Secure checkout • Your information is protected
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CartTable;