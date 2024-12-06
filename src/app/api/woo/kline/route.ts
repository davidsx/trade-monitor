import WooService from '@/service/woo';
import { Interval, KLine } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');
  const interval = (searchParams.get('interval') || '1m') as Interval;
  const limit = parseInt(searchParams.get('limit') || '100');

  if (!symbol) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const wooService = new WooService();
  const data = await wooService.getKline(`PERP_${symbol}_USDT`, interval, limit);
  return NextResponse.json(
    data.rows.reverse().map<KLine>((e) => ({
      time: e.start_timestamp,
      open: e.open,
      close: e.close,
      high: e.high,
      low: e.low,
    })),
  );
}
