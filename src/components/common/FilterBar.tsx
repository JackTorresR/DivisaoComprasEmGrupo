import { Button } from "./Button";
import { SearchField } from "./SearchField";
import { SegmentedControl, type SegmentedOption } from "./SegmentedControl";

type FilterBarProps<Value extends string> = {
  query: string;
  selected: Value;
  isActive: boolean;
  totalCount: number;
  searchLabel: string;
  resultCount: number;
  onReset: () => void;
  optionsLegend: string;
  searchPlaceholder: string;
  options: SegmentedOption<Value>[];
  onQueryChange: (query: string) => void;
  onSelectedChange: (selected: Value) => void;
};

export const FilterBar = <Value extends string>(
  props: FilterBarProps<Value>,
) => {
  const { isActive, resultCount, totalCount, onReset } = props;

  return (
    <div className="filter-bar" role="search">
      <SearchField
        value={props.query}
        label={props.searchLabel}
        onChange={props.onQueryChange}
        placeholder={props.searchPlaceholder}
      />
      <SegmentedControl
        value={props.selected}
        options={props.options}
        legend={props.optionsLegend}
        onChange={props.onSelectedChange}
      />
      <div className="filter-bar__status" aria-live="polite">
        {isActive && (
          <>
            <span className="filter-bar__count">
              Mostrando {resultCount} de {totalCount}
            </span>
            <Button size="sm" variant="ghost" onClick={onReset}>
              Limpar filtros
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
