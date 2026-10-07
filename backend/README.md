# Citibig Transit Dashboard - WordPress Backend Plugin

این دایرکتوری شامل کدهای منبع پلاگین اختصاصی وردپرس برای سامانه مانیتورینگ ترافیک تهران است.

## ساختار و فایل‌ها
- `citibig-transit-dashboard.php`: فایل اصلی پلاگین و مقداردهی اولیه کامپوننت‌ها.
- `includes/class-citibig-api.php`: کنترلر کامل REST API با namespace اختصاصی `citibig/v1` (اندپوینت‌های داشبورد، خطوط، ایستگاه‌ها، ETA، دستگاه‌ها و مدیریت کاربران).
- `includes/class-citibig-db.php`: لایه ارتباطی با دیتابیس MySQL و اجرای کوئری‌ها.
- `includes/class-citibig-admin.php`: رابط تنظیمات و صفحات ادمین وردپرس.
- `includes/class-citibig-shortcode.php`: مدیریت شورت‌کدها در وردپرس.
- `includes/class-citibig-assets.php`: لود دارایی‌های موردنیاز پلاگین.
- `assets/`: استایل‌ها و اسکریپت‌های مربوط به نقشه، فونت ایران‌سنس و چارت‌ها.

## دیپلوی به سرور
برای استقرار خودکار این پلاگین به سرور وردپرس، اسکریپت `Dump20260615/deploy.py` از طریق تابع `deploy_plugin` این پوشه را مستقیماً به مسیر پلاگین‌های سرور FTP آپلود می‌کند.
