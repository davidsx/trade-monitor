// import axios from "axios";
// import { FutureMarket } from "./types";

// const API_KEY = process.env.COINALYZE_API_KEY;
// const API_BASE_URL = "https://api.coinalyze.net/v1";
// const API_HEADER = { api_key: API_KEY };

// [
//   { name: "Poloniex", code: "P" },
//   { name: "Vertex", code: "V" },
//   { name: "Bitforex", code: "D" },
//   { name: "Kraken", code: "K" },
//   { name: "Bithumb", code: "U" },
//   { name: "Bitstamp", code: "B" },
//   { name: "BitFlyer", code: "L" },
//   { name: "BtcMarkets", code: "M" },
//   { name: "Bit2c", code: "I" },
//   { name: "MercadoBitcoin", code: "E" },
//   { name: "Independent Reserve", code: "N" },
//   { name: "Gemini", code: "G" },
//   { name: "Gate.io", code: "Y" },
//   { name: "Deribit", code: "2" },
//   { name: "OKX", code: "3" },
//   { name: "Coinbase", code: "C" },
//   { name: "Bitfinex", code: "F" },
//   { name: "Luno", code: "J" },
//   { name: "BitMEX", code: "0" },
//   { name: "Phemex", code: "7" },
//   { name: "WOO X", code: "W" },
//   { name: "Huobi", code: "4" },
//   { name: "dYdX", code: "8" },
//   { name: "Bybit", code: "6" },
//   { name: "Binance", code: "A" },
// ];

// export default class CoinalyzeService {
//   /**
//    * 6: Bybit
//    * 3: OKX
//    * A: Binance
//    * @returns
//    */
//   async getExchanges() {
//     const res = await fetch(API_BASE_URL + "/exchanges", {
//       headers: API_HEADER,
//     });
//     const data = await res.json();
//     return (data as { name: string; code: string }[]).reduce(
//       (exchanges, { name, code }) => ({ ...exchanges, [code]: name }),
//       {}
//     );
//   }
//   async getOpenInterest(symbols: string[]) {
//     const res = await fetch(
//       API_BASE_URL +
//         "/open-interest?convert_to_usd=true&symbols=" +
//         symbols.join(","),
//       {
//         headers: API_HEADER,
//         next: { revalidate: 60 },
//       }
//     );
//     return await res.json();
//   }

//   async getFutureMarkets(): Promise<FutureMarket[]> {
//     const res = await fetch(API_BASE_URL + "/future-markets", {
//       headers: API_HEADER,
//     });
//     return await res.json();
//   }
// }
