import type { KeyboardEvent } from "react";

type SearchFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

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

export const SearchField = (props: SearchFieldProps) => {
  const { label, value, onChange, placeholder } = props;

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") onChange("");
  };

  return (
    <div className="search-field">
      <SearchIcon />
      <input
        type="text"
        value={value}
        autoComplete="off"
        aria-label={label}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        className="search-field__input"
        onChange={(event) => onChange(event.target.value)}
      />
      {value !== "" && (
        <button
          type="button"
          aria-label="Limpar busca"
          onClick={() => onChange("")}
          className="search-field__clear"
        >
          ×
        </button>
      )}
    </div>
  );
};
