'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Search,
  Download,
  ChevronRight,
  ChevronLeft,
  ArrowUpDown,
} from 'lucide-react';
import { toPersianDigits, toEnglishDigits } from '@/lib/utils';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'right' | 'center' | 'left';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index?: number) => string | number;
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T | string)[];
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  exportFileName?: string;
  pageSize?: number;
  emptyMessage?: string;
  headerFilterBar?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  searchable = true,
  searchPlaceholder = 'جستجو در جدول...',
  searchKeys,
  title,
  subtitle,
  actions,
  exportFileName = 'table-export',
  pageSize: initialPageSize = 10,
  emptyMessage = 'هیچ داده‌ای برای نمایش وجود ندارد.',
  headerFilterBar,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // 1. Search Filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = toEnglishDigits(searchTerm.toLowerCase().trim());

    return data.filter((item) => {
      const keysToSearch = searchKeys || columns.map((col) => String(col.key));
      return keysToSearch.some((k) => {
        const val = item[k];
        if (val === null || val === undefined) return false;
        const norm = toEnglishDigits(String(val).toLowerCase());
        return norm.includes(term);
      });
    });
  }, [data, searchTerm, searchKeys, columns]);

  // 2. Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      // Numeric check
      const aNum = Number(toEnglishDigits(String(aVal)));
      const bNum = Number(toEnglishDigits(String(bVal)));
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // String locale comparison
      const cmp = String(aVal).localeCompare(String(bVal), 'fa', { numeric: true });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sortKey, sortDirection]);

  // 3. Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleExportCSV = () => {
    if (!data.length) return;
    const headerRow = columns.map((c) => `"${c.title}"`).join(',');
    const rows = sortedData.map((item) => {
      return columns
        .map((c) => {
          const val = item[c.key as string] ?? '';
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(',');
    });
    const csvContent = '\uFEFF' + [headerRow, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportFileName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden flex flex-col">
      {/* Header section */}
      {(title || subtitle || actions || searchable) && (
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            {title && <h3 className="text-base font-bold text-white">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {searchable && (
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}

            <button
              onClick={handleExportCSV}
              title="خروجی CSV"
              className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            {actions}
          </div>
        </div>
      )}

      {/* Optional dedicated filter toolbar */}
      {headerFilterBar}

      {/* Table Content */}
      <div className="w-full overflow-x-auto overflow-y-auto max-h-[550px] scrollbar-thin scrollbar-thumb-slate-700">
        <table className="w-full text-right text-xs text-slate-200">
          <thead className="sticky top-0 z-10 bg-slate-950/95 border-b border-slate-800 backdrop-blur-md">
            <tr>
              {columns.map((col) => {
                const isSorted = sortKey === String(col.key);
                return (
                  <th
                    key={String(col.key)}
                    style={{ width: col.width }}
                    className={`py-3.5 px-4 font-semibold text-slate-300 select-none ${
                      col.sortable !== false ? 'cursor-pointer hover:text-brand-400' : ''
                    } ${
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'left'
                        ? 'text-left'
                        : 'text-right'
                    }`}
                    onClick={() => col.sortable !== false && handleSort(String(col.key))}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === 'center'
                          ? 'justify-center'
                          : col.align === 'left'
                          ? 'justify-start'
                          : 'justify-start'
                      }`}
                    >
                      <span>{col.title}</span>
                      {col.sortable !== false && (
                        <span className="text-slate-500">
                          {isSorted ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-brand-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-brand-400" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                  <div className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-brand-400" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>در حال بارگذاری اطلاعات...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => (
                <tr
                  key={keyExtractor(item, (currentPage - 1) * pageSize + idx)}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`py-3 px-4 ${
                        col.align === 'center'
                          ? 'text-center'
                          : col.align === 'left'
                          ? 'text-left'
                          : 'text-right'
                      }`}
                    >
                      {col.render
                        ? col.render(item, (currentPage - 1) * pageSize + idx)
                        : item[col.key as string] ?? '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && sortedData.length > 0 && (
        <div className="p-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>تعداد در صفحه:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {[10, 25, 50, 100].map((sz) => (
                <option key={sz} value={sz}>
                  {toPersianDigits(sz)}
                </option>
              ))}
            </select>
            <span className="mr-2">
              نمایش {toPersianDigits((currentPage - 1) * pageSize + 1)} تا{' '}
              {toPersianDigits(Math.min(currentPage * pageSize, sortedData.length))} از کل{' '}
              {toPersianDigits(sortedData.length)} مورد
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-800/50 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-slate-300">
              صفحه {toPersianDigits(currentPage)} از {toPersianDigits(totalPages)}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-800/50 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
