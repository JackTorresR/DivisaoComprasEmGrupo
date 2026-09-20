import type { ButtonHTMLAttributes } from "react";
import { joinClassNames } from "../../utils/joinClassNames";
import { Spinner } from "./Spinner";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  size?: "md" | "sm";
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export const Button = (props: ButtonProps) => {
  const {
    children,
    disabled,
    className,
    size = "md",
    type = "button",
    loading = false,
    variant = "secondary",
    ...rest
  } = props;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={joinClassNames(
        "button",
        `button--${variant}`,
        `button--${size}`,
        className,
      )}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
};
