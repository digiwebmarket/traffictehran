'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { MapPin, Edit3, Check, X, RefreshCw, AlertCircle } from 'lucide-react';
import { apiGetStations, apiUpdateStationCustom, StationItem } from '@/lib/api';
import { DataTable, Column } from '@/components/ui/DataTable';
import { AdvancedFilterBar, FilterField } from '@/components/ui/AdvancedFilterBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toEnglishDigits, toPersianDigits } from '@/lib/utils';

export default function StationsPage() {
  const [stations, setStations] = useState<StationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Editing state
  const [editingStation, setEditingStation] = useState<StationItem | null>(null);
  const [customNameInput, setCustomNameInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadStations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiGetStations();
      setStations(res);
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری ایستگاه‌ها');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStations();
  }, []);

  const filterFields: FilterField[] = [
    { id: 'code', label: 'کد ایستگاه', placeholder: 'فیلتر شماره یا کد...' },
    { id: 'name', label: 'نام ایستگاه', placeholder: 'فیلتر نام اصلی ایستگاه...' },
    { id: 'custom', label: 'نام دلخواه', placeholder: 'فیلتر نام سفارشی...' },
  ];

  const filteredData = useMemo(() => {
    return stations.filter((st) => {
      if (filters.code) {
        const normFilter = toEnglishDigits(filters.code.toLowerCase().trim());
        const normVal = toEnglishDigits(String(st.code).toLowerCase());
        if (!normVal.includes(normFilter)) return false;
      }
      if (filters.name) {
        const normFilter = toEnglishDigits(filters.name.toLowerCase().trim());
        const normVal = toEnglishDigits((st.Station_Name || '').toLowerCase());
        if (!normVal.includes(normFilter)) return false;
      }
      if (filters.custom) {
        const normFilter = toEnglishDigits(filters.custom.toLowerCase().trim());
        const normVal = toEnglishDigits((st.station_custom || '').toLowerCase());
        if (!normVal.includes(normFilter)) return false;
      }
      return true;
    });
  }, [stations, filters]);

  const handleOpenEdit = (st: StationItem) => {
    setEditingStation(st);
    setCustomNameInput(st.station_custom || '');
  };

  const handleSaveCustom = async () => {
    if (!editingStation) return;
    setIsSaving(true);
    try {
      await apiUpdateStationCustom(editingStation.id || editingStation.code, customNameInput.trim());
      // Update local state
      setStations((prev) =>
        prev.map((s) =>
          String(s.code) === String(editingStation.code)
            ? { ...s, station_custom: customNameInput.trim() }
            : s
        )
      );
      setEditingStation(null);
    } catch (err: any) {
      alert(err.message || 'خطا در ذخیره نام دلخواه ایستگاه');
    } finally {
      setIsSaving(false);
    }
  };

  const columns: Column<StationItem>[] = [
    {
      key: 'code',
      title: 'کد ایستگاه',
      width: '18%',
      render: (item) => (
        <span className="font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
          {toPersianDigits(item.code)}
        </span>
      ),
    },
    {
      key: 'Station_Name',
      title: 'نام اصلی ایستگاه',
      width: '37%',
      render: (item) => <span className="font-semibold text-slate-100">{item.Station_Name}</span>,
    },
    {
      key: 'station_custom',
      title: 'نام سفارشی (نمایشی)',
      width: '35%',
      render: (item) =>
        item.station_custom ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
            {item.station_custom}
          </span>
        ) : (
          <span className="text-slate-500 italic text-[11px]">تعریف‌نشده</span>
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
          title="ویرایش نام سفارشی"
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
            مدیریت اطلاعات و نام دلخواه ایستگاه‌ها
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            مشاهده اطلاعات پایه و تعریف عنوان سفارشی ایستگاه‌ها برای نمایش در تابلوها
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={loadStations}
          isLoading={isLoading}
          className="gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>بروزرسانی ایستگاه‌ها</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <DataTable
        title="فهرست کامل ایستگاه‌های تهران"
        subtitle={`مجموع ${toPersianDigits(filteredData.length)} ایستگاه ثبت‌شده`}
        columns={columns}
        data={filteredData}
        keyExtractor={(item) => String(item.code)}
        isLoading={isLoading}
        searchPlaceholder="جستجو در تمام فیلدها..."
        exportFileName="tehran-stations"
        pageSize={20}
        headerFilterBar={
          <AdvancedFilterBar
            fields={filterFields}
            onFilterChange={setFilters}
            onReset={() => setFilters({})}
          />
        }
      />

      {/* Edit Custom Name Modal */}
      {editingStation && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>ویرایش نام دلخواه ایستگاه (کد {toPersianDigits(editingStation.code)})</span>
              </h3>
              <button
                onClick={() => setEditingStation(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400">نام اصلی در سیستم: </span>
                <b className="text-slate-200">{editingStation.Station_Name}</b>
              </div>

              <Input
                label="نام دلخواه (سفارشی)"
                value={customNameInput}
                onChange={(e) => setCustomNameInput(e.target.value)}
                placeholder="نام سفارشی را وارد کنید..."
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditingStation(null)}
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
