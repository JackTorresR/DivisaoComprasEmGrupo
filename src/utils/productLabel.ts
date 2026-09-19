import type { Unit } from '../domain/types';

export const formatProductLabel = (name: string, unitLabel: string) =>
  unitLabel.trim() === '' ? name : `${name} (${unitLabel.trim()})`;

export const formatUnitLabel = (unit: Unit) => {
  const label = formatProductLabel(unit.name, unit.unitLabel);
  return unit.productQuantity > 1 ? `${label} — ${unit.position}/${unit.productQuantity}` : label;
};

export const formatQuantityPrefix = (quantity: number) => (quantity > 1 ? `${quantity}× ` : '');
