import { auth } from '@/auth';
import { getMyCart } from '@/actions/cart.actions';
import { shippingAddress } from '@/types';
import { getUserById } from '@/actions/user.actions';
import { redirect } from 'next/navigation';
import ShippingAddressForm from './shipping-address-form';
import CheckoutSteps from '@/components/ui/shared/checkout-steps';

export const metadata = {
    title: 'Shipping Address'
}

const ShippingAddressPage = async () => {
    const cart = await getMyCart();

    if(!cart || cart.items.length === 0) redirect('/cart');

    const session = await auth();
    const userId = session?.user?.id;

    if(!userId) redirect('/sign-in');

    const user = await getUserById(userId);

    let address: shippingAddress | null = null;

    if (user.address) {
        try {
            address = (typeof user.address === 'string'
                ? JSON.parse(user.address)
                : user.address) as shippingAddress;
        } catch {
            address = null;
        }
    }

    return (
        <>
            <CheckoutSteps current={1}/>
            <ShippingAddressForm address={address} />
        </>
    );
}
 
export default ShippingAddressPage;