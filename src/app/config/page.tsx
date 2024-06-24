import { CHALLENGE_CONFIG } from '@/config';
import Link from 'next/link';

export default function Page(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col gap-4 bg-[#171717] p-4 text-[#C6C7C8]">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl">Config</h1>
        <nav className="flex flex-col gap-1">
          <Link className="underline underline-offset-2" href="/woo">
            Woo
          </Link>
        </nav>
      </div>
      <section className="flex flex-col gap-2">
        <div className="text-sm">
          <div className="flex gap-2">
            <h3 className="text-md opacity-50">Capital</h3>
            <span>{CHALLENGE_CONFIG.capital}</span>
          </div>
          <div className="flex gap-2">
            <h3 className="text-md opacity-50">Target</h3>
            <span>{CHALLENGE_CONFIG.target}</span>
          </div>
          <div className="flex gap-2">
            <h3 className="text-md opacity-50">Days</h3>
            <span>{CHALLENGE_CONFIG.days}</span>
          </div>
          <div className="flex gap-2">
            <h3 className="text-md opacity-50">Daily Profit</h3>
            <span>{CHALLENGE_CONFIG.dailyProfit}</span>
          </div>
          <div className="flex gap-2">
            <h3 className="text-md opacity-50">Daily Profit Percentage</h3>
            <span>{(CHALLENGE_CONFIG.dailyProfitPercentage * 100).toFixed(2)}%</span>
          </div>
        </div>
      </section>
    </div>
  );
}
