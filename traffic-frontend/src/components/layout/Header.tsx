'use client';

import React from 'react';
import { Bell, Wifi, Activity } from 'lucide-react';
import { getStoredSession } from '@/lib/auth';

export function Header({ title, subtitle }: { title?: string; subtitle?: string }) {
  const session = getStoredSession();

  return (
    <header className="h-16 px-6 bg-slate-950/70 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
      <div>
        {title && <h2 className="text-base font-extrabold text-white tracking-wide">{title}</h2>}
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ارتباط برخط با وب‌سرویس</span>
        </div>

        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
          <Bell className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
