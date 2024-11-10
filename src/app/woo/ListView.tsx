'use client';

import { ParsedTrade } from '@/types';
import { format, startOfDay } from 'date-fns';
import React from 'react';
import { compareDateOnly, formatTimeAgo } from '@/utils';
import { cn } from '@/styles';

interface Props {
  trades: ParsedTrade[];
}

export default function ListView({ trades }: Props): JSX.Element {
  const today = new Date();
  const sortedTrades = trades.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div className="relative flex h-full w-full flex-col gap-4 overflow-auto">
      {sortedTrades.map((trade, i, arr) => {
        const lastTrade = arr[i - 1];
        const isTradeFromNewDay =
          Boolean(lastTrade) && trade.timestamp < startOfDay(lastTrade.timestamp).getTime();
        return (
          <React.Fragment key={trade.id}>
            {(i === 0 || isTradeFromNewDay) && (
              <div className="text-dark text-xl" suppressHydrationWarning>
                {compareDateOnly(trade.timestamp, today)
                  ? 'Today'
                  : format(trade.timestamp, 'dd MMMM yyyy')}
              </div>
            )}
            <div className="bg-lightGrey flex w-full items-center justify-between border-b border-slate-600 py-2">
              <div className="flex flex-col items-start gap-2">
                <div className="text-teal flex w-full items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap first-letter:uppercase">
                  <div
                    className={cn(
                      'w-14 rounded-md px-2 py-1 text-center text-xs text-white',
                      trade.position_side === 'LONG' && 'bg-teal-500 bg-opacity-20 text-green-500',
                      trade.position_side === 'SHORT' && 'bg-red-500 bg-opacity-20 text-red-500',
                    )}
                  >
                    {trade.position_side}
                  </div>
                  {trade.symbol.replace('PERP_', '').replace('_USDT', '')}
                  {i}
                </div>
                <div>{trade.quantity.toFixed(2)}</div>
              </div>
              <div className="flex size-9 min-w-9 flex-col items-end justify-end gap-1 text-xl">
                <div
                  className={cn((trade.realized_pnl || 0) > 0 ? 'text-green-500' : 'text-red-500')}
                >
                  {trade.realized_pnl?.toFixed(2)}
                </div>
                <div
                  className="text-grey whitespace-nowrap text-right font-mono text-xs"
                  suppressHydrationWarning
                >
                  {formatTimeAgo(trade.timestamp)}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      {sortedTrades.length === 0 && <div className="text-grey text-xl">No trades found</div>}
    </div>
  );
}
