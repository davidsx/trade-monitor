'use client';

import useSWR from 'swr';
import CalendarView from './CalendarView';
import ListView from './ListView';
import { ParsedTrade } from '@/types';
import { fromZonedTime } from 'date-fns-tz';
import { endOfDay, startOfDay } from 'date-fns';

export default function TradeHistory() {
  const { data: trades = [] } = useSWR(
    `/api/woo/trades`,
    (url) => fetch(url).then((res) => res.json()) as Promise<ParsedTrade[]>,
  );

  const winRate = trades.filter(({ realized_pnl }) => realized_pnl > 0).length / trades.length;
  const avgPnl = trades.reduce((acc, { realized_pnl }) => acc + realized_pnl, 0) / trades.length;

  const date = new Date();
  const dateStart = fromZonedTime(startOfDay(date), 'UTC');
  const dateEnd = fromZonedTime(endOfDay(date), 'UTC');
  const tradesOnDate = trades.filter(
    (trade) =>
      trade.realized_pnl !== null &&
      trade.timestamp >= dateStart.getTime() &&
      trade.timestamp <= dateEnd.getTime(),
  );

  const totalProfit = trades.reduce(
    (acc, { realized_pnl }) => (realized_pnl > 0 ? acc + realized_pnl : acc),
    0,
  );
  const totalProfitToday = tradesOnDate.reduce(
    (acc, { realized_pnl }) => (realized_pnl > 0 ? acc + realized_pnl : acc),
    0,
  );
  const totalLoss = trades.reduce(
    (acc, { realized_pnl }) => (realized_pnl < 0 ? acc + realized_pnl : acc),
    0,
  );
  const totalLossToday = tradesOnDate.reduce(
    (acc, { realized_pnl }) => (realized_pnl < 0 ? acc + realized_pnl : acc),
    0,
  );

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Trades History</h2>
        {/* <button>switch</button> */}
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-zinc-500">Win rate: {winRate.toFixed(2)}</div>
        <div className="text-sm text-zinc-500">Avg PnL: {avgPnl.toFixed(2)}</div>
        <div className="text-sm text-zinc-500">Total Profit: {totalProfitToday.toFixed(2)}</div>
        <div className="text-sm text-zinc-500">Total Loss: {totalLossToday.toFixed(2)}</div>
        <div className="text-sm text-zinc-500">Total Profit: {totalProfit.toFixed(2)}</div>
        <div className="text-sm text-zinc-500">Total Loss: {totalLoss.toFixed(2)}</div>
      </div>
      <div className="flex flex-col gap-6">
        <CalendarView trades={trades} />
        <ListView trades={trades} />
      </div>
    </section>
  );
}
