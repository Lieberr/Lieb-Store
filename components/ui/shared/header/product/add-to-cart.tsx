'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem, Cart } from '@/types';
import { Button } from '@/components/ui/button';
import { addItemToCart, removeItemFromCart } from '@/actions/cart.actions';
import { Plus, Minus, Loader } from 'lucide-react';
import { useTransition } from 'react';
import { start } from 'repl';


const AddToCart = ({ cart, item }: {cart?: Cart, item: CartItem }) => {
  const router = useRouter();
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


      return existItem ? (
        <div>
          <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
            {isPending ? (<Loader className='w-4 h-4 animate-spin' />) : (
              <Minus className='w-4 h-4' />
            )}

          </Button>
          <span className='px-2'>{existItem.qty}</span>
          <Button type='button' variant='outline' onClick={handleAddToCart}>
             {isPending ? (<Loader className='w-4 h-4 animate-spin' />) : (
              <Plus className='w-4 h-4' />
            )}
          </Button>
        </div>
      ) : (
        
      <Button className="w-full" type="button" onClick={handleAddToCart}>
        {isPending ? (<Loader className='w-4 h-4 animate-spin' />) : (
              <Plus className='w-4 h-4' />
            )}{' '}
            Add To Cart
      </Button>
      )
};

export default AddToCart;