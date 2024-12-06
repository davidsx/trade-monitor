import { cn } from '@/styles';
import { Position } from '@/types';
import { getTextColor } from '@/utils';

export default function ClosedPositionCard({ position }: { position: Position }) {
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
              'w-min rounded-md px-1 py-0.5 text-center text-2xs text-white',
              position_side === 'LONG' && 'bg-teal-500 bg-opacity-20 text-green-500',
              position_side === 'SHORT' && 'bg-red-500 bg-opacity-20 text-red-500',
            )}
          >
            {position_side}
          </div>
        </div>
        <div className="flex items-center justify-between gap-1">
          <div className="text-sm text-zinc-500">Fee: {fee.toFixed(2)}</div>
          <div className={cn('text-md', getTextColor(pnl - fee))}>{(pnl - fee).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
