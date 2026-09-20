import type { Cents } from "./money/money";

export type Person = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  unitPriceCents: Cents;
};

export type Binding = {
  id: string;
  personId: string;
  quantity: number;
  productId: string;
};

export type Unit = {
  id: string;
  name: string;
  position: number;
  productId: string;
  unitLabel: string;
  priceCents: Cents;
  productQuantity: number;
  lockedPersonId: string | null;
};

export type Assignments = Record<string, string>;

export type TripData = {
  people: Person[];
  products: Product[];
  bindings: Binding[];
  assignments: Assignments | null;
};
