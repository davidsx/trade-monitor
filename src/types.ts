export interface ParsedTrade {
  symbol: string;
  position_side: "LONG" | "SHORT";
  quantity: number;
  hold_time: number;
  realized_pnl: number;
  entry_price: number;
  exit_price: number;
}
