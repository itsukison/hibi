import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' };

export function Button({ variant = 'primary', className, ...rest }: Props) {
  return <button className={`btn btn-${variant} t-label ${className ?? ''}`} {...rest} />;
}
