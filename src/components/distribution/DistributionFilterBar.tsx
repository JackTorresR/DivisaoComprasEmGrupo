import {
  isShareFilterActive,
  type PositionFilter,
  type ShareFilter,
} from "../../domain/calculations/shareFilter";
import { FilterBar } from "../common/FilterBar";
import type { SegmentedOption } from "../common/SegmentedControl";

type DistributionFilterBarProps = {
  totalCount: number;
  filter: ShareFilter;
  onReset: () => void;
  resultCount: number;
  onChange: (filter: ShareFilter) => void;
};

const POSITION_OPTIONS: SegmentedOption<PositionFilter>[] = [
  { value: "all", label: "Todos" },
  { value: "above", label: "Acima da média" },
  { value: "below", label: "Abaixo da média" },
];

export const DistributionFilterBar = (props: DistributionFilterBarProps) => {
  const { filter, onChange, onReset, totalCount, resultCount } = props;

  return (
    <FilterBar
      onReset={onReset}
      query={filter.query}
      totalCount={totalCount}
      resultCount={resultCount}
      selected={filter.position}
      options={POSITION_OPTIONS}
      searchLabel="Buscar pessoa"
      isActive={isShareFilterActive(filter)}
      searchPlaceholder="Buscar pessoa pelo nome"
      optionsLegend="Filtrar pela posição em relação à média"
      onQueryChange={(query) => onChange({ ...filter, query })}
      onSelectedChange={(position) => onChange({ ...filter, position })}
    />
  );
};
