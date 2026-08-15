'use client';

import { useEffect, useState } from 'react';
import { CartItem, Cart } from '@/types';
import { Button } from '@/components/ui/button';
import { addItemToCart, removeItemFromCart } from '@/actions/cart.actions';
import { Plus, Minus, Loader2, ShoppingCart, Check } from 'lucide-react';
import { useTransition } from 'react';


const AddToCart = ({ cart, item }: {cart?: Cart, item: CartItem }) => {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!feedback) return;

    const timer = window.setTimeout(() => setFeedback(null), 3500);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        setFeedback({ type: 'error', message: res.message });
        return;
      }

      setFeedback({ type: 'success', message: `${item.name} added to cart` });
      })

    
  };

  // Handle remove from cart
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
    const res = await removeItemFromCart(item.productId);

    if (!res.success) {
      setFeedback({ type: 'error', message: res.message });
      return;
    }

    setFeedback({ type: 'success', message: res.message });
    })

  }

  // Check if items is in cart
  const existItem = cart && cart.items.find((x) => x.productId === item.productId);


      return (
        <div className="space-y-3">

            {existItem ? (
                <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-1.5">

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={isPending}
                        onClick={handleRemoveFromCart}
                        className="h-10 w-10 rounded-lg hover:bg-background"
                    >
                        <div className="flex items-center justify-center h-4 w-4">
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Minus className="h-4 w-4" />
                            )}
                        </div>
                    </Button>

                    <div className="flex flex-col items-center min-w-12">
                        <span className="text-lg font-semibold">
                            {existItem.qty}
                        </span>

                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            quantity
                        </span>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={isPending}
                        onClick={handleAddToCart}
                        className="h-10 w-10 rounded-lg hover:bg-background"
                    >
                        <div className="flex items-center justify-center h-4 w-4">
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="h-4 w-4" />
                            )}
                        </div>
                    </Button>

                </div>
            ) : (
                <Button
                    className="
                    mt-4
                        w-full
                        h-12
                        rounded-xl
                        gap-2
                        text-sm
                        font-semibold
                        shadow-sm
                        transition-all
                        hover:-translate-y-0.5
                        hover:shadow-md
                    "
                    type="button"
                    disabled={isPending}
                    onClick={handleAddToCart}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                        </>
                    )}
                </Button>
            )}

            {feedback && (
                <div
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                        feedback.type === 'success'
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                            : 'bg-destructive/10 text-destructive'
                    }`}
                >
                    {feedback.type === 'success' && (
                        <Check className="h-3.5 w-3.5" />
                    )}

                    {feedback.message}
                </div>
            )}
        </div>
    );
};

export default AddToCart;