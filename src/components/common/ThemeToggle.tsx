import { useTheme } from "../../hooks/useTheme";

const IconeSol = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    strokeWidth="1.8"
    aria-hidden="true"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
  </svg>
);

const IconeLua = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    strokeWidth="1.8"
    aria-hidden="true"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.5 14.7A8.4 8.4 0 1 1 9.3 3.5a6.6 6.6 0 0 0 11.2 11.2Z" />
  </svg>
);

export const ThemeToggle = () => {
  const { tema, alternarTema } = useTheme();
  const temaClaroAtivo = tema === "light";

  return (
    <button
      type="button"
      onClick={alternarTema}
      className="theme-toggle"
      aria-pressed={temaClaroAtivo}
      title={temaClaroAtivo ? "Modo escuro" : "Modo claro"}
      aria-label={temaClaroAtivo ? "Ativar modo escuro" : "Ativar modo claro"}
    >
      {temaClaroAtivo ? <IconeSol /> : <IconeLua />}
    </button>
  );
};
