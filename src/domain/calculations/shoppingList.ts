import { formatProductLabel } from '../../utils/productLabel';
import type { Product } from '../types';

export type ShoppingItem = {
  id: string;
  label: string;
  quantity: number;
};

export const buildShoppingList = (products: Product[]): ShoppingItem[] =>
  products.map((product) => ({
    id: product.id,
    label: formatProductLabel(product.name, product.unit),
    quantity: product.quantity,
  }));
