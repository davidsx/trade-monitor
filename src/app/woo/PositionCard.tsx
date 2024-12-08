import { cn } from '@/styles';
import { KLine, Position } from '@/types';
import { getTextColor } from '@/utils';
import { useState } from 'react';
import useSWR from 'swr';
import PriceChart from './PriceChart';
import { UTCTimestamp } from 'lightweight-charts';

export default function PositionCard({
  position,
  showDetail,
}: {
  position: Position;
  showDetail: boolean;
}) {
  const {
    symbol,
    position_side,
    quantity,
    entry_price,
    mark_price,
    tp_price,
    tp_pnl,
    tp_pnl_percent,
    sl_price,
    sl_pnl,
    sl_pnl_percent,
    unrealized_pnl,
    unrealized_pnl_percent,
    fee,
    pnl,
    risk_ratio,
  } = position;

  const [showKLine, setShowKLine] = useState(false);

  const { data: kline, isLoading: isLoadingKLine } = useSWR(
    showKLine ? `/api/woo/kline?symbol=${symbol}&interval=1m&limit=1000` : null,
    (url) => fetch(url).then((res) => res.json() as Promise<KLine[]>),
    { refreshInterval: 60 * 1000 },
  );

  return (
    <button
      className={cn(
        'relative rounded-xl bg-[#262728] py-2 pl-4 pr-2',
        "after:absolute after:left-0 after:top-0 after:h-full after:w-2 after:rounded-bl-xl after:rounded-tl-xl after:bg-zinc-500 after:content-['']",
        unrealized_pnl > 0 && 'after:bg-green-500',
        unrealized_pnl < 0 && 'after:bg-red-500',
        !tp_price && 'bg-green-500 bg-opacity-10',
        !sl_price && 'bg-red-500 bg-opacity-10',
      )}
      key={`${symbol}-${position_side}`}
      onClick={() => setShowKLine((e) => !e)}
      disabled={showDetail}
    >
      <div className="flex gap-1">
        <div className="flex flex-1 flex-col items-start gap-1 text-left">
          <div className="flex items-center gap-1">
            <span className="whitespace-nowrap">{symbol}</span>
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'w-min rounded-md px-1 py-0.5 text-center text-2xs text-white',
                  position_side === 'LONG' && 'bg-teal-500 bg-opacity-20 text-green-500',
                  position_side === 'SHORT' && 'bg-red-500 bg-opacity-20 text-red-500',
                )}
              >
                {position_side}
              </span>
              <span className="whitespace-nowrap text-xs">
                {Math.abs(quantity).toFixed(2)} @ {entry_price.toFixed(2)}
              </span>
            </div>
          </div>
          {showDetail && (
            <>
              <div className="flex justify-between text-xs text-zinc-500 opacity-80">
                Mark price: {mark_price.toFixed(2)}
              </div>
              {entry_price > 0 && (
                <div className="flex flex-col">
                  {tp_price && tp_pnl && tp_pnl_percent ? (
                    <span className="text-xs text-green-500 opacity-60">
                      TP: {tp_price.toFixed(2)} ({tp_pnl.toFixed(2)}) ({tp_pnl_percent.toFixed(2)}%)
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-green-500">NO TAKE PROFIT!!!</span>
                  )}
                  {sl_price && sl_pnl && sl_pnl_percent ? (
                    <span
                      className={cn(
                        'text-xs opacity-60',
                        (position_side === 'LONG' && sl_price > entry_price) ||
                          (position_side === 'SHORT' && sl_price < entry_price)
                          ? 'text-green-500'
                          : 'text-red-500',
                      )}
                    >
                      SL: {sl_price.toFixed(2)} ({sl_pnl.toFixed(2)}) ({sl_pnl_percent.toFixed(2)}%)
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-red-500">NO STOP LOSS!!!</span>
                  )}
                  {risk_ratio && (
                    <span className="text-xs text-zinc-500 opacity-60">
                      RR: (1:{risk_ratio.toFixed(1)})
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {sl_pnl_percent ? (
            <div className={cn('text-sm', getTextColor(unrealized_pnl))}>
              {(unrealized_pnl_percent / sl_pnl_percent).toFixed(2)}R ({sl_pnl_percent.toFixed(2)}%)
            </div>
          ) : (
            <div className="text-sm text-zinc-500">No stop loss</div>
          )}
          <div className={cn('text-sm text-zinc-500 opacity-60')}>
            {unrealized_pnl.toFixed(2)} ({unrealized_pnl_percent.toFixed(2)}%)
            {/* ({Math.abs(unrealized_pnl / ((sl_price - entry_price) * quantity)).toFixed(2)}R) */}
          </div>
          {showDetail && (
            <div className="text-sm text-zinc-500 opacity-60">Fee paid: {fee.toFixed(2)}</div>
          )}
        </div>
      </div>
      {showKLine && !isLoadingKLine && kline && (
        <div className="p-4">
          <PriceChart
            data={kline.map((e) => ({ time: e.time as UTCTimestamp, value: e.close }))}
            priceLine={entry_price}
          />
        </div>
      )}
    </button>
  );
}
