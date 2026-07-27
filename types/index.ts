import {z} from 'zod';
import { insertProductsSchema, insertCartSchema, cartItemsSchema, shippingAddressSchema } from '@/lib/validators';

export type Product = z.infer<typeof insertProductsSchema> & {
    id: string;
    rating: number;
    numReviews: number;
    createdAt: Date;
}

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemsSchema >
export type shippingAddress = z.infer<typeof shippingAddressSchema>