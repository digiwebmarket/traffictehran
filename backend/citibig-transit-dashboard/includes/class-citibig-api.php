<?php
/**
 * REST API Endpoints for Headless Architecture with Multi-Role Management
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Citibig_Transit_API {

    private $namespace = 'citibig/v1';

    public function __construct() {
        add_action( 'rest_api_init', [ $this, 'register_routes' ] );
    }

    /**
     * Check if the request is authorized using the transient token
     */
    public function check_auth( $request ) {
        $client_token = $request->get_header( 'X_CITIBIG_TOKEN' );
        if ( ! $client_token ) {
            $client_token = $request->get_header( 'x-citibig-token' );
        }
        
        if ( empty( $client_token ) ) {
            return new WP_Error( 'no_token', 'توکن ارسال نشده است.', [ 'status' => 401 ] );
        }

        $session_data = get_transient( 'citibig_session_' . $client_token );
        if ( ! $session_data ) {
            return new WP_Error( 'unauthorized', 'نشست شما منقضی شده یا توکن نامعتبر است. لطفاً مجدداً وارد شوید.', [ 'status' => 401 ] );
        }

        // Compatibility check: if it's just user_id (older sessions)
        if ( is_numeric( $session_data ) ) {
            $user_id = intval( $session_data );
            $user = get_userdata( $user_id );
            $role = 'operator';
            if ( $user && in_array( 'administrator', (array) $user->roles ) ) {
                $role = 'admin';
            } elseif ( $user && in_array( 'citibig_supervisor', (array) $user->roles ) ) {
                $role = 'supervisor';
            }
            $session_data = [ 'user_id' => $user_id, 'role' => $role ];
        } else {
            $user_id = intval( $session_data['user_id'] );
        }

        // Set the current user so permission checks work
        wp_set_current_user( $user_id );

        // Inject session info into request
        $request->set_param( '_citibig_session', $session_data );

        return true;
    }

    /**
     * Check if the request is authorized as administrator (only admins can edit devices)
     */
    public function check_admin_auth( $request ) {
        $auth = $this->check_auth( $request );
        if ( is_wp_error( $auth ) ) {
            return $auth;
        }

        $session_data = $request->get_param( '_citibig_session' );
        if ( empty( $session_data ) || $session_data['role'] !== 'admin' ) {
            return new WP_Error( 'forbidden', 'فقط مدیر سیستم دسترسی لازم برای تغییر دستگاه‌ها را دارد.', [ 'status' => 403 ] );
        }

        return true;
    }

    /**
     * Check if the request is authorized to view devices (admin and supervisor)
     */
    public function check_devices_view_auth( $request ) {
        $auth = $this->check_auth( $request );
        if ( is_wp_error( $auth ) ) {
            return $auth;
        }

        $session_data = $request->get_param( '_citibig_session' );
        if ( empty( $session_data ) || ! in_array( $session_data['role'], [ 'admin', 'supervisor' ] ) ) {
            return new WP_Error( 'forbidden', 'شما دسترسی لازم برای مشاهده مدیریت نمایشگرها را ندارید.', [ 'status' => 403 ] );
        }

        return true;
    }

    /**
     * Check if the request is authorized for user management (admin and supervisor)
     */
    public function check_user_management_auth( $request ) {
        $auth = $this->check_auth( $request );
        if ( is_wp_error( $auth ) ) {
            return $auth;
        }

        $session_data = $request->get_param( '_citibig_session' );
        if ( empty( $session_data ) || ! in_array( $session_data['role'], [ 'admin', 'supervisor' ] ) ) {
            return new WP_Error( 'forbidden', 'شما دسترسی لازم برای مدیریت کاربران را ندارید.', [ 'status' => 403 ] );
        }

        return true;
    }

    public function register_routes() {
        // Auth Check Endpoint (Public)
        register_rest_route( $this->namespace, '/auth', [
            'methods'  => 'POST',
            'callback' => [ $this, 'handle_auth' ],
            'permission_callback' => '__return_true'
        ]);

        // Charts Data Endpoint
        register_rest_route( $this->namespace, '/charts', [
            'methods'  => 'GET',
            'callback' => [ $this, 'get_charts_data' ],
            'permission_callback' => [ $this, 'check_auth' ]
        ]);

        // Devices CRUD Endpoints
        register_rest_route( $this->namespace, '/devices', [
            [
                'methods'  => 'GET',
                'callback' => [ $this, 'get_devices' ],
                'permission_callback' => [ $this, 'check_devices_view_auth' ]
            ],
            [
                'methods'  => 'POST',
                'callback' => [ $this, 'create_device' ],
                'permission_callback' => [ $this, 'check_admin_auth' ]
            ]
        ]);

        register_rest_route( $this->namespace, '/devices/(?P<id>\d+)', [
            [
                'methods'  => 'PUT',
                'callback' => [ $this, 'update_device' ],
                'permission_callback' => [ $this, 'check_admin_auth' ]
            ],
            [
                'methods'  => 'DELETE',
                'callback' => [ $this, 'delete_device' ],
                'permission_callback' => [ $this, 'check_admin_auth' ]
            ]
        ]);

        // Stations CRUD Endpoints
        register_rest_route( $this->namespace, '/stations', [
            'methods'  => 'GET',
            'callback' => [ $this, 'get_stations' ],
            'permission_callback' => [ $this, 'check_auth' ]
        ]);

        register_rest_route( $this->namespace, '/stations/(?P<id>\d+)/custom', [
            'methods'  => 'PUT',
            'callback' => [ $this, 'update_station_custom' ],
            'permission_callback' => [ $this, 'check_auth' ]
        ]);

        // Routes CRUD Endpoints
        register_rest_route( $this->namespace, '/routes', [
            'methods'  => 'GET',
            'callback' => [ $this, 'get_routes' ],
            'permission_callback' => [ $this, 'check_auth' ]
        ]);

        register_rest_route( $this->namespace, '/routes/(?P<id>\d+)/custom', [
            'methods'  => 'PUT',
            'callback' => [ $this, 'update_route_custom' ],
            'permission_callback' => [ $this, 'check_auth' ]
        ]);

        // Users CRUD Endpoints
        register_rest_route( $this->namespace, '/users', [
            [
                'methods'  => 'GET',
                'callback' => [ $this, 'get_users' ],
                'permission_callback' => [ $this, 'check_user_management_auth' ]
            ],
            [
                'methods'  => 'POST',
                'callback' => [ $this, 'create_user' ],
                'permission_callback' => [ $this, 'check_user_management_auth' ]
            ]
        ]);

        register_rest_route( $this->namespace, '/users/(?P<id>\d+)', [
            [
                'methods'  => 'PUT',
                'callback' => [ $this, 'update_user' ],
                'permission_callback' => [ $this, 'check_user_management_auth' ]
            ],
            [
                'methods'  => 'DELETE',
                'callback' => [ $this, 'delete_user' ],
                'permission_callback' => [ $this, 'check_user_management_auth' ]
            ]
        ]);
    }

    public function handle_auth( WP_REST_Request $request ) {
        $params = $request->get_json_params() ?: $request->get_body_params();
        $username = sanitize_text_field( $params['username'] ?? '' );
        $password = $params['password'] ?? '';

        if ( empty( $username ) || empty( $password ) ) {
            return new WP_Error( 'missing_credentials', 'نام کاربری و رمز عبور الزامی است.', [ 'status' => 400 ] );
        }

        $user = wp_authenticate( $username, $password );

        if ( is_wp_error( $user ) ) {
            return new WP_Error( 'invalid_credentials', 'نام کاربری یا رمز عبور اشتباه است.', [ 'status' => 401 ] );
        }

        // Determine the role
        $role = '';
        if ( in_array( 'administrator', (array) $user->roles ) ) {
            $role = 'admin';
        } elseif ( in_array( 'citibig_supervisor', (array) $user->roles ) ) {
            $role = 'supervisor';
        } elseif ( in_array( 'citibig_operator', (array) $user->roles ) ) {
            $role = 'operator';
        } else {
            return new WP_Error( 'forbidden', 'شما نقش کاربری مجاز برای ورود به سیستم را ندارید.', [ 'status' => 403 ] );
        }

        // Generate a session token
        $session_token = wp_generate_password( 32, false );
        
        $session_data = [
            'user_id' => $user->ID,
            'role'    => $role
        ];

        // Save token in transient for 24 hours
        set_transient( 'citibig_session_' . $session_token, $session_data, 24 * HOUR_IN_SECONDS );

        return rest_ensure_response([
            'success' => true,
            'token'   => $session_token,
            'role'    => $role,
            'message' => 'خوش آمدید ' . $user->display_name . '!'
        ]);
    }

    public function get_charts_data( WP_REST_Request $request ) {
        // --- تنظیمات نمایش (toggles) را همیشه مستقیم از دیتابیس بخوان ---
        // این باعث می‌شود تغییرات ادمین بلافاصله اعمال شوند بدون نیاز به پاک کردن کش
        $toggles = [
            'kpi'     => get_option('citibig_show_kpi', '1') === '1',
            'color'   => get_option('citibig_show_color', '1') === '1',
            'route'   => get_option('citibig_show_route', '1') === '1',
            'bustype' => get_option('citibig_show_bustype', '1') === '1',
            'shift'   => get_option('citibig_show_shift', '1') === '1',
            'map'     => get_option('citibig_show_map', '1') === '1',
            'eta'     => get_option('citibig_show_eta', '1') === '1',
            'history' => get_option('citibig_show_history', '1') === '1',
            'network' => get_option('citibig_show_network', '1') === '1',
            'device'  => get_option('citibig_show_device', '1') === '1'
        ];

        // داده‌های سنگین دیتابیسی را کش می‌کنیم (نه toggles را)
        $cache_key = 'citibig_charts_db_data';
        $cached_db_data = get_transient( $cache_key );
        
        if ( $cached_db_data === false ) {
            // Fetch all heavy database data points
            $cached_db_data = [
                'kpi'            => Citibig_Transit_DB::get_kpi_counts(),
                'colors'         => Citibig_Transit_DB::get_color_stats(),
                'routes'         => Citibig_Transit_DB::get_route_station_stats(),
                'bustypes'       => Citibig_Transit_DB::get_bus_type_stats(),
                'shifts'         => Citibig_Transit_DB::get_day_night_stats(),
                'stations'       => Citibig_Transit_DB::get_station_coordinates(),
                'etas'           => Citibig_Transit_DB::get_live_eta_data(),
                'delays'         => Citibig_Transit_DB::get_top_delayed_stations(),
                'network'        => Citibig_Transit_DB::get_network_health_stats(),
                'density'        => Citibig_Transit_DB::get_schedule_density_stats(),
                'device_mapping' => Citibig_Transit_DB::get_device_mapping_stats(),
            ];

            // Cache database data for 10 minutes
            set_transient( $cache_key, $cached_db_data, 10 * MINUTE_IN_SECONDS );
        }

        // ترکیب toggles لحظه‌ای با داده‌های کش شده
        $data = array_merge( [ 'toggles' => $toggles ], $cached_db_data );

        return rest_ensure_response( $data );
    }

    public function get_devices( WP_REST_Request $request ) {
        $devices = Citibig_Transit_DB::get_all_device_mappings();
        return rest_ensure_response( $devices );
    }

    public function create_device( WP_REST_Request $request ) {
        $params = $request->get_json_params() ?: $request->get_body_params();
        $imei = sanitize_text_field( $params['imei'] ?? '' );
        $station_code = intval( $params['station_code'] ?? 0 );
        $ip = sanitize_text_field( $params['ip'] ?? '' );

        if ( empty($imei) || $station_code <= 0 ) {
            return new WP_Error( 'invalid_data', 'اطلاعات ورودی نامعتبر است.', [ 'status' => 400 ] );
        }

        $result = Citibig_Transit_DB::insert_device_mapping( $imei, $station_code, $ip );
        if ( ! empty( $result['success'] ) ) {
            delete_transient( 'citibig_charts_data' );
            delete_transient( 'citibig_charts_db_data' );
        }
        return rest_ensure_response( $result );
    }

    public function update_device( WP_REST_Request $request ) {
        $id = intval( $request['id'] );
        $params = $request->get_json_params() ?: $request->get_body_params();
        $imei = sanitize_text_field( $params['imei'] ?? '' );
        $station_code = intval( $params['station_code'] ?? 0 );
        $ip = sanitize_text_field( $params['ip'] ?? '' );

        if ( $id <= 0 || empty($imei) || $station_code <= 0 ) {
            return new WP_Error( 'invalid_data', 'اطلاعات ورودی نامعتبر است.', [ 'status' => 400 ] );
        }

        $result = Citibig_Transit_DB::update_device_mapping( $id, $imei, $station_code, $ip );
        if ( ! empty( $result['success'] ) ) {
            delete_transient( 'citibig_charts_data' );
            delete_transient( 'citibig_charts_db_data' );
        }
        return rest_ensure_response( $result );
    }

    public function delete_device( WP_REST_Request $request ) {
        $id = intval( $request['id'] );
        if ( $id <= 0 ) {
            return new WP_Error( 'invalid_data', 'شناسه نامعتبر است.', [ 'status' => 400 ] );
        }

        $result = Citibig_Transit_DB::delete_device_mapping( $id );
        if ( ! empty( $result['success'] ) ) {
            delete_transient( 'citibig_charts_data' );
            delete_transient( 'citibig_charts_db_data' );
        }
        return rest_ensure_response( $result );
    }

    public function get_stations( WP_REST_Request $request ) {
        $stations = Citibig_Transit_DB::get_all_stations();
        return rest_ensure_response( $stations );
    }

    public function get_routes( WP_REST_Request $request ) {
        $routes = Citibig_Transit_DB::get_all_routes();
        return rest_ensure_response( $routes );
    }

    public function update_station_custom( WP_REST_Request $request ) {
        $id = intval( $request['id'] );
        $params = $request->get_json_params() ?: $request->get_body_params();
        $station_custom = isset($params['station_custom']) ? sanitize_text_field($params['station_custom']) : '';

        $result = Citibig_Transit_DB::update_station_custom_fields( $id, $station_custom );
        
        if ( ! empty( $result['success'] ) ) {
            delete_transient( 'citibig_charts_data' );
            delete_transient( 'citibig_charts_db_data' );
        }
        return rest_ensure_response( $result );
    }

    public function update_route_custom( WP_REST_Request $request ) {
        $id = intval( $request['id'] );
        $params = $request->get_json_params() ?: $request->get_body_params();
        $terminal1_custom = isset($params['Terminal1_custom']) ? sanitize_text_field($params['Terminal1_custom']) : '';
        $terminal2_custom = isset($params['Terminal2_custom']) ? sanitize_text_field($params['Terminal2_custom']) : '';

        $result = Citibig_Transit_DB::update_route_custom_fields( $id, $terminal1_custom, $terminal2_custom );
        
        if ( ! empty( $result['success'] ) ) {
            delete_transient( 'citibig_charts_data' );
            delete_transient( 'citibig_charts_db_data' );
        }
        return rest_ensure_response( $result );
    }

    /**
     * User Management Endpoints
     */
    public function get_users( WP_REST_Request $request ) {
        $session = $request->get_param( '_citibig_session' );
        $role = $session['role'];

        $roles_to_query = [];
        if ( $role === 'admin' ) {
            $roles_to_query = [ 'citibig_supervisor', 'citibig_operator' ];
        } elseif ( $role === 'supervisor' ) {
            $roles_to_query = [ 'citibig_operator' ];
        }

        $users = get_users([
            'role__in' => $roles_to_query,
            'orderby'  => 'ID',
            'order'    => 'DESC'
        ]);

        $response_data = [];
        foreach ( $users as $u ) {
            $u_role = 'operator';
            if ( in_array( 'citibig_supervisor', (array) $u->roles ) ) {
                $u_role = 'supervisor';
            }
            $response_data[] = [
                'id'           => $u->ID,
                'username'     => $u->user_login,
                'display_name' => $u->display_name,
                'role'         => $u_role,
                'created_at'   => $u->user_registered
            ];
        }

        return rest_ensure_response( $response_data );
    }

    public function create_user( WP_REST_Request $request ) {
        $session = $request->get_param( '_citibig_session' );
        $current_role = $session['role'];

        $params = $request->get_json_params() ?: $request->get_body_params();
        $username = sanitize_text_field( $params['username'] ?? '' );
        $password = $params['password'] ?? '';
        $role = sanitize_text_field( $params['role'] ?? 'operator' );

        // Validation
        if ( empty( $username ) || empty( $password ) ) {
            return new WP_Error( 'invalid_data', 'نام کاربری و کلمه عبور الزامی است.', [ 'status' => 400 ] );
        }

        if ( strlen( $password ) < 4 ) {
            return new WP_Error( 'weak_password', 'کلمه عبور باید حداقل ۴ کاراکتر باشد.', [ 'status' => 400 ] );
        }

        if ( ! in_array( $role, [ 'supervisor', 'operator' ] ) ) {
            return new WP_Error( 'invalid_role', 'نقش انتخابی نامعتبر است.', [ 'status' => 400 ] );
        }

        // Supervisor role checking: Supervisors can only create Operators
        if ( $current_role === 'supervisor' && $role !== 'operator' ) {
            return new WP_Error( 'forbidden', 'سوپروایزر فقط می‌تواند کاربر اپراتور بسازد.', [ 'status' => 403 ] );
        }

        if ( username_exists( $username ) ) {
            return new WP_Error( 'user_exists', 'این نام کاربری قبلا در سیستم ثبت شده است.', [ 'status' => 400 ] );
        }

        // Insert WordPress user
        $user_id = wp_insert_user([
            'user_login'   => $username,
            'user_pass'    => $password,
            'display_name' => $username,
            'role'         => 'citibig_' . $role
        ]);

        if ( is_wp_error( $user_id ) ) {
            return new WP_Error( 'registration_failed', $user_id->get_error_message(), [ 'status' => 500 ] );
        }

        return rest_ensure_response([
            'success' => true,
            'message' => 'کاربر جدید با موفقیت ثبت شد.',
            'user'    => [
                'id'           => $user_id,
                'username'     => $username,
                'display_name' => $username,
                'role'         => $role
            ]
        ]);
    }

    public function update_user( WP_REST_Request $request ) {
        $session = $request->get_param( '_citibig_session' );
        $current_role = $session['role'];
        $target_user_id = intval( $request['id'] );

        $target_user = get_userdata( $target_user_id );
        if ( ! $target_user ) {
            return new WP_Error( 'user_not_found', 'کاربر مورد نظر یافت نشد.', [ 'status' => 404 ] );
        }

        // Determine target user's role
        $target_role = '';
        if ( in_array( 'citibig_supervisor', (array) $target_user->roles ) ) {
            $target_role = 'supervisor';
        } elseif ( in_array( 'citibig_operator', (array) $target_user->roles ) ) {
            $target_role = 'operator';
        } else {
            return new WP_Error( 'forbidden', 'شما مجاز به ویرایش این کاربر نیستید.', [ 'status' => 403 ] );
        }

        // Permissions logic
        if ( $current_role === 'supervisor' && $target_role !== 'operator' ) {
            return new WP_Error( 'forbidden', 'سوپروایزر فقط مجاز به ویرایش اپراتورها است.', [ 'status' => 403 ] );
        }

        $params = $request->get_json_params() ?: $request->get_body_params();
        $password = $params['password'] ?? '';
        $role = sanitize_text_field( $params['role'] ?? '' );

        $user_data = [ 'ID' => $target_user_id ];

        // Update password if provided
        if ( ! empty( $password ) ) {
            if ( strlen( $password ) < 4 ) {
                return new WP_Error( 'weak_password', 'کلمه عبور باید حداقل ۴ کاراکتر باشد.', [ 'status' => 400 ] );
            }
            $user_data['user_pass'] = $password;
        }

        // Update role if provided
        if ( ! empty( $role ) ) {
            if ( ! in_array( $role, [ 'supervisor', 'operator' ] ) ) {
                return new WP_Error( 'invalid_role', 'نقش انتخابی نامعتبر است.', [ 'status' => 400 ] );
            }
            if ( $current_role === 'supervisor' && $role !== 'operator' ) {
                return new WP_Error( 'forbidden', 'سوپروایزر نمی‌تواند نقش کاربر را به غیر از اپراتور تغییر دهد.', [ 'status' => 403 ] );
            }
            $user_data['role'] = 'citibig_' . $role;
        }

        // Perform update
        if ( count( $user_data ) > 1 ) {
            $result = wp_update_user( $user_data );
            if ( is_wp_error( $result ) ) {
                return new WP_Error( 'update_failed', $result->get_error_message(), [ 'status' => 500 ] );
            }
        }

        return rest_ensure_response([
            'success' => true,
            'message' => 'اطلاعات کاربر با موفقیت به‌روزرسانی شد.'
        ]);
    }

    public function delete_user( WP_REST_Request $request ) {
        $session = $request->get_param( '_citibig_session' );
        $current_role = $session['role'];
        $target_user_id = intval( $request['id'] );

        $target_user = get_userdata( $target_user_id );
        if ( ! $target_user ) {
            return new WP_Error( 'user_not_found', 'کاربر مورد نظر یافت نشد.', [ 'status' => 404 ] );
        }

        // Determine target user's role
        $target_role = '';
        if ( in_array( 'citibig_supervisor', (array) $target_user->roles ) ) {
            $target_role = 'supervisor';
        } elseif ( in_array( 'citibig_operator', (array) $target_user->roles ) ) {
            $target_role = 'operator';
        } else {
            return new WP_Error( 'forbidden', 'شما مجاز به حذف این کاربر نیستید.', [ 'status' => 403 ] );
        }

        // Permissions logic
        if ( $current_role === 'supervisor' && $target_role !== 'operator' ) {
            return new WP_Error( 'forbidden', 'سوپروایزر فقط مجاز به حذف اپراتورها است.', [ 'status' => 403 ] );
        }

        // Delete user (requires wp-admin/includes/user.php)
        require_once ABSPATH . 'wp-admin/includes/user.php';
        $deleted = wp_delete_user( $target_user_id );

        if ( ! $deleted ) {
            return new WP_Error( 'delete_failed', 'خطا در حذف کاربر از دیتابیس.', [ 'status' => 500 ] );
        }

        return rest_ensure_response([
            'success' => true,
            'message' => 'کاربر با موفقیت حذف شد.'
        ]);
    }
}
