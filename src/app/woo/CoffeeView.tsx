import { cn } from '@/styles';
import { AccountDetail } from '@/types';
import { getTextColor } from '@/utils';
import { IconArrowRight, IconEqual, IconPlus } from '@tabler/icons-react';

interface Props {
  accountDetail: AccountDetail;
}

export default function CoffeeView({ accountDetail }: Props) {
  const {
    starting_balance,
    target_balance,
    equity,
    equity_percent,
    realized,
    realized_percent,
    unrealized,
    unrealized_percent,
    pnl,
    pnl_percent,
  } = accountDetail;

  return (
    <section className="flex h-full flex-col gap-2">
      <div
        className={cn(
          'flex w-full flex-col items-center gap-1 rounded-xl border border-zinc-500 p-4',
          equity_percent > 20 && 'border-4 border-green-500',
          equity_percent > 40 && 'bg-green-500 bg-opacity-20',
          equity_percent < -10 && 'border-4 border-red-500',
          equity_percent < -20 && 'bg-red-500 bg-opacity-20',
        )}
      >
        <div className="flex w-full items-center">
          <div className="flex flex-1 flex-col items-start">
            <div className="text-xl">{starting_balance.toFixed(2)}</div>
            <span className="text-sm opacity-50">({target_balance.toFixed(2)})</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <IconArrowRight size={24} />
          </div>
          <div className="flex flex-1 flex-col items-end">
            <div className="text-xl">{equity.toFixed(2)}</div>
            <span className="text-sm opacity-50">({equity_percent.toFixed(2)}%)</span>
          </div>
        </div>
        <div className="flex w-full items-center">
          <div className="flex flex-1 flex-col items-start">
            <div className={cn('text-xl', getTextColor(realized))}>{realized.toFixed(2)}</div>
          </div>
          <IconPlus size={16} />
          <div className="flex flex-1 flex-col items-center">
            <div className={cn('text-xl', getTextColor(unrealized))}>{unrealized.toFixed(2)}</div>
          </div>
          <IconEqual size={16} />
          <div className="flex flex-1 flex-col items-end">
            <div className={cn('text-xl', getTextColor(pnl))}>{pnl.toFixed(2)}</div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between whitespace-nowrap text-sm opacity-50">
          <span>({realized_percent.toFixed(2)}%)</span>
          <span>({unrealized_percent.toFixed(2)}%)</span>
          <span>({pnl_percent.toFixed(2)}%)</span>
        </div>
      </div>
    </section>
  );
}
