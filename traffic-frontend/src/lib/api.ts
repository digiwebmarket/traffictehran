import { getStoredSession } from './auth';

const DEFAULT_BRIDGE_URL = typeof window !== 'undefined' && window.location.hostname === 'dev.citibig.com'
  ? './citibig-bridge.php'
  : 'https://dev.citibig.com/tehrandashboard/citibig-bridge.php';

const BRIDGE_URL = process.env.NEXT_PUBLIC_BRIDGE_URL || DEFAULT_BRIDGE_URL;
const API_PATH = '/wp-json/citibig/v1';

export function getApiUrl(endpoint: string): string {
  return `${BRIDGE_URL}?path=${encodeURIComponent(API_PATH + endpoint)}`;
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const session = getStoredSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (session?.token) {
    headers['X-Citibig-Token'] = session.token;
  }

  const url = getApiUrl(endpoint);
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMsg = isJson ? (data.message || data.error || 'خطای سرور') : 'پاسخ نامعتبر از سرور دریافت شد.';
    throw new Error(errorMsg);
  }

  return data as T;
}

// 1. Auth API
export async function apiLogin(username: string, password: string) {
  return request('/auth', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// 2. Charts & Dashboard Summary
export interface DashboardChartsData {
  summary: {
    stations: number;
    routes: number;
    devices: number;
    eta_records: number;
  };
  colors: {
    labels: string[];
    values: number[];
  };
  routes: {
    labels: string[];
    values: number[];
  };
  bus_types: {
    labels: string[];
    values: number[];
  };
  live_eta: Array<{
    id?: number;
    Line: string;
    Station_Name: string;
    ETA: string;
    Time?: string;
  }>;
  stations_map: Array<{
    code: string | number;
    name: string;
    custom_name?: string;
    lat: number;
    lng: number;
  }>;
  display_toggles?: {
    show_devices_section?: boolean;
    show_users_section?: boolean;
    [key: string]: any;
  };
}

export async function apiGetCharts(): Promise<DashboardChartsData> {
  return request<DashboardChartsData>('/charts', { method: 'GET' });
}

// 3. Stations API
export interface StationItem {
  code: string | number;
  Station_Name: string;
  station_custom?: string | null;
  Color?: string;
  [key: string]: any;
}

export async function apiGetStations(): Promise<StationItem[]> {
  const res = await request('/stations', { method: 'GET' });
  return Array.isArray(res) ? res : (res.data || []);
}

export async function apiUpdateStationCustom(code: string | number, station_custom: string) {
  return request('/stations/custom-name', {
    method: 'PUT',
    body: JSON.stringify({ code, station_custom }),
  });
}

// 4. Routes API
export interface RouteItem {
  code: string | number;
  Terminal1: string;
  Terminal2: string;
  Terminal1_custom?: string | null;
  Terminal2_custom?: string | null;
  [key: string]: any;
}

export async function apiGetRoutes(): Promise<RouteItem[]> {
  const res = await request('/routes', { method: 'GET' });
  return Array.isArray(res) ? res : (res.data || []);
}

export async function apiUpdateRouteCustom(code: string | number, terminal1_custom: string, terminal2_custom: string) {
  return request('/routes/custom-name', {
    method: 'PUT',
    body: JSON.stringify({ code, terminal1_custom, terminal2_custom }),
  });
}

// 5. Devices API
export interface DeviceItem {
  id: number;
  imei: string;
  ip?: string;
  station_code: string | number;
  Station_Name?: string;
  created_at?: string;
}

export async function apiGetDevices(): Promise<DeviceItem[]> {
  const res = await request('/devices', { method: 'GET' });
  return Array.isArray(res) ? res : (res.data || []);
}

export async function apiSaveDevice(payload: { id?: number; imei: string; ip?: string; station_code: string | number }) {
  if (payload.id) {
    return request(`/devices/${payload.id}`, {
      method: 'PUT',
      body: JSON.stringify({ imei: payload.imei, ip: payload.ip, station_code: payload.station_code }),
    });
  }
  return request('/devices', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteDevice(id: number) {
  return request(`/devices/${id}`, { method: 'DELETE' });
}

// 6. Users API
export interface UserItem {
  id?: number;
  username: string;
  role: string;
  registered?: string;
}

export async function apiGetUsers(): Promise<UserItem[]> {
  const res = await request('/users', { method: 'GET' });
  return Array.isArray(res) ? res : (res.data || []);
}

export async function apiCreateUser(payload: { username: string; password?: string; role: string }) {
  return request('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteUser(username: string) {
  return request(`/users/${encodeURIComponent(username)}`, { method: 'DELETE' });
}
