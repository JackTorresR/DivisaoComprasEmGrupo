import { create } from "zustand";
import { mergeBinding } from "../domain/calculations/bindings";
import { createExampleData } from "../domain/example/exampleData";
import type { Assignments, Product, TripData } from "../domain/types";
import type { ProductDraft } from "../domain/validation/product";
import { createId } from "../utils/createId";

type Actions = {
  clearAll: () => void;
  loadExample: () => void;
  addPerson: (name: string) => void;
  hydrate: (data: TripData) => void;
  removePerson: (id: string) => void;
  removeProduct: (id: string) => void;
  removeBinding: (id: string) => void;
  addProduct: (draft: ProductDraft) => void;
  renamePerson: (id: string, name: string) => void;
  setAssignments: (assignments: Assignments) => void;
  updateProduct: (id: string, draft: ProductDraft) => void;
  reassignUnit: (unitId: string, personId: string) => void;
  addBinding: (productId: string, personId: string, quantity: number) => void;
};

export type AppState = TripData & Actions;

export const EMPTY_TRIP_DATA: TripData = {
  people: [],
  products: [],
  bindings: [],
  assignments: null,
};

const INVALIDATE_DISTRIBUTION = { assignments: null };

const changesDistribution = (
  previous: Product | undefined,
  draft: ProductDraft,
) =>
  previous?.quantity !== draft.quantity ||
  previous?.unitPriceCents !== draft.unitPriceCents;

export const useAppStore = create<AppState>()((set) => ({
  ...EMPTY_TRIP_DATA,

  addPerson: (name) =>
    set((state) => ({
      people: [...state.people, { id: createId(), name: name.trim() }],
      ...INVALIDATE_DISTRIBUTION,
    })),

  renamePerson: (id, name) =>
    set((state) => ({
      people: state.people.map((person) =>
        person.id === id ? { ...person, name: name.trim() } : person,
      ),
    })),

  removePerson: (id) =>
    set((state) => ({
      people: state.people.filter((person) => person.id !== id),
      bindings: state.bindings.filter((binding) => binding.personId !== id),
      ...INVALIDATE_DISTRIBUTION,
    })),

  addProduct: (draft) =>
    set((state) => ({
      products: [...state.products, { id: createId(), ...draft }],
      ...INVALIDATE_DISTRIBUTION,
    })),

  updateProduct: (id, draft) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, ...draft } : product,
      ),
      ...(changesDistribution(
        state.products.find((product) => product.id === id),
        draft,
      )
        ? INVALIDATE_DISTRIBUTION
        : {}),
    })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
      bindings: state.bindings.filter((binding) => binding.productId !== id),
      ...INVALIDATE_DISTRIBUTION,
    })),

  addBinding: (productId, personId, quantity) =>
    set((state) => ({
      bindings: mergeBinding(state.bindings, productId, personId, quantity),
      ...INVALIDATE_DISTRIBUTION,
    })),

  removeBinding: (id) =>
    set((state) => ({
      bindings: state.bindings.filter((binding) => binding.id !== id),
      ...INVALIDATE_DISTRIBUTION,
    })),

  setAssignments: (assignments) => set({ assignments }),

  reassignUnit: (unitId, personId) =>
    set((state) => ({
      assignments: state.assignments && {
        ...state.assignments,
        [unitId]: personId,
      },
    })),

  loadExample: () =>
    set({ ...createExampleData(), ...INVALIDATE_DISTRIBUTION }),

  clearAll: () => set(EMPTY_TRIP_DATA),

  hydrate: (data) => set(data),
}));
