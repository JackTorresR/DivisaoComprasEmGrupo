import { normalizeText } from "../../utils/normalizeText";
import type { Binding, Product } from "../types";

export type BindingFilter = "all" | "linked" | "unlinked";

export type ProductFilter = {
  query: string;
  binding: BindingFilter;
};

export const EMPTY_PRODUCT_FILTER: ProductFilter = {
  query: "",
  binding: "all",
};

export const isProductFilterActive = (filter: ProductFilter) =>
  filter.query.trim() !== "" || filter.binding !== "all";

const matchesQuery = (product: Product, query: string) => {
  const searchable = normalizeText(`${product.name} ${product.unit}`);
  return normalizeText(query)
    .split(/\s+/)
    .every((term) => searchable.includes(term));
};

const matchesBinding = (
  product: Product,
  bindings: Binding[],
  filter: BindingFilter,
) => {
  if (filter === "all") return true;
  const isLinked = bindings.some((binding) => binding.productId === product.id);
  return filter === "linked" ? isLinked : !isLinked;
};

export const filterProducts = (
  products: Product[],
  bindings: Binding[],
  filter: ProductFilter,
): Product[] =>
  products.filter(
    (product) =>
      matchesQuery(product, filter.query) &&
      matchesBinding(product, bindings, filter.binding),
  );
