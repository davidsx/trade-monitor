'use client';

import useSWR from 'swr';
import CalendarView from './CalendarView';
import ListView from './ListView';
import { ParsedTrade } from '@/types';

export default function TradeHistory() {
  const { data: trades = [] } = useSWR(
    `/api/woo/trades`,
    (url) => fetch(url).then((res) => res.json()) as Promise<ParsedTrade[]>,
  );

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Trades History</h2>
        <button>switch</button>
      </div>
      <div className="flex flex-col gap-6">
        <CalendarView trades={trades} />
        <ListView trades={trades} />
      </div>
    </section>
  );
}
