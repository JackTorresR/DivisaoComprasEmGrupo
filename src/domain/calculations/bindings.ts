import { createId } from '../../utils/createId';
import type { Binding, Product } from '../types';

export const countBoundUnits = (productId: string, bindings: Binding[]) =>
  bindings
    .filter((binding) => binding.productId === productId)
    .reduce((total, binding) => total + binding.quantity, 0);

export const countAvailableUnits = (product: Product, bindings: Binding[]) =>
  product.quantity - countBoundUnits(product.id, bindings);

export const mergeBinding = (
  bindings: Binding[],
  productId: string,
  personId: string,
  quantity: number,
): Binding[] => {
  const existing = bindings.find(
    (binding) => binding.productId === productId && binding.personId === personId,
  );
  if (!existing) return [...bindings, { id: createId(), productId, personId, quantity }];
  return bindings.map((binding) =>
    binding.id === existing.id ? { ...binding, quantity: binding.quantity + quantity } : binding,
  );
};
