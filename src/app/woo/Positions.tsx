'use client';

import { cn } from '@/styles';
import { AccountDetail, Position } from '@/types';
import { getTextColor } from '@/utils';

interface Props {
  positions: Position[];
}

export default function Positions({ positions }: Props) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        {positions
          .filter((position) => position.unrealized_pnl !== 0 && position.quantity !== 0)
          .sort((a, b) => a.unrealized_pnl - b.unrealized_pnl)
          .map((position) => {
            const {
              symbol,
              position_side,
              quantity,
              entry_price,
              mark_price,
              tp_price,
              sl_price,
              unrealized_pnl,
              fee,
              pnl,
              risk_ratio,
            } = position;
            return (
              <div
                className={cn(
                  'relative flex flex-row gap-1 rounded-xl bg-[#262728] px-6 py-2',
                  "after:absolute after:left-0 after:top-0 after:h-full after:w-2 after:rounded-bl-xl after:rounded-tl-xl after:bg-zinc-500 after:content-['']",
                  unrealized_pnl > 0 && 'after:bg-green-500',
                  unrealized_pnl < 0 && 'after:bg-red-500',
                )}
                key={`${symbol}-${position_side}`}
              >
                <div className="flex flex-1 flex-col gap-1">
                  <span className="whitespace-nowrap">
                    {symbol.replace('PERP_', '').replace('_USDT', '')}-PERP
                  </span>
                  <div className="flex items-center gap-1">
                    <span
                      className={cn(
                        'text-2xs w-min rounded-md px-1 py-0.5 text-center text-white',
                        position_side === 'LONG' && 'bg-teal-500 bg-opacity-20 text-green-500',
                        position_side === 'SHORT' && 'bg-red-500 bg-opacity-20 text-red-500',
                      )}
                    >
                      {position_side}
                    </span>
                    <span className="whitespace-nowrap text-xs">
                      {quantity.toFixed(2)} @ {entry_price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-xs text-zinc-500 opacity-80">
                    Mark price: {mark_price.toFixed(2)}
                  </div>
                  {entry_price > 0 && (
                    <div className="flex flex-col opacity-60">
                      {tp_price && (
                        <span className="text-xs text-green-500">
                          TP: {tp_price.toFixed(2)} (
                          {Math.abs((tp_price - entry_price) * quantity).toFixed(2)})
                        </span>
                      )}
                      {sl_price && (
                        <span
                          className={cn(
                            'text-xs',
                            (position_side === 'LONG' && sl_price > entry_price) ||
                              (position_side === 'SHORT' && sl_price < entry_price)
                              ? 'text-green-500'
                              : 'text-red-500',
                          )}
                        >
                          SL: {sl_price.toFixed(2)} (
                          {Math.abs((sl_price - entry_price) * quantity).toFixed(2)})
                        </span>
                      )}
                      {risk_ratio && (
                        <span className="text-xs text-zinc-500">(1:{risk_ratio.toFixed(1)})</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className={cn('text-md', getTextColor(unrealized_pnl))}>
                    {unrealized_pnl.toFixed(2)}
                    {/* ({Math.abs(unrealized_pnl / ((sl_price - entry_price) * quantity)).toFixed(2)}R) */}
                  </div>
                  <div className={cn(getTextColor(pnl - fee), 'text-sm')}>
                    PnL: {(pnl - fee).toFixed(2)}
                  </div>
                  <div className="text-sm text-zinc-500">Fee paid: {fee.toFixed(2)}</div>
                  {pnl !== 0 && (
                    <div className={cn(getTextColor(pnl), 'text-xs opacity-40')}>
                      PnL before fee: {pnl.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {positions
          .filter((position) => position.pnl !== 0)
          .map((position) => {
            const { symbol, position_side, fee, pnl } = position;
            return (
              <div
                className={cn(
                  'relative flex flex-row gap-1 rounded-xl border-4 bg-[#262728] p-2',
                  pnl - fee > 0 && 'border-green-500/50',
                  pnl - fee < 0 && 'border-red-500/50',
                )}
                key={`${symbol}-${position_side}`}
              >
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="whitespace-nowrap">
                      {symbol.replace('PERP_', '').replace('_USDT', '')}-PERP
                    </span>
                    <div
                      className={cn(
                        'text-2xs w-min rounded-md px-1 py-0.5 text-center text-white',
                        position_side === 'LONG' && 'bg-teal-500 bg-opacity-20 text-green-500',
                        position_side === 'SHORT' && 'bg-red-500 bg-opacity-20 text-red-500',
                      )}
                    >
                      {position_side}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <div className="text-sm text-zinc-500">Fee: {fee.toFixed(2)}</div>
                    <div className={cn('text-md', getTextColor(pnl - fee))}>
                      {(pnl - fee).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}
