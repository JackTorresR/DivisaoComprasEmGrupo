import type { Problem, Solution } from './problem';

const findLowestTotalIndex = (totals: number[]) =>
  totals.reduce((lowest, total, index) => (total < totals[lowest] ? index : lowest), 0);

const sortByPriceDescending = (prices: number[]) =>
  prices.map((_, index) => index).sort((a, b) => prices[b] - prices[a] || a - b);

export const createGreedySolution = (problem: Problem): Solution => {
  const totals = [...problem.baseTotals];
  const owners = Array<number>(problem.prices.length).fill(-1);
  sortByPriceDescending(problem.prices).forEach((itemIndex) => {
    const owner = findLowestTotalIndex(totals);
    owners[itemIndex] = owner;
    totals[owner] += problem.prices[itemIndex];
  });
  return { owners, totals };
};
