import { useId, type KeyboardEvent } from "react";
import {
  isProductFilterActive,
  type BindingFilter,
  type ProductFilter,
} from "../../domain/calculations/productFilter";
import { Button } from "../common/Button";

type ProductFilterBarProps = {
  totalCount: number;
  resultCount: number;
  onReset: () => void;
  filter: ProductFilter;
  onChange: (filter: ProductFilter) => void;
};

const BINDING_OPTIONS: { value: BindingFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "linked", label: "Com vínculo" },
  { value: "unlinked", label: "Sem vínculo" },
];

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    aria-hidden="true"
    viewBox="0 0 20 20"
    className="search-field__icon"
  >
    <circle
      r="5.5"
      cx="8.5"
      cy="8.5"
      fill="none"
      strokeWidth="1.8"
      stroke="currentColor"
    />
    <path
      fill="none"
      d="M13 13l4 4"
      strokeWidth="1.8"
      stroke="currentColor"
      strokeLinecap="round"
    />
  </svg>
);

export const ProductFilterBar = (props: ProductFilterBarProps) => {
  const { filter, onReset, onChange, totalCount, resultCount } = props;

  const groupName = useId();
  const isActive = isProductFilterActive(filter);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") onChange({ ...filter, query: "" });
  };

  return (
    <div className="filter-bar" role="search">
      <div className="search-field">
        <SearchIcon />
        <input
          type="text"
          autoComplete="off"
          onKeyDown={handleKeyDown}
          aria-label="Buscar produto"
          className="search-field__input"
          placeholder="Buscar por nome ou embalagem"
          value={filter.query}
          onChange={(event) =>
            onChange({ ...filter, query: event.target.value })
          }
        />
        {filter.query !== "" && (
          <button
            type="button"
            aria-label="Limpar busca"
            className="search-field__clear"
            onClick={() => onChange({ ...filter, query: "" })}
          >
            ×
          </button>
        )}
      </div>
      <fieldset className="segmented">
        <legend className="visually-hidden">Filtrar por vínculo</legend>
        {BINDING_OPTIONS.map((option) => (
          <label key={option.value} className="segmented__option">
            <input
              type="radio"
              name={groupName}
              value={option.value}
              className="visually-hidden"
              checked={filter.binding === option.value}
              onChange={() => onChange({ ...filter, binding: option.value })}
            />
            <span className="segmented__label">{option.label}</span>
          </label>
        ))}
      </fieldset>
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
