import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPersianDigits(str: string | number | null | undefined): string {
  if (str === null || str === undefined) return '';
  const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.toString().replace(/[0-9]/g, (w) => id[+w]);
}

export function toEnglishDigits(str: string | number | null | undefined): string {
  if (str === null || str === undefined) return '';
  const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let result = str.toString();
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(faDigits[i], 'g'), i.toString());
    result = result.replace(new RegExp(arDigits[i], 'g'), i.toString());
  }
  return result;
}

export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '-';
  const num = Number(toEnglishDigits(value));
  if (isNaN(num)) return String(value);
  return toPersianDigits(num.toLocaleString('fa-IR'));
}
