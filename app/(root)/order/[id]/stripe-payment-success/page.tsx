import { getOrderById } from "@/actions/order.actions";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, PackageCheck } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const SuccessPage = async (props: {
    params: Promise<{
        id: string
    }>;
    searchParams: Promise<{
        payment_intent: string;
    }>
}) => {
    const {id} = await props.params;
    const {payment_intent: paymentIntentId} = await props.searchParams;


    // Fetch order
    const order = await getOrderById(id);
    if(!order) notFound();

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Check if payment intent is valid
    if (paymentIntent.metadata.orderId == null || paymentIntent.metadata.orderId !== order.id.toString()) {
        return notFound();
    }

    // Check if payment is success
    const isSuccess = paymentIntent.status === 'succeeded';

    if(!isSuccess) {
        return redirect(`/order/$${id}`)
    }

    return ( 
        <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">
                <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                    <div className="flex flex-col items-center border-b px-6 py-10 text-center sm:px-10">
                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                            <CheckCircle2 className="h-11 w-11 text-green-600 dark:text-green-400" />
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Thank you for your purchase!
                        </h1>

                        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                            Your payment was successfully processed and your
                            order has been received.
                        </p>
                    </div>

                     <div className="space-y-5 px-6 py-7 sm:px-10">

                        <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <PackageCheck className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm font-medium">
                                    Order confirmed
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Order #{order.id}
                                </p>
                            </div>

                        </div>

                        <div className="rounded-xl bg-muted/30 px-4 py-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                We are processing your order and will keep you
                                updated as it moves through fulfillment.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 pt-2">

                            <Button
                                asChild
                                size="lg"
                                className="h-11 w-full rounded-xl font-semibold"
                            >
                                <Link href={`/order/${id}`}>
                                    View Order
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="h-11 w-full rounded-xl"
                            >
                                <Link href="/">
                                    Continue Shopping
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <p className="mt-5 text-center text-xs text-muted-foreground">
                    Thank you for choosing our store.
                </p>
            </div>
        </div>
    );
}
 
export default SuccessPage;