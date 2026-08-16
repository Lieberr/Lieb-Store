'use client';

import { useEffect } from "react";
import { Review } from "@/types";
import Link from "next/link";
import { useState } from "react";
import ReviewForm from "./review-form";
import { getReviews } from "@/actions/review-action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, UserIcon } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Rating from "@/components/ui/shared/header/product/rating";


const ReviewList = ({userId, productId, productSlug}: {
    userId: string;
    productId: string;
    productSlug: string;
}) => {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const loadReviews = async () => {
            const res = await getReviews({productId});
            setReviews(res.data)
        }

        loadReviews();

    }, [productId])


    const reload = async () => {
        const res = await getReviews({productId});

        setReviews([...res.data])
    }
    return ( <>
        <div className="space-y-4">
            {reviews.length === 0 && <div>No reviews yet</div>}
            {
                userId ? (
                    <ReviewForm userId={userId} productId={productId} onReviewSubmitted={reload}/>
                ) : (
                    <div>
                        Please <Link className="text-blue-700 px-2" href={`/sign-in?callbackUrl=/product/${productSlug}`}>
                            sign in
                        </Link>
                        to write a review
                    </div>
                )
            }


            <div className="flex flex-col gap-4">
                {reviews.map((review) => (
                    <Card className="overflow-hidden rounded-2xl border bg-card shadow-sm translate-all duration-200 hover:shadow-sm" key={review.id}>
                        <CardHeader className="space-y-3 pb-3">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <CardTitle className="text-base font-semibold leading-6">{review.title}</CardTitle>
                                <div className="shrink-0">
                                    <Rating value={review.rating} />
                                </div>
                            </div>
                            
                        </CardHeader>

                        <CardContent className="space-y-4 pt-0">
                            <p className="text-sm leading-6 text-muted-foreground">
                                {review.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                                        <UserIcon className="h-3.5 w-3.5" />
                                    </div>

                                    <span className="font-medium text-foreground">
                                        {review.user ? review.user.name : "User"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />

                                    <span>
                                        {formatDateTime(review.createdAt).dateTime}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                      
                    </Card>
                ))}
            </div>
        </div>
    </> );
}
 
export default ReviewList;