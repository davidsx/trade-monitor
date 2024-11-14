'use client';

import { cn } from '@/styles';
import { PositionDetail } from '@/types';
import { IconArrowLeft, IconArrowRight, IconEqual, IconPlus } from '@tabler/icons-react';
import useSWR from 'swr';

export default function AccountAndPositions() {
  const { data: positionDetail } = useSWR(
    '/api/woo/positions',
    (url) => fetch(url).then((res) => res.json() as Promise<PositionDetail>),
    { refreshInterval: 500 },
  );

  if (!positionDetail) return null;

  const {
    starting_balance,
    balance,
    balance_percent,
    equity,
    unrealized,
    realized,
    fee,
    unrealized_percent,
    realized_percent,
    pnl,
    pnl_percent,
    fee_percent,
    total_risk,
    total_risk_percent,
    total_target,
    total_target_percent,
  } = positionDetail;

  const closedPositions = positionDetail.positions.filter(
    (position) => position.unrealized_pnl === 0 && position.quantity === 0,
  );

  const lossPositions = positionDetail.positions.filter((position) => position.pnl < 0);
  const profitPositions = positionDetail.positions.filter((position) => position.pnl > 0);
  const totalLossToday = lossPositions.reduce((acc, { pnl, fee }) => pnl - fee + acc, 0);
  const totalProfitToday = profitPositions.reduce((acc, { pnl, fee }) => pnl - fee + acc, 0);

  const getTextColor = (value: number, base: number = 0) =>
    cn('text-gray-500', value > base && 'text-green-500', value < base && 'text-red-500');

  return (
    <section className="flex flex-col gap-2">
      {/* <div className="flex items-center justify-between">
      <h2 className="text-2xl">Portfolio</h2>
      <div className="font-semibold">{challengeText.join(' / ')}</div>
    </div> */}
      <div className="flex h-full flex-col gap-2">
        {/* Balance */}
        <div className="flex w-full items-center rounded-xl border border-zinc-500 p-4">
          <div className="flex flex-col items-start">
            <div className="text-md opacity-50">Starting Balance</div>
            <div className="text-xl">{starting_balance.toFixed(2)}</div>
            <div className="text-sm opacity-50">Target 50%</div>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center">
            <IconArrowRight size={24} />
            <div className={cn('text-sm', getTextColor(balance_percent))}>
              ({balance_percent.toFixed(2)}%)
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-md opacity-50">Current Balance</div>
            <div className="text-xl">{balance.toFixed(2)}</div>
            <div className="text-sm opacity-50">Equity: {equity.toFixed(2)}</div>
          </div>
        </div>
        {/* Current PnL */}
        <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-zinc-500 p-4">
          <div className="flex w-full">
            <div className="flex flex-1 flex-col items-start">
              <div className="text-md opacity-50">Realized PnL</div>
              <div className="text-xl text-red-500">{realized.toFixed(2)}</div>
              <span className="text-red-500 opacity-80">({realized_percent.toFixed(2)}%)</span>
            </div>
            <IconPlus size={24} />
            <div className="flex flex-1 flex-col items-center">
              <div className="text-md opacity-50">Unrealized PnL</div>
              <div className="text-xl text-green-500">{unrealized.toFixed(2)}</div>
              <span className="text-green-500 opacity-80">({unrealized_percent.toFixed(2)}%)</span>
            </div>
            <IconEqual size={24} />
            <div className="flex flex-1 flex-col items-end">
              <div className="text-md opacity-50">Total PnL</div>
              <div className={cn('text-xl', getTextColor(pnl))}>{pnl.toFixed(2)}</div>
              <span className={cn('opacity-80', getTextColor(pnl_percent))}>
                ({pnl_percent.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div className="text-md text-center opacity-50">
            Fee: -{fee.toFixed(2)} ({fee_percent.toFixed(2)}%)
          </div>
        </div>
        {/* Expected Profit and Loss */}
        <div className="flex w-full items-center rounded-xl border border-zinc-500 p-4">
          <div className="flex flex-col items-start">
            <div className="text-md opacity-50">Expected Loss</div>
            <div className="text-xl text-red-500">{total_risk.toFixed(2)}</div>
            <span className="text-red-500 opacity-80">({total_risk_percent.toFixed(2)}%)</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center">
            <div>Risk ratio</div>
            <div className="text-sm">1 : {(total_target / total_risk).toFixed(2)}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-md opacity-50">Expected Profit</div>
            <div className="text-xl text-green-500">{total_target.toFixed(2)}</div>
            <span className="text-green-500 opacity-80">({total_target_percent.toFixed(2)}%)</span>
          </div>
        </div>
        {/* Closed Positions */}
        <div className="flex w-full items-center rounded-xl border border-zinc-500 p-4">
          <div className="flex flex-col items-start">
            <div className="text-md opacity-50">Daily Loss</div>
            <div className="text-xl text-red-500">{totalLossToday.toFixed(2)}</div>
            <span className="text-red-500 opacity-80">
              ({((totalLossToday / starting_balance) * 100).toFixed(2)}%)
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center">
            <div>Win rate</div>
            <div className="text-sm">
              {((profitPositions.length || 1) / (closedPositions.length || 1)) * 100}%
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-md opacity-50">Daily Profit</div>
            <div className="text-xl text-green-500">{totalProfitToday.toFixed(2)}</div>
            <span className="text-green-500 opacity-80">
              ({((totalProfitToday / starting_balance) * 100).toFixed(2)}%)
            </span>
          </div>
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
      {positionDetail.positions
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
                      <span className="text-xs text-red-500">
                        SL: {sl_price.toFixed(2)} (-
                        {Math.abs((sl_price - entry_price) * quantity).toFixed(2)})
                      </span>
                    )}
                    {sl_price && (
                      <span className="text-xs text-zinc-500">
                        Risk:
                        {Math.abs((((sl_price - entry_price) * quantity) / balance) * 100).toFixed(
                          2,
                        )}
                        % (1:{risk_ratio.toFixed(1)})
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className={cn('font-medium', getTextColor(unrealized_pnl))}>
                  {unrealized_pnl.toFixed(2)}
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
      <div className="grid grid-cols-2 gap-2">
        {positionDetail.positions
          .filter((position) => position.unrealized_pnl === 0 && position.quantity === 0)
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
