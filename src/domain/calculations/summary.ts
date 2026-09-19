import { sumCents, type Cents } from '../money/money';
import type { Assignments, Person, Unit } from '../types';

export type TripSummary = {
  unitCount: number;
  peopleCount: number;
  totalCents: Cents;
  averageCents: Cents;
};

export type PersonShare = {
  person: Person;
  units: Unit[];
  totalCents: Cents;
  differenceCents: Cents;
};

export const calculateTripSummary = (peopleCount: number, units: Unit[]): TripSummary => {
  const totalCents = sumCents(units.map((unit) => unit.priceCents));
  return {
    unitCount: units.length,
    peopleCount,
    totalCents,
    averageCents: peopleCount === 0 ? 0 : Math.round(totalCents / peopleCount),
  };
};

export const buildPersonShares = (
  people: Person[],
  units: Unit[],
  assignments: Assignments,
  averageCents: Cents,
): PersonShare[] =>
  people.map((person) => {
    const ownedUnits = units.filter((unit) => assignments[unit.id] === person.id);
    const totalCents = sumCents(ownedUnits.map((unit) => unit.priceCents));
    return { person, units: ownedUnits, totalCents, differenceCents: totalCents - averageCents };
  });

export const findLargestDifferenceCents = (shares: PersonShare[]): Cents =>
  Math.max(0, ...shares.map((share) => Math.abs(share.differenceCents)));
