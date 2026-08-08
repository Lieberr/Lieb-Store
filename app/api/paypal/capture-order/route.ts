import { NextRequest, NextResponse } from 'next/server';
import { approvePaypalOrder } from '@/actions/order.actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, data } = body;

    if (!orderId || !data) {
      return NextResponse.json({ success: false, message: 'orderId and data are required' }, { status: 400 });
    }

    const result = await approvePaypalOrder(orderId, data);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data, message: result.message });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
