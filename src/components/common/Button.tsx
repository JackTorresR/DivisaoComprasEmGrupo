import type { ButtonHTMLAttributes } from 'react';
import { joinClassNames } from '../../utils/joinClassNames';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'md' | 'sm';
};

export const Button = ({ variant = 'secondary', size = 'md', className, type = 'button', ...rest }: ButtonProps) => (
  <button type={type} className={joinClassNames('button', `button--${variant}`, `button--${size}`, className)} {...rest} />
);
