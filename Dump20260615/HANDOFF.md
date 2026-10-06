# Citibig Transit Dashboard - Handoff Document

## Project Context
The project is a transit management system split into a WordPress backend (which exposes REST APIs) and a decoupled vanilla HTML/JS/CSS frontend (the remote app). The backend accesses a custom remote MySQL database (`Citibig_Transit_DB`).

### Key Directories
- Workspace: `d:\Antigravity\Dump20260615\Dump20260615`
- Frontend UI: `citibig-remote-app/index.html`
- Backend API logic: `citibig-transit-dashboard/includes/class-citibig-api.php`
- Backend DB interactions: `citibig-transit-dashboard/includes/class-citibig-db.php`

### Remote Hosting & Deployment Infrastructure (Verified via FTP)
- **Host / IP:** `89.39.208.183` (Port 21, Pure-FTPd TLS)
- **Domain:** `dev.citibig.com` (Note: `ftp.dev.citibig.com` has no DNS record, connect via IP)
- **FTP User:** `dlacmems`
- **WordPress Root Directory:** `/public_html/tehran/`
  - Admin URL: `http://dev.citibig.com/tehran/wp-admin/`
  - Active Plugin Path: `/public_html/tehran/wp-content/plugins/citibig-transit-dashboard/`
- **Remote App Frontend Directory:** `/public_html/tehrandashboard/`
  - Web URL: `http://dev.citibig.com/tehrandashboard/`
  - Core files on host: `index.html`, `citibig-bridge.php`, `assets/`, `citibig-remote-app.zip`
- **Remote Transit Database (Connected via WordPress Plugin Settings):**
  - Host / IP: `2.144.22.6`
  - Port: `5010`
  - Database Name: `tahatehran_new`
  - DB User: `root`

## What Was Accomplished in the Current Session
The user requested the ability to edit custom names for **Stations** (`station.station_custom`) and **Routes** (`Route.Terminal1_custom`, `Route.Terminal2_custom`) directly from the frontend, mirroring the existing user/device management style, while strictly preventing edits to other sensitive DB columns.

1. **Backend Integration:**
   - Added `get_all_stations` and `get_all_routes` methods to the Database class.
   - Registered `GET` and `PUT` endpoints for `/stations`, `/routes`, and their custom field modifications.
2. **Frontend UI/UX:**
   - Appended UI sections (`#sec-stations` and `#sec-routes`) to `index.html`.
   - Included data tables with dynamically bound list views and an update form.
   - Wrote Vanilla JS fetch calls ensuring token-based authentication headers are passed along with JSON payloads.
3. **Bug Fixing & Diagnostics:**
   - Diagnosed and resolved an `Uncaught SyntaxError` (expected expression, got '}') in `citibig-remote-app/index.html` caused by a duplicate code snippet with an unmatched closing brace.
   - Verified the outbound network port and SQL handshake database checks are 100% successful on the dashboard diagnostics panel.
   - Packaged and synchronized the updated zip archives (`citibig-remote-app.zip` and `citibig-transit-dashboard.zip`).
4. **Version Control:**
   - We initialized Git in the workspace, added `safe.directory` rules, committed the updates, and confirmed the repository is clean.
5. **Device IP Column Integration & Live Deployment:**
   - Added support for `ip` column in `device_station_mapping` table across backend DB queries (`class-citibig-db.php`) and REST API endpoints (`class-citibig-api.php`).
   - Added `آدرس IP` column in table and form field in `citibig-remote-app/index.html` and WordPress shortcode (`class-citibig-shortcode.php`).
   - Backed up remote files and deployed exclusively to `/public_html/tehran/wp-content/plugins/citibig-transit-dashboard/` and `/public_html/tehrandashboard/index.html`.
   - Verified live site (HTTP 200) and updated zip packages.
6. **Dynamic Database Tables Discovery:**
   - Updated `Citibig_Transit_DB::get_db_status()` to execute `SHOW TABLES` dynamically instead of a hardcoded list, automatically discovering and showing all database tables (including newly added `ip_whitelist`) in the WordPress admin status board.
   - Synchronized SQL dumps (`tahatehran_new_ip_whitelist.sql` and `tahatehran_new_device_station_mapping.sql`) from `Dump20260923`.
7. **Universal Interactive Column Sorting Across All Tables:**
   - Added interactive click-to-sort functionality for all table headers across all 5 dashboard tables (`#etaTable`, `#stationsTable`, `#routesTable`, `#devicesTable`, `#usersTable`).
   - Integrated Persian and Arabic digit normalization (`toEnglishDigits`) for proper numeric comparison.
   - Natural alphanumeric and IP address sorting (`localeCompare('fa', { numeric: true })`).
   - Added automatic sort re-application (`reapplyTableSort`) so that asynchronous data refreshes retain the user's active sort order.
   - Visual indicators (`fa-sort`, `fa-sort-up`, `fa-sort-down`) with hover states and exclusion of the action ("عملیات") column.
   - Deployed and verified live at `http://dev.citibig.com/tehrandashboard/` (HTTP 200 OK, 90,965 bytes).
8. **Universal Dedicated Filter Toolbars Above All 5 Tables (Model 1):**
   - Added responsive, field-specific filter toolbars (`.table-filter-bar`) above all 5 tables (`#etaTable`, `#stationsTable`, `#routesTable`, `#devicesTable`, `#usersTable`).
   - Fields covered:
     - ETA: Station Name, Route Code, ETA Arrival Time.
     - Stations: Station Code, Station Name, Station Custom Name.
     - Routes: Route Code, Origin (main/custom), Destination (main/custom).
     - Devices: IMEI Code, IP Address, Station Name, Station Code.
     - Users: Username, Role selector (Dropdown: All, Admin, Supervisor, Operator).
   - Real-time multi-field AND filtering with Persian/Arabic digit normalization (`toEnglishDigits`).
   - Reset button on each toolbar for one-click clearing.
   - Preserves filtering across data reloads and integrates seamlessly with column sorting.
   - Deployed and verified live at `http://dev.citibig.com/tehrandashboard/` (HTTP 200 OK, 104,440 bytes).
9. **Fix Sticky Header Overlapping Filter Bar on Table Scroll:**
   - **Root Cause:** `.table-wrapper` had `overflow-x: auto` but lacked `overflow-y: auto`, causing vertical scrolling to happen on the entire window/viewport rather than strictly within the container. Consequently, `position: sticky; top: 0` on `th` pinned headers to the viewport top, spilling over `.table-filter-bar`.
   - **Resolution:**
     - Added `overflow-y: auto` to `.table-wrapper` so vertical scroll is contained inside the table container.
     - Changed `thead th` background from semi-transparent `rgba(255, 255, 255, 0.02)` to solid `#0b0f1e` (and `#f1f5f9` for light theme) so lower table rows do not show through when scrolling.
     - Visually merged `.table-filter-bar` and `.table-wrapper` into a unified block (`border-radius: var(--radius-md) var(--radius-md) 0 0` on filter bar, `border-bottom: none`, and `border-radius: 0 0 var(--radius-md) var(--radius-md)` on table-wrapper).
      - Deployed and verified live at `http://dev.citibig.com/tehrandashboard/` (HTTP 200 OK, 106,803 bytes).
10. **Station Dropdown Selection & Duplicate Assignment Prevention:**
    - **Client Requirement:** In device/station mapping, ensure invalid station codes cannot be entered by populating from the `Station` table, and strictly prevent duplicate station assignments.
    - **Backend Validation (`class-citibig-db.php` & `class-citibig-shortcode.php`):**
      - In `insert_device_mapping` & `update_device_mapping`: added SQL verification to ensure `station_code` exists in table `Station`.
      - Added check ensuring `station_code` is not already assigned to another device in `device_station_mapping` (unique constraint enforcement).
      - Updated WordPress shortcode form to render a `<select>` dropdown populated dynamically with stations from `Citibig_Transit_DB::get_all_stations()`.
    - **Frontend Dynamic Dropdown (`citibig-remote-app/index.html`):**
      - Replaced free-text input with `<select id="deviceStation">`.
      - Added `populateDeviceStationsDropdown()` dynamically loaded from `/stations` API (`window.allStationsList`).
      - Disabled and tagged already-assigned stations in the dropdown (`[اختصاص‌یافته به نمایشگر دیگر]`), while preserving selection for the currently edited device.
      - Added client-side pre-submission validation preventing submission of non-existent or duplicate stations.
    - **Deployment & Packaging:**
      - Created automated deployment pipeline `deploy.py` connecting via pure FTP to `89.39.208.183`.
      - Repackaged `citibig-remote-app.zip` and `citibig-transit-dashboard.zip`.
      - Deployed both frontend and WordPress plugin to production host.
      - Verified live site (HTTP 200, 108,180 bytes).
10. **Searchable Combobox & 3 Strict Validations (IMEI 15 digits, Station existence, IPv4/IPv6 Regex):**
    - **Searchable Combobox (`citibig-remote-app/index.html`):**
      - Replaced native `<select>` with a custom floating searchable Combobox (`#stationSearchInput`, `#stationDropdownList`, `#stationClearBtn`).
      - Completely resolved the broken SVG background repeating arrow visual defect.
      - Allowed real-time search by station numeric code or Persian/English station name.
    - **Strict IMEI Validation:**
      - Exactly 15 digits required (`/^\d{15}$/`).
      - Real-time client-side digit normalization (converting Persian/Arabic numbers to English) and restricting input to 15 digits.
      - Backend validation with `preg_match('/^\d{15}$/', $imei)` rejecting any invalid input.
    - **Strict Station Existence & Uniqueness:**
      - Enforced existence in table `Station` on both client (against `window.allStationsList`) and server (`SELECT code FROM Station WHERE code = ?`).
      - Prevented assigning the same station to multiple devices.
    - **Strict IP Regex Validation:**
      - Client-side `isValidIpAddress` supporting IPv4 and IPv6 syntax.
      - Server-side `filter_var(..., FILTER_VALIDATE_IP)` combined with comprehensive IPv4/IPv6 regex checks.
    - **Live Deployment & Verification:**
      - Deployed to `http://dev.citibig.com/tehrandashboard/` and verified REST endpoints.
      - Updated git commits and zip archives.
11. **Operator Access Restrictions (User & Device Management Hidden):**
    - **Frontend Access Layer (`citibig-remote-app/index.html`):**
      - For `role === 'operator'`, hid both `#navDevicesTab` (sidebar link) and `#sec-devices` (table section) using `style.display = 'none'` and `.hidden`.
      - Ensured `#navUsersTab` and `#sec-users` remain completely hidden for `operator`.
      - Suppressed network calls `fetchDevicesData` and `fetchUsersData` when user is logged in as an operator.
      - Added automatic hash redirection to `#sec-overview` if an operator attempts to navigate directly to `#sec-devices` or `#sec-users`.
      - Updated `applyDisplayToggles` to never reveal device management to operator even if enabled in WP admin toggles.
    - **Backend API Layer (`class-citibig-api.php`):**
      - Added `check_devices_view_auth` permission callback on `GET /devices` endpoint, strictly restricting device list retrieval to `admin` and `supervisor`. Operator requests receive `403 Forbidden`.
    - **Deployment & Sync:**
      - Successfully deployed to `http://dev.citibig.com/tehrandashboard/` (HTTP 200).
      - Repackaged zip archives and committed changes to Git.

## References
For deep-dives into the thought process, tasks, and walkthroughs of this session, refer to the artifacts generated during this conversation:
- **Implementation Plan:** `C:\Users\Administrator\.gemini\antigravity\brain\cca3f95e-29aa-4531-bb40-9edbf91346f7\implementation_plan.md`
- **Walkthrough/Changelog:** `C:\Users\Administrator\.gemini\antigravity\brain\cca3f95e-29aa-4531-bb40-9edbf91346f7\walkthrough.md`
- **Git Commit:** Review the most recent commits (`git log --oneline`).

## Suggested Skills for the Next Agent
To continue working on this project effectively, consider using the following skills if requested by the user:
- `graphify-windows`: If you need to quickly map out the architecture, DB schema, or file relationships.
- `git-safety-workflow`: To ensure all subsequent modifications are cleanly versioned.
- `frontend` or `taste`: If further visual polishing or UI additions are requested on `index.html`.

