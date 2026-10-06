export type UserRole = 'admin' | 'supervisor' | 'operator';

export interface UserSession {
  token: string;
  role: UserRole;
  username: string;
}

const TOKEN_KEY = 'citibig_token';
const ROLE_KEY = 'citibig_role';
const USERNAME_KEY = 'citibig_username';

export function getStoredSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const role = (localStorage.getItem(ROLE_KEY) || 'operator') as UserRole;
  const username = localStorage.getItem(USERNAME_KEY) || 'کاربر';
  if (!token) return null;
  return { token, role, username };
}

export function saveSession(token: string, role: UserRole, username: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(USERNAME_KEY, username);
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

export function isOperator(role?: UserRole | string): boolean {
  return role === 'operator';
}

export function canManageDevicesOrUsers(role?: UserRole | string): boolean {
  return role === 'admin' || role === 'supervisor';
}
