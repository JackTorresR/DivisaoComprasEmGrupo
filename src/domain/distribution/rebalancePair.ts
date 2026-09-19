import type { Problem, Solution } from './problem';
import { findSubsetClosestToDoubledGoal } from './subsetSum';

const sumPrices = (problem: Problem, itemIndexes: number[]) =>
  itemIndexes.reduce((total, itemIndex) => total + problem.prices[itemIndex], 0);

const listOwnedItems = (solution: Solution, people: number[]) =>
  solution.owners.flatMap((owner, itemIndex) => (people.includes(owner) ? [itemIndex] : []));

export const rebalancePair = (problem: Problem, solution: Solution, first: number, second: number): boolean => {
  const pool = listOwnedItems(solution, [first, second]);
  if (pool.length === 0) return false;

  const pairTotal = solution.totals[first] + solution.totals[second];
  const firstBase = solution.totals[first] - sumPrices(problem, listOwnedItems(solution, [first]));
  const weights = pool.map((itemIndex) => problem.prices[itemIndex]);
  const chosen = findSubsetClosestToDoubledGoal(weights, pairTotal - 2 * firstBase);
  if (!chosen) return false;

  const newFirstTotal = firstBase + sumPrices(problem, chosen.map((position) => pool[position]));
  const newSecondTotal = pairTotal - newFirstTotal;
  const currentCost = solution.totals[first] ** 2 + solution.totals[second] ** 2;
  if (newFirstTotal ** 2 + newSecondTotal ** 2 >= currentCost) return false;

  pool.forEach((itemIndex) => {
    solution.owners[itemIndex] = second;
  });
  chosen.forEach((position) => {
    solution.owners[pool[position]] = first;
  });
  solution.totals[first] = newFirstTotal;
  solution.totals[second] = newSecondTotal;
  return true;
};
