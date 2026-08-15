import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";
import { Product } from "@/types";
import Rating from "./rating";

const ProductCard = ({product} : {product: Product}) => {
    return ( <Card className='group relative w-full max-w-sm overflow-hidden rounded-2xl border bg-background translate-all duration-300
    hover:shadow-lg '>
        <CardHeader className="p-0 relative">
            <Link className="block overflow-hidden bg-muted" href={`/product/${product.slug}`}>
                <Image src={product.images[0]} alt={product.name} height={300}
                width={300} priority={true} className="aspect-square w-full object-contain
                p-6 translate-transform duration-500 group-hover:scale-105 " />
            </Link>
        </CardHeader>
        <CardContent className="p-4 grid gap-4">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {product.brand}
            </div>

            <Link href={`/product/${product.slug}`}>
                <h2 className="line-clamp-2 text-base font-semibold translate-colors group-hover:text-primary ">
                    {product.name}
                </h2>
            </Link>
            <div className="flex-between gap-4">
                <div className="flex items-center gap-2">
                    <Rating value={Number(product.rating)} />
                    <span className="text-xs text-muted-foreground">
                        ({product.numReviews})
                    </span>
                </div>
                {product.stock > 0 ? (
                    <ProductPrice className="font-semibold" value={Number(product.price)} />
                ) : (
                    <p className="text-destructive">Out Of Stock</p>
                )}
            </div>
        </CardContent>
    </Card> );
}
 
export default ProductCard;