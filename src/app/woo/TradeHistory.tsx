'use client';

import useSWR from 'swr';
import CalendarView from './CalendarView';
import ListView from './ListView';
import { ParsedTrade } from '@/types';
// import { fromZonedTime } from 'date-fns-tz';
// import { endOfDay, startOfDay } from 'date-fns';

export default function TradeHistory() {
  const { data: trades = [], isLoading } = useSWR(
    `/api/woo/trades`,
    (url) => fetch(url).then((res) => res.json()) as Promise<ParsedTrade[]>,
  );

  if (trades.length === 0) return null;
  if (isLoading) return <div>Loading trade history...</div>;

  const winRate = trades.filter(({ realized_pnl }) => realized_pnl > 0).length / trades.length;
  const avgPnl = trades.reduce((acc, { realized_pnl }) => acc + realized_pnl, 0) / trades.length;

  // const date = new Date();
  // const dateStart = fromZonedTime(startOfDay(date), 'UTC');
  // const dateEnd = fromZonedTime(endOfDay(date), 'UTC');
  // const tradesOnDate = trades.filter(
  //   (trade) =>
  //     trade.realized_pnl !== null &&
  //     trade.timestamp >= dateStart.getTime() &&
  //     trade.timestamp <= dateEnd.getTime(),
  // );

  const totalLoss = trades.reduce(
    (acc, { realized_pnl }) => (realized_pnl < 0 ? acc + realized_pnl : acc),
    0,
  );
  const totalWin = trades.reduce(
    (acc, { realized_pnl }) => (realized_pnl > 0 ? acc + realized_pnl : acc),
    0,
  );

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Trades History</h2>
        {/* <button>switch</button> */}
      </div>
      <div className="flex justify-between text-sm text-zinc-500">
        <div className="flex flex-col items-start">
          <div>Win rate: {winRate.toFixed(2)}</div>
          <div>Avg PnL: {avgPnl.toFixed(2)}</div>
        </div>
        <div className="flex flex-col items-end">
          <div>Total Win: {totalWin.toFixed(2)}</div>
          <div>Total Loss: {totalLoss.toFixed(2)}</div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <CalendarView trades={trades} />
        <ListView trades={trades} />
      </div>
    </section>
  );
}
