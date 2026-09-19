import { describe, expect, it } from 'vitest';
import { buildPersonShares, calculateTripSummary } from '../calculations/summary';
import { expandUnits } from '../calculations/units';
import { createExampleData } from '../example/exampleData';
import type { Binding, Person, Product } from '../types';
import { createSeededRandom } from '../../utils/seededRandom';
import { calculateDistribution } from './calculateDistribution';

const makePeople = (count: number): Person[] =>
  Array.from({ length: count }, (_, index) => ({ id: `p${index}`, name: `Pessoa ${index}` }));

const makeProduct = (id: string, quantity: number, unitPriceCents: number): Product => ({
  id,
  name: id,
  quantity,
  unitPriceCents,
  unit: '',
});

const totalsOf = (people: Person[], products: Product[], bindings: Binding[]) => {
  const assignments = calculateDistribution(people, products, bindings);
  const units = expandUnits(products, bindings);
  const summary = calculateTripSummary(people.length, units);
  return { assignments, units, summary, shares: buildPersonShares(people, units, assignments, summary.averageCents) };
};

const enumerateBestCost = (baseTotals: number[], prices: number[]) => {
  let best = Infinity;
  const totals = [...baseTotals];
  const visit = (index: number) => {
    if (index === prices.length) {
      best = Math.min(best, totals.reduce((sum, total) => sum + total * total, 0));
      return;
    }
    totals.forEach((_, person) => {
      totals[person] += prices[index];
      visit(index + 1);
      totals[person] -= prices[index];
    });
  };
  visit(0);
  return best;
};

describe('calculateDistribution', () => {
  it('atribui cada unidade a exatamente uma pessoa', () => {
    const { people, products, bindings } = createExampleData();
    const { assignments, units } = totalsOf(people, products, bindings);
    expect(Object.keys(assignments).sort()).toEqual(units.map((unit) => unit.id).sort());
    Object.values(assignments).forEach((personId) => {
      expect(people.some((person) => person.id === personId)).toBe(true);
    });
  });

  it('preserva vínculos e soma o valor deles ao total da pessoa', () => {
    const { people, products, bindings } = createExampleData();
    const { assignments, units } = totalsOf(people, products, bindings);
    units
      .filter((unit) => unit.lockedPersonId !== null)
      .forEach((unit) => expect(assignments[unit.id]).toBe(unit.lockedPersonId));
  });

  it('é determinística', () => {
    const { people, products, bindings } = createExampleData();
    expect(calculateDistribution(people, products, bindings)).toEqual(
      calculateDistribution(people, products, bindings),
    );
  });

  it('separa unidades iguais entre pessoas diferentes', () => {
    const people = makePeople(2);
    const products = [makeProduct('agua', 2, 300)];
    const { shares } = totalsOf(people, products, []);
    expect(shares.map((share) => share.totalCents)).toEqual([300, 300]);
  });

  it('não compensa quem já passou da média por vontade própria', () => {
    const people = makePeople(4);
    const products = [makeProduct('tv', 1, 13000), makeProduct('item', 12, 1000), makeProduct('extra', 3, 2000)];
    const bindings: Binding[] = [{ id: 'b1', productId: 'tv', personId: 'p0', quantity: 1 }];
    const { shares, summary } = totalsOf(people, products, bindings);
    expect(shares[0].totalCents).toBe(13000);
    expect(summary.totalCents).toBe(13000 + 12000 + 6000);
    const others = shares.slice(1).map((share) => share.totalCents);
    expect(Math.max(...others) - Math.min(...others)).toBeLessThanOrEqual(1000);
  });

  it('completa quem ficou abaixo da média após os vínculos', () => {
    const people = makePeople(5);
    const products = [makeProduct('papel', 2, 3000), makeProduct('item', 22, 2000)];
    const bindings: Binding[] = [{ id: 'b1', productId: 'papel', personId: 'p0', quantity: 2 }];
    const { shares } = totalsOf(people, products, bindings);
    expect(shares.map((share) => share.totalCents)).toEqual([10000, 10000, 10000, 10000, 10000]);
  });

  it('funciona com uma única pessoa e com tudo vinculado', () => {
    const products = [makeProduct('a', 2, 500)];
    const single = totalsOf(makePeople(1), products, []);
    expect(single.shares[0].totalCents).toBe(1000);
    const locked = totalsOf(makePeople(2), products, [{ id: 'b', productId: 'a', personId: 'p1', quantity: 2 }]);
    expect(locked.shares.map((share) => share.totalCents)).toEqual([0, 1000]);
  });

  it('encontra o ótimo global em instâncias pequenas', () => {
    const random = createSeededRandom(7);
    const pick = (min: number, max: number) => min + Math.floor(random() * (max - min + 1));

    for (let attempt = 0; attempt < 40; attempt++) {
      const people = makePeople(pick(2, 4));
      const prices = Array.from({ length: pick(3, 9) }, () => pick(50, 4000));
      const bases = people.map(() => (random() < 0.4 ? pick(0, 6000) : 0));
      const products = prices.map((price, index) => makeProduct(`i${index}`, 1, price));
      const lockedProducts = bases.flatMap((base, index) => (base > 0 ? [makeProduct(`base${index}`, 1, base)] : []));
      const bindings: Binding[] = bases.flatMap((base, index) =>
        base > 0 ? [{ id: `b${index}`, productId: `base${index}`, personId: `p${index}`, quantity: 1 }] : [],
      );
      const { shares } = totalsOf(people, [...products, ...lockedProducts], bindings);
      const achieved = shares.reduce((sum, share) => sum + share.totalCents ** 2, 0);
      expect(achieved).toBe(enumerateBestCost(bases, prices));
    }
  });
});
