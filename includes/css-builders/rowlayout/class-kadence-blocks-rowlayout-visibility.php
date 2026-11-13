<?php
/**
 * Hides the row on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-selector.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-environment.php';

/**
 * Hides the row on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Visibility_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that hides the row.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The media state.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $state;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that hides the row.
	 * @param string $state     The media state.
	 */
	public function __construct( $attribute, $state ) {
		$this->attribute = $attribute;
		$this->state     = $state;
	}

	/**
	 * Write the rule.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( empty( $input->attribute( $this->attribute ) ) ) {
			return;
		}

		$input->css()->set_media_state( $this->state );
		Kadence_Blocks_Rowlayout_Selector::set( $input, 'base' );
		$input->css()->add_property( 'display', 'none !important' );
		$input->css()->set_media_state( 'desktop' );
	}
}
