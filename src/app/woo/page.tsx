import { CHALLENGE_CONFIG, CHALLENGE_START_DAY } from '@/config';
import WooService from '@/service/woo';
import { cn } from '@/styles';
import { differenceInDays } from 'date-fns';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import Link from 'next/link';

const wooService = new WooService();
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export const revalidate = 30;

// type TradeSummary = Record<string, { fee: number; pnl: number; count: number }>;
export default async function Page(): Promise<JSX.Element> {
  const accountInfo = await wooService.getAccountInfo();
  const orderResponse = await wooService.getOrders();
  const positionResponse = await wooService.getPositions();

  // const trades = orderResponse.rows
  //   .filter((order) =>
  //     isAfter(new Date(order.updated_time * 1000), addDays(startOfDay(new Date()), -1)),
  //   )
  //   .reduce<TradeSummary>(
  //     (acc, order) => ({
  //       ...acc,
  //       [order.symbol]: {
  //         fee: acc[order.symbol]?.fee || 0 + order.total_fee,
  //         pnl: acc[order.symbol]?.pnl || 0 + (order.realized_pnl || 0),
  //         count: acc[order.symbol]?.count || 0 + (order.realized_pnl !== null ? 1 : 0),
  //       },
  //     }),
  //     {} as TradeSummary,
  //   )

  // console.log(
  //   orderResponse.rows
  //     .filter((order) => order.realized_pnl !== null)
  //     .map((order) => `${order.status} ${order.realized_pnl}`),
  //   orderResponse.rows
  //     .filter((order) => order.realized_pnl !== null)
  //     .map((order) => `${order.status} ${order.realized_pnl}`).length
  // );
  // const { trades, mismatch_orders } = orderResponse.rows.reduce<{
  //   trades: ParsedTrade[];
  //   mismatch_orders: WOOOrder[];
  // }>(
  //   (acc, order) => {
  //     const { trades, mismatch_orders } = acc;
  //     if (order.status !== "FILLED") return acc;

  //     // Trade open
  //     let open_order: WOOOrder | undefined;
  //     let close_order: WOOOrder | undefined;
  //     const match_order = mismatch_orders.find(
  //       (o) =>
  //         o.position_side === order.position_side &&
  //         o.symbol === order.symbol &&
  //         o.quantity === order.quantity &&
  //         o.side !== order.side
  //     );
  //     if (match_order) {
  //       // Open order
  //       if (
  //         (order.position_side === "LONG" && order.side === "BUY") ||
  //         (order.position_side === "SHORT" && order.side === "SELL")
  //       ) {
  //         close_order = match_order;
  //         open_order = order;
  //       }
  //       // Close order
  //       if (
  //         (order.position_side === "LONG" && order.side === "SELL") ||
  //         (order.position_side === "SHORT" && order.side === "BUY")
  //       ) {
  //         open_order = match_order;
  //         close_order = order;
  //       }
  //     }

  //     if (open_order && close_order) {
  //       const price_diff =
  //         close_order.average_executed_price -
  //         open_order.average_executed_price;
  //       const filter_order_ids = [open_order.order_id, close_order.order_id];
  //       const realized_pnl =
  //         (open_order.position_side === "LONG" ? 1 : -1) *
  //         price_diff *
  //         open_order.quantity;
  //       console.log(
  //         realized_pnl.toFixed(3),
  //         close_order.realized_pnl?.toFixed(3),
  //         realized_pnl.toFixed(3) === close_order.realized_pnl?.toFixed(3)
  //       );
  //       const trade: ParsedTrade = {
  //         symbol: open_order.symbol,
  //         position_side: open_order.position_side,
  //         quantity: open_order.quantity,
  //         hold_time: close_order.updated_time - open_order.updated_time,
  //         realized_pnl,
  //         entry_price: open_order.average_executed_price,
  //         exit_price: close_order.average_executed_price,
  //       };
  //       return {
  //         trades: [...trades, trade],
  //         mismatch_orders: mismatch_orders.filter(
  //           (o) => !filter_order_ids.includes(o.order_id)
  //         ),
  //       };
  //     }
  //     return { trades, mismatch_orders: [...mismatch_orders, order] };
  //   },
  //   { trades: [], mismatch_orders: [] }
  // );

  const { unrealized, realized, fee } = positionResponse.data.positions.reduce(
    ({ unrealized, realized, fee }, { averageOpenPrice, markPrice, holding, fee24H, pnl24H }) => {
      const unrealized_pnl = (markPrice - averageOpenPrice) * holding;
      return {
        unrealized: unrealized + unrealized_pnl,
        realized: realized + pnl24H,
        fee: fee + fee24H,
      };
    },
    { unrealized: 0, realized: 0, fee: 0 },
  );

  const balance = accountInfo.data.totalAccountValue - unrealized - realized;
  const unrealized_percent = (unrealized / (balance - realized)) * 100;
  const realized_percent = (realized / (balance - realized)) * 100;
  const fee_percent = (fee / (balance - realized)) * 100;

  const challengeText = [
    `${(CHALLENGE_CONFIG.dailyProfitPercentage * 100).toFixed(2)}%`,
    `${CHALLENGE_CONFIG.getProfileRequired(
      differenceInDays(new Date(), CHALLENGE_START_DAY) + 1,
    ).toFixed(2)}`,
    `${CHALLENGE_CONFIG.getBalanceRequired(
      differenceInDays(new Date(), CHALLENGE_START_DAY) + 1,
    ).toFixed(2)}`,
  ];

  const getTextColor = (value: number) =>
    cn('text-gray-500', value > 0 && 'text-green-500', value < 0 && 'text-red-500');

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-[#171717] p-4 text-[#C6C7C8]">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl">WOO X</h1>
        <nav className="flex flex-col gap-1">
          <Link className="underline underline-offset-2" href="/config">
            Config
          </Link>
        </nav>
      </div>
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">
            Portfolio
            <span className="opacity-50"> ({accountInfo.data.totalAccountValue.toFixed(2)})</span>
          </h2>
          <div className="font-semibold">{challengeText.join(' / ')}</div>
        </div>
        <div className="text-sm">
          <div className="flex gap-2">
            <h3 className="text-md opacity-50">Balance</h3>
            <span>{balance.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <h3 className="text-md opacity-50">Unrealized PnL</h3>
            <span className={getTextColor(unrealized)}>{unrealized.toFixed(2)}</span>
            <span className={cn('opacity-50', getTextColor(unrealized_percent))}>
              ({unrealized_percent.toFixed(2)}%)
            </span>
          </div>
          <div className="flex gap-2">
            <h3 className="text-md opacity-50">Realized PnL</h3>
            <span className={getTextColor(realized)}>{realized.toFixed(2)}</span>
            <span className={cn('opacity-50', getTextColor(realized_percent))}>
              ({realized_percent.toFixed(2)}%)
            </span>
          </div>
          <div className="flex gap-2">
            <h3 className="text-md opacity-50">Fee</h3>
            <span className="opacity-50">{fee.toFixed(2)}</span>
            <span className="opacity-50">({fee_percent.toFixed(2)}%)</span>
          </div>
        </div>
        {positionResponse.data.positions.map((position) => {
          const { symbol, fee24H, pnl24H, positionSide, averageOpenPrice, markPrice, holding } =
            position;
          const unrealized_pnl = (markPrice - averageOpenPrice) * holding;
          return (
            <div
              className={cn(
                'relative flex flex-col rounded-xl bg-[#262728] px-6 py-2',
                "after:absolute after:left-0 after:top-0 after:h-full after:w-2 after:rounded-bl-xl after:rounded-tl-xl after:content-['']",
                positionSide === 'LONG' ? 'after:bg-green-500' : 'after:bg-red-500',
              )}
              key={`${symbol}-${positionSide}`}
            >
              <div className="flex justify-between">
                <div>
                  {symbol.replace('PERP_', '').replace('_USDT', '')}-PERP{' '}
                  {averageOpenPrice > 0 && (
                    <span className="text-xs">{averageOpenPrice.toFixed(2)}</span>
                  )}
                </div>
                <div className={cn('font-medium', getTextColor(unrealized_pnl))}>
                  {unrealized_pnl.toFixed(2)}
                </div>
              </div>
              <div className="flex justify-between text-sm opacity-40">
                <div className="text-gray-500">fee: {fee24H.toFixed(2)}</div>
                <div className={cn(getTextColor(pnl24H))}>PnL: {pnl24H.toFixed(2)}</div>
              </div>
            </div>
          );
        })}
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-2xl">Trades History</h2>
        <table className="w-full">
          <thead>
            <tr className="opacity-50">
              <th className="text-left font-normal">Symbol</th>
              <th className="text-left font-normal">Quantity</th>
              <th className="text-left font-normal">PnL</th>
              <th className="text-left font-normal">Time</th>
            </tr>
          </thead>
          <tbody>
            {orderResponse.rows
              .filter(({ realized_pnl }) => realized_pnl !== null)
              .map((order) => (
                <tr key={order.order_id}>
                  <td>{order.symbol.replace('PERP_', '').replace('_USDT', '')}</td>
                  <td className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-14 rounded-md px-2 py-1 text-center text-xs text-white',
                        order.position_side === 'LONG' && 'bg-green-500',
                        order.position_side === 'SHORT' && 'bg-red-500',
                      )}
                    >
                      {order.position_side}
                    </div>
                    {order.quantity.toFixed(2)}
                  </td>
                  <td
                    className={cn(
                      (order.realized_pnl || 0) > 0 ? 'text-green-500' : 'text-red-500',
                    )}
                  >
                    {order.realized_pnl?.toFixed(2)}
                  </td>
                  <td>{timeAgo.format(new Date(order.updated_time * 1000)).replace(' ago', '')}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
