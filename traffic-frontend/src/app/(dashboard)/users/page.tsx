'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Users, UserPlus, Trash2, RefreshCw, AlertCircle, Check, X, Shield } from 'lucide-react';
import { apiGetUsers, apiCreateUser, apiDeleteUser, UserItem } from '@/lib/api';
import { getStoredSession } from '@/lib/auth';
import { DataTable, Column } from '@/components/ui/DataTable';
import { AdvancedFilterBar, FilterField } from '@/components/ui/AdvancedFilterBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toPersianDigits } from '@/lib/utils';

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const session = getStoredSession();
  const isAdmin = session?.role === 'admin';

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<'admin' | 'supervisor' | 'operator'>('operator');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiGetUsers();
      setUsers(res);
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری کاربران');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filterFields: FilterField[] = [
    { id: 'username', label: 'نام کاربری', placeholder: 'فیلتر نام کاربری...' },
    {
      id: 'role',
      label: 'نقش کاربری',
      type: 'select',
      options: [
        { label: 'مدیر (ادمین)', value: 'admin' },
        { label: 'سوپروایزر', value: 'supervisor' },
        { label: 'اپراتور', value: 'operator' },
      ],
    },
  ];

  const filteredData = useMemo(() => {
    return users.filter((u) => {
      if (filters.username) {
        const normFilter = filters.username.toLowerCase().trim();
        const normVal = (u.username || '').toLowerCase();
        if (!normVal.includes(normFilter)) return false;
      }
      if (filters.role) {
        if (u.role?.toLowerCase() !== filters.role.toLowerCase()) return false;
      }
      return true;
    });
  }, [users, filters]);

  const handleDelete = async (user: UserItem) => {
    if (user.username === session?.username) {
      alert('نمی‌توانید حساب کاربری فعال خودتان را حذف نمایید.');
      return;
    }
    if (!confirm(`آیا از حذف کاربر "${user.username}" اطمینان دارید؟`)) return;

    try {
      await apiDeleteUser(user.username);
      setUsers((prev) => prev.filter((u) => u.username !== user.username));
    } catch (err: any) {
      alert(err.message || 'خطا در حذف کاربر');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formUsername.trim() || !formPassword) {
      setFormError('نام کاربری و کلمه عبور الزامی هستند.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await apiCreateUser({
        username: formUsername.trim(),
        password: formPassword,
        role: formRole,
      });

      if (res.success) {
        setIsModalOpen(false);
        setFormUsername('');
        setFormPassword('');
        setFormRole('operator');
        await loadUsers();
      } else {
        setFormError(res.message || 'خطا در ساخت کاربر');
      }
    } catch (err: any) {
      setFormError(err.message || 'خطا در ایجاد کاربر');
    } finally {
      setIsSaving(false);
    }
  };

  const columns: Column<UserItem>[] = [
    {
      key: 'username',
      title: 'نام کاربری',
      width: '35%',
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
            {item.username.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-slate-100">{item.username}</span>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'نقش کاربری',
      width: '30%',
      render: (item) => <StatusBadge status={item.role} />,
    },
    {
      key: 'registered',
      title: 'تاریخ ثبت‌نام',
      width: '25%',
      render: (item) => (
        <span className="text-slate-400 text-xs">
          {item.registered ? toPersianDigits(item.registered) : '-'}
        </span>
      ),
    },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            title: 'عملیات',
            sortable: false,
            align: 'center' as const,
            width: '10%',
            render: (item: UserItem) => (
              <button
                onClick={() => handleDelete(item)}
                className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:text-white hover:bg-rose-500/20 border border-slate-700 transition-colors"
                title="حذف کاربر"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-wide">
            مدیریت کاربران و سطوح دسترسی
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تعریف حساب‌های کاربری جدید و انتساب نقش‌های مدیر، سوپروایزر و اپراتور
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadUsers}
            isLoading={isLoading}
            className="gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>بروزرسانی</span>
          </Button>

          {isAdmin && (
            <Button size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5">
              <UserPlus className="w-4 h-4" />
              <span>کاربر جدید</span>
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <DataTable
        title="فهرست کاربران سامانه"
        subtitle={`مجموع ${toPersianDigits(filteredData.length)} کاربر ثبت‌شده`}
        columns={columns}
        data={filteredData}
        keyExtractor={(item) => item.username}
        isLoading={isLoading}
        searchPlaceholder="جستجو در نام کاربری..."
        exportFileName="tehran-users"
        pageSize={20}
        headerFilterBar={
          <AdvancedFilterBar
            fields={filterFields}
            onFilterChange={setFilters}
            onReset={() => setFilters({})}
          />
        }
      />

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-400" />
                <span>تعریف کاربر جدید سامانه</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="نام کاربری"
                placeholder="نام کاربری انگلیسی..."
                value={formUsername}
                onChange={(e) => setFormUsername(e.target.value)}
                autoFocus
                required
              />

              <Input
                label="رمز عبور"
                type="password"
                placeholder="رمز عبور امن..."
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  نقش کاربری
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as any)}
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="operator">اپراتور (فقط مشاهده داشبورد و ایستگاه‌ها)</option>
                  <option value="supervisor">سوپروایزر (دسترسی به نمایشگرها و کاربران)</option>
                  <option value="admin">مدیر کل (دسترسی کامل)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                  انصراف
                </Button>
                <Button size="sm" type="submit" isLoading={isSaving} className="gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>ثبت کاربر</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
