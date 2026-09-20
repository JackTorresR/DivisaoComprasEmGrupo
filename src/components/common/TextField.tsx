import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { joinClassNames } from "../../utils/joinClassNames";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  hideLabel?: boolean;
  error?: string | null;
  endAdornment?: ReactNode;
};

export const TextField = (props: TextFieldProps) => {
  const {
    hint,
    label,
    error,
    className,
    endAdornment,
    hideLabel = false,
    ...inputProps
  } = props;

  const inputId = useId();
  const message = error ?? hint;
  const messageId = `${inputId}-message`;

  return (
    <div className={joinClassNames("field", className)}>
      <label
        htmlFor={inputId}
        className={joinClassNames(
          "field__label",
          hideLabel && "visually-hidden",
        )}
      >
        {label}
      </label>
      <div
        className={joinClassNames(
          "field__control",
          Boolean(endAdornment) && "field__control--with-adornment",
        )}
      >
        <input
          id={inputId}
          className={joinClassNames(
            "field__input",
            Boolean(error) && "field__input--invalid",
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={message ? messageId : undefined}
          {...inputProps}
        />
        {endAdornment && <div className="field__adornment">{endAdornment}</div>}
      </div>
      {message && (
        <p
          id={messageId}
          className={
            error ? "field__message field__message--error" : "field__message"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
};
