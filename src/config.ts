export const createChallenge = (capital: number, target: number, days: number) => {
  return {
    capital,
    target,
    days,
    dailyProfit: target / days,
    dailyProfitPercentage: Math.pow(10, Math.log10(target / capital) / days) - 1,
  };
};

export const CHALLENGE_CONFIG = createChallenge(
  300, // capital
  30000, // target
  100, // days
);
