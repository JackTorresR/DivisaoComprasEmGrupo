import type { Cents } from '../money/money';

export type Problem = {
  baseTotals: Cents[];
  prices: Cents[];
};

export type Solution = {
  owners: number[];
  totals: Cents[];
};

export const cloneSolution = (solution: Solution): Solution => ({
  owners: [...solution.owners],
  totals: [...solution.totals],
});

export const listPeopleIndexes = (problem: Problem) => problem.baseTotals.map((_, index) => index);
