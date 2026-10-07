<?php
/**
 * Plugin Name: Citibig Transit Dashboard (Test Version)
 * Description: Connects to a remote database and displays transit charts and reports.
 * Version: 1.0.0
 * Author: Citibig Web
 * Text Domain: citibig-transit
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Define plugin constants
define( 'CITIBIG_TRANSIT_PATH', plugin_dir_path( __FILE__ ) );
define( 'CITIBIG_TRANSIT_URL', plugin_dir_url( __FILE__ ) );
define( 'CITIBIG_TRANSIT_VERSION', '1.0.0' );

// Include required modular classes
require_once CITIBIG_TRANSIT_PATH . 'includes/class-citibig-db.php';
require_once CITIBIG_TRANSIT_PATH . 'includes/class-citibig-admin.php';
require_once CITIBIG_TRANSIT_PATH . 'includes/class-citibig-assets.php';
require_once CITIBIG_TRANSIT_PATH . 'includes/class-citibig-shortcode.php';
require_once CITIBIG_TRANSIT_PATH . 'includes/class-citibig-api.php';

// Initialize the plugin components
function run_citibig_transit_dashboard() {
    new Citibig_Transit_API();

    // Instantiate Admin Settings
    if ( is_admin() ) {
        new Citibig_Transit_Admin();
    }
    
    // Instantiate Assets Loader
    new Citibig_Transit_Assets();
    
    // Instantiate Shortcodes Handler
    new Citibig_Transit_Shortcode();
}
add_action( 'plugins_loaded', 'run_citibig_transit_dashboard' );

// Register custom user roles
function citibig_register_custom_roles() {
    add_role( 'citibig_supervisor', 'Citibig Supervisor', array(
        'read' => true,
    ) );
    add_role( 'citibig_operator', 'Citibig Operator', array(
        'read' => true,
    ) );
}
add_action( 'init', 'citibig_register_custom_roles' );

