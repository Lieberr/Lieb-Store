'use server';
import { convertToPlainObject } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";
import { LATEST_PRODCUTS_LIMIT } from "@/lib/constants";
import {prisma} from '@/lib/prisma'


// Get latest products
export async function getLatestProducts() {

    const data = await prisma.product.findMany({
        take: LATEST_PRODCUTS_LIMIT ,
        orderBy: {createdAt: 'desc'}
    })

    return convertToPlainObject(data);
}

// Get single product by slug
export async function getProductBySlug(slug: string){
    

    return await prisma.product.findFirst({
        where: {slug: slug},
    })
}