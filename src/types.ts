export interface Trade {
  id: string;
  symbol: string;
  position_side: 'LONG' | 'SHORT';
  quantity: number;
  // hold_time: number;
  realized_pnl: number;
  timestamp: number;
  // entry_price: number;
  // exit_price: number;
}

export interface Position {
  symbol: string;
  position_side: 'LONG' | 'SHORT';
  quantity: number;
  entry_price: number;
  mark_price: number;
  unrealized_pnl: number;
  unrealized_pnl_percent: number;
  fee: number;
  fee_percent: number;
  pnl: number;
  pnl_percent: number;
  tp_price?: number;
  tp_pnl?: number;
  tp_pnl_percent?: number;
  sl_price?: number;
  sl_pnl?: number;
  sl_pnl_percent?: number;
  risk_ratio?: number;
}

export interface AccountDetail {
  target_percent: number;
  starting_balance: number;
  available_balance: number;
  target_balance: number;
  balance: number;
  balance_percent: number;
  equity: number;
  equity_percent: number;
  unrealized: number;
  unrealized_percent: number;
  realized: number;
  realized_percent: number;
  fee: number;
  fee_percent: number;
  pnl: number;
  pnl_percent: number;
  per_position_unrealized: number;
  per_position_unrealized_percent: number;
  total_risk: number;
  total_risk_percent: number;
  total_target: number;
  total_target_percent: number;
  total_risk_ratio: number;
  positions: Position[];
  trades: Trade[];
}

export interface KLine {
  time: number;
  open: number;
  close: number;
  high: number;
  low: number;
}

export type Interval = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';