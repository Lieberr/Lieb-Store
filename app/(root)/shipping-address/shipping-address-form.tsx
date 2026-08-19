'use client';

import { shippingAddress } from "@/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { shippingAddressSchema } from "@/lib/validators";
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, SubmitHandler} from 'react-hook-form';
import {z} from 'zod';
import { shippingAddressDefaultValues } from "@/lib/constants";
import { Form, FormControl, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { AlertCircle, ArrowRight, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateUserAddress } from "@/actions/user.actions";
import { useState } from "react";

const ShippingAddressForm = ({address}: {address: shippingAddress | null}) => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);


    const form = useForm<z.infer<typeof shippingAddressSchema>>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: address || shippingAddressDefaultValues,
    })

    const [isPending, startTransition] = useTransition();

    const onSubmit:SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (values) => {
        startTransition( async () => {
            setError(null);
            const res = await updateUserAddress(values);

            if (!res.success) {
                setError(res.message)
                return;
            }
            
            router.push('/payment-method');
        })
    }

    return (
        <div className="mx-auto w-full max-w-2xl px-4 pb-12">
            <div className="rounded-2xl border bg-card shadow-sm">

                <div className="border-b px-6 py-5 sm:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <MapPin className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Shipping Address</h1>
                            
                            <p className="mt-1 text-sm text-muted-foreground">
                                Enter the address where your order should be delivered.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6 sm:px-8">
                    {error && (
                        <div className="mb-6 items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                            <div>
                                <p className="font-semibold">
                                    Something went wrong
                                </p>
                                <p className="mt-1 opacity-90">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    <Form {...form}>
                        <form method="POST" className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>

                                        <FormControl>
                                            <Input
                                                placeholder="Enter your full name"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                             <FormField
                                control={form.control}
                                name="streetAddress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Street Address</FormLabel>

                                        <FormControl>
                                            <Input
                                                placeholder="123 Main Street"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>

                                            <FormControl>
                                                <Input
                                                    placeholder="New York"
                                                    className="h-11"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="postalCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Postal Code</FormLabel>

                                            <FormControl>
                                                <Input
                                                    placeholder="10001"
                                                    className="h-11"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                             <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>

                                        <FormControl>
                                            <Input
                                                placeholder="United States"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            

                            <div className="border-t pt-6">
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="h-11 w-full rounded-xl font-semibold sm:w-auto sm:min-w-44"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            Continue
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
 
export default ShippingAddressForm;