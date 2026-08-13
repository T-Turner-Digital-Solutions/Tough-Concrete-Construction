import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/lib/cn';

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap';

const variants = {
  primary: 'bg-safety-500 text-concrete-950 hover:bg-safety-400 shadow-sm',
  dark: 'bg-concrete-900 text-white hover:bg-concrete-800 shadow-sm',
  outline: 'border border-concrete-300 text-concrete-800 hover:bg-concrete-100',
  'outline-light': 'border border-white/40 text-white hover:bg-white/10',
  ghost: 'text-concrete-700 hover:bg-concrete-100',
  steel: 'bg-steel-600 text-white hover:bg-steel-700 shadow-sm',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  subtle: 'bg-concrete-100 text-concrete-800 hover:bg-concrete-200',
};

const sizes = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-6 py-3.5',
};

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

interface ButtonOwnProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

type ButtonProps = ButtonOwnProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

type ButtonLinkProps = ButtonOwnProps & LinkProps;

export function ButtonLink({ variant = 'primary', size = 'md', fullWidth, className, ...props }: ButtonLinkProps) {
  return <Link className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)} {...props} />;
}
