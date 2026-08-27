"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const ProductCarousel = ({ data }: { data: Product[] }) => {
  return (
    <section className="mb-10 w-full">
      <Carousel
        opts={{
          loop: true,
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {data.map((product) => (
            <CarouselItem key={product.id}>
              <Link
                href={`/product/${product.slug}`}
                className="group block"
              >
                <div className="relative aspect-[16/5] w-full overflow-hidden rounded-2xl bg-muted">

                  {/* Banner */}
                  {product.banner ? (
                    <Image
                      src={product.banner}
                      alt={product.name}
                      fill
                      priority
                      sizes="100vw"
                      className="
                        object-cover
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-[1.02]
                      "
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                      <span className="text-sm text-muted-foreground">
                        No banner available
                      </span>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-xl px-6 sm:px-10 lg:px-14">

                      {/* Badge */}
                      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-md">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </div>

                      {/* Brand */}
                      <p className="mb-1 text-xs font-medium uppercase tracking-widest text-white/65">
                        {product.brand}
                      </p>

                      {/* Name */}
                      <h2 className="max-w-lg text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                        {product.name}
                      </h2>

                      {/* Description */}
                      <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-white/70">
                        {product.description}
                      </p>

                      {/* Bottom */}
                      <div className="mt-5 flex items-center gap-4">
                        <span className="text-xl font-semibold text-white sm:text-2xl">
                          ${Number(product.price).toFixed(2)}
                        </span>

                        <span
                          className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-lg
                            bg-white
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-black
                            transition-all
                            duration-300
                            group-hover:gap-3
                          "
                        >
                          View product
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Previous */}
        <CarouselPrevious
          className="
            left-4
            h-9
            w-9
            border-white/20
            bg-black/20
            text-white
            backdrop-blur-md
            hover:bg-black/40
            hover:text-white
          "
        />

        {/* Next */}
        <CarouselNext
          className="
            right-4
            h-9
            w-9
            border-white/20
            bg-black/20
            text-white
            backdrop-blur-md
            hover:bg-black/40
            hover:text-white
          "
        />
      </Carousel>
    </section>
  );
};

export default ProductCarousel;