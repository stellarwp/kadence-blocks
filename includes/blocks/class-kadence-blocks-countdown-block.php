<?php
/**
 * Class to Build the Countdown Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Groups_Site_Styles;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Supports_Site_Styles;

/**
 * Class to Build the Countdown Block.
 *
 * @category class
 */
class Kadence_Blocks_Countdown_Block extends Kadence_Blocks_Abstract_Block implements Supports_Site_Styles, Groups_Site_Styles {

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $block_name = 'countdown';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = true;

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
	 * Builds CSS for block.
	 *
	 * @param array $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		return Kadence_Blocks_Css_Builders::build( 'Kadence_Blocks_Countdown_Css', $this, $this->block_name, $attributes, $css, $unique_id, $unique_style_id );
	}
	/**
	 * Return dynamically generated HTML for block
	 *
	 * @param $attributes
	 * @param $unique_id
	 * @param $content
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		//$countdown should grow with each countdown that gets loaded to the page
		static $countdown        = array();
		$campaign_id             = ( ! empty( $attributes['campaignID'] ) ? $attributes['campaignID'] : $unique_id );
		$countdown_type          = ( ! empty( $attributes['countdownType'] ) ? $attributes['countdownType'] : 'date' );
		$site_slug               = apply_filters( 'kadence_blocks_countdown_site_slug', sanitize_title( get_bloginfo( 'name' ) ) );
		$reset_days              = ( isset( $attributes['evergreenReset'] ) && ! empty( $attributes['evergreenReset'] ) ? $attributes['evergreenReset'] : 30 );
		$countdown[ $unique_id ] = array(
			'timestamp'    => ( isset( $attributes['timestamp'] ) ? esc_attr( $attributes['timestamp'] ) : '' ),
			'type'         => esc_attr( $countdown_type ),
			'revealOnLoad' => ( isset( $attributes['revealOnLoad'] ) && $attributes['revealOnLoad'] ? true : false ),
			'stopWatch'    => ( isset( $attributes['timeNumbers'] ) && $attributes['timeNumbers'] ? true : false ),
			'dividers'     => ( isset( $attributes['countdownDivider'] ) && $attributes['countdownDivider'] ? true : false ),
			'action'       => ( isset( $attributes['expireAction'] ) ? esc_attr( $attributes['expireAction'] ) : 'none' ),
			'redirect'     => ( isset( $attributes['redirectURL'] ) ? esc_url( $attributes['redirectURL'] ) : '' ),
			'repeat'       => ( isset( $attributes['repeat'] ) && $attributes['repeat'] ? true : false ),
			'frequency'    => ( isset( $attributes['frequency'] ) ? esc_attr( $attributes['frequency'] ) : '' ),
			'stopCount'    => ( isset( $attributes['stopRepeating'] ) && $attributes['stopRepeating'] ? true : false ),
			'endDate'      => ( isset( $attributes['endDate'] ) ? esc_attr( $attributes['endDate'] ) : '' ),
			'reset'        => esc_attr( $reset_days ),
			'time_offset'  => get_option( 'gmt_offset' ),
			'campaign_id'  => esc_attr( $campaign_id ),
			'evergreen'    => ( 'evergreen' === $countdown_type ? apply_filters( 'kadence_blocks_countdown_evergreen_config', 'query', $campaign_id, $site_slug, $reset_days ) : '' ),
			'strict'       => ( isset( $attributes['evergreenStrict'] ) && $attributes['evergreenStrict'] ? true : false ),
			'hours'        => ( isset( $attributes['evergreenHours'] ) ? esc_attr( $attributes['evergreenHours'] ) : '' ),
			'minutes'      => ( isset( $attributes['evergreenMinutes'] ) ? esc_attr( $attributes['evergreenMinutes'] ) : '' ),
			'timer'        => ( isset( $attributes['enableTimer'] ) && ! $attributes['enableTimer'] ? false : true ),
			'units'        => array(
				array(
					'days'    => ( isset( $attributes['units'][0]['days'] ) && ! $attributes['units'][0]['days'] ? false : true ),
					'hours'   => ( isset( $attributes['units'][0]['hours'] ) && ! $attributes['units'][0]['hours'] ? false : true ),
					'minutes' => ( isset( $attributes['units'][0]['minutes'] ) && ! $attributes['units'][0]['minutes'] ? false : true ),
					'seconds' => ( isset( $attributes['units'][0]['seconds'] ) && ! $attributes['units'][0]['seconds'] ? false : true ),
				),
			),
			'preLabel'     => ( ! empty( $attributes['preLabel'] ) ? sanitize_text_field( $attributes['preLabel'] ) : '' ),
			'postLabel'    => ( ! empty( $attributes['postLabel'] ) ? sanitize_text_field( $attributes['postLabel'] ) : '' ),
			'daysLabel'    => ( ! empty( $attributes['daysLabel'] ) ? sanitize_text_field( $attributes['daysLabel'] ) : esc_attr__( 'Days', 'kadence-blocks' ) ),
			'hoursLabel'   => ( ! empty( $attributes['hoursLabel'] ) ? sanitize_text_field( $attributes['hoursLabel'] ) : esc_attr__( 'Hrs', 'kadence-blocks' ) ),
			'minutesLabel' => ( ! empty( $attributes['minutesLabel'] ) ? sanitize_text_field( $attributes['minutesLabel'] ) : esc_attr__( 'Mins', 'kadence-blocks' ) ),
			'secondsLabel' => ( ! empty( $attributes['secondsLabel'] ) ? sanitize_text_field( $attributes['secondsLabel'] ) : esc_attr__( 'Secs', 'kadence-blocks' ) ),
		);
		wp_localize_script(
			'kadence-blocks-countdown',
			'kadence_blocks_countdown',
			array(
				'ajax_url'   => admin_url( 'admin-ajax.php' ),
				'ajax_nonce' => wp_create_nonce( 'kadence_blocks_countdown' ),
				'site_slug'  => apply_filters( 'kadence_blocks_countdown_site_slug', sanitize_title( get_bloginfo( 'name' ) ) ),
				'timers'     => wp_json_encode( $countdown ),
			)
		);

		return $content;
	}

	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {
		parent::register_scripts();
		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		if ( apply_filters( 'kadence_blocks_check_if_rest', false ) && kadence_blocks_is_rest() ) {
			return;
		}

		wp_register_script( 'kadence-blocks-countdown', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-countdown.min.js', array( 'wp-i18n' ), KADENCE_BLOCKS_VERSION, true );
		wp_set_script_translations( 'kadence-blocks-countdown', 'kadence-blocks' );
	}

	/**
	 * The editor paints every Countdown value itself, in its own style tag, and
	 * the instance rule outranks core's, so every site value goes through the
	 * overlay.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_overlay_attributes(): array {
		return array_merge( array_merge( ...$this->site_styles_attribute_groups() ), [ 'background', 'itemBackground', 'numberColor', 'labelColor' ] );
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_attributes_map(): array {
		return [];
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_supports(): array {
		return [];
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_selectors(): array {
		return [];
	}

	/**
	 * Each spacing and border takes its devices and unit or color with it, each
	 * radius its sides, and each font is kept whole, for the container and the
	 * count items.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_attribute_groups(): array {
		return [
			[ 'containerPadding', 'containerTabletPadding', 'containerMobilePadding', 'paddingType' ],
			[ 'containerMargin', 'containerTabletMargin', 'containerMobileMargin', 'marginType' ],
			[ 'border', 'borderWidth', 'tabletBorderWidth', 'mobileBorderWidth' ],
			[ 'borderRadius' ],
			[ 'itemPadding', 'itemTabletPadding', 'itemMobilePadding', 'itemPaddingType' ],
			[ 'itemBorder', 'itemBorderWidth', 'itemTabletBorderWidth', 'itemMobileBorderWidth' ],
			[ 'itemBorderRadius' ],
			[ 'numberFont' ],
			[ 'labelFont' ],
		];
	}
}

Kadence_Blocks_Countdown_Block::get_instance();
