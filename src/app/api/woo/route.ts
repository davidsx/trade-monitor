import WooService from '@/service/woo';
import { Trade, AccountDetail } from '@/types';
import { NextResponse } from 'next/server';

const wooService = new WooService();

export async function GET() {
  const accountInfo = await wooService.getAccountInfo();
  const positionResponse = await wooService.getPositions();
  const openingOrderResponse = await wooService.getOpeningOrders();

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

  const target_percent = 0.1;
  const available_balance = accountInfo.data.freeCollateral;
  const equity = accountInfo.data.totalAccountValue;
  const starting_balance = equity - unrealized - realized + fee;
  const target_balance = starting_balance * (1 + target_percent);
  const balance = equity - unrealized;
  const balance_percent = ((balance - starting_balance) / starting_balance) * 100;
  const equity_percent = ((equity - starting_balance) / starting_balance) * 100;

  const unrealized_percent = (unrealized / starting_balance) * 100;
  const realized_percent = (realized / starting_balance) * 100;

  const pnl = unrealized + realized;
  const pnl_percent = (pnl / starting_balance) * 100;
  const fee_percent = (fee / starting_balance) * 100;

  const positions = positionResponse.data.positions.map((position) => {
    const { symbol, fee24H, pnl24H, positionSide, averageOpenPrice, markPrice, holding } = position;
    const unrealized_pnl = (markPrice - averageOpenPrice) * holding;
    const unrealized_pnl_percent = (unrealized_pnl / starting_balance) * 100;
    const algoOrders =
      openingOrderResponse.data.rows.find(
        (algoOrder) =>
          position.symbol === algoOrder.symbol &&
          position.positionSide === algoOrder.positionSide &&
          algoOrder.algoType === 'POSITIONAL_TP_SL',
      )?.childOrders || [];
    const tpOrder = algoOrders.find((algoOrder) => algoOrder.algoType === 'TAKE_PROFIT');
    const tp_price = tpOrder?.triggerPrice;
    const tp_pnl = tp_price ? Math.abs((tp_price - averageOpenPrice) * holding) : undefined;
    const tp_pnl_percent = tp_pnl ? (tp_pnl / starting_balance) * 100 : undefined;
    const slOrder = algoOrders.find((algoOrder) => algoOrder.algoType === 'STOP_LOSS');
    const sl_price = slOrder?.triggerPrice;
    const sl_pnl = sl_price ? Math.abs((sl_price - averageOpenPrice) * holding) : undefined;
    const sl_pnl_percent = sl_pnl ? (sl_pnl / starting_balance) * 100 : undefined;
    const risk_ratio =
      tp_price && sl_price
        ? Math.abs((tp_price || averageOpenPrice) - averageOpenPrice) /
          Math.abs((sl_price || averageOpenPrice) - averageOpenPrice)
        : null;
    const pnl = pnl24H;
    const pnl_percent = (pnl / starting_balance) * 100;
    const fee = fee24H;
    const fee_percent = (fee / starting_balance) * 100;
    return {
      symbol: symbol.replace('PERP_', '').replace('_USDT', ''),
      position_side: positionSide,
      quantity: holding,
      entry_price: averageOpenPrice,
      mark_price: markPrice,
      tp_price,
      tp_pnl,
      tp_pnl_percent,
      sl_price,
      sl_pnl,
      sl_pnl_percent,
      unrealized_pnl,
      unrealized_pnl_percent,
      fee,
      fee_percent,
      pnl,
      pnl_percent,
      risk_ratio,
    };
  });

  const per_position_unrealized =
    unrealized /
    positions.filter((position) => position.unrealized_pnl !== 0 && position.quantity !== 0).length;
  const per_position_unrealized_percent = (per_position_unrealized / starting_balance) * 100;

  const total_risk = positions.reduce(
    (acc, { sl_price, entry_price, quantity, position_side }) =>
      acc +
      (entry_price && sl_price && quantity
        ? (position_side === 'LONG' ? sl_price - entry_price : entry_price - sl_price) *
          Math.abs(quantity)
        : 0),
    0,
  );
  const total_risk_percent = (total_risk / starting_balance) * 100;

  const total_target = positions.reduce(
    (acc, { tp_price, entry_price, quantity }) =>
      acc +
      (entry_price && tp_price && quantity
        ? Math.abs((tp_price - entry_price) * Math.abs(quantity))
        : 0),
    0,
  );
  const total_target_percent = (total_target / starting_balance) * 100;

  const total_risk_ratio = Math.abs(total_target / total_risk);

  const orderResponse = await wooService.getPreviousOrders();
  const trades = orderResponse.rows
    .filter(({ realized_pnl }) => realized_pnl !== null)
    .map((order) => {
      return {
        id: order.order_id.toString(),
        symbol: order.symbol,
        position_side: order.position_side,
        quantity: order.quantity,
        realized_pnl: order.realized_pnl,
        timestamp: parseFloat(order.updated_time.toString()) * 1000,
      } as Trade;
    });

  return NextResponse.json({
    target_percent,
    starting_balance,
    available_balance,
    target_balance,
    balance,
    balance_percent,
    equity,
    equity_percent,
    unrealized,
    unrealized_percent,
    realized,
    realized_percent,
    fee,
    fee_percent,
    pnl,
    pnl_percent,
    per_position_unrealized,
    per_position_unrealized_percent,
    total_risk,
    total_risk_percent,
    total_target,
    total_target_percent,
    total_risk_ratio,
    positions,
    trades,
  } as AccountDetail);
}
