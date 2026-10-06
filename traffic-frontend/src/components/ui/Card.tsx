import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'bordered' | 'glass';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: "bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 backdrop-blur-md",
    flat: "bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6",
    bordered: "bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6",
    glass: "bg-slate-900/60 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl p-6",
  };

  return (
    <div className={twMerge(clsx(variants[variant], className))} {...props}>
      {children}
    </div>
  );
}

export function Badge({ className, variant = 'info', children }: { className?: string; variant?: 'success' | 'warning' | 'danger' | 'info'; children: React.ReactNode }) {
  const variants = {
    success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    info: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
  };

  return (
    <span className={twMerge(clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border', variants[variant], className))}>
      {children}
    </span>
  );
}
