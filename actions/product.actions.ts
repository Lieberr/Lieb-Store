'use server';
import { LATEST_PRODCUTS_LIMIT, PAGE_SIZE } from "@/lib/constants";
import {prisma} from '@/lib/prisma'
import { formatError } from "@/lib/utils";
import { insertProductsSchema, updateProductsSchema } from "@/lib/validators";
import { Product } from '@/types'
import { revalidatePath } from "next/cache";
import z from "zod";
import { convertToPlainObject } from "../lib/utils";

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

//Get Product by ID
export async function getProductById(productId: string): Promise<Product | null> {
    const data = await prisma.product.findFirst({
        where: {id: productId},
    })

    return convertToPlainObject(data);
}

// Get all products
export async function getAllProducts({
    query,
    limit = PAGE_SIZE,
    page,
    category
}: {
    query: string;
    limit?: number;
    page: number;
    category?: string
}): Promise<{ data: Product[]; totalpages: number }> {
    const data = await prisma.product.findMany({
        orderBy: {createdAt: 'desc'},
        skip: (page - 1) * limit,
        take: limit
    });

    const dataCount  = await prisma.product.count();

    return {
        data: data.map((product) => ({
            ...product,
            price: product.price.toString(),
            rating: Number(product.rating),
        })) as Product[],
        totalpages: Math.ceil(dataCount / limit)
    }
}

// Delete a product
export async function deleteProduct(id: string) {
    try {
        const productExists = await prisma.product.findFirst({
            where: {id}
        });

        if(!productExists) throw new Error('Producto not found');

        await prisma.product.delete({where: {id}});

        revalidatePath('/admin/products');

        return {
            success: true,
            message: 'Product deleted successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

// Create a product
export async function createProduct(data: z.infer<typeof insertProductsSchema>) {
    try {
        const product = insertProductsSchema.parse(data);
        await prisma.product.create({
            data: product
        })

        revalidatePath('/admin/products');

        return {
            success: true,
            message: 'Product created succesfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

// Update a product
export async function updateProduct(data: z.infer<typeof updateProductsSchema>) {
    try {
        const product = updateProductsSchema.parse(data);
        const productExists = await prisma.product.findFirst({
            where: {id: product.id}
        });

        if(!productExists) throw new Error('Product not found');

        await prisma.product.update({
            where: {id: product.id},
            data: product
        });

        revalidatePath('/admin/products');

        return {
            success: true,
            message: 'Update created succesfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}