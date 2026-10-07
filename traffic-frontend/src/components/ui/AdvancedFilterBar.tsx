'use client';

import React, { useState } from 'react';
import { RotateCcw, Filter, Search } from 'lucide-react';
import { toEnglishDigits } from '@/lib/utils';

export interface FilterField {
  id: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'select';
  options?: Array<{ label: string; value: string }>;
}

export interface AdvancedFilterBarProps {
  fields: FilterField[];
  onFilterChange: (filters: Record<string, string>) => void;
  onReset?: () => void;
  title?: string;
}

export function AdvancedFilterBar({
  fields,
  onFilterChange,
  onReset,
  title = 'فیلترهای پیشرفته',
}: AdvancedFilterBarProps) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleChange = (id: string, val: string) => {
    const updated = { ...filterValues, [id]: val };
    setFilterValues(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    setFilterValues({});
    onFilterChange({});
    if (onReset) onReset();
  };

  return (
    <div className="w-full bg-slate-950/80 border-b border-indigo-500/20 p-3.5 flex flex-wrap items-center gap-3 text-xs">
      <div className="flex items-center gap-1.5 pl-2">
        <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold text-[11px] flex items-center gap-1.5 shadow-sm">
          <Search className="w-3.5 h-3.5 text-indigo-400" />
          <span>{title}</span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        {fields.map((f) => (
          <div key={f.id} className="flex items-center gap-1.5 min-w-[170px]">
            <span className="text-slate-400 text-[11px] whitespace-nowrap">{f.label}:</span>
            {f.type === 'select' ? (
              <select
                value={filterValues[f.id] || ''}
                onChange={(e) => handleChange(f.id, e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">همه</option>
                {f.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={filterValues[f.id] || ''}
                  onChange={(e) => handleChange(f.id, e.target.value)}
                  placeholder={f.placeholder || 'جستجو در نتایج...'}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pr-8 pl-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleReset}
          title="بازنشانی تمام فیلترهای جستجو"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <RotateCcw className="w-3 h-3 text-indigo-400" />
          <span>بازنشانی فیلترها</span>
        </button>
      </div>
    </div>
  );
}
