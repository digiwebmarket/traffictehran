'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Monitor, Plus, Edit3, Trash2, RefreshCw, AlertCircle, Check, X, Filter, RotateCcw, Search } from 'lucide-react';
import { apiGetDevices, apiGetStations, apiSaveDevice, apiDeleteDevice, DeviceItem, StationItem } from '@/lib/api';
import { getStoredSession } from '@/lib/auth';
import { DataTable, Column } from '@/components/ui/DataTable';
import { SearchableSelect, SearchableOption } from '@/components/ui/SearchableSelect';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { isValidImei, isValidIpAddress } from '@/lib/validations';
import { toEnglishDigits, toPersianDigits } from '@/lib/utils';

export default function DevicesPage() {
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [stations, setStations] = useState<StationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const session = getStoredSession();
  const isAdmin = session?.role === 'admin';

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<DeviceItem | null>(null);
  const [formImei, setFormImei] = useState('');
  const [formIp, setFormIp] = useState('');
  const [formStationCode, setFormStationCode] = useState<string | number>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [devs, sts] = await Promise.all([apiGetDevices(), apiGetStations()]);
      setDevices(devs);
      setStations(sts);
    } catch (err: any) {
      setError(err.message || 'خطا در بارگذاری اطلاعات نمایشگرها');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Station options for table filter (searches from full Station table)
  const filterStationOptions: SearchableOption[] = useMemo(() => {
    return stations.map((st) => {
      const customPart = st.station_custom ? ` (${st.station_custom})` : '';
      return {
        label: `کد ${toPersianDigits(st.code)} - ${st.Station_Name}${customPart}`,
        value: String(st.code),
      };
    });
  }, [stations]);

  const filteredData = useMemo(() => {
    return devices.filter((dev) => {
      // 1. Filter by IMEI
      if (filters.imei) {
        const normFilter = toEnglishDigits(filters.imei.toLowerCase().trim());
        const normVal = toEnglishDigits(String(dev.imei).toLowerCase());
        if (!normVal.includes(normFilter)) return false;
      }

      // 2. Filter by IP
      if (filters.ip) {
        const normFilter = toEnglishDigits(filters.ip.toLowerCase().trim());
        const normVal = toEnglishDigits(String(dev.ip || '').toLowerCase());
        if (!normVal.includes(normFilter)) return false;
      }

      // 3. Filter by Selected Station from Station Combobox
      if (filters.station_code) {
        const selectedCode = toEnglishDigits(String(filters.station_code).trim());
        const devCode = toEnglishDigits(String(dev.station_code).trim());
        if (devCode !== selectedCode) return false;
      }

      // 4. Filter by Free-Text Station Search (matches station_code, Station_Name, and station_custom)
      if (filters.station_text) {
        const normFilter = toEnglishDigits(filters.station_text.toLowerCase().trim());
        const normName = toEnglishDigits((dev.Station_Name || '').toLowerCase());
        const normCustom = toEnglishDigits((dev.station_custom || '').toLowerCase());
        const normCode = toEnglishDigits(String(dev.station_code).toLowerCase());

        // Also cross-reference against the full station record in stations table
        const matchingStation = stations.find((st) => String(st.code) === String(dev.station_code));
        const refName = matchingStation ? toEnglishDigits(matchingStation.Station_Name.toLowerCase()) : '';
        const refCustom = matchingStation?.station_custom ? toEnglishDigits(matchingStation.station_custom.toLowerCase()) : '';

        const matches =
          normName.includes(normFilter) ||
          normCustom.includes(normFilter) ||
          normCode.includes(normFilter) ||
          refName.includes(normFilter) ||
          refCustom.includes(normFilter);

        if (!matches) return false;
      }

      return true;
    });
  }, [devices, filters, stations]);

  // Map of stations already assigned to other devices
  const assignedStationMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    devices.forEach((d) => {
      if (editingDevice && d.id === editingDevice.id) return;
      map[String(d.station_code)] = true;
    });
    return map;
  }, [devices, editingDevice]);

  // Prepare Station Searchable Combobox Options
  const stationOptions: SearchableOption[] = useMemo(() => {
    return stations.map((st) => {
      const isAssigned = Boolean(assignedStationMap[String(st.code)]);
      const customPart = st.station_custom ? ` (${st.station_custom})` : '';
      return {
        label: `کد ${st.code} - ${st.Station_Name}${customPart}`,
        value: st.code,
        disabled: isAssigned,
        badge: isAssigned ? 'اختصاص‌یافته' : undefined,
      };
    });
  }, [stations, assignedStationMap]);

  const handleOpenAdd = () => {
    setEditingDevice(null);
    setFormImei('');
    setFormIp('');
    setFormStationCode('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dev: DeviceItem) => {
    setEditingDevice(dev);
    setFormImei(dev.imei);
    setFormIp(dev.ip || '');
    setFormStationCode(dev.station_code);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (dev: DeviceItem) => {
    if (!confirm(`آیا از حذف نمایشگر با کد IMEI "${dev.imei}" اطمینان دارید؟`)) return;
    try {
      await apiDeleteDevice(dev.id);
      setDevices((prev) => prev.filter((d) => d.id !== dev.id));
    } catch (err: any) {
      alert(err.message || 'خطا در حذف نمایشگر');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const normImei = toEnglishDigits(formImei.trim()).replace(/\D/g, '');
    const normIp = toEnglishDigits(formIp.trim());
    const normStation = String(formStationCode).trim();

    // 1. IMEI Validation: Exactly 15 digits
    if (!isValidImei(normImei)) {
      setFormError('کد IMEI باید الزاماً یک عدد ۱۵ رقمی معتبر باشد.');
      return;
    }

    // 2. Station Validation: Must be selected and exist
    if (!normStation) {
      setFormError('لطفاً ایستگاه مورد نظر را از کامبوباکس انتخاب نمایید.');
      return;
    }

    // 3. Station Uniqueness
    if (assignedStationMap[normStation]) {
      setFormError('این ایستگاه قبلاً به نمایشگر دیگری اختصاص داده شده است.');
      return;
    }

    // 4. IP Validation: If provided, must be valid IPv4 or IPv6
    if (normIp && !isValidIpAddress(normIp)) {
      setFormError('آدرس IP وارد شده نامعتبر است (تنها ساختار IPv4 یا IPv6 معتبر پذیرفته می‌شود).');
      return;
    }

    setIsSaving(true);
    try {
      const res = await apiSaveDevice({
        id: editingDevice?.id,
        imei: normImei,
        ip: normIp || undefined,
        station_code: normStation,
      });

      if (res.success) {
        setIsModalOpen(false);
        await loadData();
      } else {
        setFormError(res.message || 'خطا در ذخیره اطلاعات');
      }
    } catch (err: any) {
      setFormError(err.message || 'خطا در ارسال اطلاعات به سرور');
    } finally {
      setIsSaving(false);
    }
  };

  const columns: Column<DeviceItem>[] = [
    {
      key: 'imei',
      title: 'شناسه IMEI',
      width: '25%',
      render: (item) => (
        <span className="font-mono font-bold text-sky-400 dir-ltr text-left block">
          {item.imei}
        </span>
      ),
    },
    {
      key: 'ip',
      title: 'آدرس IP',
      width: '20%',
      render: (item) => (
        <span className="font-mono text-slate-300 dir-ltr text-left block">
          {item.ip || '-'}
        </span>
      ),
    },
    {
      key: 'Station_Name',
      title: 'ایستگاه متصل',
      width: '30%',
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-slate-100">{item.Station_Name || '-'}</span>
          {item.station_custom && (
            <span className="text-[11px] text-amber-400 font-normal">
              نام سفارشی: {item.station_custom}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'station_code',
      title: 'کد ایستگاه',
      width: '15%',
      render: (item) => (
        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          {toPersianDigits(item.station_code)}
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
            width: '15%',
            render: (item: DeviceItem) => (
              <div className="flex items-center justify-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 hover:text-sky-200 border border-sky-500/30 transition-all font-medium text-xs shadow-sm"
                  title="ویرایش نمایشگر در پنجره پاپ‌آپ"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>ویرایش</span>
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 border border-rose-500/30 transition-all font-medium text-xs shadow-sm"
                  title="حذف نمایشگر"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف</span>
                </button>
              </div>
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
            مدیریت نمایشگرها و تابلوهای متصل
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            پایش و اتصال دستگاه‌های نمایشگر به ایستگاه‌های ناوگان شهری
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadData}
            isLoading={isLoading}
            className="gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>بروزرسانی</span>
          </Button>

          {isAdmin && (
            <Button
              size="sm"
              onClick={handleOpenAdd}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت نمایشگر جدید (فرم پاپ‌آپ)</span>
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

      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs shadow-sm">
        <Monitor className="w-4 h-4 text-indigo-400 flex-shrink-0" />
        <span>
          <b>راهنمای نمایشگرها:</b> جهت ثبت نمایشگر جدید از دکمه سبز‌رنگ بالای صفحه استفاده فرمایید؛ و جهت ویرایش هر نمایشگر، روی دکمه آبی‌رنگ <b>«ویرایش»</b> در سطر همان نمایشگر کلیک فرمایید تا فرم پاپ‌آپ باز شود.
        </span>
      </div>

      <DataTable
        title="فهرست نمایشگرهای فعال"
        subtitle={`مجموع ${toPersianDigits(filteredData.length)} نمایشگر تعریف‌شده`}
        columns={columns}
        data={filteredData}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        searchPlaceholder="جستجو در تمام فیلدها..."
        exportFileName="tehran-devices"
        pageSize={20}
        headerFilterBar={
          <div className="w-full bg-slate-950/80 border-b border-indigo-500/20 p-3.5 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 pl-2">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold text-[11px] flex items-center gap-1.5 shadow-sm">
                <Search className="w-3.5 h-3.5 text-indigo-400" />
                <span>پالایش و فیلتر لحظه‌ای جدول</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              {/* IMEI Filter */}
              <div className="flex items-center gap-1.5 min-w-[140px]">
                <span className="text-slate-400 text-[11px] whitespace-nowrap">کد IMEI:</span>
                <div className="relative w-full">
                  <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={filters.imei || ''}
                    onChange={(e) => setFilters((prev) => ({ ...prev, imei: e.target.value }))}
                    placeholder="جستجو..."
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pr-8 pl-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dir-ltr"
                  />
                </div>
              </div>

              {/* IP Filter */}
              <div className="flex items-center gap-1.5 min-w-[130px]">
                <span className="text-slate-400 text-[11px] whitespace-nowrap">آدرس IP:</span>
                <div className="relative w-full">
                  <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={filters.ip || ''}
                    onChange={(e) => setFilters((prev) => ({ ...prev, ip: e.target.value }))}
                    placeholder="جستجو..."
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pr-8 pl-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dir-ltr"
                  />
                </div>
              </div>

              {/* Station Filter from Station Table (Combobox) */}
              <div className="flex items-center gap-1.5 min-w-[240px] flex-1 max-w-sm">
                <span className="text-slate-400 text-[11px] whitespace-nowrap">انتخاب ایستگاه:</span>
                <div className="w-full">
                  <SearchableSelect
                    options={filterStationOptions}
                    value={filters.station_code || ''}
                    onChange={(val) => setFilters((prev) => ({ ...prev, station_code: String(val) }))}
                    placeholder="جستجو و انتخاب از جدول ایستگاه‌ها..."
                    searchPlaceholder="جستجوی نام، دلخواه یا کد ایستگاه..."
                  />
                </div>
              </div>

              {/* Free Text Station Search (Name / Custom / Code) */}
              <div className="flex items-center gap-1.5 min-w-[160px]">
                <span className="text-slate-400 text-[11px] whitespace-nowrap">جستجوی متنی:</span>
                <div className="relative w-full">
                  <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={filters.station_text || ''}
                    onChange={(e) => setFilters((prev) => ({ ...prev, station_text: e.target.value }))}
                    placeholder="نام، دلخواه یا کد..."
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pr-8 pl-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setFilters({})}
              title="بازنشانی فیلترها"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-indigo-400" />
              <span>بازنشانی</span>
            </button>
          </div>
        }
      />

      {/* Add / Edit Device Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Monitor className="w-4 h-4 text-brand-400" />
                <span>{editingDevice ? 'ویرایش اطلاعات نمایشگر' : 'ثبت نمایشگر جدید'}</span>
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

            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="کد IMEI (الزاماً ۱۵ رقم)"
                placeholder="مثال: 862415051234567"
                value={formImei}
                onChange={(e) => setFormImei(toEnglishDigits(e.target.value).replace(/\D/g, '').slice(0, 15))}
                autoFocus
                required
              />

              <Input
                label="آدرس IP دستگاه (اختیاری)"
                placeholder="مثال: 192.168.1.100"
                value={formIp}
                onChange={(e) => setFormIp(toEnglishDigits(e.target.value))}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  انتخاب ایستگاه (کامبوباکس جستجوپذیر)
                </label>
                <SearchableSelect
                  options={stationOptions}
                  value={formStationCode}
                  onChange={(val) => setFormStationCode(val)}
                  placeholder="جستجو و انتخاب ایستگاه..."
                  searchPlaceholder="کد یا نام ایستگاه را جستجو کنید..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                  انصراف
                </Button>
                <Button size="sm" type="submit" isLoading={isSaving} className="gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>ذخیره نمایشگر</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
