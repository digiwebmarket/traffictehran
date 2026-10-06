'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Clock, RefreshCw, Bus, AlertCircle } from 'lucide-react';
import { apiGetCharts } from '@/lib/api';
import { DataTable, Column } from '@/components/ui/DataTable';
import { AdvancedFilterBar, FilterField } from '@/components/ui/AdvancedFilterBar';
import { Button } from '@/components/ui/Button';
import { toEnglishDigits, toPersianDigits } from '@/lib/utils';

interface EtaRecord {
  id?: number;
  Line: string;
  Station_Name: string;
  ETA: string;
  Time?: string;
}

export default function EtaPage() {
  const [etaData, setEtaData] = useState<EtaRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const loadEta = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiGetCharts();
      setEtaData(res.live_eta || []);
    } catch (err: any) {
      setError(err.message || 'خطا در دریافت اطلاعات ETA');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEta();
    const interval = setInterval(loadEta, 30000); // 30 sec auto-refresh for live ETA
    return () => clearInterval(interval);
  }, []);

  const filterFields: FilterField[] = [
    { id: 'station', label: 'نام ایستگاه', placeholder: 'فیلتر نام ایستگاه...' },
    { id: 'line', label: 'کد خط', placeholder: 'فیلتر شماره خط...' },
    { id: 'eta', label: 'زمان ورود (ETA)', placeholder: 'فیلتر زمان تخمینی...' },
  ];

  // Apply multi-field filtering
  const filteredData = useMemo(() => {
    return etaData.filter((item) => {
      if (filters.station) {
        const normFilter = toEnglishDigits(filters.station.toLowerCase().trim());
        const normVal = toEnglishDigits((item.Station_Name || '').toLowerCase());
        if (!normVal.includes(normFilter)) return false;
      }
      if (filters.line) {
        const normFilter = toEnglishDigits(filters.line.toLowerCase().trim());
        const normVal = toEnglishDigits((item.Line || '').toLowerCase());
        if (!normVal.includes(normFilter)) return false;
      }
      if (filters.eta) {
        const normFilter = toEnglishDigits(filters.eta.toLowerCase().trim());
        const normVal = toEnglishDigits((item.ETA || '').toLowerCase());
        if (!normVal.includes(normFilter)) return false;
      }
      return true;
    });
  }, [etaData, filters]);

  const columns: Column<EtaRecord>[] = [
    {
      key: 'Line',
      title: 'کد مسیر (خط)',
      width: '20%',
      render: (item) => (
        <div className="flex items-center gap-2 font-bold text-sky-400">
          <Bus className="w-4 h-4 text-slate-500" />
          <span>خط {toPersianDigits(item.Line)}</span>
        </div>
      ),
    },
    {
      key: 'Station_Name',
      title: 'نام ایستگاه',
      width: '45%',
      render: (item) => (
        <span className="font-semibold text-slate-100">{item.Station_Name}</span>
      ),
    },
    {
      key: 'ETA',
      title: 'زمان تخمینی ورود (ETA)',
      width: '35%',
      render: (item) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
          <Clock className="w-3.5 h-3.5" />
          {item.ETA}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-wide">
            پایش رکوردهای زنده زمان ورود (ETA)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            اطلاعات لحظه‌ای و به‌روز تخمین زمان رسیدن ناوگان به ایستگاه‌ها
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={loadEta}
          isLoading={isLoading}
          className="gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>بروزرسانی زنده</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <DataTable
        title="فهرست رکوردهای زنده زمان تخمینی ورود"
        subtitle={`مجموع ${toPersianDigits(filteredData.length)} رکورد آنلاین در این لحظه`}
        columns={columns}
        data={filteredData}
        keyExtractor={(item: EtaRecord, idx?: number) => `${item.Line}-${item.Station_Name}-${idx ?? 0}`}
        isLoading={isLoading}
        searchPlaceholder="جستجوی سریع در تمام فیلدها..."
        exportFileName="live-eta-records"
        pageSize={25}
        headerFilterBar={
          <AdvancedFilterBar
            fields={filterFields}
            onFilterChange={setFilters}
            onReset={() => setFilters({})}
          />
        }
      />
    </div>
  );
}
