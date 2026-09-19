import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mergeBinding } from '../domain/calculations/bindings';
import { createExampleData } from '../domain/example/exampleData';
import type { Assignments, Binding, Person, Product } from '../domain/types';
import type { ProductDraft } from '../domain/validation/product';
import { createAppStorage, STORAGE_KEY } from '../services/storage/appStorage';
import { createId } from '../utils/createId';

type PersistedState = {
  people: Person[];
  products: Product[];
  bindings: Binding[];
  assignments: Assignments | null;
};

type Actions = {
  addPerson: (name: string) => void;
  renamePerson: (id: string, name: string) => void;
  removePerson: (id: string) => void;
  addProduct: (draft: ProductDraft) => void;
  updateProduct: (id: string, draft: ProductDraft) => void;
  removeProduct: (id: string) => void;
  addBinding: (productId: string, personId: string, quantity: number) => void;
  removeBinding: (id: string) => void;
  setAssignments: (assignments: Assignments) => void;
  reassignUnit: (unitId: string, personId: string) => void;
  loadExample: () => void;
  clearAll: () => void;
};

export type AppState = PersistedState & Actions;

const EMPTY_STATE: PersistedState = { people: [], products: [], bindings: [], assignments: null };

const INVALIDATE_DISTRIBUTION = { assignments: null };

const changesDistribution = (previous: Product | undefined, draft: ProductDraft) =>
  previous?.quantity !== draft.quantity || previous?.unitPriceCents !== draft.unitPriceCents;

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...EMPTY_STATE,

      addPerson: (name) =>
        set((state) => ({
          people: [...state.people, { id: createId(), name: name.trim() }],
          ...INVALIDATE_DISTRIBUTION,
        })),

      renamePerson: (id, name) =>
        set((state) => ({
          people: state.people.map((person) => (person.id === id ? { ...person, name: name.trim() } : person)),
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
          products: state.products.map((product) => (product.id === id ? { ...product, ...draft } : product)),
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
        set((state) => ({ assignments: state.assignments && { ...state.assignments, [unitId]: personId } })),

      loadExample: () => set({ ...createExampleData(), ...INVALIDATE_DISTRIBUTION }),

      clearAll: () => set(EMPTY_STATE),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createAppStorage<PersistedState>(),
      partialize: ({ people, products, bindings, assignments }) => ({ people, products, bindings, assignments }),
    },
  ),
);
