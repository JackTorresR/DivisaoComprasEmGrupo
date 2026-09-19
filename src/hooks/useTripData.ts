import { useMemo } from 'react';
import { buildPersonShares, calculateTripSummary } from '../domain/calculations/summary';
import { expandUnits } from '../domain/calculations/units';
import { useAppStore } from '../store/useAppStore';

export const useTripData = () => {
  const people = useAppStore((state) => state.people);
  const products = useAppStore((state) => state.products);
  const bindings = useAppStore((state) => state.bindings);
  const assignments = useAppStore((state) => state.assignments);

  return useMemo(() => {
    const units = expandUnits(products, bindings);
    const summary = calculateTripSummary(people.length, units);
    const shares = assignments ? buildPersonShares(people, units, assignments, summary.averageCents) : null;
    return { people, products, bindings, assignments, units, summary, shares };
  }, [people, products, bindings, assignments]);
};
