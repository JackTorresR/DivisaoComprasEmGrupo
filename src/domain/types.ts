import type { Cents } from './money/money';

export type Person = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  quantity: number;
  unitPriceCents: Cents;
  unit: string;
};

export type Binding = {
  id: string;
  productId: string;
  personId: string;
  quantity: number;
};

export type Unit = {
  id: string;
  productId: string;
  name: string;
  unitLabel: string;
  priceCents: Cents;
  position: number;
  productQuantity: number;
  lockedPersonId: string | null;
};

export type Assignments = Record<string, string>;
