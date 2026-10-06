'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';
import { toPersianDigits, toEnglishDigits } from '@/lib/utils';

export interface SearchableOption {
  label: string;
  value: string | number;
  badge?: string;
  disabled?: boolean;
}

export interface SearchableSelectProps {
  options: SearchableOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'انتخاب کنید...',
  searchPlaceholder = 'جستجو با کد یا نام...',
  label,
  disabled = false,
  className = '',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(() => {
    return options.find((opt) => String(opt.value) === String(value));
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const norm = toEnglishDigits(searchTerm.trim().toLowerCase());
    return options.filter((opt) => {
      const optLabel = toEnglishDigits(opt.label.toLowerCase());
      const optVal = toEnglishDigits(String(opt.value).toLowerCase());
      return optLabel.includes(norm) || optVal.includes(norm);
    });
  }, [options, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (opt: SearchableOption) => {
    if (opt.disabled) return;
    onChange(opt.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  return (
    <div className={`relative w-full space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}

      {/* Combobox Trigger */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-slate-900/80 border rounded-xl px-3.5 py-2.5 text-sm cursor-pointer transition-all duration-200 select-none ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-slate-800'
            : isOpen
            ? 'border-brand-500 ring-2 ring-brand-500/20'
            : 'border-slate-700/80 hover:border-slate-600'
        }`}
      >
        <span className={`truncate ${selectedOption ? 'text-slate-100 font-medium' : 'text-slate-500'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="flex items-center gap-1.5 mr-2">
          {selectedOption && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-brand-400' : ''
            }`}
          />
        </div>
      </div>

      {/* Floating Dropdown List */}
      {isOpen && !disabled && (
        <div className="absolute z-50 right-0 left-0 mt-1.5 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-fadeIn">
          {/* Search Box */}
          <div className="p-2 border-b border-slate-800 relative">
            <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-700">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-500">
                موردی یافت نشد.
              </div>
            ) : (
              filteredOptions.slice(0, 100).map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <div
                    key={String(opt.value)}
                    onClick={() => handleSelect(opt)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      opt.disabled
                        ? 'opacity-40 cursor-not-allowed bg-slate-800/30'
                        : isSelected
                        ? 'bg-brand-500/15 text-brand-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />}
                      <span className="truncate">{opt.label}</span>
                    </div>
                    {opt.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50 flex-shrink-0">
                        {opt.badge}
                      </span>
                    )}
                  </div>
                );
              })
            )}
            {filteredOptions.length > 100 && (
              <div className="p-2 text-center text-[11px] text-slate-500 border-t border-slate-800/60">
                ... و {toPersianDigits(filteredOptions.length - 100)} مورد دیگر (برای محدود کردن بیشتر جستجو کنید)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
