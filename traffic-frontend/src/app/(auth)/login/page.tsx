'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bus, User, Lock, AlertCircle } from 'lucide-react';
import { apiLogin } from '@/lib/api';
import { saveSession, getStoredSession } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = getStoredSession();
    if (session?.token) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('لطفاً نام کاربری و رمز عبور را وارد فرمایید.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await apiLogin(username.trim(), password);
      if (res.success && res.token) {
        saveSession(res.token, res.role, username.trim());
        router.push('/');
      } else {
        setError(res.message || 'ورود ناموفق بود. دسترسی یا اطلاعات نامعتبر است.');
      }
    } catch (err: any) {
      setError(err.message || 'خطا در ارتباط با سرور. لطفاً مجدداً تلاش فرمایید.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/v2tehrandashboard/images/login-bg.jpg')",
      }}
    >
      {/* Background Image with Crisp Contrast & Subtle Vignette */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/v2tehrandashboard/images/login-bg.jpg"
          alt="ایستگاه اتوبوسرانی و سامانه مانیتورینگ ترافیک تهران"
          className="w-full h-full object-cover object-center select-none"
        />
        {/* Subtle Dark Vignette: keeps the red BRT bus and autumn trees vibrant while ensuring WCAG AA contrast */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
      </div>

      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Glassmorphic Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-white/15 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-black/90 backdrop-blur-2xl relative z-10 animate-fadeIn">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-brand-600 via-rose-600 to-amber-500 text-white shadow-lg shadow-brand-500/25">
            <Bus className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">ورود به سامانه مانیتورینگ ترافیک</h2>
          <p className="text-xs text-slate-300">مرکز پایش هوشمند ناوگان اتوبوسرانی و نمایشگرهای دیجیتال تهران</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="username"
            label="نام کاربری"
            placeholder="نام کاربری خود را وارد کنید"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={<User className="w-4 h-4" />}
            autoFocus
          />

          <Input
            id="password"
            label="رمز عبور"
            type="password"
            placeholder="رمز عبور را وارد کنید"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
          />

          <Button
            type="submit"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2 font-bold shadow-lg shadow-brand-600/30 hover:shadow-brand-600/50 transition-all"
          >
            ورود به داشبورد
          </Button>
        </form>

        <div className="mt-8 text-center text-[11px] text-slate-400 border-t border-slate-800/80 pt-4">
          مرکز کنترل و نظارت یکپارچه خطوط اتوبوسرانی تهران
        </div>
      </div>
    </div>
  );
}

