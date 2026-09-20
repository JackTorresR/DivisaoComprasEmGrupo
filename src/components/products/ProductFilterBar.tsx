import {
  isProductFilterActive,
  type BindingFilter,
  type ProductFilter,
} from "../../domain/calculations/productFilter";
import { FilterBar } from "../common/FilterBar";
import type { SegmentedOption } from "../common/SegmentedControl";

type ProductFilterBarProps = {
  totalCount: number;
  onReset: () => void;
  resultCount: number;
  filter: ProductFilter;
  onChange: (filter: ProductFilter) => void;
};

const BINDING_OPTIONS: SegmentedOption<BindingFilter>[] = [
  { value: "all", label: "Todos" },
  { value: "linked", label: "Com vínculo" },
  { value: "unlinked", label: "Sem vínculo" },
];

export const ProductFilterBar = (props: ProductFilterBarProps) => {
  const { filter, onChange, onReset, totalCount, resultCount } = props;

  return (
    <FilterBar
      onReset={onReset}
      query={filter.query}
      totalCount={totalCount}
      resultCount={resultCount}
      options={BINDING_OPTIONS}
      selected={filter.binding}
      searchLabel="Buscar produto"
      optionsLegend="Filtrar por vínculo"
      isActive={isProductFilterActive(filter)}
      searchPlaceholder="Buscar por nome ou embalagem"
      onQueryChange={(query) => onChange({ ...filter, query })}
      onSelectedChange={(binding) => onChange({ ...filter, binding })}
    />
  );
};
