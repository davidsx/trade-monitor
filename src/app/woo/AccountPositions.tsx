'use client';

import { cn } from '@/styles';
import { PositionDetail } from '@/types';
import useSWR from 'swr';

export default function AccountPositions() {
  const { data: positionDetail } = useSWR(
    '/api/woo/positions',
    (url) => fetch(url).then((res) => res.json() as Promise<PositionDetail>),
    { refreshInterval: 500 },
  );

  if (!positionDetail) return null;

  const {
    unrealized,
    realized,
    fee,
    balance,
    unrealized_percent,
    realized_percent,
    pnl,
    pnl_percent,
    fee_percent,
  } = positionDetail;

  const getTextColor = (value: number, base: number = 0) =>
    cn('text-gray-500', value > base && 'text-green-500', value < base && 'text-red-500');

  return (
    <section className="flex flex-col gap-2">
      {/* <div className="flex items-center justify-between">
      <h2 className="text-2xl">Portfolio</h2>
      <div className="font-semibold">{challengeText.join(' / ')}</div>
    </div> */}
      <div className="flex justify-between text-sm">
        <div className="h-full">
          <div className="flex gap-2">
            <h3 className="text-md opacity-50">Balance</h3>
            <span>{balance.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <h3 className="text-md opacity-50">Equity</h3>
            <span>{(balance + pnl).toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <h3 className="text-md opacity-50">Total PnL</h3>
            <span className={getTextColor(pnl)}>{pnl.toFixed(2)}</span>
            <span className={cn('opacity-50', getTextColor(pnl_percent))}>
              ({pnl_percent.toFixed(2)}%)
            </span>
          </div>
          <div className="flex gap-2">
            <h3 className="text-md opacity-50">Unrealized</h3>
            <span className={cn(getTextColor(unrealized), 'opacity-60')}>
              {unrealized.toFixed(2)}
            </span>
            <span className={cn('opacity-50', getTextColor(unrealized_percent))}>
              ({unrealized_percent.toFixed(2)}%)
            </span>
          </div>
          <div className="flex gap-2">
            <h3 className="text-md opacity-50">Realized</h3>
            <span className={cn(getTextColor(unrealized), 'opacity-60')}>
              {realized.toFixed(2)}
            </span>
            <span className={cn('opacity-50', getTextColor(realized_percent))}>
              ({realized_percent.toFixed(2)}%)
            </span>
          </div>
          <div className="flex gap-2">
            <h3 className="text-md opacity-50">Fee</h3>
            <span className="opacity-50">-{fee.toFixed(2)}</span>
            <span className="opacity-50">({fee_percent.toFixed(2)}%)</span>
          </div>
        </div>
        {/* <div className="flex h-full flex-col items-end">
          <div className="flex gap-2">
          <h3 className="text-md opacity-50">Daily Target</h3>
          <span>{daily_target.toFixed(2)}</span>
        </div>
          <div className="flex gap-2">
          <h3 className="text-md opacity-50">Current Equity</h3>
          <span className={cn(getTextColor(equity, daily_target))}>{equity.toFixed(2)}</span>
        </div>
          <Link href="/woo">
            <button className="mt-auto underline">refresh</button>
          </Link>
        </div> */}
      </div>
      {positionDetail.positions.map((position) => {
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
              'relative flex flex-col gap-1 rounded-xl bg-[#262728] px-6 py-2',
              "after:absolute after:left-0 after:top-0 after:h-full after:w-2 after:rounded-bl-xl after:rounded-tl-xl after:content-['']",
              position_side === 'LONG' ? 'after:bg-green-500' : 'after:bg-red-500',
            )}
            key={`${symbol}-${position_side}`}
          >
            <div className="flex justify-between">
              <div>
                {symbol.replace('PERP_', '').replace('_USDT', '')}-PERP&nbsp;
                <span className="text-xs">at {mark_price.toFixed(2)}</span>
              </div>
              <div className={cn('font-medium', getTextColor(unrealized_pnl))}>
                {unrealized_pnl.toFixed(2)}
              </div>
            </div>
            <div className="flex justify-between text-sm opacity-40">
              <div>Fee: {fee.toFixed(2)}</div>
              <div className={cn(getTextColor(pnl))}>
                PnL: {pnl.toFixed(2)} ({(pnl - fee).toFixed(2)})
              </div>
            </div>
            {entry_price > 0 && (
              <div className="flex gap-2">
                <span className="text-xs">Entry: {entry_price.toFixed(2)}</span>
                {tp_price && <span className="text-xs">TP: {tp_price.toFixed(2)}</span>}
                {sl_price && <span className="text-xs">SL: {sl_price.toFixed(2)}</span>}
              </div>
            )}
            {entry_price > 0 && (
              <div className="flex gap-2">
                {tp_price && (
                  <span className="text-xs">
                    Profit: {Math.abs((tp_price - entry_price) * quantity).toFixed(2)}
                  </span>
                )}
                {sl_price && (
                  <span className="text-xs">
                    Loss: -{Math.abs((sl_price - entry_price) * quantity).toFixed(2)}
                  </span>
                )}
                {risk_ratio > 0 && (
                  <span className="text-xs">RR: 1 to {risk_ratio.toFixed(1)}</span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
