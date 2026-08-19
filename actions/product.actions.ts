'use server';
import { LATEST_PRODCUTS_LIMIT, PAGE_SIZE } from "@/lib/constants";
import {prisma} from '@/lib/prisma'
import { formatError } from "@/lib/utils";
import { insertProductsSchema, updateProductsSchema } from "@/lib/validators";
import { Product } from '@/types'
import { revalidatePath } from "next/cache";
import z from "zod";
import { convertToPlainObject } from "../lib/utils";
import { Prisma } from '@prisma/client';


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

    if (!data) return null;

    return {
        ...data,
        price: data.price.toString(),
        rating: Number(data.rating),
    } as Product;
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
    // Query Filter
    const queryFilter: Prisma.ProductWhereInput = 
        query && query !== 'all' ? {
            name: {
                contains: query,
                mode: 'insensitive'
            } as Prisma.StringFilter
        } : {};
    

    // Category filter
    const categoryFilter = category && category !== 'all' ? {
        category
    } : {};


    // Price Filter
    const priceFilter: Prisma.ProductWhereInput = price && price !== 'all' ? {
        price: {
            gte: Number(price.split('-')[0]),
            lte: Number(price.split('-')[1])
        }        
    } : {}

    // Rating Filter
    const ratingFilter = rating && rating !== 'all' ? {
        rating: {
            gte: Number(rating)
        }
    } : {};


  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    orderBy:
      sort === 'lowest'
        ? { price: 'asc' }
        : sort === 'highest'
        ? { price: 'desc' }
        : sort === 'rating'
        ? { rating: 'desc' }
        : { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
        data: data.map((product) => ({
            ...product,
            price: product.price.toString(),
            rating: Number(product.rating),
        })) as Product[],
    totalPages: Math.ceil(dataCount / limit),
  };
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

// Get all categories
export async function getAllCategories() {
    const data = await prisma.product.groupBy({
        by: ['category'],
        _count: true
    });

    return data;
}

// Get featureed products 
export async function getFeaturedProducts() {
    const data = await prisma.product.findMany({
        where: {isFeatured: true},
        orderBy: {createdAt: 'desc'},
        take: 4
    })

    return convertToPlainObject(data)
}