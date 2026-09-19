import { useId, type InputHTMLAttributes } from 'react';
import { joinClassNames } from '../../utils/joinClassNames';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hideLabel?: boolean;
  error?: string | null;
  hint?: string;
};

export const TextField = ({ label, hideLabel = false, error, hint, className, ...inputProps }: TextFieldProps) => {
  const inputId = useId();
  const messageId = `${inputId}-message`;
  const message = error ?? hint;
  return (
    <div className={joinClassNames('field', className)}>
      <label htmlFor={inputId} className={joinClassNames('field__label', hideLabel && 'visually-hidden')}>
        {label}
      </label>
      <input
        id={inputId}
        className={joinClassNames('field__input', Boolean(error) && 'field__input--invalid')}
        aria-invalid={Boolean(error)}
        aria-describedby={message ? messageId : undefined}
        {...inputProps}
      />
      {message && (
        <p id={messageId} className={error ? 'field__message field__message--error' : 'field__message'}>
          {message}
        </p>
      )}
    </div>
  );
};
