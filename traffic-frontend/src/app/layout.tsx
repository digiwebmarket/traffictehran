import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'داشبورد هوشمند ترافیک تهران | سیتی‌بیگ',
  description: 'سامانه پایش هوشمند ایستگاه‌ها، خطوط، نمایشگرها و تخمین زمان رسیدن (ETA) ترافیک تهران',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <head>
        <link rel="stylesheet" href="/v2tehrandashboard/css/leaflet.css" />
      </head>
      <body className="min-h-screen bg-[#070913] text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
