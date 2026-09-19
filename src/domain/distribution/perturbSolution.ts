import type { Problem, Solution } from './problem';

const MIN_PEOPLE_TO_SHUFFLE = 2;
const MAX_EXTRA_PEOPLE_TO_SHUFFLE = 2;

const pickDistinctPeople = (personCount: number, random: () => number) => {
  const wanted = Math.min(personCount, MIN_PEOPLE_TO_SHUFFLE + Math.floor(random() * MAX_EXTRA_PEOPLE_TO_SHUFFLE));
  const candidates = Array.from({ length: personCount }, (_, index) => index);
  for (let position = 0; position < wanted; position++) {
    const swapWith = position + Math.floor(random() * (personCount - position));
    [candidates[position], candidates[swapWith]] = [candidates[swapWith], candidates[position]];
  }
  return candidates.slice(0, wanted);
};

export const perturbSolution = (problem: Problem, solution: Solution, random: () => number): number[] => {
  const people = pickDistinctPeople(solution.totals.length, random);
  solution.owners.forEach((owner, itemIndex) => {
    if (!people.includes(owner)) return;
    const newOwner = people[Math.floor(random() * people.length)];
    solution.totals[owner] -= problem.prices[itemIndex];
    solution.totals[newOwner] += problem.prices[itemIndex];
    solution.owners[itemIndex] = newOwner;
  });
  return people;
};
