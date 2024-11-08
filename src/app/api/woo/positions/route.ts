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
  const balance = equity - unrealized - realized + fee;

  const unrealized_percent = (unrealized / balance) * 100;
  const realized_percent = (realized / balance) * 100;

  const pnl = unrealized + realized - fee;
  const pnl_percent = (pnl / balance) * 100;
  const fee_percent = (fee / balance) * 100;

  return NextResponse.json({
    unrealized,
    realized,
    fee,
    balance,
    unrealized_percent,
    realized_percent,
    pnl,
    pnl_percent,
    fee_percent,
    positions: positionResponse.data.positions.map((position) => {
      const { symbol, fee24H, pnl24H, positionSide, averageOpenPrice, markPrice, holding } =
        position;
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
    }),
  } as PositionDetail);
}
