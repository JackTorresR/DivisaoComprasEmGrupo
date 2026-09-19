import type { Assignments, Binding, Person, Product } from '../types';

export type WorkerRequest = {
  people: Person[];
  products: Product[];
  bindings: Binding[];
};

export type WorkerResponse =
  | { type: 'progress'; progress: number }
  | { type: 'done'; assignments: Assignments };
