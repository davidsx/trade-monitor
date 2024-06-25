export interface WOOAccountInfo {
  applicationId: string;
  account: string;
  alias: string;
  accountMode: string;
  positionMode: string;
  leverage: number;
  takerFeeRate: number;
  makerFeeRate: number;
  interestRate: number;
  futuresTakerFeeRate: number;
  futuresMakerFeeRate: number;
  otpauth: boolean;
  marginRatio: number;
  openMarginRatio: number;
  initialMarginRatio: number;
  maintenanceMarginRatio: number;
  totalCollateral: number;
  freeCollateral: number;
  totalAccountValue: number;
  totalVaultValue: number;
  totalStakingValue: number;
  referrerID: string;
  accountType: string;
  totalLaunchpadVaultValue: number;
  totalEarnValue: number;
}

export interface WOOTradeHistory {
  id: number;
  symbol: string;
  fee: number;
  fee_asset: string;
  side: 'BUY' | 'SELL';
  executed_timestamp: string;
  executed_price: number;
  executed_quantity: number;
  order_id: number;
  order_tag: string;
  is_maker: number;
  realized_pnl: number | null;
}

export interface WOOOrder {
  symbol: string;
  status: string;
  side: 'BUY' | 'SELL';
  created_time: number;
  updated_time: number;
  order_id: number;
  order_tag: string;
  price: number;
  type: 'LIMIT';
  quantity: number;
  amount: null;
  visible: number;
  executed: number;
  total_fee: number;
  fee_asset: 'USDT';
  total_rebate: number;
  rebate_asset: 'USDT';
  client_order_id: number;
  reduce_only: false;
  realized_pnl: number | null;
  average_executed_price: number;
  position_side: 'LONG' | 'SHORT';
}

export interface WOOAlgoOrder {
  algoOrderId: number;
  clientOrderId: number;
  rootAlgoOrderId: number;
  parentAlgoOrderId: number;
  symbol: string;
  order_tag: string;
  algoType: string; // POSITIONAL_TP_SL | BRACKET
  algoStatus: string;
  rootAlgoState: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  isTriggered: boolean;
  triggerPrice: number;
  triggerStatus: string;
  triggerPriceType: string;
  triggerTime: number;
  totalExecutedQuantity: number;
  visibleQuantity: number;
  averageExecutedPrice: number;
  totalFee: number;
  feeAsset: string;
  totalRebate: number;
  relateAsset: string;
  reduceOnly: boolean;
  createdTime: string;
  updatedTime: string;
  isActivated: boolean;
  childOrders: WOOAlgoOrder[];
  positionSide: 'LONG' | 'SHORT';
}

export interface WOOPosition {
  symbol: string;
  holding: number;
  pendingLongQty: number;
  pendingShortQty: number;
  settlePrice: number;
  averageOpenPrice: number;
  pnl24H: number;
  fee24H: number;
  markPrice: number;
  estLiqPrice: number;
  timestamp: number;
  adlQuantile: number;
  positionSide: 'LONG' | 'SHORT';
}

export interface PageMeta {
  total: number;
  records_per_page: number;
  current_page: number;
}

export interface PageResponse<T> {
  success: true;
  meta: PageMeta;
  rows: T[];
}

export interface BasicResponse<T> {
  success: true;
  data: T;
  timestamp: number;
}
