'use server';

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { formatError } from "@/lib/utils";
import { insertReviewsShcema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import z from "zod";

// Create & update reviews
export async function createUpdateReview(data: z.infer<typeof insertReviewsShcema>) {
    try {
        const session = await auth();

        if(!session) throw new Error('User is not authenticated');

        // Validate and store the review
        const review = insertReviewsShcema.parse({
            ...data,
            userId: session?.user?.id
        });

        // get product that is being reviewd
        const product = await prisma.product.findFirst({
            where: {id: review.productId}
        });

        if(!product) throw new Error('Product not found');

        // Check if user already reviewed
        const reviewExists = await prisma.review.findFirst({
            where: {
                productId: review.productId,
                userId: review.userId
            }
        });

        await prisma.$transaction(async (tx) => {
            if(reviewExists) {
                // Update review
                await tx.review.update({
                    where: {id: reviewExists.id},
                    data: {
                        title: review.title,
                        description: review.description,
                        rating: review.rating
                    }
                })
            } else {
                // Create review
                await tx.review.create({
                    data: review
                })
            }

            // get avg rating
            const averageRating = await tx.review.aggregate({
                _avg: {rating: true},
                where: {productId: review.productId}
            })

            // get number of reviews
            const numReviews = await tx.review.count({
                where: {
                    productId: review.productId
                }
            });

            // Update the rating and numreviews in product table
            await tx.product.update({
                where: {id: review.productId},
                data: {
                    rating: averageRating._avg.rating || 0,
                    numReviews
                }
            })
        })

        revalidatePath(`/product/${product.slug}`);

        return {
            success: true,
            message: 'Review Update successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

// Get all reviews form a product
export async function getReviews({productId}: {productId: string}) {
    const data = await prisma.review.findMany({
        where: {
            productId: productId
        },
        include: {
            user: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return {
        data
    }
}

// get a review written by the curretn user
export async function getreviewByProductId({productId}: {productId: string}) {
    const session = await auth();

    if(!session) throw new Error('User is not authenticated');

    return await prisma.review.findFirst({
        where: {
            productId,
            userId: session?.user?.id
        }
    })
}