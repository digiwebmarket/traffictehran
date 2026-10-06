import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface StatusBadgeProps {
  status?: string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const text = label || status || '';

  const getVariant = (s: string) => {
    const lower = s.toLowerCase();
    if (lower.includes('فعال') || lower.includes('admin') || lower.includes('مدیر') || lower === 'active') {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
    if (lower.includes('سوپروایزر') || lower.includes('supervisor')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
    if (lower.includes('اپراتور') || lower.includes('operator')) {
      return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    }
    if (lower.includes('غیرفعال') || lower.includes('مختل') || lower.includes('danger')) {
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
    return 'bg-slate-700/50 text-slate-300 border-slate-600/50';
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm',
          getVariant(text),
          className
        )
      )}
    >
      {text}
    </span>
  );
}
