'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getStoredSession, isOperator } from '@/lib/auth';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const session = getStoredSession();
    if (!session?.token) {
      router.replace('/login/');
      return;
    }

    // Role protection: strictly guard devices and users from Operator!
    if (isOperator(session.role)) {
      if (pathname.startsWith('/devices') || pathname.startsWith('/users')) {
        router.replace('/');
        return;
      }
    }

    setIsAuthorized(true);
  }, [router, pathname]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#070913] flex items-center justify-center text-slate-400 text-xs">
        در حال بررسی دسترسی...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#070913]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
