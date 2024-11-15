import { cn } from '@/styles';
import { AccountDetail } from '@/types';
import { getTextColor } from '@/utils';
import { IconArrowRight, IconEqual } from '@tabler/icons-react';
import { startOfDay } from 'date-fns';
import { endOfDay } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

interface Props {
  accountDetail: AccountDetail;
}

export default function Summary({ accountDetail }: Props) {
  const {
    starting_balance,
    balance,
    balance_percent,
    equity,
    equity_percent,
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
  } = accountDetail;

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = toZonedTime(new Date(), 'UTC');
  const dateStart = fromZonedTime(startOfDay(date), tz);
  const dateEnd = fromZonedTime(endOfDay(date), tz);
  const tradesOnDate = accountDetail.trades.filter(
    (trade) =>
      trade.realized_pnl !== null &&
      trade.timestamp >= dateStart.getTime() &&
      trade.timestamp <= dateEnd.getTime(),
  );

  const lossTrades = tradesOnDate.filter((trade) => trade.realized_pnl < 0);
  const profitTrades = tradesOnDate.filter((trade) => trade.realized_pnl > 0);
  const totalLossToday = lossTrades.reduce((acc, { realized_pnl }) => realized_pnl + acc, 0);
  const totalProfitToday = profitTrades.reduce((acc, { realized_pnl }) => realized_pnl + acc, 0);

  return (
    <section className="flex h-full flex-col gap-2">
      {/* Balance */}
      <div className="flex w-full items-center rounded-xl border border-zinc-500 p-4">
        <div className="flex flex-col items-start">
          <div className="text-sm opacity-50">Starting Balance</div>
          <div className="text-xl">{starting_balance.toFixed(2)}</div>
          <div className="text-sm opacity-50">
            Target: {(starting_balance * 1.5).toFixed(2)} (50%)
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center">
          <IconArrowRight size={24} />
          <div className={cn('text-sm', getTextColor(equity_percent))}>
            ({equity_percent.toFixed(2)}%)
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm opacity-50">Equity</div>
          <div className="text-xl">{equity.toFixed(2)}</div>
          <div className="text-sm opacity-50">Current: {balance.toFixed(2)}</div>
        </div>
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
          <IconArrowRight size={16} />
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
        <div className="text-md w-full text-center text-right opacity-50">
          Fee: -{fee.toFixed(2)} ({fee_percent.toFixed(2)}%)
        </div>
      </div>
      {/* Expected Profit and Loss */}
      <div className="flex w-full items-center rounded-xl border border-zinc-500 p-4">
        <div className="flex flex-col items-start">
          <div className="text-sm opacity-50">Expected Loss</div>
          <div className="text-xl text-red-500">{total_risk.toFixed(2)}</div>
          <span className="text-red-500 opacity-80">({total_risk_percent.toFixed(2)}%)</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center text-sm">
          <div>Risk ratio</div>
          <div>1 : {(total_target / total_risk).toFixed(2)}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm opacity-50">Expected Profit</div>
          <div className="text-xl text-green-500">{total_target.toFixed(2)}</div>
          <span className="text-green-500 opacity-80">({total_target_percent.toFixed(2)}%)</span>
        </div>
      </div>
      {/* Closed Positions */}
      <div className="flex w-full items-center justify-between rounded-xl border border-zinc-500 p-4">
        <div className="flex flex-col items-start">
          <div className="text-sm opacity-50">Daily Loss</div>
          <div className="text-xl text-red-500">{totalLossToday.toFixed(2)}</div>
          <span className="text-red-500 opacity-80">
            ({((totalLossToday / starting_balance) * 100).toFixed(2)}%)
          </span>
        </div>
        {/* <div className="flex flex-1 flex-col items-center justify-center text-sm">
          <div>Win rate</div>
          <div>{((profitPositions.length || 1) / (closedPositions.length || 1)) * 100}%</div>
        </div> */}
        <div className="flex flex-col items-end">
          <div className="text-sm opacity-50">Daily Profit</div>
          <div className="text-xl text-green-500">{totalProfitToday.toFixed(2)}</div>
          <span className="text-green-500 opacity-80">
            ({((totalProfitToday / starting_balance) * 100).toFixed(2)}%)
          </span>
        </div>
      </div>
    </section>
  );
}
