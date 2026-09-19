import type { Problem, Solution } from './problem';
import { rebalancePair } from './rebalancePair';

export const improveDistribution = (problem: Problem, solution: Solution, dirtyPeople: number[]) => {
  const pending = new Set(dirtyPeople);
  while (pending.size > 0) {
    const [person] = pending;
    pending.delete(person);
    for (let other = 0; other < solution.totals.length; other++) {
      if (other !== person && rebalancePair(problem, solution, person, other)) {
        pending.add(person);
        pending.add(other);
      }
    }
  }
};
