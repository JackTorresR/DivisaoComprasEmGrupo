import { calculateCost, isPerfectlyBalanced } from './cost';
import { createGreedySolution } from './greedy';
import { improveDistribution } from './improveDistribution';
import { perturbSolution } from './perturbSolution';
import { cloneSolution, listPeopleIndexes, type Problem, type Solution } from './problem';
import { MAX_SEARCH_ROUNDS, RANDOM_SEED, STALLED_ROUNDS_LIMIT } from './settings';
import { createSeededRandom } from '../../utils/seededRandom';

const hasNothingToOptimize = (problem: Problem) => problem.baseTotals.length < 2 || problem.prices.length < 2;

const runSearchRound = (problem: Problem, current: Solution, random: () => number): Solution => {
  const candidate = cloneSolution(current);
  const touchedPeople = perturbSolution(problem, candidate, random);
  improveDistribution(problem, candidate, touchedPeople);
  return calculateCost(candidate.totals) <= calculateCost(current.totals) ? candidate : current;
};

export const optimizeDistribution = (problem: Problem, reportProgress: (progress: number) => void): number[] => {
  const initial = createGreedySolution(problem);
  improveDistribution(problem, initial, listPeopleIndexes(problem));
  if (hasNothingToOptimize(problem)) return initial.owners;

  const random = createSeededRandom(RANDOM_SEED);
  let best = initial;
  let stalledRounds = 0;

  for (let round = 1; round <= MAX_SEARCH_ROUNDS; round++) {
    if (isPerfectlyBalanced(best.totals) || stalledRounds >= STALLED_ROUNDS_LIMIT) break;
    const next = runSearchRound(problem, best, random);
    stalledRounds = calculateCost(next.totals) < calculateCost(best.totals) ? 0 : stalledRounds + 1;
    best = next;
    reportProgress(round / MAX_SEARCH_ROUNDS);
  }

  reportProgress(1);
  return best.owners;
};
