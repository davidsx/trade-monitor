'use client';

import useSWR from 'swr';
import CalendarView from './CalendarView';
import ListView from './ListView';
import { ParsedTrade } from '@/types';

export default function TradeHistory() {
  const { data: trades = [] } = useSWR(
    `/api/woo/trades`,
    (url) => fetch(url).then((res) => res.json()) as Promise<ParsedTrade[]>,
  );

  const winRate = trades.filter(({ realized_pnl }) => realized_pnl > 0).length / trades.length;
  const avgPnl = trades.reduce((acc, { realized_pnl }) => acc + realized_pnl, 0) / trades.length;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Trades History</h2>
        {/* <button>switch</button> */}
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-zinc-500">Win rate: {winRate.toFixed(2)}</div>
        <div className="text-sm text-zinc-500">Avg PnL: {avgPnl.toFixed(2)}</div>
      </div>
      <div className="flex flex-col gap-6">
        <CalendarView trades={trades} />
        <ListView trades={trades} />
      </div>
    </section>
  );
}
