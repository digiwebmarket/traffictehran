'use client';

import React from 'react';
import { toPersianDigits, formatNumber } from '@/lib/utils';

// --- 1. KPI Stat Card ---
export interface KpiCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: 'sky' | 'orange' | 'purple' | 'emerald' | 'rose';
  trend?: string;
}

export function KpiCard({ title, value, icon, color = 'sky', trend }: KpiCardProps) {
  const colorMap = {
    sky: 'from-sky-500/20 to-sky-500/5 text-sky-400 border-sky-500/30',
    orange: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30',
    purple: 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30',
    emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30',
    rose: 'from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/30',
  };

  return (
    <div className={`relative bg-gradient-to-br ${colorMap[color]} bg-slate-900/80 border rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-md flex items-center justify-between overflow-hidden group hover:border-slate-600 transition-all duration-300`}>
      <div className="space-y-1 z-10">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {typeof value === 'number' ? formatNumber(value) : toPersianDigits(value)}
        </div>
        {trend && <span className="text-[11px] text-emerald-400 font-semibold">{trend}</span>}
      </div>

      <div className={`p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
    </div>
  );
}

// --- 2. Bar Chart Item ---
export interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartWidgetProps {
  title: string;
  subtitle?: string;
  data: BarChartItem[];
  height?: number;
}

export function BarChartWidget({ title, subtitle, data, height = 240 }: BarChartWidgetProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="space-y-2.5 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-slate-700 pr-1" style={{ minHeight: height }}>
        {data.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500">داده‌ای یافت نشد.</div>
        ) : (
          data.map((item, idx) => {
            const pct = Math.round((item.value / maxValue) * 100);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="font-medium truncate max-w-[70%]">{item.label}</span>
                  <span className="text-brand-400 font-bold">{toPersianDigits(item.value)}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: item.color || '#38bdf8',
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// --- 3. Donut / Share Chart Item ---
export interface DonutChartWidgetProps {
  title: string;
  subtitle?: string;
  data: Array<{ label: string; value: number; color?: string }>;
}

export function DonutChartWidget({ title, subtitle, data }: DonutChartWidgetProps) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;
  const defaultColors = ['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24'];

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      {/* Progress Strip */}
      <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex my-3">
        {data.map((item, idx) => {
          const pct = (item.value / total) * 100;
          return (
            <div
              key={idx}
              style={{
                width: `${pct}%`,
                backgroundColor: item.color || defaultColors[idx % defaultColors.length],
              }}
              title={`${item.label}: ${item.value}`}
              className="h-full transition-all duration-300 hover:opacity-80"
            />
          );
        })}
      </div>

      {/* Legend list */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((item, idx) => {
          const pct = Math.round((item.value / total) * 100);
          const color = item.color || defaultColors[idx % defaultColors.length];
          return (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-slate-300 truncate">{item.label}</span>
              <span className="mr-auto font-bold text-slate-400 text-[11px]">
                {toPersianDigits(pct)}٪
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
