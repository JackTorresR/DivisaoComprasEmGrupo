import { createJSONStorage } from 'zustand/middleware';

export const STORAGE_KEY = 'divisor-de-compras:v1';

export const createAppStorage = <State>() => createJSONStorage<State>(() => localStorage);
