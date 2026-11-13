<?php
/**
 * Makes the column sticky and writes its desktop offset.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-column-selector.php';
require_once __DIR__ . '/class-kadence-blocks-column-selector-css.php';
require_once __DIR__ . '/class-kadence-blocks-column-device.php';
require_once __DIR__ . '/class-kadence-blocks-column-layout.php';
require_once __DIR__ . '/class-kadence-blocks-column-flex-values.php';
require_once __DIR__ . '/class-kadence-blocks-column-sticky-offset.php';

/**
 * Makes the column sticky and writes its desktop offset.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Sticky_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the sticky rules.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( true !== $input->attribute( 'sticky' ) ) {
			return;
		}

		$css = $input->css();

		$css->set_selector( '#wrapper.site' );
		$css->add_property( 'overflow', 'clip' );

		( new Kadence_Blocks_Column_Sticky_Offset_Css( 'desktop', 0 ) )->write( $input );
	}
}
