<?php
/**
 * Class to handle remote database connection and queries using native PHP mysqli.
 * This prevents WordPress from triggering its global wp_die() database error page.
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Citibig_Transit_DB {

    private static $connection = null;

    /**
     * Get the native mysqli database connection.
     * 
     * @return mysqli|null
     */
    public static function get_connection() {
        if ( self::$connection !== null ) {
            return self::$connection;
        }

        $host = get_option( 'citibig_transit_db_host', '' );
        $port = get_option( 'citibig_transit_db_port', '3306' );
        $name = get_option( 'citibig_transit_db_name', '' );
        $user = get_option( 'citibig_transit_db_user', '' );
        $pass = get_option( 'citibig_transit_db_pass', '' );

        if ( empty( $host ) || empty( $name ) || empty( $user ) ) {
            return null;
        }

        // Disable mysqli throwing exceptions to handle errors gracefully
        mysqli_report( MYSQLI_REPORT_OFF );

        $link = mysqli_init();
        if ( ! $link ) {
            return null;
        }

        // Set connection timeout to 3 seconds to avoid freezing the site on firewall block
        mysqli_options( $link, MYSQLI_OPT_CONNECT_TIMEOUT, 3 );

        // Connect using suppress operator to avoid PHP warnings on screen
        $connected = @mysqli_real_connect( $link, $host, $user, $pass, $name, (int)$port );

        if ( ! $connected ) {
            return null;
        }

        mysqli_set_charset( $link, 'utf8mb4' );
        self::$connection = $link;
        return self::$connection;
    }

    /**
     * Get database table status and row counts.
     * 
     * @return array|false
     */
    public static function get_db_status() {
        $link = self::get_connection();
        if ( ! $link ) {
            return false;
        }

        // Dynamically discover all tables in the database
        $tables = [];
        $tables_res = @mysqli_query( $link, "SHOW TABLES" );
        if ( $tables_res ) {
            while ( $t_row = mysqli_fetch_row( $tables_res ) ) {
                if ( ! empty( $t_row[0] ) ) {
                    $tables[] = $t_row[0];
                }
            }
            mysqli_free_result( $tables_res );
        }

        // Fallback to default list if SHOW TABLES returned empty or restricted
        if ( empty( $tables ) ) {
            $tables = [
                'Color', 
                'History', 
                'Local', 
                'Route', 
                'Route_Station', 
                'Route_Status', 
                'Schedule', 
                'Station', 
                'Station_Status', 
                'code_eta',
                'device_station_mapping',
                'ip_whitelist'
            ];
        }

        $status = [];
        foreach ( $tables as $table ) {
            $clean_table = preg_replace( '/[^a-zA-Z0-9_]/', '', $table );
            $result = @mysqli_query( $link, "SELECT COUNT(*) FROM `{$clean_table}`" );
            if ( $result ) {
                $row = mysqli_fetch_row( $result );
                $status[$table] = isset( $row[0] ) ? $row[0] : 0;
                mysqli_free_result( $result );
            } else {
                $status[$table] = 'خطا یا عدم وجود جدول';
            }
        }
        return $status;
    }

    /**
     * Get KPI row counts for dashboard summary.
     */
    public static function get_kpi_counts() {
        $link = self::get_connection();
        if ( ! $link ) {
            return [
                'stations' => 0,
                'routes'   => 0,
                'locals'   => 0,
                'etas'     => 0
            ];
        }

        $kpis = [];
        
        $q_stations = @mysqli_query( $link, "SELECT COUNT(*) FROM `Station`" );
        $kpis['stations'] = $q_stations ? (int)mysqli_fetch_row( $q_stations )[0] : 0;

        $q_routes = @mysqli_query( $link, "SELECT COUNT(*) FROM `Route`" );
        $kpis['routes'] = $q_routes ? (int)mysqli_fetch_row( $q_routes )[0] : 0;

        $q_locals = @mysqli_query( $link, "SELECT COUNT(*) FROM `Local`" );
        $kpis['locals'] = $q_locals ? (int)mysqli_fetch_row( $q_locals )[0] : 0;

        $q_etas = @mysqli_query( $link, "SELECT COUNT(*) FROM `code_eta`" );
        $kpis['etas'] = $q_etas ? (int)mysqli_fetch_row( $q_etas )[0] : 0;

        return $kpis;
    }

    /**
     * Get color distribution statistics.
     */
    public static function get_color_stats() {
        $link = self::get_connection();
        if ( ! $link ) {
            return [];
        }

        $result = @mysqli_query( $link, "SELECT Color_Type, COUNT(*) as count FROM Color GROUP BY Color_Type" );
        $data = [];
        if ( $result ) {
            while ( $row = mysqli_fetch_assoc( $result ) ) {
                $data[] = $row;
            }
            mysqli_free_result( $result );
        }
        return $data;
    }

    /**
     * Get route station count statistics.
     */
    public static function get_route_station_stats() {
        $link = self::get_connection();
        if ( ! $link ) {
            return [];
        }

        $sql = "SELECT CONCAT('مسیر ', r.code) AS Route_Name, COUNT(rs.Route_Station_ID) as station_count 
                FROM Route r 
                LEFT JOIN Route_Station rs ON r.Route_UUID = rs.Route_UUID 
                GROUP BY r.Route_UUID, r.code 
                HAVING station_count > 0
                LIMIT 15";
                
        $result = @mysqli_query( $link, $sql );
        $data = [];
        if ( $result ) {
            while ( $row = mysqli_fetch_assoc( $result ) ) {
                $data[] = $row;
            }
            mysqli_free_result( $result );
        }
        return $data;
    }

    /**
     * Get bus type distribution statistics (BRT, Public, Private, Auxiliary).
     */
    public static function get_bus_type_stats() {
        $link = self::get_connection();
        if ( ! $link ) {
            return [];
        }

        $result = @mysqli_query( $link, "SELECT Bus_Type, COUNT(*) as count FROM Station GROUP BY Bus_Type" );
        $data = [];
        if ( $result ) {
            while ( $row = mysqli_fetch_assoc( $result ) ) {
                $data[] = $row;
            }
            mysqli_free_result( $result );
        }
        return $data;
    }

    /**
     * Get day/night shift distribution of stations.
     */
    public static function get_day_night_stats() {
        $link = self::get_connection();
        if ( ! $link ) {
            return [];
        }

        $result = @mysqli_query( $link, "SELECT `Type` as shift_type, COUNT(*) as count FROM Station GROUP BY `Type`" );
        $data = [];
        if ( $result ) {
            while ( $row = mysqli_fetch_assoc( $result ) ) {
                $data[] = $row;
            }
            mysqli_free_result( $result );
        }
        return $data;
    }

    /**
     * Get coordinates of stations for interactive mapping.
     */
    public static function get_station_coordinates() {
        $link = self::get_connection();
        if ( ! $link ) {
            return [];
        }

        $sql = "SELECT s.Station_Name, s.code, s.Bus_Type, s.Type as shift_type, l.Latitude, l.Longitude 
                FROM Station s 
                INNER JOIN Local l ON s.Local_ID = l.Local_UUID 
                LIMIT 350";
                
        $result = @mysqli_query( $link, $sql );
        $data = [];
        if ( $result ) {
            while ( $row = mysqli_fetch_assoc( $result ) ) {
                $row['Latitude'] = (float)$row['Latitude'];
                $row['Longitude'] = (float)$row['Longitude'];
                $data[] = $row;
            }
            mysqli_free_result( $result );
        }
        return $data;
    }

    /**
     * Get Live ETA data joined with Station names for tabular view.
     * 
     * @return array
     */
    public static function get_live_eta_data() {
        $link = self::get_connection();
        if ( ! $link ) {
            return [];
        }

        // Select columns and join Station on code to get human readable names
        $sql = "SELECT DISTINCT s.Station_Name, ce.code, ce.eta, ce.eta_minutes, ce.updated_at 
                FROM code_eta ce
                INNER JOIN Station s ON ce.code = s.code 
                ORDER BY ce.eta_minutes ASC, ce.eta ASC
                LIMIT 100";
                
        $result = @mysqli_query( $link, $sql );
        $data = [];
        if ( $result ) {
            while ( $row = mysqli_fetch_assoc( $result ) ) {
                $data[] = $row;
            }
            mysqli_free_result( $result );
        }
        return $data;
    }

    /**
     * Get peak traffic hours from History table.
     * Groups records by the hour of the day to find busiest times.
     *
     * @return array  Array of ['hour' => int, 'record_count' => int]
     */
    public static function get_peak_hours_stats() {
        $link = self::get_connection();
        if ( ! $link ) {
            return [];
        }

        // The datetime column in History is Editing_Time
        // Optimize by scanning only the latest 25,000 history rows using Primary Key index to avoid full table scan
        $sql = "SELECT 
                    HOUR(Editing_Time) AS hour_of_day,
                    COUNT(*) AS record_count
                FROM (
                    SELECT Editing_Time 
                    FROM History 
                    WHERE Editing_Time IS NOT NULL 
                    ORDER BY History_ID DESC 
                    LIMIT 25000
                ) AS sub
                GROUP BY HOUR(Editing_Time)
                ORDER BY hour_of_day ASC";

        $result = @mysqli_query( $link, $sql );
        $data = [];

        if ( $result && mysqli_num_rows( $result ) > 0 ) {
            while ( $row = mysqli_fetch_assoc( $result ) ) {
                $data[] = [
                    'hour'         => (int) $row['hour_of_day'],
                    'record_count' => (int) $row['record_count'],
                ];
            }
            mysqli_free_result( $result );
            return $data;
        }

        // Fallback: try column named `Created_At`
        $sql2 = "SELECT 
                    HOUR(Created_At) AS hour_of_day,
                    COUNT(*) AS record_count
                FROM (
                    SELECT Created_At 
                    FROM History 
                    WHERE Created_At IS NOT NULL 
                    ORDER BY History_ID DESC 
                    LIMIT 25000
                ) AS sub
                GROUP BY HOUR(Created_At)
                ORDER BY hour_of_day ASC";

        $result2 = @mysqli_query( $link, $sql2 );
        if ( $result2 && mysqli_num_rows( $result2 ) > 0 ) {
            while ( $row = mysqli_fetch_assoc( $result2 ) ) {
                $data[] = [
                    'hour'         => (int) $row['hour_of_day'],
                    'record_count' => (int) $row['record_count'],
                ];
            }
            mysqli_free_result( $result2 );
        }

        return $data;
    }

    /**
     * Get top stations with highest average estimated arrival/wait time from History table.
     * Joins History with Station to get human-readable names.
     *
     * @return array  Array of ['Station_Name' => string, 'avg_delay' => float, 'total_records' => int]
     */
    public static function get_top_delayed_stations() {
        $link = self::get_connection();
        if ( ! $link ) {
            return [];
        }

        // Query average eta_minutes from History table using latest 25,000 rows
        $sql = "SELECT 
                    IFNULL(s.Station_Name, CONCAT('ایستگاه کد ', h.code)) AS Station_Name,
                    ROUND(AVG(h.eta_minutes), 1)     AS avg_delay,
                    COUNT(h.eta_minutes)             AS total_records
                FROM (
                    SELECT code, eta_minutes 
                    FROM History 
                    WHERE eta_minutes IS NOT NULL AND eta_minutes > 0
                    ORDER BY History_ID DESC
                    LIMIT 25000
                ) h
                LEFT JOIN Station s ON h.code = s.code
                GROUP BY h.code, s.Station_Name
                ORDER BY avg_delay DESC
                LIMIT 10";

        $result = @mysqli_query( $link, $sql );
        $data = [];

        if ( $result && mysqli_num_rows( $result ) > 0 ) {
            while ( $row = mysqli_fetch_assoc( $result ) ) {
                $data[] = [
                    'Station_Name'  => $row['Station_Name'],
                    'avg_delay'     => (float) $row['avg_delay'],
                    'total_records' => (int)   $row['total_records'],
                ];
            }
            mysqli_free_result( $result );
            return $data;
        }

        // Fallback: try delay column
        $sql2 = "SELECT 
                    IFNULL(s.Station_Name, CONCAT('ایستگاه کد ', h.code)) AS Station_Name,
                    ROUND(AVG(h.delay), 1)           AS avg_delay,
                    COUNT(h.delay)                   AS total_records
                FROM (
                    SELECT code, delay 
                    FROM History 
                    WHERE delay IS NOT NULL AND delay > 0
                    ORDER BY History_ID DESC
                    LIMIT 25000
                ) h
                LEFT JOIN Station s ON h.code = s.code
                GROUP BY h.code, s.Station_Name
                ORDER BY avg_delay DESC
                LIMIT 10";

        $result2 = @mysqli_query( $link, $sql2 );
        if ( $result2 && mysqli_num_rows( $result2 ) > 0 ) {
            while ( $row = mysqli_fetch_assoc( $result2 ) ) {
                $data[] = [
                    'Station_Name'  => $row['Station_Name'],
                    'avg_delay'     => (float) $row['avg_delay'],
                    'total_records' => (int)   $row['total_records'],
                ];
            }
            mysqli_free_result( $result2 );
        }

        return $data;
    }

    /**
     * Get network health stats (Active vs Inactive stations and routes)
     */
    public static function get_network_health_stats() {
        $link = self::get_connection();
        if ( ! $link ) return ['stations' => [], 'routes' => []];

        $data = ['stations' => [], 'routes' => []];

        $sql1 = "SELECT Station_Activeness, COUNT(*) as count FROM Station_Status GROUP BY Station_Activeness";
        $res1 = @mysqli_query($link, $sql1);
        if ($res1) {
            while ($row = mysqli_fetch_assoc($res1)) {
                $data['stations'][] = $row;
            }
            mysqli_free_result($res1);
        }

        $sql2 = "SELECT Route_Activeness, COUNT(*) as count FROM Route_Status GROUP BY Route_Activeness";
        $res2 = @mysqli_query($link, $sql2);
        if ($res2) {
            while ($row = mysqli_fetch_assoc($res2)) {
                $data['routes'][] = $row;
            }
            mysqli_free_result($res2);
        }

        return $data;
    }

    /**
     * Get schedule density stats (Peak departure hours)
     */
    public static function get_schedule_density_stats() {
        $link = self::get_connection();
        if ( ! $link ) return [];

        $sql = "SELECT HOUR(Departure_Time) as hour, COUNT(*) as count FROM Schedule WHERE Departure_Time IS NOT NULL GROUP BY HOUR(Departure_Time) ORDER BY hour ASC";
        $res = @mysqli_query($link, $sql);
        $data = [];
        if ($res) {
            while ($row = mysqli_fetch_assoc($res)) {
                $data[] = ['hour' => (int)$row['hour'], 'count' => (int)$row['count']];
            }
            mysqli_free_result($res);
        }
        return $data;
    }

    /**
     * Get device mapping stats (Number of devices per station)
     */
    public static function get_device_mapping_stats() {
        $link = self::get_connection();
        if ( ! $link ) return [];

        $sql = "SELECT IFNULL(s.Station_Name, CONCAT('ایستگاه کد ', d.station_code)) as Station_Name, COUNT(d.id) as device_count 
                FROM device_station_mapping d 
                LEFT JOIN Station s ON d.station_code = s.code 
                GROUP BY d.station_code, s.Station_Name 
                ORDER BY device_count DESC LIMIT 15";
        $res = @mysqli_query($link, $sql);
        $data = [];
        if ($res) {
            while ($row = mysqli_fetch_assoc($res)) {
                $data[] = $row;
            }
            mysqli_free_result($res);
        }
        return $data;
    }

    /**
     * Insert new device mapping into the database.
     * @param string $imei
     * @param int $station_code
     * @param string|null $ip
     * @return array ['success' => bool, 'message' => string]
     */
    public static function insert_device_mapping($imei, $station_code, $ip = null) {
        $link = self::get_connection();
        if ( ! $link ) return ['success' => false, 'message' => 'عدم اتصال به پایگاه‌داده.'];

        // Input sanitization and digit normalization
        $fa = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
        $ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
        $en = ['0','1','2','3','4','5','6','7','8','9'];
        $imei = str_replace($fa, $en, str_replace($ar, $en, trim((string) $imei)));
        $imei = preg_replace('/\D/', '', $imei);
        $station_code = (int) $station_code;

        // 1. Strict IMEI Validation: Exactly 15 digits
        if ( ! preg_match('/^\d{15}$/', $imei) ) {
            return ['success' => false, 'message' => 'کد IMEI باید الزاماً یک عدد ۱۵ رقمی معتبر باشد.'];
        }

        // 2. Strict IP Validation: IPv4 or IPv6
        if ( ! empty($ip) ) {
            $ip = str_replace($fa, $en, str_replace($ar, $en, trim((string) $ip)));
            $ip = sanitize_text_field($ip);
            $ipv4_regex = '/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/';
            $ipv6_regex = '/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/';
            $is_valid_ip = filter_var($ip, FILTER_VALIDATE_IP) || preg_match($ipv4_regex, $ip) || preg_match($ipv6_regex, $ip);
            if ( ! $is_valid_ip ) {
                return ['success' => false, 'message' => 'آدرس IP وارد شده نامعتبر است (تنها ساختار مجاز IPv4 یا IPv6 پذیرفته می‌شود).'];
            }
        } else {
            $ip = null;
        }

        if ($station_code <= 0) {
            return ['success' => false, 'message' => 'شماره ایستگاه نامعتبر است.'];
        }

        // 3. Check if IMEI already exists
        $check_sql = "SELECT id FROM device_station_mapping WHERE imei = ?";
        $stmt_check = mysqli_prepare($link, $check_sql);
        if ($stmt_check) {
            mysqli_stmt_bind_param($stmt_check, "s", $imei);
            mysqli_stmt_execute($stmt_check);
            mysqli_stmt_store_result($stmt_check);
            if (mysqli_stmt_num_rows($stmt_check) > 0) {
                mysqli_stmt_close($stmt_check);
                return ['success' => false, 'message' => 'این کد IMEI از قبل در سیستم ثبت شده است.'];
            }
            mysqli_stmt_close($stmt_check);
        }

        // 4. Validate station_code existence in Station table
        $stmt_st = mysqli_prepare($link, "SELECT code FROM Station WHERE code = ? LIMIT 1");
        if ($stmt_st) {
            mysqli_stmt_bind_param($stmt_st, "i", $station_code);
            mysqli_stmt_execute($stmt_st);
            mysqli_stmt_store_result($stmt_st);
            if (mysqli_stmt_num_rows($stmt_st) === 0) {
                mysqli_stmt_close($stmt_st);
                return ['success' => false, 'message' => 'شماره ایستگاه در جدول ایستگاه‌ها (Station) یافت نشد یا نامعتبر است.'];
            }
            mysqli_stmt_close($stmt_st);
        }

        // 5. Check if station_code is already assigned to another device
        $stmt_dup = mysqli_prepare($link, "SELECT id FROM device_station_mapping WHERE station_code = ? LIMIT 1");
        if ($stmt_dup) {
            mysqli_stmt_bind_param($stmt_dup, "i", $station_code);
            mysqli_stmt_execute($stmt_dup);
            mysqli_stmt_store_result($stmt_dup);
            if (mysqli_stmt_num_rows($stmt_dup) > 0) {
                mysqli_stmt_close($stmt_dup);
                return ['success' => false, 'message' => 'این شماره ایستگاه قبلاً به نمایشگر دیگری اختصاص داده شده است و نمی‌تواند تکراری باشد.'];
            }
            mysqli_stmt_close($stmt_dup);
        }

        // Insert
        $insert_sql = "INSERT INTO device_station_mapping (imei, ip, station_code) VALUES (?, ?, ?)";
        $stmt_insert = mysqli_prepare($link, $insert_sql);
        if ($stmt_insert) {
            mysqli_stmt_bind_param($stmt_insert, "ssi", $imei, $ip, $station_code);
            $success = mysqli_stmt_execute($stmt_insert);
            mysqli_stmt_close($stmt_insert);
            
            if ($success) {
                return ['success' => true, 'message' => 'دستگاه با موفقیت ثبت شد.'];
            } else {
                return ['success' => false, 'message' => 'خطا در ثبت اطلاعات: ' . mysqli_error($link)];
            }
        }
        
        return ['success' => false, 'message' => 'خطا در آماده‌سازی دستور دیتابیس.'];
    }

    /**
     * Update an existing device mapping.
     */
    public static function update_device_mapping($id, $imei, $station_code, $ip = null) {
        $link = self::get_connection();
        if ( ! $link ) return ['success' => false, 'message' => 'عدم اتصال به پایگاه‌داده.'];

        $id = (int) $id;
        $fa = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
        $ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
        $en = ['0','1','2','3','4','5','6','7','8','9'];
        $imei = str_replace($fa, $en, str_replace($ar, $en, trim((string) $imei)));
        $imei = preg_replace('/\D/', '', $imei);
        $station_code = (int) $station_code;

        if ($id <= 0) {
            return ['success' => false, 'message' => 'شناسه دستگاه نامعتبر است.'];
        }

        // 1. Strict IMEI Validation: Exactly 15 digits
        if ( ! preg_match('/^\d{15}$/', $imei) ) {
            return ['success' => false, 'message' => 'کد IMEI باید الزاماً یک عدد ۱۵ رقمی معتبر باشد.'];
        }

        // 2. Strict IP Validation: IPv4 or IPv6
        if ( ! empty($ip) ) {
            $ip = str_replace($fa, $en, str_replace($ar, $en, trim((string) $ip)));
            $ip = sanitize_text_field($ip);
            $ipv4_regex = '/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/';
            $ipv6_regex = '/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/';
            $is_valid_ip = filter_var($ip, FILTER_VALIDATE_IP) || preg_match($ipv4_regex, $ip) || preg_match($ipv6_regex, $ip);
            if ( ! $is_valid_ip ) {
                return ['success' => false, 'message' => 'آدرس IP وارد شده نامعتبر است (تنها ساختار مجاز IPv4 یا IPv6 پذیرفته می‌شود).'];
            }
        } else {
            $ip = null;
        }

        if ($station_code <= 0) {
            return ['success' => false, 'message' => 'شماره ایستگاه نامعتبر است.'];
        }

        // 1. Check if IMEI already exists on ANOTHER record
        $check_sql = "SELECT id FROM device_station_mapping WHERE imei = ? AND id != ?";
        $stmt_check = mysqli_prepare($link, $check_sql);
        if ($stmt_check) {
            mysqli_stmt_bind_param($stmt_check, "si", $imei, $id);
            mysqli_stmt_execute($stmt_check);
            mysqli_stmt_store_result($stmt_check);
            if (mysqli_stmt_num_rows($stmt_check) > 0) {
                mysqli_stmt_close($stmt_check);
                return ['success' => false, 'message' => 'این کد IMEI قبلا برای دستگاه دیگری ثبت شده است.'];
            }
            mysqli_stmt_close($stmt_check);
        }

        // 2. Validate station_code existence in Station table
        $stmt_st = mysqli_prepare($link, "SELECT code FROM Station WHERE code = ? LIMIT 1");
        if ($stmt_st) {
            mysqli_stmt_bind_param($stmt_st, "i", $station_code);
            mysqli_stmt_execute($stmt_st);
            mysqli_stmt_store_result($stmt_st);
            if (mysqli_stmt_num_rows($stmt_st) === 0) {
                mysqli_stmt_close($stmt_st);
                return ['success' => false, 'message' => 'شماره ایستگاه در جدول ایستگاه‌ها (Station) یافت نشد یا نامعتبر است.'];
            }
            mysqli_stmt_close($stmt_st);
        }

        // 3. Check if station_code is already assigned to ANOTHER record
        $stmt_dup = mysqli_prepare($link, "SELECT id FROM device_station_mapping WHERE station_code = ? AND id != ? LIMIT 1");
        if ($stmt_dup) {
            mysqli_stmt_bind_param($stmt_dup, "ii", $station_code, $id);
            mysqli_stmt_execute($stmt_dup);
            mysqli_stmt_store_result($stmt_dup);
            if (mysqli_stmt_num_rows($stmt_dup) > 0) {
                mysqli_stmt_close($stmt_dup);
                return ['success' => false, 'message' => 'این شماره ایستگاه قبلاً برای نمایشگر دیگری ثبت شده است و نمی‌تواند تکراری باشد.'];
            }
            mysqli_stmt_close($stmt_dup);
        }

        $update_sql = "UPDATE device_station_mapping SET imei = ?, ip = ?, station_code = ? WHERE id = ?";
        $stmt_update = mysqli_prepare($link, $update_sql);
        if ($stmt_update) {
            mysqli_stmt_bind_param($stmt_update, "ssii", $imei, $ip, $station_code, $id);
            $success = mysqli_stmt_execute($stmt_update);
            mysqli_stmt_close($stmt_update);
            
            if ($success) {
                return ['success' => true, 'message' => 'دستگاه با موفقیت بروزرسانی شد.'];
            } else {
                return ['success' => false, 'message' => 'خطا در بروزرسانی اطلاعات: ' . mysqli_error($link)];
            }
        }
        
        return ['success' => false, 'message' => 'خطا در آماده‌سازی دستور دیتابیس.'];
    }

    /**
     * Delete a device mapping.
     */
    public static function delete_device_mapping($id) {
        $link = self::get_connection();
        if ( ! $link ) return ['success' => false, 'message' => 'عدم اتصال به پایگاه‌داده.'];

        $id = (int) $id;
        if ($id <= 0) return ['success' => false, 'message' => 'شناسه نامعتبر است.'];

        $delete_sql = "DELETE FROM device_station_mapping WHERE id = ?";
        $stmt_delete = mysqli_prepare($link, $delete_sql);
        if ($stmt_delete) {
            mysqli_stmt_bind_param($stmt_delete, "i", $id);
            $success = mysqli_stmt_execute($stmt_delete);
            mysqli_stmt_close($stmt_delete);
            
            if ($success) {
                return ['success' => true, 'message' => 'دستگاه با موفقیت حذف شد.'];
            } else {
                return ['success' => false, 'message' => 'خطا در حذف اطلاعات: ' . mysqli_error($link)];
            }
        }
        
        return ['success' => false, 'message' => 'خطا در آماده‌سازی دستور دیتابیس.'];
    }

    /**
     * Get all device mappings for the table.
     */
    public static function get_all_device_mappings() {
        $data = [];
        $link = self::get_connection();
        if ( ! $link ) return $data;

        $sql = "SELECT d.id, d.imei, d.ip, d.station_code, 
                       IFNULL(s.Station_Name, CONCAT('ایستگاه کد ', d.station_code)) as Station_Name,
                       s.station_custom
                FROM device_station_mapping d 
                LEFT JOIN Station s ON d.station_code = s.code 
                ORDER BY d.id DESC";
        $res = mysqli_query($link, $sql);
        if ($res) {
            while ($row = mysqli_fetch_assoc($res)) {
                $data[] = $row;
            }
            mysqli_free_result($res);
        }
        return $data;
    }

    /**
     * Get all stations with custom fields.
     */
    public static function get_all_stations() {
        $data = [];
        $link = self::get_connection();
        if ( ! $link ) return $data;

        $sql = "SELECT Station_ID as id, code, Station_Name, station_custom 
                FROM Station 
                ORDER BY Station_ID DESC";
        $res = @mysqli_query($link, $sql);
        if ($res) {
            while ($row = mysqli_fetch_assoc($res)) {
                $data[] = $row;
            }
            mysqli_free_result($res);
        }
        return $data;
    }

    /**
     * Get all routes with custom fields.
     */
    public static function get_all_routes() {
        $data = [];
        $link = self::get_connection();
        if ( ! $link ) return $data;

        $sql = "SELECT Route_ID as id, code, Terminal1, Terminal1_custom, Terminal2, Terminal2_custom 
                FROM Route 
                ORDER BY Route_ID DESC";
        $res = @mysqli_query($link, $sql);
        if ($res) {
            while ($row = mysqli_fetch_assoc($res)) {
                $data[] = $row;
            }
            mysqli_free_result($res);
        }
        return $data;
    }

    /**
     * Update custom field for a station securely.
     */
    public static function update_station_custom_fields($id, $station_custom) {
        $link = self::get_connection();
        if ( ! $link ) return ['success' => false, 'message' => 'عدم اتصال به پایگاه‌داده.'];

        $id = (int) $id;
        $station_custom = sanitize_text_field($station_custom);

        if ($id <= 0) {
            return ['success' => false, 'message' => 'شناسه ایستگاه نامعتبر است.'];
        }

        $update_sql = "UPDATE Station SET station_custom = ? WHERE Station_ID = ?";
        $stmt_update = mysqli_prepare($link, $update_sql);
        if ($stmt_update) {
            mysqli_stmt_bind_param($stmt_update, "si", $station_custom, $id);
            $success = mysqli_stmt_execute($stmt_update);
            mysqli_stmt_close($stmt_update);
            
            if ($success) {
                return ['success' => true, 'message' => 'اطلاعات سفارشی ایستگاه با موفقیت بروزرسانی شد.'];
            } else {
                return ['success' => false, 'message' => 'خطا در بروزرسانی اطلاعات: ' . mysqli_error($link)];
            }
        }
        
        return ['success' => false, 'message' => 'خطا در آماده‌سازی دستور دیتابیس.'];
    }

    /**
     * Update custom fields for a route securely.
     */
    public static function update_route_custom_fields($id, $terminal1_custom, $terminal2_custom) {
        $link = self::get_connection();
        if ( ! $link ) return ['success' => false, 'message' => 'عدم اتصال به پایگاه‌داده.'];

        $id = (int) $id;
        $terminal1_custom = sanitize_text_field($terminal1_custom);
        $terminal2_custom = sanitize_text_field($terminal2_custom);

        if ($id <= 0) {
            return ['success' => false, 'message' => 'شناسه مسیر نامعتبر است.'];
        }

        $update_sql = "UPDATE Route SET Terminal1_custom = ?, Terminal2_custom = ? WHERE Route_ID = ?";
        $stmt_update = mysqli_prepare($link, $update_sql);
        if ($stmt_update) {
            mysqli_stmt_bind_param($stmt_update, "ssi", $terminal1_custom, $terminal2_custom, $id);
            $success = mysqli_stmt_execute($stmt_update);
            mysqli_stmt_close($stmt_update);
            
            if ($success) {
                return ['success' => true, 'message' => 'اطلاعات سفارشی مسیر با موفقیت بروزرسانی شد.'];
            } else {
                return ['success' => false, 'message' => 'خطا در بروزرسانی اطلاعات: ' . mysqli_error($link)];
            }
        }
        
        return ['success' => false, 'message' => 'خطا در آماده‌سازی دستور دیتابیس.'];
    }
}
