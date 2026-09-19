import { formatProductLabel } from '../../utils/productLabel';
import { sumCents, type Cents } from '../money/money';
import type { Binding, Person, Product } from '../types';

export type LockedLine = {
  id: string;
  label: string;
  quantity: number;
  totalCents: Cents;
};

export type LockedSummary = {
  person: Person;
  lines: LockedLine[];
  totalCents: Cents;
};

const buildLockedLines = (personBindings: Binding[], products: Product[]): LockedLine[] =>
  personBindings.flatMap((binding) => {
    const product = products.find((candidate) => candidate.id === binding.productId);
    if (!product) return [];
    return [
      {
        id: binding.id,
        label: formatProductLabel(product.name, product.unit),
        quantity: binding.quantity,
        totalCents: product.unitPriceCents * binding.quantity,
      },
    ];
  });

export const buildLockedSummaries = (
  people: Person[],
  products: Product[],
  bindings: Binding[],
): LockedSummary[] =>
  people
    .map((person) => {
      const lines = buildLockedLines(
        bindings.filter((binding) => binding.personId === person.id),
        products,
      );
      return { person, lines, totalCents: sumCents(lines.map((line) => line.totalCents)) };
    })
    .filter((summary) => summary.lines.length > 0);
