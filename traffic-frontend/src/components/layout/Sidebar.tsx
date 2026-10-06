'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Clock,
  MapPin,
  Route,
  Monitor,
  Users,
  LogOut,
  Shield,
  Bus,
} from 'lucide-react';
import { getStoredSession, clearSession, isOperator } from '@/lib/auth';
import { StatusBadge } from '../ui/StatusBadge';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const session = getStoredSession();
  const role = session?.role || 'operator';
  const isOp = isOperator(role);

  const navItems = [
    {
      title: 'داشبورد و وضعیت زنده',
      href: '/',
      icon: LayoutDashboard,
      show: true,
    },
    {
      title: 'پایش آنلاین ETA',
      href: '/eta/',
      icon: Clock,
      show: true,
    },
    {
      title: 'مدیریت ایستگاه‌ها',
      href: '/stations/',
      icon: MapPin,
      show: true,
    },
    {
      title: 'مدیریت خطوط و پایانه‌ها',
      href: '/routes/',
      icon: Route,
      show: true,
    },
    {
      title: 'مدیریت نمایشگرها',
      href: '/devices/',
      icon: Monitor,
      show: !isOp, // Strictly hidden from Operator!
    },
    {
      title: 'مدیریت کاربران',
      href: '/users/',
      icon: Users,
      show: !isOp, // Strictly hidden from Operator!
    },
  ];

  const handleLogout = () => {
    clearSession();
    router.push('/login/');
  };

  return (
    <aside className="w-64 bg-slate-950/90 border-l border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 backdrop-blur-xl z-30 select-none">
      {/* Top Branding */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-400 text-white shadow-lg shadow-brand-500/20">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-wide">سیتی‌بیگ ترانزیت</h1>
            <p className="text-[11px] text-slate-400">کنترل هوشمند ترافیک تهران</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navItems
            .filter((item) => item.show)
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-300 font-bold border border-brand-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
        </nav>
      </div>

      {/* Bottom Profile & Logout */}
      <div className="p-3 border-t border-slate-800/80 space-y-3">
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
              <Shield className="w-4 h-4 text-brand-400" />
            </div>
            <div className="truncate text-xs">
              <div className="font-bold text-slate-200 truncate">{session?.username || 'کاربر سیستم'}</div>
              <div className="text-[10px] text-slate-400">
                <StatusBadge status={role} />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all duration-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>خروج از سامانه</span>
        </button>
      </div>
    </aside>
  );
}
