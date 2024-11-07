// import { getChallenge } from '@/config';
import Link from 'next/link';

export const revalidate = 60;

export default async function Page(): Promise<JSX.Element> {
  return <div>Config</div>;
  // const challenge = await getChallenge();

  // return (
  //   <div className="flex min-h-screen flex-col gap-4">
  //     <div className="flex items-center justify-between">
  //       <h1 className="text-4xl">Config</h1>
  //       <nav className="flex flex-col gap-1">
  //         <Link className="underline underline-offset-2" href="/woo">
  //           Woo
  //         </Link>
  //       </nav>
  //     </div>
  //     <section className="flex flex-col gap-2">
  //       <div className="text-sm">
  //         <div className="flex gap-2">
  //           <h3 className="text-md opacity-50">Capital</h3>
  //           <span>{challenge.capital}</span>
  //         </div>
  //         <div className="flex gap-2">
  //           <h3 className="text-md opacity-50">Target</h3>
  //           <span>{challenge.target}</span>
  //         </div>
  //         <div className="flex gap-2">
  //           <h3 className="text-md opacity-50">Days</h3>
  //           <span>{challenge.days}</span>
  //         </div>
  //         <div className="flex gap-2">
  //           <h3 className="text-md opacity-50">Daily Profit</h3>
  //           <span>{challenge.dailyProfit}</span>
  //         </div>
  //         <div className="flex gap-2">
  //           <h3 className="text-md opacity-50">Daily Profit Percentage</h3>
  //           <span>{(challenge.dailyProfitPercentage * 100).toFixed(2)}%</span>
  //         </div>
  //       </div>
  //     </section>
  //   </div>
  // );
}
