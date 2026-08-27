'use client';

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

const TARGET_DATE = new Date('2026-08-29T00:00:00');

const calculateTimeRemaining = (targetDate: Date) => {
    const currentTime = new Date();

    const timeDifference = Math.max(
        Number(targetDate) - Number(currentTime),
        0
    );

    return {
        days: Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
        ),

        hours: Math.floor(
            (timeDifference % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        ),

        minutes: Math.floor(
            (timeDifference % (1000 * 60 * 60)) /
            (1000 * 60)
        ),

        seconds: Math.floor(
            (timeDifference % (1000 * 60)) /
            1000
        )
    };
};

const DealCountdown = () => {
    const [time, setTime] = useState<
        ReturnType<typeof calculateTimeRemaining>
    >();

    useEffect(() => {
        const updateTime = () => {
            const newTime = calculateTimeRemaining(TARGET_DATE);

            setTime(newTime);

            if (
                newTime.days === 0 &&
                newTime.hours === 0 &&
                newTime.minutes === 0 &&
                newTime.seconds === 0
            ) {
                clearInterval(timerInterval);
            }
        };

        updateTime();

        const timerInterval = setInterval(updateTime, 1000);

        return () => clearInterval(timerInterval);
    }, []);

    // Loading
    if (!time) {
        return (
            <section className="
                my-12
                overflow-hidden
                rounded-2xl
                border
                bg-card
                text-card-foreground
                shadow-lg
                sm:my-16
                sm:rounded-3xl
                lg:my-20
            ">
                <div className="
                    flex
                    min-h-[250px]
                    items-center
                    justify-center
                    p-6
                    sm:min-h-[300px]
                ">
                    <h3 className="text-2xl font-bold sm:text-3xl">
                        Loading countdown...
                    </h3>
                </div>
            </section>
        );
    }

    // Deal ended
    if (
        time.days === 0 &&
        time.hours === 0 &&
        time.minutes === 0 &&
        time.seconds === 0
    ) {
        return (
            <section className="
                my-12
                overflow-hidden
                rounded-2xl
                border
                bg-card
                text-card-foreground
                shadow-lg
                sm:my-16
                sm:rounded-3xl
                lg:my-20
                dark:border-white/10
            ">

                <div className="grid grid-cols-1 lg:grid-cols-2">

                    {/* Content */}
                    <div className="
                        flex
                        flex-col
                        justify-center
                        gap-5
                        bg-card
                        p-6
                        sm:p-8
                        lg:gap-6
                        lg:p-12
                    ">

                        {/* Badge */}
                        <span className="
                            w-fit
                            rounded-full
                            bg-muted
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-muted-foreground
                            sm:px-4
                            sm:py-2
                            sm:text-sm
                        ">
                            Offer ended
                        </span>

                        {/* Title */}
                        <div>
                            <p className="
                                mb-2
                                text-xs
                                font-medium
                                uppercase
                                tracking-widest
                                text-muted-foreground
                                sm:text-sm
                            ">
                                Promotion ended
                            </p>

                            <h3 className="
                                text-3xl
                                font-bold
                                tracking-tight
                                sm:text-4xl
                                lg:text-5xl
                            ">
                                This offer has ended.
                            </h3>
                        </div>

                        {/* Description */}
                        <p className="
                            max-w-xl
                            text-sm
                            leading-6
                            text-muted-foreground
                            sm:text-base
                        ">
                            This promotion is no longer available,
                            but you can check out our products and
                            find other offers.
                        </p>

                        {/* Button */}
                        <div className="pt-1">
                            <Button
                                asChild
                                size="lg"
                                className="
                                    w-full
                                    rounded-full
                                    font-semibold
                                    sm:w-fit
                                "
                            >
                                <Link href="/search">
                                    View products →
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="
                        relative
                        h-64
                        overflow-hidden
                        sm:h-80
                        lg:h-full
                        lg:min-h-[420px]
                    ">
                        <Image
                            src="/images/promo.jpg"
                            alt="Promoção encerrada"
                            fill
                            className="object-cover"
                        />
                    </div>

                </div>
            </section>
        );
    }

    // Active deal
    return (
        <section className="
            my-12
            overflow-hidden
            rounded-2xl
            border
            bg-card
            text-card-foreground
            shadow-lg
            sm:my-16
            sm:rounded-3xl
            lg:my-20
            dark:border-white/10
        ">

            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="
                    flex
                    flex-col
                    justify-center
                    gap-5
                    bg-card
                    p-6
                    sm:p-8
                    lg:gap-6
                    lg:p-12
                ">
                    <span className="
                        w-fit
                        rounded-full
                        bg-muted
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-muted-foreground
                        sm:px-4
                        sm:py-2
                        sm:text-sm
                    ">
                        🔥 Limited-time offer
                    </span>

                    {/* Title */}
                    <div>
                        <p className="
                            mb-2
                            text-xs
                            font-medium
                            uppercase
                            tracking-widest
                            text-muted-foreground
                            sm:text-sm
                        ">
                            Special offer
                        </p>

                        <h3 className="
                            text-3xl
                            font-bold
                            tracking-tight
                            text-foreground
                            sm:text-4xl
                            lg:text-5xl
                        ">
                            Deal of the Month
                        </h3>
                    </div>

                    {/* Description */}
                    <p className="
                        max-w-xl
                        text-sm
                        leading-6
                        text-muted-foreground
                        sm:text-base
                    ">
                        Take advantage of our special offers 
                        before time runs out. 
                        Find selected products with exclusive 
                        terms for a limited time.

                    </p>

                    {/* Countdown */}
                    <ul className="
                        grid
                        grid-cols-4
                        gap-2
                        sm:max-w-md
                        sm:gap-3
                    ">
                        <StatBox
                            label="Dias"
                            value={time.days}
                        />

                        <StatBox
                            label="Horas"
                            value={time.hours}
                        />

                        <StatBox
                            label="Minutos"
                            value={time.minutes}
                        />

                        <StatBox
                            label="Segundos"
                            value={time.seconds}
                        />
                    </ul>

                    {/* Button */}
                    <div className="pt-1">
                        <Button
                            asChild
                            size="lg"
                            className="
                                w-full
                                rounded-full
                                font-semibold
                                shadow-md
                                transition-transform
                                hover:scale-105
                                sm:w-fit
                            "
                        >
                            <Link href="/search">
                                Explore offers →

                            </Link>
                        </Button>
                    </div>

                </div>
                <div className="
                    relative
                    h-64
                    overflow-hidden
                    bg-muted
                    sm:h-80
                    lg:h-full
                    lg:min-h-[420px]
                ">

                    <Image
                        src="/images/promo.jpg"
                        alt="Promoção do mês"
                        fill
                        priority
                        className="
                            object-cover
                            transition-transform
                            duration-700
                            hover:scale-105
                        "
                    />

                    {/* Image overlay */}
                    <div className="
                        absolute
                        inset-0
                        bg-black/5
                        dark:bg-black/10
                    " />

                </div>

            </div>

        </section>
    );
};

const StatBox = ({
    label,
    value
}: {
    label: string;
    value: number;
}) => (
    <li className="
        rounded-xl
        border
        bg-muted
        px-2
        py-3
        text-center
        shadow-sm
        sm:rounded-2xl
        sm:p-4
        dark:border-white/5
    ">
        <p className="
            text-xl
            font-bold
            text-foreground
            sm:text-3xl
        ">
            {String(value).padStart(2, "0")}
        </p>

        <p className="
            mt-1
            text-[9px]
            font-medium
            uppercase
            tracking-wide
            text-muted-foreground
            sm:text-xs
        ">
            {label}
        </p>
    </li>
);

export default DealCountdown;