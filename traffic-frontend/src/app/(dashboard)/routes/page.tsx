'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Route as RouteIcon, Edit3, Check, X, RefreshCw, AlertCircle, ArrowLeftRight } from 'lucide-react';
import { apiGetRoutes, apiUpdateRouteCustom, RouteItem } from '@/lib/api';
import { DataTable, Column } from '@/components/ui/DataTable';
import { AdvancedFilterBar, FilterField } from '@/components/ui/AdvancedFilterBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toEnglishDigits, toPersianDigits } from '@/lib/utils';

export default function RoutesPage() {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Editing modal state
  const [editingRoute, setEditingRoute] = useState<RouteItem | null>(null);
  const [term1Custom, setTerm1Custom] = useState('');
  const [term2Custom, setTerm2Custom] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadRoutes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiGetRoutes();
      setRoutes(res);
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری خطوط');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const filterFields: FilterField[] = [
    { id: 'code', label: 'کد خط', placeholder: 'فیلتر شماره خط...' },
    { id: 'origin', label: 'مبدأ', placeholder: 'فیلتر مبدأ (اصلی/سفارشی)...' },
    { id: 'destination', label: 'مقصد', placeholder: 'فیلتر مقصد (اصلی/سفارشی)...' },
  ];

  const filteredData = useMemo(() => {
    return routes.filter((r) => {
      if (filters.code) {
        const normFilter = toEnglishDigits(filters.code.toLowerCase().trim());
        const normVal = toEnglishDigits(String(r.code).toLowerCase());
        if (!normVal.includes(normFilter)) return false;
      }
      if (filters.origin) {
        const normFilter = toEnglishDigits(filters.origin.toLowerCase().trim());
        const mainTerm = toEnglishDigits((r.Terminal1 || '').toLowerCase());
        const custTerm = toEnglishDigits((r.Terminal1_custom || '').toLowerCase());
        if (!mainTerm.includes(normFilter) && !custTerm.includes(normFilter)) return false;
      }
      if (filters.destination) {
        const normFilter = toEnglishDigits(filters.destination.toLowerCase().trim());
        const mainTerm = toEnglishDigits((r.Terminal2 || '').toLowerCase());
        const custTerm = toEnglishDigits((r.Terminal2_custom || '').toLowerCase());
        if (!mainTerm.includes(normFilter) && !custTerm.includes(normFilter)) return false;
      }
      return true;
    });
  }, [routes, filters]);

  const handleOpenEdit = (r: RouteItem) => {
    setEditingRoute(r);
    setTerm1Custom(r.Terminal1_custom || '');
    setTerm2Custom(r.Terminal2_custom || '');
  };

  const handleSaveCustom = async () => {
    if (!editingRoute) return;
    setIsSaving(true);
    try {
      await apiUpdateRouteCustom(editingRoute.id || editingRoute.code, term1Custom.trim(), term2Custom.trim());
      // Update local state
      setRoutes((prev) =>
        prev.map((r) =>
          String(r.code) === String(editingRoute.code)
            ? { ...r, Terminal1_custom: term1Custom.trim(), Terminal2_custom: term2Custom.trim() }
            : r
        )
      );
      setEditingRoute(null);
    } catch (err: any) {
      alert(err.message || 'خطا در ذخیره نام پایانه‌ها');
    } finally {
      setIsSaving(false);
    }
  };

  const columns: Column<RouteItem>[] = [
    {
      key: 'code',
      title: 'کد خط',
      width: '15%',
      render: (item) => (
        <span className="font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
          خط {toPersianDigits(item.code)}
        </span>
      ),
    },
    {
      key: 'Terminal1',
      title: 'مبدأ (پایانه اول)',
      width: '35%',
      render: (item) => (
        <div>
          <div className="font-semibold text-slate-100">{item.Terminal1}</div>
          {item.Terminal1_custom && (
            <div className="text-[11px] text-amber-300 font-bold mt-0.5">
              سفارشی: {item.Terminal1_custom}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'Terminal2',
      title: 'مقصد (پایانه دوم)',
      width: '40%',
      render: (item) => (
        <div>
          <div className="font-semibold text-slate-100">{item.Terminal2}</div>
          {item.Terminal2_custom && (
            <div className="text-[11px] text-amber-300 font-bold mt-0.5">
              سفارشی: {item.Terminal2_custom}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'عملیات',
      sortable: false,
      align: 'center',
      width: '10%',
      render: (item) => (
        <button
          onClick={() => handleOpenEdit(item)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-brand-500/20 hover:border-brand-500/30 border border-slate-700 transition-colors"
          title="ویرایش پایانه‌ها"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-wide">
            مدیریت خطوط و پایانه‌های اتوبوس‌رانی
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            مشاهده خطوط ترانزیت و ویرایش نام دلخواه پایانه‌های مبدأ و مقصد
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={loadRoutes}
          isLoading={isLoading}
          className="gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>بروزرسانی خطوط</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <DataTable
        title="فهرست خطوط اتوبوس‌رانی ترافیک تهران"
        subtitle={`مجموع ${toPersianDigits(filteredData.length)} مسیر فعال`}
        columns={columns}
        data={filteredData}
        keyExtractor={(item) => String(item.code)}
        isLoading={isLoading}
        searchPlaceholder="جستجو در تمام پایانه‌ها و خطوط..."
        exportFileName="tehran-routes"
        pageSize={20}
        headerFilterBar={
          <AdvancedFilterBar
            fields={filterFields}
            onFilterChange={setFilters}
            onReset={() => setFilters({})}
          />
        }
      />

      {/* Edit Custom Terminals Modal */}
      {editingRoute && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <RouteIcon className="w-4 h-4 text-brand-400" />
                <span>ویرایش پایانه‌های خط {toPersianDigits(editingRoute.code)}</span>
              </h3>
              <button
                onClick={() => setEditingRoute(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-800/50 rounded-xl space-y-1">
                <div className="text-slate-400">مبدأ اصلی: <b className="text-slate-200">{editingRoute.Terminal1}</b></div>
                <div className="text-slate-400">مقصد اصلی: <b className="text-slate-200">{editingRoute.Terminal2}</b></div>
              </div>

              <Input
                label="نام سفارشی مبدأ (پایانه اول)"
                value={term1Custom}
                onChange={(e) => setTerm1Custom(e.target.value)}
                placeholder="نام دلخواه برای پایانه اول..."
              />

              <Input
                label="نام سفارشی مقصد (پایانه دوم)"
                value={term2Custom}
                onChange={(e) => setTerm2Custom(e.target.value)}
                placeholder="نام دلخواه برای پایانه دوم..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditingRoute(null)}
              >
                انصراف
              </Button>
              <Button
                size="sm"
                onClick={handleSaveCustom}
                isLoading={isSaving}
                className="gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>ذخیره تغییرات</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
