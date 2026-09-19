import { createId } from "../../utils/createId";

import type { Binding, Person, Product } from "../types";

type ExampleProduct = [
  name: string,
  unit: string,
  quantity: number,
  priceCents: number,
];

const EXAMPLE_PEOPLE = [
  "Jack",
  "Sara",
  "Bruno",
  "Jenny",
  "Thaty",
  "Emisu",
  "Evisu",
  "Tâmara",
  "Vitória",
  "Vinicius",
  "Gleycinha",
];

const EXAMPLE_PRODUCTS: ExampleProduct[] = [
  ["Óleo", "UN", 1, 900],
  ["Cuscuz", "PCT", 1, 200],
  ["Açúcar", "PCT", 1, 400],
  ["Fósforo", "CX", 1, 300],
  ["Requeijão", "UN", 1, 1000],
  ["Detergente", "UN", 2, 250],
  ["Sal grosso", "UN", 1, 300],
  ["Manteiga", "POTE", 1, 1300],
  ["Guardanapo", "PCT", 2, 300],
  ["Leite líquido", "L", 1, 600],
  ["Desinfetante", "UN", 2, 800],
  ["Arroz branco", "PCT", 1, 500],
  ["Presunto 300g", "G", 1, 1750],
  ["Ovos 30 un.", "BDJ", 1, 2000],
  ["Creme de leite", "UN", 1, 400],
  ["Achocolatado", "PCT", 1, 1200],
  ["Mussarela 500g", "G", 1, 2500],
  ["Sprite Zero 2L", "UN", 1, 1100],
  ["Sal de cozinha", "PCT", 1, 300],
  ["Goma de tapioca", "PCT", 1, 600],
  ["Leite condensado", "UN", 1, 700],
  ["Água sanitária 1L", "UN", 2, 300],
  ["Margarina 500g", "POTE", 1, 1000],
  ["Café Santa Clara", "PCT", 1, 1700],
  ["Coca-Cola Zero 2L", "UN", 2, 1200],
  ["Queijo coalho 500g", "G", 1, 1900],
  ["Pão de forma genérico", "PCT", 2, 800],
  ["Papel higiênico (8 un.)", "PCT", 2, 1500],
];

export type ExampleData = {
  people: Person[];
  products: Product[];
  bindings: Binding[];
};

export const createExampleData = (): ExampleData => {
  const people = EXAMPLE_PEOPLE.map((name) => ({
    id: createId(),
    name,
  }));

  const products = EXAMPLE_PRODUCTS.map(
    ([name, unit, quantity, priceCents]) => ({
      name,
      unit,
      quantity,
      id: createId(),
      unitPriceCents: priceCents,
    }),
  );

  const bindings: Binding[] = [];

  return { people, products, bindings };
};
