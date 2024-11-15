'use client';

import CalendarView from './CalendarView';
import ListView from './ListView';
import { Trade } from '@/types';

interface Props {
  trades: Trade[];
}

export default function TradeHistory({ trades }: Props) {
  if (trades.length === 0) return null;

  const winRate = trades.filter(({ realized_pnl }) => realized_pnl > 0).length / trades.length;
  const avgPnl = trades.reduce((acc, { realized_pnl }) => acc + realized_pnl, 0) / trades.length;

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
