export interface ParsedTrade {
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
  tp_price: number;
  sl_price: number;
  unrealized_pnl: number;
  fee: number;
  pnl: number;
  risk_ratio: number;
}

export interface PositionDetail {
  starting_balance: number;
  balance: number;
  balance_percent: number;
  equity: number;
  equity_percent: number;
  unrealized: number;
  realized: number;
  fee: number;
  unrealized_percent: number;
  realized_percent: number;
  pnl: number;
  pnl_percent: number;
  fee_percent: number;
  total_risk: number;
  total_risk_percent: number;
  total_target: number;
  total_target_percent: number;
  positions: Position[];
}
