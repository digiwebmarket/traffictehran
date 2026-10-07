# -*- coding: utf-8 -*-
"""
Unified Live Deployment Script for Tehran Transit Monitoring Dashboard
Deploys:
1. Backend WordPress Plugin: backend/citibig-transit-dashboard -> /public_html/tehran/wp-content/plugins/citibig-transit-dashboard/
2. Modern Next.js 15 Frontend: traffic-frontend/out -> /public_html/v2tehrandashboard/
"""

import os
import sys
import ftplib
import urllib.request
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = Path(__file__).resolve().parent

def load_env():
    env_file = BASE_DIR / 'Dump20260615' / '.env'
    config = {}
    if env_file.exists():
        with open(env_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    config[k.strip()] = v.strip()
    return config

def get_ftp(config):
    ftp = ftplib.FTP()
    ftp.connect(config['FTP_HOST'], int(config.get('FTP_PORT', 21)), timeout=30)
    ftp.login(config['FTP_USER'], config['FTP_PASS'])
    return ftp

def upload_dir(ftp, local_dir, remote_dir):
    local_dir = Path(local_dir)
    print(f"\n[FTP] Syncing directory: {local_dir} -> {remote_dir}")
    count = 0
    for root, dirs, files in os.walk(local_dir):
        rel = os.path.relpath(root, local_dir).replace('\\', '/')
        r_dest = remote_dir.rstrip('/') if rel == '.' else f"{remote_dir.rstrip('/')}/{rel}"
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
            with open(lp, 'rb') as fp:
                ftp.storbinary(f'STOR {rp}', fp)
            try:
                ftp.sendcmd(f'SITE CHMOD 644 {rp}')
            except Exception:
                pass
            count += 1
            if count % 20 == 0:
                print(f"  .. uploaded {count} files")
    print(f"[FTP] Completed: {count} files uploaded to {remote_dir}")

def deploy_backend(ftp, config):
    print("\n==========================================")
    print(" 🚀 DEPLOYING BACKEND (WORDPRESS PLUGIN)  ")
    print("==========================================")
    local_plugin = BASE_DIR / 'backend' / 'citibig-transit-dashboard'
    remote_plugin = config.get('FTP_REMOTE_PLUGIN', '/public_html/tehran/wp-content/plugins/citibig-transit-dashboard/')
    upload_dir(ftp, str(local_plugin), remote_plugin)
    print("✅ Backend WordPress Plugin deployed successfully!")

def deploy_frontend(ftp, config):
    print("\n==========================================")
    print(" 🚀 DEPLOYING FRONTEND (NEXT.JS 15 OUT)   ")
    print("==========================================")
    local_out = BASE_DIR / 'traffic-frontend' / 'out'
    if not local_out.exists():
        print(f"❌ Error: Build output directory not found at {local_out}. Run npm run build first.")
        sys.exit(1)
    remote_frontend = '/public_html/v2tehrandashboard'
    upload_dir(ftp, str(local_out), remote_frontend)

    # Ensure parent dirs have 755
    subdirs = [
        '/public_html/v2tehrandashboard',
        '/public_html/v2tehrandashboard/_next',
        '/public_html/v2tehrandashboard/_next/static',
        '/public_html/v2tehrandashboard/css',
        '/public_html/v2tehrandashboard/fonts',
        '/public_html/v2tehrandashboard/images',
        '/public_html/v2tehrandashboard/devices',
        '/public_html/v2tehrandashboard/eta',
        '/public_html/v2tehrandashboard/login',
        '/public_html/v2tehrandashboard/routes',
        '/public_html/v2tehrandashboard/stations',
        '/public_html/v2tehrandashboard/users',
    ]
    for p in subdirs:
        try:
            ftp.sendcmd(f'SITE CHMOD 755 {p}')
        except Exception:
            pass
    print("✅ Next.js Frontend deployed successfully with 755 directory permissions!")

def verify_live():
    print("\n==========================================")
    print(" 🔍 LIVE ENDPOINT VERIFICATION            ")
    print("==========================================")
    test_urls = [
        ("Frontend Dashboard", "http://dev.citibig.com/v2tehrandashboard/"),
        ("Login Page", "http://dev.citibig.com/v2tehrandashboard/login/"),
        ("Login Background Image", "http://dev.citibig.com/v2tehrandashboard/images/login-bg.jpg"),
        ("Devices Page", "http://dev.citibig.com/v2tehrandashboard/devices/"),
        ("Stations Page", "http://dev.citibig.com/v2tehrandashboard/stations/"),
        ("Backend REST API", "http://dev.citibig.com/tehran/wp-json/citibig/v1"),
        ("Backend PHP Bridge", "http://dev.citibig.com/v2tehrandashboard/citibig-bridge.php"),
    ]
    for label, url in test_urls:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            with urllib.request.urlopen(req, timeout=12) as resp:
                print(f"  [OK {resp.status}] {label}: {url}")
        except Exception as e:
            print(f"  [WARN] {label} ({url}): {e}")

if __name__ == '__main__':
    config = load_env()
    if not config.get('FTP_USER') or not config.get('FTP_PASS'):
        print("Error: Missing FTP credentials in Dump20260615/.env")
        sys.exit(1)

    target = sys.argv[1] if len(sys.argv) > 1 else 'all'
    print(f"Connecting to FTP {config['FTP_HOST']}...")
    ftp = get_ftp(config)
    print("Connected successfully.")

    try:
        if target in ('backend', 'all'):
            deploy_backend(ftp, config)
        if target in ('frontend', 'all'):
            deploy_frontend(ftp, config)
    finally:
        ftp.quit()

    verify_live()
