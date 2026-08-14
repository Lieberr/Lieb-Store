import {z} from 'zod';
import { insertProductsSchema, insertCartSchema, cartItemsSchema, shippingAddressSchema, insertOrderItemSchema, insertOrderSchema, paymentResultSchema, insertReviewsShcema } from '@/lib/validators';

export type Product = z.infer<typeof insertProductsSchema> & {
    id: string;
    rating: number;
    numReviews: number;
    createdAt: Date;
}

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemsSchema >
export type shippingAddress = z.infer<typeof shippingAddressSchema>
export type OrderItem = z.infer<typeof insertOrderItemSchema>
export type Order = z.infer<typeof insertOrderSchema> & {
    id: string;
    createdAt: Date;
    isPaid: boolean;
    paidAt: Date | null;
    isDelivered: boolean;
    deliveredAt: Date | null;
    orderitems: OrderItem[];
    user: {name: string; email: string};
}
export type PaymentResult = z.infer<typeof paymentResultSchema>;

export type Review = z.infer<typeof insertReviewsShcema> & {
    id: string;
    createdAt: Date;
    user?: {name: string}
}