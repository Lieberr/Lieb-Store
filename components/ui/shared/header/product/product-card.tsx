import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "./product-price";
import { Product } from "@/types";
import Rating from "./rating";

const ProductCard = ({ product }: { product: Product }) => {
    return (
        <Card
            className="
                group
                relative
                w-full
                overflow-hidden
                rounded-2xl
                border
                bg-card
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
            "
        >

            {/* Product image */}
            <div className="relative overflow-hidden bg-muted/30">

                <Link
                    href={`/product/${product.slug}`}
                    className="block"
                >
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={500}
                        height={500}
                        priority
                        className="
                            aspect-square
                            w-full
                            object-contain
                            p-6
                            transition-transform
                            duration-500
                            group-hover:scale-105
                        "
                    />
                </Link>

                {/* Stock badge */}
                {product.stock > 0 ? (
                    <span
                        className="
                            absolute
                            left-3
                            top-3
                            rounded-full
                            bg-background/90
                            px-2.5
                            py-1
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-wider
                            text-green-600
                            shadow-sm
                            backdrop-blur
                            dark:text-green-400
                        "
                    >
                        In Stock
                    </span>
                ) : (
                    <span
                        className="
                            absolute
                            left-3
                            top-3
                            rounded-full
                            px-2.5
                            py-1
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-wider
                            bg-red-900/20
                            text-red-700
                            dark:bg-red-950/40
                            dark:text-red-400
                        "
                    >
                        Out of Stock
                    </span>
                )}

            </div>

            <CardContent className="space-y-3 p-4">

                {/* Brand */}
                <p
                    className="
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-[0.15em]
                        text-muted-foreground
                    "
                >
                    {product.brand}
                </p>

                {/* Product name */}
                <Link href={`/product/${product.slug}`}>
                    <h2
                        className="
                            line-clamp-2
                            min-h-[48px]
                            text-base
                            font-semibold
                            leading-6
                            transition-colors
                            group-hover:text-primary
                        "
                    >
                        {product.name}
                    </h2>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <Rating value={Number(product.rating)} />

                    <span className="text-xs text-muted-foreground">
                        ({product.numReviews})
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-end justify-between gap-3 pt-1">

                    {product.stock > 0 ? (
                        <ProductPrice
                            value={Number(product.price)}
                            className="font-bold"
                        />
                    ) : (
                        <p className="text-sm font-medium text-destructive">
                            Currently unavailable
                        </p>
                    )}

                </div>

            </CardContent>
        </Card>
    );
};

export default ProductCard;