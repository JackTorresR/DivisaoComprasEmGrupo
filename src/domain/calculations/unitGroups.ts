import { sumCents, type Cents } from '../money/money';
import type { Unit } from '../types';

export type UnitGroup = {
  key: string;
  productId: string;
  name: string;
  unitLabel: string;
  quantity: number;
  totalCents: Cents;
  locked: boolean;
};

export const groupUnitsByProduct = (units: Unit[]): UnitGroup[] => {
  const groups = new Map<string, Unit[]>();
  units.forEach((unit) => {
    const key = `${unit.productId}:${unit.lockedPersonId !== null}`;
    groups.set(key, [...(groups.get(key) ?? []), unit]);
  });
  return [...groups.entries()].map(([key, groupedUnits]) => ({
    key,
    productId: groupedUnits[0].productId,
    name: groupedUnits[0].name,
    unitLabel: groupedUnits[0].unitLabel,
    quantity: groupedUnits.length,
    totalCents: sumCents(groupedUnits.map((unit) => unit.priceCents)),
    locked: groupedUnits[0].lockedPersonId !== null,
  }));
};
