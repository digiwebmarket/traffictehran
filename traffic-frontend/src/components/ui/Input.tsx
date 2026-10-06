import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({
  className,
  label,
  error,
  icon,
  id,
  ...props
}: InputProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}
      <div className="relative rounded-xl">
        {icon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={twMerge(
            clsx(
              'w-full rounded-xl bg-slate-900/80 border border-slate-700/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all duration-200',
              icon && 'pr-10',
              error && 'border-rose-500 focus:ring-rose-500 focus:border-rose-500',
              className
            )
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </div>
  );
}
