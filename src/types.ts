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
  startingBalance: number;
  equity: number;
  balance: number;
  unrealized: number;
  realized: number;
  fee: number;
  unrealized_percent: number;
  realized_percent: number;
  pnl: number;
  pnl_percent: number;
  fee_percent: number;
  positions: Position[];
}
