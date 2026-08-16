'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { reviewFormDefaultValues } from "@/lib/constants";
import { insertReviewsShcema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquarePlus, StarIcon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { createUpdateReview } from "@/actions/review-action";
import { getreviewByProductId } from "@/actions/review-action";

const ReviewForm = ({userId, productId, onReviewSubmitted}: {
    userId: string;
    productId: string;
    onReviewSubmitted: () => void
}) => {

    const [open, setOpen] = useState(false);
    const {toast} = useToast();

    //Form
    const form = useForm<z.infer<typeof insertReviewsShcema>>({
        resolver: zodResolver(insertReviewsShcema),
        defaultValues: reviewFormDefaultValues
    });

    

    // Submit form handler
    const onSubmit:SubmitHandler<z.infer<typeof insertReviewsShcema>> = async (values) => {
        const res = await createUpdateReview({
            ...values,
            productId
        })

        if(!res.success) {
            return toast({
                variant: 'destructive',
                description: res.message
            })
        }

        setOpen(false);

        onReviewSubmitted();

        toast({
            description: res.message
        })
    }



    // Open form handler
    const handleOpenForm = async () => {
        form.setValue('productId', productId);
        form.setValue('userId', userId);

        const review = await getreviewByProductId({productId});

        if(review) {
            form.setValue('title', review.title);
            form.setValue('description', review.description);
            form.setValue('rating', review.rating);
        }

        setOpen(true);
    }

    return ( <Dialog open={open} onOpenChange={setOpen}>
        <Button onClick={handleOpenForm} variant='default' className="mt-6 h-11 rounded-xl gap-2 px-5 font-semibold shadow-sm translate-all hover:-translate-y-0.5 hover:shadow-md">
            <MessageSquarePlus className="h-4 w-4" />
            Write a Review
        </Button>

        <DialogContent className="w-[calc(100%-2rem)] max-w-lg rounded-2xl">
            <Form {...form}>
                <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader className="space-y-2">
                        <DialogTitle className="text-xl font-bold">Write a Review</DialogTitle>
                        <DialogDescription>
                            Share your thoughts with other customers
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-6">
                        <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input className="h-11 rounded-xl" placeholder="Enter title" {...field} />
                                </FormControl>
                            </FormItem>
                        )} />

                        <FormField
                        control={form.control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea className="min-h-[120px] resize-none rounded-xl" placeholder="Enter description" {...field} />
                                </FormControl>
                            </FormItem>
                        )} />

                        <FormField
                        control={form.control}
                        name="rating"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Rating</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value.toString()}>
                                    <FormControl>
                                        <SelectTrigger className="h1-11 rounded-xl">
                                            <SelectValue placeholder='Select a rating' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Array.from({length: 5}).map(
                                            (_, index) => {
                                                const rating = index + 1

                                                return (
                                                    <SelectItem key={rating} value={rating.toString()}>
                                                        <div className="flex items-center gap-2">
                                                            <span>{rating}</span>
                                                            <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />

                                                            <span className="text-muted-foreground">
                                                                {rating === 1
                                                                            ? "Poor"
                                                                            : rating === 2
                                                                            ? "Fair"
                                                                            : rating === 3
                                                                            ? "Good"
                                                                            : rating === 4
                                                                            ? "Very good"
                                                                            : "Excellent"}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                )
                                            }
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <DialogFooter>
                        <Button  type="submit" size='lg' className="w-full h-11 rounded-xl font-semibold" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog> );
}
 
export default ReviewForm;