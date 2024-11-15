'use client';

import { IconLoader2 } from '@tabler/icons-react';
import Positions from './Positions';
import Summary from './Summary';
import TradeHistory from './TradeHistory';
import { AccountDetail } from '@/types';
import useSWR from 'swr';

export default function Page(): JSX.Element {
  // const daily_profit_target = challenge.getProfileRequired();
  // const daily_profit_target_percent = challenge.dailyProfitPercentage * 100;
  // const daily_target = challenge.getBalanceRequired();
  // const challengeText = [
  //   `${daily_profit_target_percent.toFixed(2)}%`,
  //   `${daily_profit_target.toFixed(2)}`,
  // ];

  const { data, isLoading } = useSWR(
    '/api/woo',
    (url) => fetch(url).then((res) => res.json() as Promise<AccountDetail>),
    { refreshInterval: 500 },
  );

  return (
    <div className="flex justify-center">
      <div className="flex min-h-screen w-full max-w-[480px] flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl">WOO X</h1>
            {isLoading && (
              <div className="animate-spin">
                <IconLoader2 size={16} />
              </div>
            )}
          </div>
          {/* <nav className="flex flex-col gap-1">
          <Link className="underline underline-offset-2" href="/config">
            Config
          </Link>
        </nav> */}
        </div>
        {data && (
          <div className="flex flex-col gap-4">
            <Summary accountDetail={data} />
            <Positions positions={data.positions} />
            <TradeHistory trades={data.trades} />
          </div>
        )}
      </div>
    </div>
  );
}
