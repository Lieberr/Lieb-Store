'use client';
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ProductImages = ({images} : {images: string[]}) => {
    const [current, setCurrent] = useState(0);

   return (
    <div className="space-y-4">
        <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border bg-muted/20 p-6 sm:min-h-[400px]">
            <Image src={images[current]}
            alt="Product Image"
            width={800}
            height={800}
            priority
            className="max-h-[450px] w-full object-contain transform duration-300" />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((image, index) => (
                <button type="button" key={image} onClick={() => setCurrent(index)}
                className={cn(`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-muted/20 transition-all hover:border-primary/60`,
                    current === index ? "border-primary ring-2 ring-primary/20" : "border-border"
                )}>
                    <Image src={image} alt={`Product image ${index + 1}`} fill className="object-contain p-2" />

                </button>
            ))}
        </div>
    </div>
   )
}
 
export default ProductImages;