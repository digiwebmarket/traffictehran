'use client';

import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Route,
  Monitor,
  Clock,
  RefreshCw,
  Bus,
  Layers,
  Palette,
} from 'lucide-react';
import { apiGetCharts, DashboardChartsData } from '@/lib/api';
import { KpiCard, BarChartWidget, DonutChartWidget } from '@/components/ui/ChartWidgets';
import { InteractiveMap } from '@/components/ui/InteractiveMap';
import { Button } from '@/components/ui/Button';

export default function OverviewDashboardPage() {
  const [data, setData] = useState<DashboardChartsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiGetCharts();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'خطا در دریافت اطلاعات داشبورد');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // 1 minute auto refresh
    return () => clearInterval(interval);
  }, []);

  const summary = data?.summary || {
    stations: 0,
    routes: 0,
    devices: 0,
    eta_records: 0,
  };

  // Prepare Bar chart data for Colors
  const colorChartData = (data?.colors?.labels || []).map((lbl, idx) => ({
    label: lbl,
    value: data?.colors?.values[idx] || 0,
    color: '#38bdf8',
  }));

  // Prepare Bar chart data for Routes
  const routeChartData = (data?.routes?.labels || []).map((lbl, idx) => ({
    label: `خط ${lbl}`,
    value: data?.routes?.values[idx] || 0,
    color: '#f59e0b',
  }));

  // Prepare Donut chart data for Bus Types
  const busTypeData = (data?.bus_types?.labels || []).map((lbl, idx) => ({
    label: lbl,
    value: data?.bus_types?.values[idx] || 0,
  }));

  // Prepare Map points
  const mapStations = (data?.stations_map || []).map((st) => ({
    code: st.code,
    name: st.name,
    custom_name: st.custom_name,
    lat: st.lat,
    lng: st.lng,
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-wide">
            داشبورد مانیتورینگ ترافیک تهران
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            خلاصه آمار زنده، پراکندگی جغرافیایی ایستگاه‌ها و وضعیت ناوگان
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={loadData}
          isLoading={isLoading}
          className="gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>بروزرسانی داده‌ها</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <KpiCard
          title="کل ایستگاه‌های ثبت‌شده"
          value={summary.stations}
          icon={<MapPin className="w-6 h-6 text-sky-400" />}
          color="sky"
        />
        <KpiCard
          title="کل خطوط فعال"
          value={summary.routes}
          icon={<Route className="w-6 h-6 text-amber-400" />}
          color="orange"
        />
        <KpiCard
          title="نمایشگرهای آنلاین"
          value={summary.devices}
          icon={<Monitor className="w-6 h-6 text-purple-400" />}
          color="purple"
        />
        <KpiCard
          title="رکوردهای لحظه‌ای ETA"
          value={summary.eta_records}
          icon={<Clock className="w-6 h-6 text-emerald-400" />}
          color="emerald"
        />
      </div>

      {/* Row 2: Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BarChartWidget
          title="تعداد رنگ‌های ایستگاه‌ها"
          subtitle="تفکیک تعداد ایستگاه‌ها بر مبنای کد رنگ تعریف‌شده"
          data={colorChartData}
        />
        <BarChartWidget
          title="تعداد ایستگاه در هر مسیر"
          subtitle="تراکم تعداد ایستگاه‌ها در خطوط مختلف اتوبوس‌رانی"
          data={routeChartData}
        />
        <DonutChartWidget
          title="سهم انواع اتوبوس‌ها"
          subtitle="نسبت ناوگان عمومی فعال در خطوط ترانزیت"
          data={busTypeData}
        />
      </div>

      {/* Row 3: Interactive Geographic Map */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              <span>نقشه جغرافیایی ایستگاه‌ها و نمایشگرها</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              موقعیت مکانی ایستگاه‌های اتوبوس روی نقشه ماهواره‌ای و شهری تهران
            </p>
          </div>
        </div>

        <InteractiveMap stations={mapStations} height="520px" />
      </div>
    </div>
  );
}
