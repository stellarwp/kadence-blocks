<?php
/**
 * Rowlayout columns.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * The columns of the row layout: how many, how they are laid out and how wide they are on every
 * device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Columns {

	/**
	 * The names of the column width attributes, in order.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const NAMES = [ 'first', 'second', 'third', 'fourth', 'fifth', 'sixth' ];

	/**
	 * The end of the width attribute names, by device.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const SUFFIXES = [
		'desktop' => '',
		'tablet'  => 'Tablet',
		'mobile'  => 'Mobile',
	];

	/**
	 * The layouts that can reverse the order of the columns.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const COLLAPSING = [ 'row', 'two-grid', 'three-grid', 'last-row', 'first-row' ];

	/**
	 * The block attributes.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $attributes;

	/**
	 * Create the columns.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 */
	public function __construct( array $attributes ) {
		$this->attributes = $attributes;
	}

	/**
	 * How many columns the row has.
	 *
	 * @since TBD
	 *
	 * @return mixed
	 */
	public function count() {
		return ! empty( $this->attributes['columns'] ) ? $this->attributes['columns'] : 2;
	}

	/**
	 * The layout of a device: `desktop`, `tablet` or `mobile`.
	 *
	 * @since TBD
	 *
	 * @param string $device The device.
	 *
	 * @return mixed
	 */
	public function layout_for( $device ) {
		$desktop = ! empty( $this->attributes['colLayout'] ) ? $this->attributes['colLayout'] : 'equal';
		$tablet  = $this->attributes['tabletLayout'] ?? null;
		$mobile  = ! empty( $this->attributes['mobileLayout'] ) ? $this->attributes['mobileLayout'] : 'row';

		if ( 'mobile' === $device ) {
			return $mobile;
		}

		return 'tablet' === $device && ! empty( $tablet ) && 'inherit' !== $tablet ? $tablet : $desktop;
	}

	/**
	 * Whether the layout can reverse the order of the columns, and the editor asked for it.
	 *
	 * @since TBD
	 *
	 * @param mixed $layout The layout.
	 *
	 * @return bool
	 */
	public function is_collapsing( $layout ): bool {
		$order = $this->attributes['collapseOrder'] ?? null;

		return ! empty( $order ) && 'left-to-right' !== $order && in_array( $layout, self::COLLAPSING, true );
	}

	/**
	 * The widths of the columns on a device.
	 *
	 * @since TBD
	 *
	 * @param string $device The device.
	 *
	 * @return array
	 */
	public function widths( $device ): array {
		$widths = [];

		foreach ( self::NAMES as $name ) {
			$saved    = $this->attributes[ $name . 'ColumnWidth' . self::SUFFIXES[ $device ] ] ?? null;
			$widths[] = ! empty( $saved ) ? $saved : '';
		}

		return $widths;
	}

	/**
	 * Whether the columns of a device have their own widths.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input  What the section needs to write its CSS.
	 * @param string                         $device The device.
	 *
	 * @return bool
	 */
	public function has_custom_widths( Kadence_Blocks_Css_Build_Input $input, $device ): bool {
		return (bool) $input->context()->call( 'has_custom_widths', $this->count(), ...$this->widths( $device ) );
	}

	/**
	 * The widths a grid uses: those of the device, or those of desktop for a tablet that has none of its
	 * own.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input  What the section needs to write its CSS.
	 * @param string                         $source `desktop`, `tablet`, `mobile` or `tablet_inherit`.
	 *
	 * @return array
	 */
	public function widths_for( Kadence_Blocks_Css_Build_Input $input, $source ): array {
		if ( 'tablet_inherit' === $source ) {
			return $this->widths( $this->has_custom_widths( $input, 'tablet' ) ? 'tablet' : 'desktop' );
		}

		return $this->widths( $source );
	}
}
