import { useState, type InputHTMLAttributes } from "react";
import { TextField } from "./TextField";

type PasswordFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: string;
  hint?: string;
  error?: string | null;
};

const IconeSenhaVisivel = () => (
  <svg
    width="18"
    fill="none"
    height="18"
    strokeWidth="1.8"
    aria-hidden="true"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconeSenhaOculta = () => (
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
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="M6.5 6.7C3.6 8.5 1.5 12 1.5 12s3.5 7 10.5 7a10.7 10.7 0 0 0 4.1-.8M10.6 5.2A11 11 0 0 1 12 5c7 0 10.5 7 10.5 7a17.6 17.6 0 0 1-3.3 4.2" />
    <path d="M3 3l18 18" />
  </svg>
);

export const PasswordField = (props: PasswordFieldProps) => {
  const { label, hint, error, ...inputProps } = props;
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const alternarVisibilidadeSenha = () =>
    setSenhaVisivel((visivel) => !visivel);

  return (
    <TextField
      {...inputProps}
      hint={hint}
      label={label}
      error={error}
      type={senhaVisivel ? "text" : "password"}
      endAdornment={
        <button
          type="button"
          aria-pressed={senhaVisivel}
          className="password-field__toggle"
          onClick={alternarVisibilidadeSenha}
          aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
        >
          {senhaVisivel ? <IconeSenhaOculta /> : <IconeSenhaVisivel />}
        </button>
      }
    />
  );
};
