import WooService from '@/service/woo';
import { PositionDetail } from '@/types';
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

  const equity = accountInfo.data.totalAccountValue;
  const startingBalance = equity - unrealized - realized + fee;
  const balance = equity - unrealized;
  const balance_percent = ((balance - startingBalance) / startingBalance) * 100;

  const unrealized_percent = (unrealized / startingBalance) * 100;
  const realized_percent = (realized / startingBalance) * 100;

  const pnl = unrealized + realized - fee;
  const pnl_percent = (pnl / startingBalance) * 100;
  const fee_percent = (fee / startingBalance) * 100;

  const positions = positionResponse.data.positions.map((position) => {
    const { symbol, fee24H, pnl24H, positionSide, averageOpenPrice, markPrice, holding } = position;
    const unrealized_pnl = (markPrice - averageOpenPrice) * holding;
    const algoOrders =
      openingOrderResponse.data.rows.find(
        (algoOrder) =>
          position.symbol === algoOrder.symbol &&
          position.positionSide === algoOrder.positionSide &&
          algoOrder.algoType === 'POSITIONAL_TP_SL',
      )?.childOrders || [];
    const tpOrder = algoOrders.find((algoOrder) => algoOrder.algoType === 'TAKE_PROFIT');
    const tpPrice = tpOrder?.triggerPrice;
    const slOrder = algoOrders.find((algoOrder) => algoOrder.algoType === 'STOP_LOSS');
    const slPrice = slOrder?.triggerPrice;
    const riskRatio =
      Math.abs((tpPrice || averageOpenPrice) - averageOpenPrice) /
      Math.abs((slPrice || averageOpenPrice) - averageOpenPrice);
    return {
      symbol,
      position_side: positionSide,
      quantity: holding,
      entry_price: averageOpenPrice,
      mark_price: markPrice,
      tp_price: tpPrice,
      sl_price: slPrice,
      unrealized_pnl,
      fee: fee24H,
      pnl: pnl24H,
      risk_ratio: riskRatio,
    };
  });

  const total_risk = positions.reduce(
    (acc, { sl_price, entry_price, quantity }) =>
      acc +
      (entry_price && sl_price && quantity ? Math.abs((sl_price - entry_price) * quantity) : 0),
    0,
  );
  const total_risk_percent = (total_risk / startingBalance) * 100;

  const total_target = positions.reduce(
    (acc, { tp_price, entry_price, quantity }) =>
      acc +
      (entry_price && tp_price && quantity ? Math.abs((tp_price - entry_price) * quantity) : 0),
    0,
  );
  const total_target_percent = (total_target / startingBalance) * 100;

  return NextResponse.json({
    startingBalance,
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
    positions,
  } as PositionDetail);
}
