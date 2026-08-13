import { forwardRef } from 'react';
import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const inputClass =
  'w-full rounded-md border border-concrete-300 bg-white px-3 py-2.5 text-sm text-concrete-900 placeholder:text-concrete-400 focus:border-steel-500 focus:outline-none focus:ring-2 focus:ring-steel-500/20 disabled:bg-concrete-100 disabled:text-concrete-400';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(inputClass, className)} {...props} />
));
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(inputClass, 'min-h-[6rem] resize-y', className)} {...props} />
));
Textarea.displayName = 'Textarea';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn(inputClass, 'pr-8', className)} {...props}>
    {children}
  </select>
));
Select.displayName = 'Select';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
}

export function FormField({ label, htmlFor, required, hint, error, children, labelProps }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-concrete-800" {...labelProps}>
        {label} {required && <span className="text-safety-600">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-concrete-500">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
