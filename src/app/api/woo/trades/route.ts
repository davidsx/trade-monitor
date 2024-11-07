import { NextRequest, NextResponse } from 'next/server';
import WooService from '@/service/woo';
import { ParsedTrade } from '@/types';

const wooService = new WooService();

export async function GET(request: NextRequest) {
  // const { searchParams } = new URL(request.url);
  // const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
  // const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());

  // const startDate = new Date(year, month - 1, 1).getTime();
  // const endDate = new Date(year, month, 0).getTime();

  // console.log(startDate, endDate);

  try {
    const orderResponse = await wooService.getPreviousOrders();
    const trades = orderResponse.rows
      .filter(({ realized_pnl }) => realized_pnl !== null)
      .map((order) => {
        return {
          id: order.order_id.toString(),
          symbol: order.symbol,
          position_side: order.position_side,
          quantity: order.quantity,
          realized_pnl: order.realized_pnl,
          timestamp: parseFloat(order.updated_time.toString()) * 1000,
        } as ParsedTrade;
      });

    return NextResponse.json(trades);
  } catch (error) {
    console.error('Error fetching trades', error);
    return NextResponse.json([]);
  }
}
