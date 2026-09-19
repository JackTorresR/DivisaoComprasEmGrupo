import type { Binding, Product, Unit } from '../types';

const createUnitId = (productId: string, index: number) => `${productId}#${index}`;

const listLockedOwners = (product: Product, bindings: Binding[]) =>
  bindings
    .filter((binding) => binding.productId === product.id)
    .flatMap((binding) => Array<string>(binding.quantity).fill(binding.personId));

export const expandUnits = (products: Product[], bindings: Binding[]): Unit[] =>
  products.flatMap((product) => {
    const lockedOwners = listLockedOwners(product, bindings);
    return Array.from({ length: product.quantity }, (_, index) => ({
      id: createUnitId(product.id, index),
      productId: product.id,
      name: product.name,
      unitLabel: product.unit,
      priceCents: product.unitPriceCents,
      position: index + 1,
      productQuantity: product.quantity,
      lockedPersonId: lockedOwners[index] ?? null,
    }));
  });
