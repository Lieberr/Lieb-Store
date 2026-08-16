import { getProductBySlug } from "@/actions/product.actions";
import { notFound } from "next/navigation";

import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";
import ProductPrice from "@/components/ui/shared/header/product/product-price";
import ProductImages from "@/components/ui/shared/header/product/product-images";
import AddToCart from "@/components/ui/shared/header/product/add-to-cart";
import { getMyCart } from "@/actions/cart.actions";
import ReviewList from "./review-list";
import { auth } from "@/auth";
import Rating from "@/components/ui/shared/header/product/rating";
import { Check, Package, ShieldCheck, Truck } from "lucide-react";

const ProductDetailsPage = async (props: {
    params: Promise<{slug: string}>
}) => {
    const {slug} = await props.params;

    const product = await getProductBySlug(slug);
    if(!product) notFound();

    const session = await auth();
    const userId = session?.user?.id;

    const cart = await getMyCart();

    const isInStock = product.stock > 0;



    return ( 
      <>
        <section className="py-6 sm:py-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-6">
                    <ProductImages images={product.images} />
                </div>

                <div className="lg:col-span-3">
                    <div className="space-y-5">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant='secondary' className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider">
                                {product.brand}
                            </Badge>

                            <span className="text-sm text-muted-foreground">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                            {product.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-3">
                            <Rating value={Number(product.rating)} />
                            <span className="text-sm text-muted-foreground">
                                {product.numReviews}{' '}
                                {product.numReviews === 1 ? 'Review' : 'Reviews'}
                            </span>
                        </div>

                        <div className="border-y py-5">
                            <ProductPrice value={Number(product.price)} className="text-3xl font-bold sm:text-4xl" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-sm font-semibold uppercase tracking-wider">
                                About this product
                            </h2>
                            <p className="text-sm leading-6 text-muted-foreground">
                                {product.description}
                            </p>
                        </div>

                        <div className="space-y-3 border-t pt-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                    <Truck className="h-4 w-4 text-primary" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium">
                                        Fast Delivery
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Quick and reliable shipping
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium">
                                        Secure purchase
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Your payment is protected
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                    <Package className="h-4 w-4 text-primary" />
                                </div>
                                
                                <div>
                                    <p className="text-sm font-medium">
                                        Quality products
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        Carefully selected products
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 lg:self-start">
                    <Card className="rounded-2xl border shadow-sm lg:sticky lg:top-24">
                        <CardContent className="space-y-5 p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Price
                                </span>

                                <ProductPrice value={Number(product.price)} className="text-xl font-bold" />
                            </div>
                            <div className="border-t" />

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Availability
                                </span>

                                {isInStock ? (
                                    <Badge className="rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/10 dark:text-green-400">
                                        <Check className="mr-1 h-3 w-3" />
                                        In Stock
                                    </Badge>
                                ) : (
                                    <Badge className="rounded-full bg-red-600 text-white hover:bg-red-600">
                                        Out Of Stock
                                    </Badge>
                                )}
                            </div>

                            {isInStock && (
                                <p className="text-xs text-muted-foreground">
                                    {product.stock}{' '}
                                    {product.stock === 1 ? 'unit' : 'units'}{' '}
                                    available
                                </p>
                            )}

                            {isInStock ? (
                                <div className="pt-2">  
                                    <AddToCart cart={cart} item={{
                                        productId: product.id,
                                        name: product.name,
                                        slug: product.price,
                                        price: product.price,
                                        qty: 1,
                                        image: product.images[0]
                                    }} />
                                </div>
                            ) : (
                                <div className="rounded-xl bg-red-500/10 px-4 py-3 text-center text-sm font-medium text-red-600 dark:text-red-400">
                                    This product is currently unavailable.
                                </div>
                            )}

                            <div className="space-y-2 border-t pt-4">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">
                                        Secure Payment
                                    </span>

                                    <span className="font-medium">
                                        Protected
                                    </span>
                                </div>

                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">
                                        Shipping
                                    </span>

                                    <span className="font-medium">
                                        Calculated at checkout
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        <section className="mt-12 border-t pt-10 sm:mt-16">
            <div className="mb-6">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Customer feedback
                </p>

                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Customer Reviews
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    See what other customers think about this product.
                </p>
            </div>

            <ReviewList userId={userId || ''} productId={product.id} productSlug={product.slug} />
        </section>
      </>  
    );
}
 
export default ProductDetailsPage;