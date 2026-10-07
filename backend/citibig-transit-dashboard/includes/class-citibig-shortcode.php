<?php
/**
 * Class to handle frontend shortcode rendering.
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Citibig_Transit_Shortcode {

    public function __construct() {
        add_shortcode( 'citibig_transit_charts', [ $this, 'render_dashboard_shortcode' ] );
    }

    public function render_dashboard_shortcode() {
        // Process form submission (Phase 7 & 8)
        $form_message = '';
        $form_status = '';
        if ( isset($_POST['citibig_device_nonce']) && wp_verify_nonce($_POST['citibig_device_nonce'], 'citibig_device_action') ) {
            if ( current_user_can( 'manage_options' ) ) {
                $action = isset($_POST['device_action']) ? sanitize_text_field($_POST['device_action']) : '';
                $imei = isset($_POST['device_imei']) ? sanitize_text_field($_POST['device_imei']) : '';
                $ip = isset($_POST['device_ip']) ? sanitize_text_field($_POST['device_ip']) : '';
                $station_code = isset($_POST['station_code']) ? intval($_POST['station_code']) : 0;
                $device_id = isset($_POST['device_id']) ? intval($_POST['device_id']) : 0;

                if ($action === 'insert') {
                    $result = Citibig_Transit_DB::insert_device_mapping($imei, $station_code, $ip);
                    $form_message = $result['message'];
                    $form_status = $result['success'] ? 'success' : 'error';
                    if ( $result['success'] ) {
                        delete_transient( 'citibig_charts_data' );
                    }
                } elseif ($action === 'update') {
                    $result = Citibig_Transit_DB::update_device_mapping($device_id, $imei, $station_code, $ip);
                    $form_message = $result['message'];
                    $form_status = $result['success'] ? 'success' : 'error';
                    if ( $result['success'] ) {
                        delete_transient( 'citibig_charts_data' );
                    }
                } elseif ($action === 'delete') {
                    $result = Citibig_Transit_DB::delete_device_mapping($device_id);
                    $form_message = $result['message'];
                    $form_status = $result['success'] ? 'success' : 'error';
                    if ( $result['success'] ) {
                        delete_transient( 'citibig_charts_data' );
                    }
                }
            } else {
                $form_message = 'شما مجوز دسترسی برای تغییر داده را ندارید.';
                $form_status = 'error';
            }
        }

        // Fetch Toggles
        $show_kpi     = get_option('citibig_show_kpi', '1') === '1';
        $show_color   = get_option('citibig_show_color', '1') === '1';
        $show_route   = get_option('citibig_show_route', '1') === '1';
        $show_bustype = get_option('citibig_show_bustype', '1') === '1';
        $show_shift   = get_option('citibig_show_shift', '1') === '1';
        $show_map     = get_option('citibig_show_map', '1') === '1';
        $show_eta     = get_option('citibig_show_eta', '1') === '1';
        $show_history = get_option('citibig_show_history', '1') === '1';
        $show_network = get_option('citibig_show_network', '1') === '1';
        $show_device  = get_option('citibig_show_device', '1') === '1';

        // Fetch stats from remote DB
        $kpi_data          = $show_kpi     ? Citibig_Transit_DB::get_kpi_counts() : [];
        $color_data        = $show_color   ? Citibig_Transit_DB::get_color_stats() : [];
        $route_data        = $show_route   ? Citibig_Transit_DB::get_route_station_stats() : [];
        $bus_type_data     = $show_bustype ? Citibig_Transit_DB::get_bus_type_stats() : [];
        $day_night_data    = $show_shift   ? Citibig_Transit_DB::get_day_night_stats() : [];
        $station_coords    = $show_map     ? Citibig_Transit_DB::get_station_coordinates() : [];
        $eta_data          = $show_eta     ? Citibig_Transit_DB::get_live_eta_data() : [];
        
        // Phase 5 — History Analytics
        $peak_hours_data    = $show_history ? Citibig_Transit_DB::get_peak_hours_stats() : [];
        $top_delayed_data   = $show_history ? Citibig_Transit_DB::get_top_delayed_stations() : [];
        $history_available  = $show_history && ( ! empty( $peak_hours_data ) || ! empty( $top_delayed_data ) );

        // Phase 6 — Network & Device Stats
        $network_health    = $show_network ? Citibig_Transit_DB::get_network_health_stats() : ['stations' => [], 'routes' => []];
        $schedule_density  = $show_network ? Citibig_Transit_DB::get_schedule_density_stats() : [];
        $device_mapping    = $show_device  ? Citibig_Transit_DB::get_device_mapping_stats() : [];

        // Render HTML wrapper for charts
        ob_start();
        ?>
        <!-- Direct injection of data to prevent timing issues with wp_localize_script -->
        <script type="text/javascript">
            var citibigTransitData = {
                colorStats:      <?php echo json_encode( $color_data     ? $color_data     : [] ); ?>,
                routeStats:      <?php echo json_encode( $route_data     ? $route_data     : [] ); ?>,
                busTypeStats:    <?php echo json_encode( $bus_type_data  ? $bus_type_data  : [] ); ?>,
                dayNightStats:   <?php echo json_encode( $day_night_data ? $day_night_data : [] ); ?>,
                stationCoords:   <?php echo json_encode( $station_coords ? $station_coords : [] ); ?>,
                peakHoursStats:  <?php echo json_encode( $peak_hours_data  ? $peak_hours_data  : [] ); ?>,
                topDelayedStats: <?php echo json_encode( $top_delayed_data ? $top_delayed_data : [] ); ?>,
                networkHealth:   <?php echo json_encode( $network_health  ? $network_health  : ['stations' => [], 'routes' => []] ); ?>,
                scheduleDensity: <?php echo json_encode( $schedule_density ? $schedule_density : [] ); ?>,
                deviceMapping:   <?php echo json_encode( $device_mapping  ? $device_mapping  : [] ); ?>
            };
            console.log('Citibig Transit Data Loaded (Full):', citibigTransitData);
        </script>

        <div class="citibig-dashboard-container">
            <h2>داشبورد گزارشات حمل و نقل سیتی بیگ</h2>
            
            <!-- KPI Section (Phase 1) -->
            <?php if ( $show_kpi ) : ?>
            <div class="citibig-kpi-grid">
                <div class="citibig-kpi-card kpi-stations">
                    <div class="kpi-icon"><span class="dashicons dashicons-location-alt"></span></div>
                    <div class="kpi-info">
                        <span class="kpi-value"><?php echo number_format($kpi_data['stations']); ?></span>
                        <span class="kpi-label">کل ایستگاه‌ها</span>
                    </div>
                </div>
                <div class="citibig-kpi-card kpi-routes">
                    <div class="kpi-icon"><span class="dashicons dashicons-leftright"></span></div>
                    <div class="kpi-info">
                        <span class="kpi-value"><?php echo number_format($kpi_data['routes']); ?></span>
                        <span class="kpi-label">کل مسیرها</span>
                    </div>
                </div>
                <div class="citibig-kpi-card kpi-locals">
                    <div class="kpi-icon"><span class="dashicons dashicons-admin-site"></span></div>
                    <div class="kpi-info">
                        <span class="kpi-value"><?php echo number_format($kpi_data['locals']); ?></span>
                        <span class="kpi-label">موقعیت‌های جغرافیایی</span>
                    </div>
                </div>
                <div class="citibig-kpi-card kpi-etas">
                    <div class="kpi-icon"><span class="dashicons dashicons-clock"></span></div>
                    <div class="kpi-info">
                        <span class="kpi-value"><?php echo number_format($kpi_data['etas']); ?></span>
                        <span class="kpi-label">تخمین‌های زمان (ETA)</span>
                    </div>
                </div>
            </div>
            <?php endif; ?>

            <!-- Charts Section (Phase 2) -->
            <div class="citibig-grid">
                <!-- Chart 1: Colors -->
                <?php if ( $show_color ) : ?>
                <div class="citibig-card">
                    <h3>تعداد رنگ‌های ثبت شده (جدول Color)</h3>
                    <div class="chart-container">
                        <canvas id="citibigColorChart"></canvas>
                    </div>
                </div>
                <?php endif; ?>

                <!-- Chart 2: Routes -->
                <?php if ( $show_route ) : ?>
                <div class="citibig-card">
                    <h3>تعداد ایستگاه‌های هر مسیر (Route & Route_Station)</h3>
                    <div class="chart-container">
                        <canvas id="citibigRouteChart"></canvas>
                    </div>
                </div>
                <?php endif; ?>

                <!-- Chart 3: Bus Types -->
                <?php if ( $show_bustype ) : ?>
                <div class="citibig-card">
                    <h3>سهم انواع اتوبوس‌ها در ناوگان</h3>
                    <div class="chart-container">
                        <canvas id="citibigBusTypeChart"></canvas>
                    </div>
                </div>
                <?php endif; ?>

                <!-- Chart 4: Day vs Night Shift -->
                <?php if ( $show_shift ) : ?>
                <div class="citibig-card">
                    <h3>نوبت کاری ایستگاه‌ها (روزانه / شبانه)</h3>
                    <div class="chart-container">
                        <canvas id="citibigDayNightChart"></canvas>
                    </div>
                </div>
                <?php endif; ?>

                <!-- Map Container (Phase 3) -->
                <?php if ( $show_map ) : ?>
                <div class="citibig-card" style="grid-column: 1 / -1; margin-top: 10px;">
                    <h3>نقشه تعاملی ایستگاه‌های حمل و نقل (تهران)</h3>
                    <div class="chart-container" style="height: 450px;">
                        <div id="citibigStationMap" style="height: 100%; width: 100%; border-radius: 6px; border: 1px solid #cbd5e1; z-index: 1;"></div>
                    </div>
                </div>
                <?php endif; ?>

                <!-- Live ETA Table (Phase 4) -->
                <?php if ( $show_eta ) : ?>
                <div class="citibig-card" style="grid-column: 1 / -1; margin-top: 10px;">
                    <h3>جدول لحظه‌ای زمان رسیدن اتوبوس‌ها (ETA Live)</h3>
                    <div style="margin-bottom: 20px;">
                        <input type="text" id="citibigEtaSearch" placeholder="جستجو بر اساس نام ایستگاه یا کد مسیر..." style="width: 100%; max-width: 400px; padding: 10px 15px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: Tahoma, sans-serif; font-size: 14px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);" />
                    </div>
                    <div style="overflow-x: auto; max-height: 400px;">
                        <table class="citibig-table" id="citibigLiveEtaTable" style="width: 100%; border-collapse: collapse; text-align: right;">
                            <thead>
                                <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                                    <th style="padding: 12px; font-weight: bold; color: #475569;">نام ایستگاه</th>
                                    <th style="padding: 12px; font-weight: bold; color: #475569;">کد مسیر</th>
                                    <th style="padding: 12px; font-weight: bold; color: #475569;">ساعت تقریبی ورود</th>
                                    <th style="padding: 12px; font-weight: bold; color: #475569;">زمان باقی‌مانده</th>
                                    <th style="padding: 12px; font-weight: bold; color: #475569;">آخرین بروزرسانی</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if ( ! empty( $eta_data ) ) : ?>
                                    <?php foreach ( $eta_data as $row ) : ?>
                                        <tr style="border-bottom: 1px solid #e2e8f0; transition: background-color 0.15s;">
                                            <td style="padding: 12px; font-weight: 500;"><?php echo esc_html( $row['Station_Name'] ); ?></td>
                                            <td style="padding: 12px; font-family: monospace; color: #4b5563;"><?php echo esc_html( $row['code'] ); ?></td>
                                            <td style="padding: 12px; font-family: monospace; font-weight: bold; color: #1e3a8a;"><?php echo esc_html( $row['eta'] ); ?></td>
                                            <td style="padding: 12px;">
                                                <?php if ( (int)$row['eta_minutes'] <= 1 ) : ?>
                                                    <span class="eta-tag eta-now" style="background: #fee2e2; color: #dc2626; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">هم‌اکنون در ایستگاه</span>
                                                <?php else : ?>
                                                    <span class="eta-tag eta-wait" style="background: #f0fdf4; color: #16a34a; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;"><?php echo esc_html( $row['eta_minutes'] ); ?> دقیقه</span>
                                                <?php endif; ?>
                                            </td>
                                            <td style="padding: 12px; font-size: 12px; color: #64748b; font-family: monospace;"><?php echo esc_html( $row['updated_at'] ); ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else : ?>
                                    <tr>
                                        <td colspan="5" style="padding: 25px; text-align: center; color: #94a3b8;">هیچ داده‌ی فعالی برای تخمین زمان لود نشد. جدول code_eta را بررسی کنید.</td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
                <?php endif; ?>

                <?php if ( $show_history ) : ?>
                    <?php if ( $history_available ) : ?>
                    <!-- History Analytics Section (Phase 5) -->
                    <div class="citibig-history-section" style="grid-column: 1 / -1; margin-top: 10px;">
                        <div class="citibig-history-header">
                            <span class="citibig-history-icon">📊</span>
                            <div>
                                <h3 class="citibig-history-title">تحلیل پیشرفته تاریخچه شبکه</h3>
                                <p class="citibig_history_sub">داده‌های استخراج شده از جدول <code>History</code> — روند ترافیک و میانگین زمان انتظار ایستگاه‌ها</p>
                            </div>
                        </div>
                        <div class="citibig-history-grid">
                            <!-- Peak Hours Line Chart -->
                            <div class="citibig-card citibig-history-chart-card">
                                <h3>📈 شلوغ‌ترین ساعات شبانه‌روز (ترافیک ثبت شده)</h3>
                                <div class="chart-container" style="height: 320px;">
                                    <canvas id="citibigPeakHoursChart"></canvas>
                                </div>
                            </div>

                            <!-- Top Delayed Stations Bar Chart -->
                            <div class="citibig-card citibig-history-chart-card">
                                <h3>⏱️ ایستگاه‌های دارای بیشترین میانگین زمان انتظار تخمینی (دقیقه)</h3>
                                <div class="chart-container" style="height: 320px;">
                                    <canvas id="citibigDelayChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php else : ?>
                    <!-- History section placeholder when data is unavailable -->
                    <div class="citibig-card citibig-history-empty" style="grid-column: 1 / -1; margin-top: 10px;">
                        <div class="citibig-history-empty-inner">
                            <span class="citibig-history-empty-icon">📂</span>
                            <h3>تحلیل تاریخچه در دسترس نیست</h3>
                            <p>جدول <code>History</code> یا ستون‌های <code>eta_minutes</code> / <code>Editing_Time</code> داده‌ای ندارند یا به دیتابیس متصل نشده است.</p>
                        </div>
                    </div>
                    <?php endif; ?>
                <?php endif; ?>

                <?php if ( $show_network ) : ?>
                <!-- Network Health & Schedule Density (Phase 6) -->
                <div class="citibig-history-section" style="grid-column: 1 / -1; margin-top: 10px;">
                    <div class="citibig-history-header" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                        <span class="citibig-history-icon">🏥</span>
                        <div>
                            <h3 class="citibig-history-title">وضعیت سلامت شبکه و زمان‌بندی</h3>
                            <p class="citibig_history_sub">بررسی ایستگاه‌ها و مسیرهای فعال و همچنین تراکم زمان‌بندی برنامه اعزام اتوبوس‌ها</p>
                        </div>
                    </div>
                    <?php if ( empty($network_health['stations']) && empty($network_health['routes']) && empty($schedule_density) ) : ?>
                    <div class="citibig-card citibig-history-empty" style="grid-column: 1 / -1; margin: 15px; border-color: #10b981;">
                        <div class="citibig-history-empty-inner">
                            <span class="citibig-history-empty-icon" style="color: #10b981; background: #d1fae5;">🏥</span>
                            <h3>داده‌های سلامت شبکه یافت نشد</h3>
                            <p>جداول <code>Station_Status</code>، <code>Route_Status</code> یا <code>Schedule</code> خالی هستند.</p>
                        </div>
                    </div>
                    <?php else : ?>
                    <div class="citibig-history-grid">
                        <!-- Station Health Doughnut -->
                        <div class="citibig-card citibig-history-chart-card">
                            <h3>✅ وضعیت سلامت ایستگاه‌ها (فعال/غیرفعال)</h3>
                            <div class="chart-container" style="height: 250px;">
                                <canvas id="citibigStationHealthChart"></canvas>
                            </div>
                        </div>

                        <!-- Route Health Doughnut -->
                        <div class="citibig-card citibig-history-chart-card">
                            <h3>✅ وضعیت سلامت مسیرها (فعال/غیرفعال)</h3>
                            <div class="chart-container" style="height: 250px;">
                                <canvas id="citibigRouteHealthChart"></canvas>
                            </div>
                        </div>
                        
                        <!-- Schedule Density Line Chart -->
                        <div class="citibig-card citibig-history-chart-card" style="grid-column: 1 / -1;">
                            <h3>⏰ تراکم برنامه‌های اعزام اتوبوس در ساعات مختلف شبانه‌روز</h3>
                            <div class="chart-container" style="height: 320px;">
                                <canvas id="citibigScheduleDensityChart"></canvas>
                            </div>
                        </div>
                    </div>
                    <?php endif; ?>
                </div>
                <?php endif; ?>

                <?php if ( $show_device ) : ?>
                <!-- Device Mapping Stats (Phase 6, 7 & 8) -->
                <div class="citibig-card" style="grid-column: 1 / -1; margin-top: 10px;">
                    <h3>توزیع دستگاه‌ها در ایستگاه‌ها (Device Mapping)</h3>

                    <!-- Device Mapping Data Entry Form & Table (Phase 7 & 8) -->
                    <?php if ( is_user_logged_in() ) : 
                        $all_devices = Citibig_Transit_DB::get_all_device_mappings();
                        $all_stations = Citibig_Transit_DB::get_all_stations();
                        $assigned_station_codes = array_column($all_devices, 'station_code');
                    ?>
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                        <h4 id="deviceFormTitle" style="margin-top: 0; color: #334155; font-size: 15px; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">ثبت سخت‌افزار جدید در ایستگاه</h4>
                        <?php if ( ! empty($form_message) ) : ?>
                            <div style="padding: 10px; border-radius: 4px; margin-bottom: 15px; font-weight: bold; background: <?php echo $form_status === 'success' ? '#dcfce7' : '#fee2e2'; ?>; color: <?php echo $form_status === 'success' ? '#166534' : '#991b1b'; ?>;">
                                <?php echo esc_html($form_message); ?>
                            </div>
                        <?php endif; ?>
                        <form method="post" action="" id="deviceForm" style="display: flex; gap: 15px; flex-wrap: wrap; align-items: flex-end;">
                            <?php wp_nonce_field('citibig_device_action', 'citibig_device_nonce'); ?>
                            <input type="hidden" name="device_action" id="device_action" value="insert" />
                            <input type="hidden" name="device_id" id="device_id" value="" />
                            <div style="flex: 1; min-width: 180px;">
                                <label for="device_imei" style="display: block; margin-bottom: 5px; font-size: 13px; color: #475569;">کد IMEI دستگاه:</label>
                                <input type="text" id="device_imei" name="device_imei" required placeholder="مثال: 351234567890123" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 4px; font-family: monospace; direction: ltr;" />
                            </div>
                            <div style="flex: 1; min-width: 160px;">
                                <label for="device_ip" style="display: block; margin-bottom: 5px; font-size: 13px; color: #475569;">آدرس IP دستگاه:</label>
                                <input type="text" id="device_ip" name="device_ip" placeholder="مثال: 192.168.1.50" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 4px; font-family: monospace; direction: ltr;" />
                            </div>
                            <div style="flex: 1; min-width: 220px;">
                                <label for="station_code" style="display: block; margin-bottom: 5px; font-size: 13px; color: #475569;">ایستگاه (از جدول Station):</label>
                                <select id="station_code" name="station_code" required style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 4px; direction: rtl;">
                                    <option value="">-- انتخاب ایستگاه --</option>
                                    <?php foreach ($all_stations as $st) : 
                                        $code = (int) $st['code'];
                                        $label = 'کد ' . $code . ' - ' . esc_html($st['Station_Name']);
                                        if (!empty($st['station_custom'])) {
                                            $label .= ' (' . esc_html($st['station_custom']) . ')';
                                        }
                                    ?>
                                    <option value="<?php echo esc_attr($code); ?>"><?php echo $label; ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button type="submit" id="deviceSubmitBtn" style="background: #3b82f6; color: white; border: none; padding: 9px 20px; border-radius: 4px; font-family: Tahoma; cursor: pointer; font-weight: bold; height: 38px;">➕ ثبت دستگاه</button>
                                <button type="button" id="deviceCancelBtn" style="display: none; background: #94a3b8; color: white; border: none; padding: 9px 15px; border-radius: 4px; font-family: Tahoma; cursor: pointer; font-weight: bold; height: 38px;" onclick="cancelDeviceEdit()">انصراف</button>
                            </div>
                        </form>
                    </div>

                    <!-- Device Table (Phase 8) -->
                    <div style="margin-bottom: 20px; overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: right; font-size: 13px;">
                            <thead>
                                <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                                    <th style="padding: 10px;">کد IMEI</th>
                                    <th style="padding: 10px;">آدرس IP</th>
                                    <th style="padding: 10px;">نام ایستگاه</th>
                                    <th style="padding: 10px;">کد ایستگاه</th>
                                    <th style="padding: 10px; width: 150px;">عملیات</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (empty($all_devices)) : ?>
                                <tr>
                                    <td colspan="5" style="padding: 15px; text-align: center; color: #64748b;">هیچ دستگاهی ثبت نشده است.</td>
                                </tr>
                                <?php else : foreach ($all_devices as $dev) : ?>
                                <tr style="border-bottom: 1px solid #e2e8f0;">
                                    <td style="padding: 10px; font-family: monospace; direction: ltr; text-align: left;"><?php echo esc_html($dev['imei']); ?></td>
                                    <td style="padding: 10px; font-family: monospace; direction: ltr; text-align: left;"><?php echo !empty($dev['ip']) ? esc_html($dev['ip']) : '-'; ?></td>
                                    <td style="padding: 10px;"><?php echo esc_html($dev['Station_Name']); ?></td>
                                    <td style="padding: 10px; direction: ltr; text-align: right;"><?php echo esc_html($dev['station_code']); ?></td>
                                    <td style="padding: 10px;">
                                        <button type="button" style="background: #eab308; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 11px; font-family: Tahoma; margin-left: 5px;" onclick="editDevice(<?php echo $dev['id']; ?>, '<?php echo esc_js($dev['imei']); ?>', <?php echo $dev['station_code']; ?>, '<?php echo esc_js($dev['ip'] ?? ''); ?>')">ویرایش</button>
                                        <form method="post" action="" style="display: inline-block; margin: 0;" onsubmit="return confirm('آیا از حذف این دستگاه اطمینان دارید؟ این عمل غیرقابل بازگشت است.');">
                                            <?php wp_nonce_field('citibig_device_action', 'citibig_device_nonce'); ?>
                                            <input type="hidden" name="device_action" value="delete" />
                                            <input type="hidden" name="device_id" value="<?php echo $dev['id']; ?>" />
                                            <button type="submit" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 11px; font-family: Tahoma;">حذف</button>
                                        </form>
                                    </td>
                                </tr>
                                <?php endforeach; endif; ?>
                            </tbody>
                        </table>
                    </div>

                    <script>
                        function editDevice(id, imei, station_code, ip) {
                            document.getElementById('device_action').value = 'update';
                            document.getElementById('device_id').value = id;
                            document.getElementById('device_imei').value = imei;
                            document.getElementById('device_ip').value = ip || '';
                            document.getElementById('station_code').value = station_code;
                            
                            document.getElementById('deviceFormTitle').innerText = 'ویرایش سخت‌افزار (کد: ' + imei + ')';
                            document.getElementById('deviceSubmitBtn').innerText = '🔄 بروزرسانی دستگاه';
                            document.getElementById('deviceSubmitBtn').style.background = '#eab308';
                            document.getElementById('deviceCancelBtn').style.display = 'block';
                            
                            document.getElementById('deviceFormTitle').scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                        
                        function cancelDeviceEdit() {
                            document.getElementById('device_action').value = 'insert';
                            document.getElementById('device_id').value = '';
                            document.getElementById('device_imei').value = '';
                            document.getElementById('device_ip').value = '';
                            document.getElementById('station_code').value = '';
                            
                            document.getElementById('deviceFormTitle').innerText = 'ثبت سخت‌افزار جدید در ایستگاه';
                            document.getElementById('deviceSubmitBtn').innerText = '➕ ثبت دستگاه';
                            document.getElementById('deviceSubmitBtn').style.background = '#3b82f6';
                            document.getElementById('deviceCancelBtn').style.display = 'none';
                        }
                    </script>
                    <?php endif; ?>

                    <?php if ( empty($device_mapping) ) : ?>
                    <div style="padding: 25px; text-align: center; color: #94a3b8; background: #f8fafc; border-radius: 6px; margin-top: 15px;">هیچ دستگاهی ثبت نشده است یا جدول <code>device_station_mapping</code> خالی است.</div>
                    <?php else : ?>
                    <div class="chart-container" style="height: 400px;">
                        <canvas id="citibigDeviceMappingChart"></canvas>
                    </div>
                    <?php endif; ?>
                </div>
                <?php endif; ?>

            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
