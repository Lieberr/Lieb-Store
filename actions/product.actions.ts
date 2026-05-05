'use server';
import { LATEST_PRODCUTS_LIMIT } from "@/lib/constants";
import {prisma} from '@/lib/prisma'
import { Product } from '@/types'

// Get latest products
export async function getLatestProducts(): Promise<Product[]> {
    const data = await prisma.product.findMany({
        take: LATEST_PRODCUTS_LIMIT,
        orderBy: {createdAt: 'desc'}
    })

    return data.map((product) => ({
        ...product,
        price: product.price.toString(),
        rating: Number(product.rating),
    })) as Product[];
}

// Get single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
    const product = await prisma.product.findFirst({
        where: {slug: slug},
    })

    if (!product) {
        return null;
    }

    return {
        ...product,
        price: product.price.toString(),
        rating: Number(product.rating),
    } as Product;
}