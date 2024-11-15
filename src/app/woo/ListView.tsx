'use client';

import { Trade } from '@/types';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { formatTimeAgo } from '@/utils';
import { cn } from '@/styles';

interface Props {
  trades: Trade[];
}

export default function ListView({ trades }: Props): JSX.Element {
  const groupedTrades = useMemo(() => {
    return trades.reduce((map, trade) => {
      const date = new Date(
        Date.UTC(
          new Date(trade.timestamp).getUTCFullYear(),
          new Date(trade.timestamp).getUTCMonth(),
          new Date(trade.timestamp).getUTCDate(),
        ),
      );
      const dateKey = date.getTime();
      map.set(dateKey, [...(map.get(dateKey) || []), trade]);
      return map;
    }, new Map<number, Trade[]>());
  }, [trades]);

  const sortedDates = Array.from(groupedTrades.keys()).sort((a, b) => b - a);

  return (
    <div className="relative flex h-full w-full flex-col gap-4 overflow-auto">
      {sortedDates.map((tradeDateStart) => {
        const tradesForDate = groupedTrades
          .get(tradeDateStart)!
          .sort((a, b) => b.timestamp - a.timestamp);
        return (
          <React.Fragment key={tradeDateStart}>
            <div className="text-dark text-xl" suppressHydrationWarning>
              {format(tradeDateStart, 'dd MMMM yyyy')}
            </div>
            {tradesForDate.map((trade) => (
              <div
                className="bg-lightGrey flex w-full items-center justify-between border-b border-slate-600 py-2"
                key={trade.id}
              >
                <div className="flex flex-col items-start gap-2">
                  <div className="text-teal flex w-full items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap first-letter:uppercase">
                    <div
                      className={cn(
                        'w-14 rounded-md px-2 py-1 text-center text-xs text-white',
                        trade.position_side === 'LONG' &&
                          'bg-teal-500 bg-opacity-20 text-green-500',
                        trade.position_side === 'SHORT' && 'bg-red-500 bg-opacity-20 text-red-500',
                      )}
                    >
                      {trade.position_side}
                    </div>
                    {trade.symbol.replace('PERP_', '').replace('_USDT', '')}
                  </div>
                  <div>{trade.quantity.toFixed(2)}</div>
                </div>
                <div className="flex size-9 min-w-9 flex-col items-end justify-end gap-1 text-md">
                  <div
                    className={cn(
                      (trade.realized_pnl || 0) > 0 ? 'text-green-500' : 'text-red-500',
                    )}
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
            ))}
          </React.Fragment>
        );
      })}
      {sortedDates.length === 0 && <div className="text-grey text-xl">No trades found</div>}
    </div>
  );
}
