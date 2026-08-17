'use client';

import { createOrder } from "@/actions/order.actions";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PlaceOrderForm = () => {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isPending) return;

        setIsPending(true);

        try {
            const res = await createOrder();

            if (res.redirectTo) {
                router.push(res.redirectTo);
            }
        } finally {
            setIsPending(false);
        }
    };

    return (
        <form className="w-full" onSubmit={handleSubmit}>
            <Button type="submit" disabled={isPending} className="h-12 w-full rounded-xl gap-2 font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-sm">
                {isPending ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Placing Order...
                    </>
                ) : (
                    <>
                        <Check className="h-4 w-4" />
                        Place Order
                    </>
                )}
            </Button>
        </form>
    );
};

export default PlaceOrderForm;