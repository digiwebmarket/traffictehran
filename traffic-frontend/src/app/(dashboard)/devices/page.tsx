'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Monitor, Plus, Edit3, Trash2, RefreshCw, AlertCircle, Check, X } from 'lucide-react';
import { apiGetDevices, apiGetStations, apiSaveDevice, apiDeleteDevice, DeviceItem, StationItem } from '@/lib/api';
import { getStoredSession } from '@/lib/auth';
import { DataTable, Column } from '@/components/ui/DataTable';
import { AdvancedFilterBar, FilterField } from '@/components/ui/AdvancedFilterBar';
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

  const filterFields: FilterField[] = [
    { id: 'imei', label: 'کد IMEI', placeholder: 'فیلتر کد IMEI...' },
    { id: 'ip', label: 'آدرس IP', placeholder: 'فیلتر آدرس IP...' },
    { id: 'station_name', label: 'نام ایستگاه', placeholder: 'فیلتر نام ایستگاه...' },
    { id: 'station_code', label: 'کد ایستگاه', placeholder: 'فیلتر شماره ایستگاه...' },
  ];

  const filteredData = useMemo(() => {
    return devices.filter((dev) => {
      if (filters.imei) {
        const normFilter = toEnglishDigits(filters.imei.toLowerCase().trim());
        const normVal = toEnglishDigits(String(dev.imei).toLowerCase());
        if (!normVal.includes(normFilter)) return false;
      }
      if (filters.ip) {
        const normFilter = toEnglishDigits(filters.ip.toLowerCase().trim());
        const normVal = toEnglishDigits(String(dev.ip || '').toLowerCase());
        if (!normVal.includes(normFilter)) return false;
      }
      if (filters.station_name) {
        const normFilter = toEnglishDigits(filters.station_name.toLowerCase().trim());
        const normVal = toEnglishDigits((dev.Station_Name || '').toLowerCase());
        if (!normVal.includes(normFilter)) return false;
      }
      if (filters.station_code) {
        const normFilter = toEnglishDigits(filters.station_code.toLowerCase().trim());
        const normVal = toEnglishDigits(String(dev.station_code).toLowerCase());
        if (!normVal.includes(normFilter)) return false;
      }
      return true;
    });
  }, [devices, filters]);

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
      title: 'نام ایستگاه متصل',
      width: '30%',
      render: (item) => (
        <span className="font-semibold text-slate-100">{item.Station_Name || '-'}</span>
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
            width: '10%',
            render: (item: DeviceItem) => (
              <div className="flex items-center justify-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-brand-500/20 border border-slate-700 transition-colors"
                  title="ویرایش نمایشگر"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:text-white hover:bg-rose-500/20 border border-slate-700 transition-colors"
                  title="حذف نمایشگر"
                >
                  <Trash2 className="w-3.5 h-3.5" />
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
            <Button size="sm" onClick={handleOpenAdd} className="gap-1.5">
              <Plus className="w-4 h-4" />
              <span>ثبت نمایشگر جدید</span>
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
          <AdvancedFilterBar
            fields={filterFields}
            onFilterChange={setFilters}
            onReset={() => setFilters({})}
          />
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
