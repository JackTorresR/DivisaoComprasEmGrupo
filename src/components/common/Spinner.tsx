type SpinnerProps = {
  size?: "sm" | "md";
};

export const Spinner = (props: SpinnerProps) => {
  const { size = "md" } = props;

  return (
    <span
      role="status"
      aria-label="Carregando"
      className={`spinner spinner--${size}`}
    />
  );
};
