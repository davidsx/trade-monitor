import { HmacSHA256 } from 'crypto-js';
import {
  BasicResponse,
  PageResponse,
  WOOAccountInfo,
  WOOOrder,
  WOOPosition,
  WOOTradeHistory,
} from './types';
import { addDays, startOfDay } from 'date-fns';

export const API_DOMAIN = 'https://api.woo.org/';
export const API_SECRET = process.env.WOO_API_SECRET;
export const API_KEY = process.env.WOO_API_KEY;

export default class WooService {
  private _getHeadersV1(queryString = '') {
    const xApiTimestamp = Date.now();

    const message = queryString + '|' + xApiTimestamp;
    // const signString = xApiTimestamp + method + path;
    const apiSignature = HmacSHA256(message, API_SECRET).toString();
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'x-api-signature': apiSignature,
      'x-api-timestamp': xApiTimestamp.toString(),
      'cache-control': 'no-cache',
    };
    return headers;
  }

  private _getHeadersV3(method: string, path: string) {
    const xApiTimestamp = Date.now();

    // const queryString = "|" + xApiTimestamp;
    const signString = xApiTimestamp + method + path;
    const apiSignature = HmacSHA256(signString, API_SECRET).toString();
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'x-api-signature': apiSignature,
      'x-api-timestamp': xApiTimestamp.toString(),
      'cache-control': 'no-cache',
    };
    return headers;
  }

  async get<TRes extends { success: true }>(url: string) {
    const fullUrl = 'https://api.woo.org' + url;
    const queryString = new URL(fullUrl).search.replace(/^\?/, '');
    const res = await fetch('https://api.woo.org' + url, {
      headers: url.startsWith('/v3')
        ? this._getHeadersV3('GET', url)
        : this._getHeadersV1(queryString),
      next: { revalidate: 30 },
    });
    const data = (await res.json()) as TRes | { success: false; code: number; message: string };
    if (!data.success) {
      console.log(data);
      console.log(queryString);
      throw new Error(data.message);
    }
    return data;
  }

  async getAccountInfo() {
    const data = await this.get<BasicResponse<WOOAccountInfo>>('/v3/accountinfo');
    return data;
  }

  async getTradeHistory() {
    const data = await this.get<PageResponse<WOOTradeHistory>>('/v1/client/trades');
    return data;
  }

  async getOrders() {
    // const today = (startOfDay(new Date()).getTime() / 1000).toFixed(3);
    // const tmr = (addDays(startOfDay(new Date()), 1).getTime() / 1000).toFixed(3);
    // console.log(today, tmr);
    const data = await this.get<PageResponse<WOOOrder>>(
      `/v1/orders?realized_pnl=true&size=200&status=FILLED`,
    );
    return data;
  }

  async getPositions() {
    // const today = (startOfDay(new Date()).getTime() / 1000).toFixed(3);
    // const tmr = (addDays(startOfDay(new Date()), 1).getTime() / 1000).toFixed(3);
    // console.log(today, tmr);
    const data = await this.get<BasicResponse<{ positions: WOOPosition[] }>>(`/v3/positions`);
    return data;
  }
}
