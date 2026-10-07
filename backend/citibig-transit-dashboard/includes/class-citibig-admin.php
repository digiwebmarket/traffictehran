<?php
/**
 * Class to handle WordPress Admin Menu, Settings, and Diagnostics.
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Citibig_Transit_Admin {

    public function __construct() {
        add_action( 'admin_menu', [ $this, 'add_admin_menu' ] );
        add_action( 'admin_init', [ $this, 'register_settings' ] );

        // Clear charts transient cache when settings are saved/updated
        $toggles = ['kpi', 'color', 'route', 'bustype', 'shift', 'map', 'eta', 'history', 'network', 'device'];
        foreach ( $toggles as $toggle ) {
            add_action( "update_option_citibig_show_{$toggle}", [ $this, 'clear_charts_cache' ] );
        }
    }

    public function clear_charts_cache() {
        delete_transient( 'citibig_charts_data' );
        delete_transient( 'citibig_charts_db_data' );
    }

    /**
     * Add a top-level menu page with submenus.
     */
    public function add_admin_menu() {
        // Main menu
        add_menu_page(
            'داشبورد حمل و نقل سیتی بیگ',
            'داشبورد سیتی بیگ',
            'manage_options',
            'citibig-transit-main',
            [ $this, 'render_dashboard_page' ],
            'dashicons-chart-bar',
            30
        );

        // Submenu: Dashboard
        add_submenu_page(
            'citibig-transit-main',
            'داشبورد داده‌ها',
            'داشبورد داده‌ها',
            'manage_options',
            'citibig-transit-main',
            [ $this, 'render_dashboard_page' ]
        );

        // Submenu: Settings
        add_submenu_page(
            'citibig-transit-main',
            'تنظیمات اتصال',
            'تنظیمات اتصال',
            'manage_options',
            'citibig-transit-settings',
            [ $this, 'render_settings_page' ]
        );

        // Submenu: Diagnostics
        add_submenu_page(
            'citibig-transit-main',
            'عیب‌یابی اتصال',
            'عیب‌یابی اتصال',
            'manage_options',
            'citibig-transit-diagnostics',
            [ $this, 'render_diagnostics_page' ]
        );
    }

    public function register_settings() {
        register_setting( 'citibig_transit_group', 'citibig_transit_db_host' );
        register_setting( 'citibig_transit_group', 'citibig_transit_db_port' );
        register_setting( 'citibig_transit_group', 'citibig_transit_db_name' );
        register_setting( 'citibig_transit_group', 'citibig_transit_db_user' );
        register_setting( 'citibig_transit_group', 'citibig_transit_db_pass' );
        register_setting( 'citibig_transit_group', 'citibig_api_token' );

        // Phase 6 Display Toggles
        $toggles = ['kpi', 'color', 'route', 'bustype', 'shift', 'map', 'eta', 'history', 'network', 'device'];
        foreach ($toggles as $toggle) {
            register_setting( 'citibig_transit_group', 'citibig_show_' . $toggle, ['default' => '1'] );
        }
    }

    /**
     * Render the main overview dashboard showing status & data summary.
     */
    public function render_dashboard_page() {
        $host = get_option( 'citibig_transit_db_host' );
        $pdo = Citibig_Transit_DB::get_connection();
        $db_status = Citibig_Transit_DB::get_db_status();
        ?>
        <div class="wrap" style="direction: rtl; text-align: right; font-family: Tahoma, sans-serif;">
            <h1>داشبورد داده‌های حمل و نقل (Citibig Transit)</h1>
            <p>خلاصه‌ای از داده‌های خوانده‌شده از دیتابیس خارجی در زیر نمایش داده شده است:</p>

            <!-- Connection Status -->
            <div style="background: #fff; padding: 15px; border-right: 4px solid <?php echo $pdo ? '#46b450' : '#dc3232'; ?>; box-shadow: 0 1px 1px rgba(0,0,0,.04); margin-bottom: 20px;">
                <strong>وضعیت اتصال به سرور دیتابیس: </strong>
                <?php if ( $pdo ) : ?>
                    <span style="color: #46b450; font-weight: bold;">برقرار ✅ (متصل به: <?php echo esc_html($host); ?>)</span>
                <?php else : ?>
                    <span style="color: #dc3232; font-weight: bold;">قطع ❌ (به منوی <a href="<?php echo esc_url( admin_url('admin.php?page=citibig-transit-diagnostics') ); ?>">عیب‌یابی اتصال</a> مراجعه کنید)</span>
                <?php endif; ?>
            </div>

            <?php if ( $pdo && $db_status ) : ?>
                <!-- Database Summary Card -->
                <div style="background: #fff; padding: 20px; border: 1px solid #ccd0d4; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <h2 style="margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">جدول‌ها و تعداد رکوردهای خوانده‌شده</h2>
                    
                    <table class="wp-list-table widefat fixed striped" style="margin-top: 15px; text-align: right; width: 100%;">
                        <thead>
                            <tr>
                                <th style="font-weight: bold; padding: 10px;">نام جدول در دیتابیس</th>
                                <th style="font-weight: bold; padding: 10px;">تعداد ردیف‌ها (Rows Count)</th>
                                <th style="font-weight: bold; padding: 10px;">وضعیت خواندن داده‌ها</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ( $db_status as $table => $count ) : ?>
                                <tr>
                                    <td style="padding: 10px; font-family: monospace; font-size: 14px;"><?php echo esc_html( $table ); ?></td>
                                    <td style="padding: 10px; font-weight: bold;"><?php echo is_numeric($count) ? number_format($count) : esc_html($count); ?></td>
                                    <td style="padding: 10px;">
                                        <?php if ( is_numeric($count) && $count > 0 ) : ?>
                                            <span style="background: #e7f4e9; color: #2e7d32; padding: 3px 8px; border-radius: 3px; font-size: 12px;">با موفقیت لود شد</span>
                                        <?php elseif ( is_numeric($count) && $count == 0 ) : ?>
                                            <span style="background: #fff8e1; color: #f57f17; padding: 3px 8px; border-radius: 3px; font-size: 12px;">خالی است</span>
                                        <?php else : ?>
                                            <span style="background: #ffebee; color: #c62828; padding: 3px 8px; border-radius: 3px; font-size: 12px;">عدم دسترسی / خطا</span>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php else : ?>
                <div class="notice notice-warning">
                    <p>هیچ داده‌ای یافت نشد. لطفاً ابتدا از منوی <strong>تنظیمات اتصال</strong> مشخصات دیتابیس خارجی را به درستی وارد کنید.</p>
                </div>
            <?php endif; ?>
        </div>
        <?php
    }

    /**
     * Render the settings page to configure connection.
     */
    public function render_settings_page() {
        ?>
        <div class="wrap" style="direction: rtl; text-align: right; font-family: Tahoma, sans-serif;">
            <h1>تنظیمات اتصال به دیتابیس خارجی</h1>
            <p>اطلاعات سرور دوم را در فرم زیر ثبت کنید:</p>

            <style>
                /* Toggle Switch CSS */
                .citibig-switch {
                    position: relative;
                    display: inline-block;
                    width: 44px;
                    height: 24px;
                    margin-left: 10px;
                    vertical-align: middle;
                }
                .citibig-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .citibig-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #cbd5e1;
                    transition: .4s;
                    border-radius: 24px;
                }
                .citibig-slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .citibig-slider {
                    background-color: #3b82f6;
                }
                input:focus + .citibig-slider {
                    box-shadow: 0 0 1px #3b82f6;
                }
                input:checked + .citibig-slider:before {
                    transform: translateX(20px);
                }
            </style>

            <form method="post" action="options.php" style="max-width: 600px; background: #fff; padding: 25px; border: 1px solid #ccd0d4; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-top: 15px;">
                <?php
                settings_fields( 'citibig_transit_group' );
                do_settings_sections( 'citibig-transit-settings' );
                ?>
                <table class="form-table" style="width: 100%;">
                    <tr>
                        <th scope="row" style="padding: 15px 0;"><label for="citibig_transit_db_host">آدرس هاست دیتابیس (IP/Domain)</label></th>
                        <td><input type="text" id="citibig_transit_db_host" name="citibig_transit_db_host" value="<?php echo esc_attr( get_option('citibig_transit_db_host') ); ?>" class="regular-text" style="direction: ltr;" placeholder="e.g. 192.168.1.100" /></td>
                    </tr>
                    <tr>
                        <th scope="row" style="padding: 15px 0;"><label for="citibig_transit_db_port">پورت دیتابیس</label></th>
                        <td><input type="text" id="citibig_transit_db_port" name="citibig_transit_db_port" value="<?php echo esc_attr( get_option('citibig_transit_db_port', '3306') ); ?>" class="regular-text" style="direction: ltr;" /></td>
                    </tr>
                    <tr>
                        <th scope="row" style="padding: 15px 0;"><label for="citibig_transit_db_name">نام دیتابیس</label></th>
                        <td><input type="text" id="citibig_transit_db_name" name="citibig_transit_db_name" value="<?php echo esc_attr( get_option('citibig_transit_db_name') ); ?>" class="regular-text" style="direction: ltr;" /></td>
                    </tr>
                    <tr>
                        <th scope="row" style="padding: 15px 0;"><label for="citibig_transit_db_user">نام کاربری دیتابیس</label></th>
                        <td><input type="text" id="citibig_transit_db_user" name="citibig_transit_db_user" value="<?php echo esc_attr( get_option('citibig_transit_db_user') ); ?>" class="regular-text" style="direction: ltr;" /></td>
                    </tr>
                    <tr>
                        <th scope="row" style="padding: 15px 0;"><label for="citibig_transit_db_pass">رمز عبور دیتابیس</label></th>
                        <td><input type="password" id="citibig_transit_db_pass" name="citibig_transit_db_pass" value="<?php echo esc_attr( get_option('citibig_transit_db_pass') ); ?>" class="regular-text" style="direction: ltr;" /></td>
                    </tr>
                </table>

                <h2 style="margin-top: 30px; border-bottom: 1px solid #ccd0d4; padding-bottom: 10px;">تنظیمات امنیتی (API)</h2>
                <table class="form-table" style="width: 100%;">
                    <tr>
                        <th scope="row" style="padding: 15px 0;"><label for="citibig_api_token">توکن وب‌سرویس</label></th>
                        <?php
                            $current_token = get_option('citibig_api_token');
                            if ( empty($current_token) ) {
                                $current_token = wp_generate_password(16, false);
                                update_option('citibig_api_token', $current_token);
                            }
                        ?>
                        <td><input type="text" id="citibig_api_token" name="citibig_api_token" value="<?php echo esc_attr($current_token); ?>" class="regular-text" style="direction: ltr; font-family: monospace; font-weight: bold; color: #d97706;" /></td>
                    </tr>
                </table>

                <h2 style="margin-top: 30px; border-bottom: 1px solid #ccd0d4; padding-bottom: 10px;">تنظیمات نمایش گزارش‌ها (فرانت‌اند)</h2>
                <p>گزارش‌هایی که نمی‌خواهید در صفحه داشبورد (توسط شورت‌کد) نمایش داده شوند را غیرفعال کنید:</p>
                <table class="form-table" style="width: 100%;">
                    <?php
                    $toggles_ui = [
                        'kpi'     => 'کارت‌های آماری کلی (KPI)',
                        'color'   => 'نمودار رنگ‌های ثبت شده',
                        'route'   => 'نمودار ایستگاه‌های هر مسیر',
                        'bustype' => 'نمودار سهم انواع اتوبوس‌ها',
                        'shift'   => 'نمودار نوبت کاری (روزانه/شبانه)',
                        'map'     => 'نقشه تعاملی ایستگاه‌ها',
                        'eta'     => 'جدول لحظه‌ای زمان رسیدن اتوبوس‌ها',
                        'history' => 'تحلیل پیشرفته تاریخچه شبکه',
                        'network' => 'وضعیت سلامت شبکه و تراکم زمان‌بندی',
                        'device'  => 'توزیع دستگاه‌ها در ایستگاه‌ها'
                    ];

                    foreach ( $toggles_ui as $key => $label ) {
                        $option_name = 'citibig_show_' . $key;
                        $checked = get_option( $option_name, '1' ) === '1' ? 'checked' : '';
                        ?>
                        <tr>
                            <th scope="row" style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;"><label for="<?php echo esc_attr($option_name); ?>" style="font-weight: 500; font-size: 14px;"><?php echo esc_html($label); ?></label></th>
                            <td style="border-bottom: 1px solid #f1f5f9; vertical-align: middle;">
                                <div style="display: flex; align-items: center;">
                                    <label class="citibig-switch">
                                        <input type="hidden" name="<?php echo esc_attr($option_name); ?>" value="0" />
                                        <input type="checkbox" id="<?php echo esc_attr($option_name); ?>" name="<?php echo esc_attr($option_name); ?>" value="1" <?php echo $checked; ?> />
                                        <span class="citibig-slider"></span>
                                    </label>
                                    <span style="color: #64748b; font-size: 13px;">نمایش داده شود</span>
                                </div>
                            </td>
                        </tr>
                        <?php
                    }
                    ?>
                </table>

                <div style="margin-top: 20px;">
                    <?php submit_button( 'ذخیره تنظیمات', 'primary', 'submit', false ); ?>
                    <a href="<?php echo esc_url( admin_url('admin.php?page=citibig-transit-main') ); ?>" class="button button-secondary" style="margin-right: 10px;">مشاهده وضعیت اتصال و داده‌ها</a>
                </div>
            </form>
        </div>
        <?php
    }

    /**
     * Render the diagnostics page to debug connection errors.
     */
    public function render_diagnostics_page() {
        $host = get_option( 'citibig_transit_db_host', '' );
        $port = get_option( 'citibig_transit_db_port', '3306' );
        $name = get_option( 'citibig_transit_db_name', '' );
        $user = get_option( 'citibig_transit_db_user', '' );
        $pass = get_option( 'citibig_transit_db_pass', '' );

        $diagnostics = [];
        $run_diagnostics = ! empty( $host );

        if ( $run_diagnostics ) {
            // 1. PHP Extension check
            $diagnostics['mysqli_ext'] = [
                'name' => 'بررسی لود بودن افزونه mysqli در PHP سرور وردپرس',
                'status' => extension_loaded( 'mysqli' ) ? 'success' : 'error',
                'message' => extension_loaded( 'mysqli' ) ? 'افزونه mysqli فعال است.' : 'افزونه mysqli روی هاست شما نصب یا فعال نیست!'
            ];

            // 2. DNS Resolution check
            $is_ip = filter_var( $host, FILTER_VALIDATE_IP );
            $resolved_ip = $is_ip ? $host : gethostbyname( $host );
            $dns_ok = $is_ip || ( $resolved_ip !== $host );
            $diagnostics['dns_resolve'] = [
                'name' => 'بررسی تبدیل نام هاست دیتابیس (DNS Resolution)',
                'status' => $dns_ok ? 'success' : 'error',
                'message' => $dns_ok 
                    ? ($is_ip ? "آدرس وارد شده یک آی‌پی معتبر است ({$host})." : "آدرس هاست با موفقیت به آی‌پی {$resolved_ip} ترجمه شد.")
                    : "امکان ترجمه هاست وجود ندارد. نام دامنه یا آی‌پی اشتباه وارد شده است یا سرور DNS هاست شما مشکل دارد."
            ];

            // 3. Host Outbound Firewall Check (using portquiz.net)
            $outbound_status = 'error';
            $outbound_msg = '';
            if ( $dns_ok ) {
                // portquiz.net listens on all TCP ports. If we can reach it, the host allows outbound traffic on this port.
                $outbound_test = @fsockopen( 'portquiz.net', (int)$port, $out_errno, $out_errstr, 3 );
                if ( is_resource( $outbound_test ) ) {
                    $outbound_status = 'success';
                    $outbound_msg = "هاست سایت شما اجازه خروج ترافیک از پورت {$port} را می‌دهد (تست از طریق portquiz.net موفق بود). فایروال هاست شما مشکلی ندارد.";
                    fclose( $outbound_test );
                } else {
                    $outbound_status = 'error';
                    $outbound_msg = "شرکت هاستینگ شما پورت خروجی {$port} را در فایروال خود مسدود کرده است! باید به پشتیبانی هاست تیکت بزنید.";
                }
            } else {
                $outbound_msg = "به دلیل عدم موفقیت در ترجمه DNS، تست فایروال هاست انجام نشد.";
            }
            $diagnostics['outbound_check'] = [
                'name' => "بررسی فایروال خروجی هاست سایت (پورت {$port})",
                'status' => $outbound_status,
                'message' => $outbound_msg
            ];

            // 4. Port/Socket check (Target server)
            $socket_status = 'error';
            $socket_msg = '';
            if ( $dns_ok ) {
                $connection_test = @fsockopen( $host, (int)$port, $errno, $errstr, 3 );
                if ( is_resource( $connection_test ) ) {
                    $socket_status = 'success';
                    $socket_msg = "پورت {$port} روی سرور مقصد باز است و ارتباط اولیه برقرار شد.";
                    fclose( $connection_test );
                } else {
                    $socket_status = 'error';
                    $blame = ($outbound_status === 'success') 
                        ? "چون هاست سایت شما پورت را نبسته، ۱۰۰٪ مشکل از فایروال سرور دیتابیس است که آی‌پی سایت شما را مسدود کرده است (نیاز به Whitelist)." 
                        : "دلیل این خطا بسته بودن پورت در هاست سایت خود شماست.";
                    $socket_msg = "پورت {$port} مسدود است! {$blame} متن خطا: [{$errno}] {$errstr}";
                }
            } else {
                $socket_msg = "به دلیل عدم موفقیت در ترجمه DNS، تست سوکت انجام نشد.";
            }
            $diagnostics['port_check'] = [
                'name' => "تست اتصال مستقیم به پورت شبکه مقصد ({$host}:{$port})",
                'status' => $socket_status,
                'message' => $socket_msg
            ];

            // 4. SQL Login Handshake check
            $mysql_status = 'error';
            $mysql_msg = '';
            if ( $socket_status === 'success' ) {
                mysqli_report( MYSQLI_REPORT_OFF );
                $link = mysqli_init();
                mysqli_options( $link, MYSQLI_OPT_CONNECT_TIMEOUT, 3 );
                $conn = @mysqli_real_connect( $link, $host, $user, $pass, $name, (int)$port );
                
                if ( $conn ) {
                    $mysql_status = 'success';
                    $mysql_msg = 'نام کاربری و رمز عبور دیتابیس صحیح است و اتصال SQL برقرار گردید.';
                    mysqli_close( $link );
                } else {
                    $mysql_status = 'error';
                    $error_no = mysqli_connect_errno();
                    $error_desc = mysqli_connect_error();
                    $mysql_msg = "خطا در احراز هویت دیتابیس! دسترسی کاربر نامعتبر است یا دیتابیسی با این نام وجود ندارد. کد خطا: [{$error_no}] {$error_desc}";
                }
            } else {
                $mysql_msg = "به دلیل بسته بودن پورت شبکه، تست ورود به پایگاه‌داده انجام نشد.";
            }
            $diagnostics['db_login'] = [
                'name' => 'تست احراز هویت و اطلاعات ورود دیتابیس (SQL Handshake)',
                'status' => $mysql_status,
                'message' => $mysql_msg
            ];
        }
        ?>
        <div class="wrap" style="direction: rtl; text-align: right; font-family: Tahoma, sans-serif;">
            <h1>عیب‌یابی اتصال دیتابیس سیتی بیگ</h1>
            <p>این صفحه با بررسی لایه به لایه، دقیقاً به شما نشان می‌دهد مشکل متصل نشدن به دیتابیس خارجی چیست:</p>

            <?php if ( ! $run_diagnostics ) : ?>
                <div class="notice notice-warning">
                    <p>ابتدا باید اطلاعات اتصال را در بخش <a href="<?php echo esc_url( admin_url('admin.php?page=citibig-transit-settings') ); ?>">تنظیمات اتصال</a> ذخیره کنید تا عیب‌یابی آغاز شود.</p>
                </div>
            <?php else : ?>
                <div style="margin-top: 20px;">
                    <?php foreach ( $diagnostics as $key => $test ) : ?>
                        <div style="background: #fff; padding: 15px; border-right: 5px solid <?php echo $test['status'] === 'success' ? '#46b450' : '#dc3232'; ?>; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 15px;">
                            <h3 style="margin: 0 0 10px 0; color: #23282d; font-size: 15px;">
                                <?php echo esc_html( $test['name'] ); ?>
                                <?php echo $test['status'] === 'success' ? '✅' : '❌'; ?>
                            </h3>
                            <p style="margin: 0; color: #555; font-size: 13px; font-family: sans-serif; line-height: 1.5;"><?php echo esc_html( $test['message'] ); ?></p>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div style="margin-top: 20px; background: #f0f0f1; padding: 15px; border-radius: 4px;">
                    <h3 style="margin-top: 0;">چطور نتایج بالا را تفسیر کنیم؟</h3>
                    <ul style="list-style-type: disc; padding-right: 20px; line-height: 1.6;">
                        <li>اگر تمام مراحل سبز هستند، یعنی افزونه در اتصال به دیتابیس کاملاً موفق بوده است.</li>
                        <li>اگر بخش <strong>تست باز بودن پورت شبکه</strong> قرمز است، مشکل صددرصد مربوط به فایروال هاست مبدا یا مقصد است که پورت ۳۳۰۶ را مسدود کرده است. متن خطای نمایش داده شده را برای هاستینگ خود ارسال کنید.</li>
                        <li>اگر بخش <strong>تست احراز هویت دیتابیس</strong> قرمز است، یعنی شبکه باز است اما نام کاربری، رمز عبور، یا نام دیتابیس را اشتباه وارد کرده‌اید یا کاربر دسترسی به این دیتابیس ندارد.</li>
                    </ul>
                </div>
            <?php endif; ?>
        </div>
        <?php
    }
}
