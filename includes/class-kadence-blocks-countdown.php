<?php
/**
 * Setup the Countdown Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Countdown Block.
 *
 * @category class
 */
class Kadence_Blocks_Countdown {

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * Google fonts to enqueue
	 *
	 * @var array
	 */
	public static $gfonts = array();

	/**
	 * Countdown Block information.
	 *
	 * @var array
	 */
	public static $countdown = array();


	/**
	 * Instance Control
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
	/**
	 * Class Constructor.
	 */
	public function __construct() {
		add_action( 'wp_footer', array( $this, 'countdown_enqueue' ), 1 );
	}

	/**
	 * Render Countdown Block
	 *
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_countdown( $attributes, $content ) {
		if ( ! is_array( $attributes ) ) {
			return;
		}
		if ( ! wp_style_is( 'kadence-blocks-countdown', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-countdown' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id      = $attributes['uniqueID'];
			$campaign_id    = ( isset( $attributes['campaignID'] ) && ! empty( $attributes['campaignID'] ) ? $attributes['campaignID'] : $unique_id );
			$countdown_type = ( isset( $attributes['countdownType'] ) && ! empty( $attributes['countdownType'] ) ? $attributes['countdownType'] : 'date' );
			$site_slug      = apply_filters( 'kadence_blocks_countdown_site_slug', sanitize_title( get_bloginfo( 'name' ) ) );
			$reset_days     = ( isset( $attributes['evergreenReset'] ) && ! empty( $attributes['evergreenReset'] ) ? $attributes['evergreenReset'] : 30 );
			self::$countdown[ $unique_id ] = array(
				'timestamp'    => ( isset( $attributes['timestamp'] ) ? $attributes['timestamp'] : '' ),
				'type'         => $countdown_type,
				'revealOnLoad' => ( isset( $attributes['revealOnLoad'] ) && $attributes['revealOnLoad'] ? true : false ),
				'stopWatch'    => ( isset( $attributes['timeNumbers'] ) && $attributes['timeNumbers'] ? true : false ),
				'dividers'     => ( isset( $attributes['countdownDivider'] ) && $attributes['countdownDivider'] ? true : false ),
				'action'       => ( isset( $attributes['expireAction'] ) ? $attributes['expireAction'] : 'none' ),
				'redirect'     => ( isset( $attributes['redirectURL'] ) ? $attributes['redirectURL'] : '' ),
				'reset'        => $reset_days,
				'campaign_id'  => $campaign_id,
				'evergreen'    => ( 'evergreen' === $countdown_type ? apply_filters( 'kadence_blocks_countdown_evergreen_config', 'query', $campaign_id, $site_slug, $reset_days ) : '' ),
				'strict'       => ( isset( $attributes['evergreenStrict'] ) && $attributes['evergreenStrict'] ? true : false ),
				'hours'        => ( isset( $attributes['evergreenHours'] ) ? $attributes['evergreenHours'] : '' ),
				'minutes'      => ( isset( $attributes['evergreenMinutes'] ) ? $attributes['evergreenMinutes'] : '' ),
				'timer'        => ( isset( $attributes['enableTimer'] ) ? $attributes['enableTimer'] : true ),
				'units'        => ( isset( $attributes['units'] ) ? $attributes['units'] : array( array( 'days' => true, 'hours' => true, 'minutes' => true, 'seconds' => true ) ) ),
				'preLabel'     => ( isset( $attributes['preLabel'] ) ? $attributes['preLabel'] : '' ),
				'postLabel'    => ( isset( $attributes['postLabel'] ) ? $attributes['postLabel'] : '' ),
				'daysLabel'    => ( isset( $attributes['daysLabel'] ) && ! empty( $attributes['daysLabel'] ) ? $attributes['daysLabel'] : esc_attr__( 'Days', 'kadence-blocks' ) ),
				'hoursLabel'   => ( isset( $attributes['hoursLabel'] ) && ! empty( $attributes['hoursLabel'] ) ? $attributes['hoursLabel'] : esc_attr__( 'Hrs', 'kadence-blocks' ) ),
				'minutesLabel' => ( isset( $attributes['minutesLabel'] ) && ! empty( $attributes['minutesLabel'] ) ? $attributes['minutesLabel'] : esc_attr__( 'Mins', 'kadence-blocks' ) ),
				'secondsLabel' => ( isset( $attributes['secondsLabel'] ) && ! empty( $attributes['secondsLabel'] ) ? $attributes['secondsLabel'] : esc_attr__( 'Secs', 'kadence-blocks' ) ),
			);


		}
		return $content;
	}
	/**
	 * Adds countdown data.
	 */
	public function countdown_enqueue() {
		wp_localize_script(
			'kadence-blocks-countdown',
			'kadence_blocks_countdown',
			array(
				'ajax_url'   => admin_url( 'admin-ajax.php' ),
				'ajax_nonce' => wp_create_nonce( 'kadence_blocks_countdown' ),
				'site_slug'  => apply_filters( 'kadence_blocks_countdown_site_slug', sanitize_title( get_bloginfo( 'name' ) ) ),
				'timers'     => wp_json_encode( self::$countdown ),
			)
		);
	}
}
Kadence_Blocks_Countdown::get_instance();
