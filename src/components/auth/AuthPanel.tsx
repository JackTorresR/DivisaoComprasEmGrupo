import { useState, type FormEvent } from "react";
import { Button } from "../common/Button";
import { TextField } from "../common/TextField";

type AuthMode = "signIn" | "signUp";

type EmailCredentialsProps = {
  email: string;
  password: string;
};

type AuthPanelProps = {
  pending: boolean;
  authError: string | null;
  onSignIn: (props: EmailCredentialsProps) => Promise<boolean>;
  onSignUp: (props: EmailCredentialsProps) => Promise<boolean>;
};

const MODE_TEXTS: Record<
  AuthMode,
  { title: string; submitLabel: string; toggleLabel: string }
> = {
  signIn: {
    submitLabel: "Entrar",
    title: "Entrar na sua conta",
    toggleLabel: "Ainda não tem conta? Criar conta",
  },
  signUp: {
    title: "Criar sua conta",
    submitLabel: "Criar conta",
    toggleLabel: "Já tem conta? Entrar",
  },
};

export const AuthPanel = (props: AuthPanelProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("signIn");
  const { pending, authError, onSignIn, onSignUp } = props;

  const texts = MODE_TEXTS[mode];

  const toggleMode = () => setMode(mode === "signIn" ? "signUp" : "signIn");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const action = mode === "signIn" ? onSignIn : onSignUp;
    const succeeded = await action({ email, password });
    if (succeeded) setPassword("");
  };

  return (
    <section className="card auth-panel" aria-labelledby="auth-panel-title">
      <h2 id="auth-panel-title" className="card__title">
        {texts.title}
      </h2>
      <p className="card__description">
        Crie uma conta para poder montar listas de compras e compartilhar o link
        com o grupo.
      </p>
      <form className="auth-panel__form" onSubmit={handleSubmit}>
        <TextField
          required
          type="email"
          value={email}
          label="E-mail"
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          required
          label="Senha"
          minLength={6}
          type="password"
          value={password}
          hint="Mínimo de 6 caracteres."
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={mode === "signIn" ? "current-password" : "new-password"}
        />
        {authError && (
          <p className="field__message field__message--error" role="alert">
            {authError}
          </p>
        )}
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Aguarde…" : texts.submitLabel}
        </Button>
      </form>
      <Button
        variant="ghost"
        onClick={toggleMode}
        className="auth-panel__toggle"
      >
        {texts.toggleLabel}
      </Button>
    </section>
  );
};
