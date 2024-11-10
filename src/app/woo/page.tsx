import { cn } from '@/styles';
import AccountAndPositions from './AccountAndPositions';
import TradeHistory from './TradeHistory';

export const revalidate = 30;

export default async function Page(): Promise<JSX.Element> {
  // const daily_profit_target = challenge.getProfileRequired();
  // const daily_profit_target_percent = challenge.dailyProfitPercentage * 100;
  // const daily_target = challenge.getBalanceRequired();
  // const challengeText = [
  //   `${daily_profit_target_percent.toFixed(2)}%`,
  //   `${daily_profit_target.toFixed(2)}`,
  // ];

  const getTextColor = (value: number, base: number = 0) =>
    cn('text-gray-500', value > base && 'text-green-500', value < base && 'text-red-500');

  return (
    <div className="flex min-h-screen flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl">WOO X</h1>
        {/* <nav className="flex flex-col gap-1">
          <Link className="underline underline-offset-2" href="/config">
            Config
          </Link>
        </nav> */}
      </div>
      <AccountAndPositions />
      <TradeHistory />
    </div>
  );
}
