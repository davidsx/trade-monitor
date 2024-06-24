import { differenceInDays } from 'date-fns';

export const CHALLENGE_START_DAY = new Date('2024-06-24');

export const createChallenge = (capital: number, target: number, days: number) => {
  const dailyProfit = target / days;
  const dailyProfitPercentage = Math.pow(10, Math.log10(target / capital) / days) - 1;
  const getProfileRequired = (day?: number) => {
    const dayPassed = Math.min(day || differenceInDays(new Date(), CHALLENGE_START_DAY) + 1, 1);
    if (dayPassed <= 1) return capital * dailyProfitPercentage;
    return (
      capital * Math.pow(1 + dailyProfitPercentage, dayPassed + 1) -
      capital * Math.pow(1 + dailyProfitPercentage, dayPassed)
    );
  };
  const getBalanceRequired = (day?: number) => {
    const dayPassed = Math.min(day || differenceInDays(new Date(), CHALLENGE_START_DAY) + 1, 1);
    if (dayPassed <= 1) return capital * (1 + dailyProfitPercentage);
    return capital * Math.pow(1 + dailyProfitPercentage, dayPassed + 1);
  };
  return {
    startDay: CHALLENGE_START_DAY,
    capital,
    target,
    days,
    dailyProfit,
    dailyProfitPercentage,
    getProfileRequired,
    getBalanceRequired,
  };
};

export const CHALLENGE_CONFIG = createChallenge(
  400, // capital
  40000, // target
  100, // days
);
