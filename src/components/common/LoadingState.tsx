import { Spinner } from "./Spinner";

type LoadingStateProps = {
  label?: string;
};

export const LoadingState = (props: LoadingStateProps) => {
  const { label = "Carregando…" } = props;

  return (
    <div className="loading-state" role="status" aria-live="polite">
      <Spinner />
      <span>{label}</span>
    </div>
  );
};
