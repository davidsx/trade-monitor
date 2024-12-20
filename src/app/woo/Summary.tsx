import { cn } from '@/styles';
import { AccountDetail } from '@/types';
import { getTextColor } from '@/utils';
import { IconArrowRight, IconEqual, IconMinus, IconPlus } from '@tabler/icons-react';
import { startOfDay } from 'date-fns';
import { endOfDay } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { useState } from 'react';

interface Props {
  accountDetail: AccountDetail;
}

export default function Summary({ accountDetail }: Props) {
  const {
    starting_balance,
    target_percent,
    target_balance,
    available_balance,
    balance,
    balance_percent,
    equity,
    equity_percent,
    unrealized,
    unrealized_percent,
    realized,
    realized_percent,
    pnl,
    pnl_percent,
    fee,
    fee_percent,
    per_position_unrealized,
    per_position_unrealized_percent,
    total_risk,
    total_risk_percent,
    total_target,
    total_target_percent,
    total_risk_ratio,
  } = accountDetail;

  const [hideExpected, setHideExpected] = useState(false);
  const [hideClosed, setHideClosed] = useState(false);

  const date = toZonedTime(new Date(), 'UTC');
  const dateStart = fromZonedTime(startOfDay(date), 'UTC');
  const dateEnd = fromZonedTime(endOfDay(date), 'UTC');
  const tradesOnDate = accountDetail.trades.filter(
    (trade) =>
      trade.realized_pnl !== null &&
      trade.timestamp >= dateStart.getTime() &&
      trade.timestamp <= dateEnd.getTime(),
  );

  const lossTrades = tradesOnDate.filter((trade) => trade.realized_pnl < 0);
  const profitTrades = tradesOnDate.filter((trade) => trade.realized_pnl > 0);
  const totalLossToday = lossTrades.reduce((acc, { realized_pnl }) => realized_pnl + acc, 0);
  const totalLossTodayPercent = (totalLossToday / starting_balance) * 100;
  const totalProfitToday = profitTrades.reduce((acc, { realized_pnl }) => realized_pnl + acc, 0);
  const totalProfitTodayPercent = (totalProfitToday / starting_balance) * 100;

  const winRate =
    (profitTrades.length === 0
      ? -1
      : lossTrades.length === 0
        ? 1
        : profitTrades.length / tradesOnDate.length) * 100;

  return (
    <section className="flex h-full flex-col gap-2">
      <h2 className="flex w-full items-center justify-between text-sm">
        Summary
        {/* <div>
          <button onClick={() => setShowDetail(!showDetail)}>
            {showDetail ? <IconList size={16} /> : <IconLayoutList size={16} />}
          </button>
        </div> */}
      </h2>
      {/* Balance */}
      <div
        className={cn(
          'flex w-full flex-col items-center rounded-xl border border-zinc-500 p-4',
          equity_percent > target_percent * 100 && 'border-4 border-green-500',
          equity_percent > target_percent * 100 * 2 && 'bg-green-500 bg-opacity-20',
          equity_percent < target_percent * -100 && 'border-4 border-red-500',
          equity_percent < target_percent * -100 * 2 && 'bg-red-500 bg-opacity-20',
        )}
      >
        <div className="flex w-full items-center">
          <div className="flex flex-1 flex-col items-start">
            <div className="text-sm opacity-50">Starting Balance</div>
            <div className="text-xl">{starting_balance.toFixed(2)}</div>
            <div className="whitespace-nowrap text-xs opacity-50">
              Available: {available_balance.toFixed(2)}
            </div>
            <div className="whitespace-nowrap text-xs opacity-50">
              Target: {target_balance.toFixed(2)}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <IconArrowRight size={24} />
            <div
              className={cn(
                'text-md opacity-80',
                equity_percent > 0 && 'text-green-500',
                equity_percent < 0 && 'text-red-500',
              )}
            >
              ({equity_percent.toFixed(2)}%)
            </div>
          </div>
          <div className="flex flex-1 flex-col items-end">
            <div className="text-sm opacity-50">Equity</div>
            <div className="text-xl">{equity.toFixed(2)}</div>
            <div className="whitespace-nowrap text-xs opacity-50">
              Current: {balance.toFixed(2)}
            </div>
            <div className="whitespace-nowrap text-xs opacity-50">
              ({balance_percent.toFixed(2)}%)
            </div>
          </div>
        </div>
        {/* {equity_percent > 20 && (
          <div className="flex flex-col items-center text-green-500">
            <span className="text-md uppercase">Take profit now 🚀</span>
            {equity_percent > 40 && (
              <span className="text-sm opacity-80">At least check the chart</span>
            )}
          </div>
        )} */}
      </div>
      {/* Current PnL */}
      <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-zinc-500 p-4">
        <div className="flex w-full items-center">
          <div className="flex flex-1 flex-col items-start">
            <div className="text-sm opacity-50">Realized</div>
            <div className={cn('text-xl', getTextColor(realized))}>{realized.toFixed(2)}</div>
            <span className={cn('opacity-80', getTextColor(realized))}>
              ({realized_percent.toFixed(2)}%)
            </span>
          </div>
          <IconPlus size={16} />
          <div className="flex flex-1 flex-col items-center">
            <div className="text-sm opacity-50">Unrealized</div>
            <div className={cn('text-xl', getTextColor(unrealized))}>{unrealized.toFixed(2)}</div>
            <span className={cn('opacity-80', getTextColor(unrealized))}>
              ({unrealized_percent.toFixed(2)}%)
            </span>
          </div>
          <IconEqual size={16} />
          <div className="flex flex-1 flex-col items-end">
            <div className="text-sm opacity-50">PnL</div>
            <div className={cn('text-xl', getTextColor(pnl))}>{pnl.toFixed(2)}</div>
            <span className={cn('opacity-80', getTextColor(pnl_percent))}>
              ({pnl_percent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="flex w-full items-center justify-between whitespace-nowrap text-xs opacity-50">
          <div className="flex flex-1 flex-col items-start">
            {per_position_unrealized && (
              <span>Per position: {per_position_unrealized.toFixed(2)}</span>
            )}
            {per_position_unrealized_percent && (
              <span>({per_position_unrealized_percent.toFixed(2)}%)</span>
            )}
          </div>
          <div className="flex flex-1 flex-col items-center">
            <span>Fee: -{fee.toFixed(2)}</span>
            <span>(-{fee_percent.toFixed(2)}%)</span>
          </div>
          <div className="flex flex-1 flex-col items-end">
            <span>Required: {(starting_balance * 0.2).toFixed(2)}</span>
            <span>(20%)</span>
          </div>
        </div>
      </div>
      {/* Expected Profit and Loss */}
      {((total_risk ?? 0) !== 0 || (total_target ?? 0) !== 0) && hideExpected ? (
        <div className="flex w-full items-center justify-center rounded-lg border border-zinc-500 p-2">
          <button onClick={() => setHideExpected(false)} className="rounded-full bg-zinc-500 p-0.5">
            <IconPlus size={16} />
          </button>
        </div>
      ) : (
        <div className="group relative flex w-full items-center rounded-xl border border-zinc-500 p-4">
          <button
            className="absolute -right-1 -top-1 rounded-full bg-zinc-500 p-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            onClick={() => setHideExpected(true)}
          >
            <IconMinus size={12} />
          </button>
          <div className="flex flex-1 flex-col items-start">
            <div className="text-sm opacity-50">Expected Loss</div>
            <div className={cn('text-xl', getTextColor(total_risk))}>{total_risk.toFixed(2)}</div>
            <span className={cn('whitespace-nowrap text-xs opacity-80', getTextColor(total_risk))}>
              ({total_risk_percent.toFixed(2)}%) {(balance + total_risk).toFixed(2)}
            </span>
          </div>
          {total_risk_ratio && (
            <div className="flex flex-1 flex-col items-center justify-center text-sm">
              <div>Risk ratio</div>
              <div>1 : {total_risk_ratio.toFixed(2)}</div>
            </div>
          )}
          <div className="flex flex-1 flex-col items-end">
            <div className="text-sm opacity-50">Expected Profit</div>
            <div className={cn('text-xl', getTextColor(total_target))}>
              {total_target.toFixed(2)}
            </div>
            <span
              className={cn('whitespace-nowrap text-xs opacity-80', getTextColor(total_target))}
            >
              {(balance + total_target).toFixed(2)} ({total_target_percent.toFixed(2)}%)
            </span>
          </div>
        </div>
      )}
      {/* Closed Positions */}
      {hideClosed ? (
        <div className="flex w-full items-center justify-center rounded-lg border border-zinc-500 p-2">
          <button onClick={() => setHideClosed(false)} className="rounded-full bg-zinc-500 p-0.5">
            <IconPlus size={16} />
          </button>
        </div>
      ) : (
        <div className="group relative flex w-full items-center justify-between rounded-xl border border-zinc-500 p-4">
          <button
            className="absolute -right-1 -top-1 rounded-full bg-zinc-500 p-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            onClick={() => setHideClosed(true)}
          >
            <IconMinus size={12} />
          </button>
          <div className="flex flex-col items-start">
            <div className="text-sm opacity-50">Daily Loss</div>
            <div className="text-xl text-red-500">{totalLossToday.toFixed(2)}</div>
            <span className="text-xs text-red-500 opacity-80">
              ({totalLossTodayPercent.toFixed(2)}%)
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center text-sm">
            <span>Win rate: {winRate.toFixed(2)}%</span>
            <span>avg: {(realized / tradesOnDate.length).toFixed(2)}</span>
            <span>count: {tradesOnDate.length}</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm opacity-50">Daily Profit</div>
            <div className="text-xl text-green-500">{totalProfitToday.toFixed(2)}</div>
            <span className="text-xs text-green-500 opacity-80">
              ({totalProfitTodayPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
