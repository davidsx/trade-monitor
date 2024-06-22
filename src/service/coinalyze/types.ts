export interface FutureMarket {
  symbol: string;
  exchange: string;
  symbol_on_exchange: string;
  base_asset: string;
  quote_asset: string;
  is_perpetual: boolean;
  margined: string;
  expire_at: number;
  oi_lq_vol_denominated_in: string;
  has_long_short_ratio_data: boolean;
  has_ohlcv_data: boolean;
  has_buy_sell_data: boolean;
}
