import React from "react";
import { cn } from "@/lib/utils";

const CheckoutSteps = ({ current = 0 }) => {
    const steps = [
        "User Login",
        "Shipping Address",
        "Payment Method",
        "Place Order",
    ];

    return (
        <div className="mb-10 w-full">
            <div className="flex flex-col items-center gap-2 md:flex-row md:justify-center md:gap-2">
                {steps.map((step, index) => (
                    <React.Fragment key={step}>
                        <div
                            className={cn(
                                "w-full max-w-xs rounded-full border px-4 py-2.5 text-center text-sm font-medium transition-all duration-200 md:w-52",
                                index === current
                                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                    : index < current
                                    ? "border-primary/30 bg-primary/10 text-primary"
                                    : "border-border bg-muted/40 text-muted-foreground"
                            )}
                        >
                            {step}
                        </div>

                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    "hidden h-px w-8 md:block",
                                    index < current
                                        ? "bg-primary/50"
                                        : "bg-border"
                                )}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CheckoutSteps;