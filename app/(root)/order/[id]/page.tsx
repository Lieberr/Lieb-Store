import { Metadata } from "next";
import { getOrderById } from "@/actions/order.actions";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { shippingAddress } from "@/types";

export const metadata: Metadata = {
  title: "Order Details",
};

const OrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as shippingAddress,
        orderitems: order.OrderItem?.map((item: any) => ({
          ...item,
          price: Number(item.price),
          qty: Number(item.qty),
        })) ?? [],
      }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
    />
  );
};

export default OrderDetailsPage;