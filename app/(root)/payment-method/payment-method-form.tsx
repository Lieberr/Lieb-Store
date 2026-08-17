'use client';
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import {z} from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight, Check, CreditCard, Loader, Loader2, Wallet } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { paymentMethodSchema } from "@/lib/validators";
import { useState } from "react";
import { updateUserPaymentMethod } from "@/actions/user.actions";


const PaymentMethodForm = ({preferredPaymentMethod}: {preferredPaymentMethod: string | null}) => {
    const router = useRouter();

    const form = useForm<z.infer<typeof paymentMethodSchema>>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD
        }
    });

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);


    const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
        startTransition(async () => {
            setError(null)
            const res = await updateUserPaymentMethod(values)

            if(!res.success) {
                // Mensagem de erro
                setError(res.message);
                return;
            }

            router.push('/place-order');
        })
    }


    return (
        <div className="mx-auto w-full max-w-2xl px-4 pb-12">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className="border-b px-6 py-5 sm:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <CreditCard className="w-5 h-5"/>
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                                Payment Method
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Choose how you would like to pay for your order.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6 sm:px-8">
                    {error && (
                        <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
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
                        <form method="POST" className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroup
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                className="grid gap-3">

                                                {PAYMENT_METHODS?.map(
                                                    (paymentMethod) => {

                                                        const selected =
                                                            field.value === paymentMethod;

                                                        return (
                                                            <label
                                                                key={paymentMethod}
                                                                htmlFor={`payment-${paymentMethod}`}
                                                                className={`group relative flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all duration-200

                                                                    ${
                                                                        selected
                                                                            ? 'border-primary bg-primary/5 shadow-sm'
                                                                            : 'hover:border-primary/40 hover:bg-muted/40'
                                                                    }
                                                                `}
                                                            >
                                                                <RadioGroupItem
                                                                    id={`payment-${paymentMethod}`}
                                                                    value={paymentMethod}
                                                                    className="shrink-0"
                                                                />
                                                                <div className={`
                                                                    flex
                                                                    h-10
                                                                    w-10
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    transition-colors

                                                                    ${
                                                                        selected
                                                                            ? 'bg-primary text-primary-foreground'
                                                                            : 'bg-muted text-muted-foreground'
                                                                    }
                                                                `}>

                                                                    <Wallet className="h-5 w-5" />

                                                                </div>


                                                                <div className="flex-1">

                                                                    <p className="
                                                                        font-semibold
                                                                        capitalize
                                                                    ">
                                                                        {paymentMethod}
                                                                    </p>

                                                                    <p className="
                                                                        mt-0.5
                                                                        text-xs
                                                                        text-muted-foreground
                                                                    ">
                                                                        Secure payment method
                                                                    </p>

                                                                </div>

                                                                {selected && (
                                                                    <div className="
                                                                        flex
                                                                        h-6
                                                                        w-6
                                                                        items-center
                                                                        justify-center
                                                                        rounded-full
                                                                        bg-primary
                                                                        text-primary-foreground
                                                                    ">
                                                                        <Check className="h-3.5 w-3.5" />
                                                                    </div>
                                                                )}
                                                            </label>
                                                        );
                                                    }
                                                )}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="border-t pt-6">
                                <Button type="submit" disabled={isPending} className="h-11 w-full rounded-xl font-semibold shadow-sm translate-all hover:-translate-y-0.5 hover:shadow-sm sm:w-auto sm:min-w-44">
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
 
export default PaymentMethodForm;