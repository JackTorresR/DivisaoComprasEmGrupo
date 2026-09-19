import { expandUnits } from '../calculations/units';
import { sumCents } from '../money/money';
import type { Assignments, Binding, Person, Product, Unit } from '../types';
import { optimizeDistribution } from './optimizeDistribution';
import type { Problem } from './problem';

const doNothing = () => undefined;

const isLocked = (unit: Unit) => unit.lockedPersonId !== null;

const sumLockedByPerson = (person: Person, lockedUnits: Unit[]) =>
  sumCents(lockedUnits.filter((unit) => unit.lockedPersonId === person.id).map((unit) => unit.priceCents));

const buildAssignments = (lockedUnits: Unit[], freeUnits: Unit[], people: Person[], owners: number[]) => {
  const assignments: Assignments = {};
  lockedUnits.forEach((unit) => {
    assignments[unit.id] = unit.lockedPersonId ?? '';
  });
  freeUnits.forEach((unit, index) => {
    assignments[unit.id] = people[owners[index]].id;
  });
  return assignments;
};

export const calculateDistribution = (
  people: Person[],
  products: Product[],
  bindings: Binding[],
  reportProgress: (progress: number) => void = doNothing,
): Assignments => {
  const units = expandUnits(products, bindings);
  const lockedUnits = units.filter(isLocked);
  const freeUnits = units.filter((unit) => !isLocked(unit));
  const problem: Problem = {
    baseTotals: people.map((person) => sumLockedByPerson(person, lockedUnits)),
    prices: freeUnits.map((unit) => unit.priceCents),
  };
  const owners = optimizeDistribution(problem, reportProgress);
  return buildAssignments(lockedUnits, freeUnits, people, owners);
};
