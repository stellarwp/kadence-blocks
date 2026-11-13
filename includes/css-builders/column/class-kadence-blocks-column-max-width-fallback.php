<?php
/**
 * Writes the maximum width of a larger device on mobile when mobile has none.
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

/**
 * Writes the maximum width of a larger device on mobile when mobile has none.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Max_Width_Fallback_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The position of the larger device: 0 desktop, 1 tablet.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param int $index The position of the larger device: 0 desktop, 1 tablet.
	 */
	public function __construct( $index ) {
		$this->index = $index;
	}

	/**
	 * Write the fallback maximum width.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( $this->has_stronger_width( $input ) || empty( $input->item( 'maxWidth', $this->index ) ) ) {
			return;
		}

		$css  = $input->css();
		$unit = $input->derived( 'layout' )->device( $this->index )->max_width_unit();

		Kadence_Blocks_Column_Selector::set( $input, '.wp-block-kadence-column.kb-section-sm-dir-vertical:not(.kb-section-sm-dir-horizontal):not(.kb-section-sm-dir-specificity)>.kt-inside-inner-col>{col}' );
		$css->add_property( 'max-width', $input->item( 'maxWidth', $this->index ) . $unit );
		$css->add_property( 'flex', '1' );
		$css->add_property( 'margin-left', 'auto' );
		$css->add_property( 'margin-right', 'auto' );
	}

	/**
	 * Whether mobile, or a device between this one and mobile, has its own maximum width.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	private function has_stronger_width( Kadence_Blocks_Css_Build_Input $input ): bool {
		for ( $stronger = 2; $stronger > $this->index; $stronger-- ) {
			if ( ! empty( $input->item( 'maxWidth', $stronger ) ) ) {
				return true;
			}
		}

		return false;
	}
}
