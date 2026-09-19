import type { Cents } from '../money/money';

export const calculateCost = (totals: Cents[]) => totals.reduce((sum, total) => sum + total * total, 0);

export const isPerfectlyBalanced = (totals: Cents[]) => Math.max(...totals) - Math.min(...totals) <= 1;
