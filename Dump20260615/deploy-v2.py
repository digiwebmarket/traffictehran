import os
import sys
import ftplib
from pathlib import Path
from deploy import load_env, get_ftp_connection

config = load_env()
ftp = get_ftp_connection(config)
remote_base = '/public_html/v2tehrandashboard'
local_base = Path('D:/VpsAntigravity/ترافیک تهران/traffic-frontend/out')

print(f"Deploying {local_base} -> {remote_base}...")

def upload_dir(local_dir, remote_dir):
    for root, dirs, files in os.walk(local_dir):
        rel = os.path.relpath(root, local_dir).replace('\\', '/')
        r_dest = remote_dir if rel == '.' else f"{remote_dir}/{rel}"
        try:
            ftp.mkd(r_dest)
        except Exception:
            pass
        try:
            ftp.sendcmd(f'SITE CHMOD 755 {r_dest}')
        except Exception:
            pass
        for f in files:
            lp = os.path.join(root, f)
            rp = f"{r_dest}/{f}".replace('\\', '/')
            print(f"Uploading: {f} -> {rp}")
            with open(lp, 'rb') as fp:
                ftp.storbinary(f'STOR {rp}', fp)
            try:
                ftp.sendcmd(f'SITE CHMOD 644 {rp}')
            except Exception:
                pass

upload_dir(str(local_base), remote_base)

# Ensure all parent dirs in _next are 755
for path in [
    '/public_html/v2tehrandashboard',
    '/public_html/v2tehrandashboard/_next',
    '/public_html/v2tehrandashboard/_next/static',
    '/public_html/v2tehrandashboard/_next/static/chunks',
    '/public_html/v2tehrandashboard/_next/static/chunks/app',
    '/public_html/v2tehrandashboard/_next/static/chunks/app/(dashboard)',
    '/public_html/v2tehrandashboard/_next/static/css',
    '/public_html/v2tehrandashboard/css',
    '/public_html/v2tehrandashboard/css/images',
    '/public_html/v2tehrandashboard/js',
    '/public_html/v2tehrandashboard/fonts',
    '/public_html/v2tehrandashboard/images',
    '/public_html/v2tehrandashboard/devices',
    '/public_html/v2tehrandashboard/eta',
    '/public_html/v2tehrandashboard/login',
    '/public_html/v2tehrandashboard/routes',
    '/public_html/v2tehrandashboard/stations',
    '/public_html/v2tehrandashboard/users',
]:
    try:
        ftp.sendcmd(f'SITE CHMOD 755 {path}')
    except Exception:
        pass

print("Deployment complete and 755 permissions set on all directories!")
ftp.quit()
