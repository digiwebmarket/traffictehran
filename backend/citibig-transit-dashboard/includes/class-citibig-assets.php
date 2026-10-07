<?php
/**
 * Class to manage enqueuing CSS and JS assets.
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Citibig_Transit_Assets {

    public function __construct() {
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_frontend_assets' ] );
    }

    public function enqueue_frontend_assets() {
        // Enqueue Leaflet CSS and JS locally (Offline)
        wp_enqueue_style( 'leaflet-css', CITIBIG_TRANSIT_URL . 'assets/css/leaflet.css', [], '1.9.4' );
        wp_enqueue_script( 'leaflet-js', CITIBIG_TRANSIT_URL . 'assets/js/leaflet.js', [], '1.9.4', true );

        // Enqueue Chart.js locally (Offline)
        wp_enqueue_script( 'chart-js', CITIBIG_TRANSIT_URL . 'assets/js/chart.js', [], '4.4.0', true );

        // Enqueue custom style
        wp_enqueue_style( 'citibig-transit-style', CITIBIG_TRANSIT_URL . 'assets/css/citibig-style.css', [], CITIBIG_TRANSIT_VERSION );

        // Enqueue custom script (depends on jquery, chart-js, and leaflet-js)
        wp_enqueue_script( 'citibig-transit-script', CITIBIG_TRANSIT_URL . 'assets/js/citibig-charts.js', [ 'jquery', 'chart-js', 'leaflet-js' ], CITIBIG_TRANSIT_VERSION, true );
    }
}
