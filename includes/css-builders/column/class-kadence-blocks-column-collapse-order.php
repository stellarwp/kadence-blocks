<?php
/**
 * Writes the order of the column when its row collapses.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-column-selector.php';

/**
 * Writes the order of the column when its row collapses.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Collapse_Order_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The name of the layout class, `tab` or `mobile`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $layout;

	/**
	 * What follows the order.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $suffix;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $layout The part of the layout class name that tells the device, `tab` or `mobile`.
	 * @param string $suffix What follows the order.
	 */
	public function __construct( $layout, $suffix ) {
		$this->layout = $layout;
		$this->suffix = $suffix;
	}

	/**
	 * Write the order.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$order = $input->attribute( 'collapseOrder' );

		if ( null === $order ) {
			return;
		}

		$layouts = [ 'three-grid', 'two-grid', 'row' ];
		$parts   = [];

		foreach ( $layouts as $name ) {
			$parts[] = '.kt-row-column-wrap.kt-' . $this->layout . '-layout-' . $name . ' > {col}';
		}

		Kadence_Blocks_Column_Selector::set( $input, implode( ', ', $parts ) );
		$input->css()->add_property( 'order', $order . $this->suffix );
	}
}
