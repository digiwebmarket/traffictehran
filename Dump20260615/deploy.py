"""
Citibig Transit Dashboard - Automated Deployment Script
Deploy local frontend or plugin files to the remote FTP server.
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
    env_file = BASE_DIR / '.env'
    config = {}
    if env_file.exists():
        with open(env_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    config[k.strip()] = v.strip()
    return config

def get_ftp_connection(config):
    ftp = ftplib.FTP()
    ftp.connect(config['FTP_HOST'], int(config.get('FTP_PORT', 21)), timeout=30)
    ftp.login(config['FTP_USER'], config['FTP_PASS'])
    return ftp

def upload_file(ftp, local_path, remote_path):
    rel = os.path.basename(local_path)
    print(f"Uploading: {rel} -> {remote_path}")
    with open(local_path, 'rb') as f:
        ftp.storbinary(f'STOR {remote_path}', f)

def upload_directory(ftp, local_dir, remote_dir):
    for root, dirs, files in os.walk(local_dir):
        rel_path = os.path.relpath(root, local_dir).replace('\\', '/')
        current_remote = remote_dir.rstrip('/') if rel_path == '.' else f"{remote_dir.rstrip('/')}/{rel_path}"
        try:
            ftp.mkd(current_remote)
        except Exception:
            pass
        for file in files:
            if file.endswith('.zip'):
                continue
            lp = os.path.join(root, file)
            rp = f"{current_remote}/{file}"
            upload_file(ftp, lp, rp)

def deploy_frontend(ftp, config):
    print("\n--- Deploying Frontend (Remote App) ---")
    local_frontend = BASE_DIR / 'citibig-remote-app'
    remote_frontend = config['FTP_REMOTE_FRONTEND']
    upload_directory(ftp, str(local_frontend), remote_frontend)
    print("Frontend deployed successfully.")

def deploy_plugin(ftp, config):
    print("\n--- Deploying WordPress Plugin ---")
    local_plugin = BASE_DIR / 'citibig-transit-dashboard'
    remote_plugin = config['FTP_REMOTE_PLUGIN']
    upload_directory(ftp, str(local_plugin), remote_plugin)
    print("Plugin deployed successfully.")

def test_live():
    print("\n--- Verifying Live Endpoints ---")
    urls = [
        "http://dev.citibig.com/tehrandashboard/",
        "http://dev.citibig.com/tehran/wp-json/citibig/v1"
    ]
    for url in urls:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as resp:
                print(f"[OK {resp.status}] {url}")
        except Exception as e:
            print(f"[WARN] Failed to fetch {url}: {e}")

if __name__ == '__main__':
    config = load_env()
    if not config.get('FTP_USER') or not config.get('FTP_PASS'):
        print("Error: Missing FTP credentials in .env")
        sys.exit(1)

    target = sys.argv[1] if len(sys.argv) > 1 else 'test'

    print(f"Connecting to {config['FTP_HOST']} as {config['FTP_USER']}...")
    ftp = get_ftp_connection(config)
    print("Connected.")

    try:
        if target == 'frontend':
            deploy_frontend(ftp, config)
        elif target == 'plugin':
            deploy_plugin(ftp, config)
        elif target == 'all':
            deploy_frontend(ftp, config)
            deploy_plugin(ftp, config)
        elif target == 'test':
            print("FTP Connection test passed! Available target commands: frontend, plugin, all")
    finally:
        ftp.quit()

    if target in ('frontend', 'plugin', 'all'):
        test_live()
