<?php
/**
 * Writes the font size of a part of the countdown.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-countdown-font.php';

/**
 * Writes the font size of a part of the countdown for a device, under the current selector or under a selector of its own.
 *
 * @since TBD
 */
final class Kadence_Blocks_Countdown_Font_Size_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the font.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $font_attribute;

	/**
	 * The device, 0 for desktop, 1 for tablet, 2 for mobile.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * The selector to write under, or null for the current one.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private $selector;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string      $font_attribute The attribute that stores the font.
	 * @param int         $index          The device, 0 for desktop, 1 for tablet, 2 for mobile.
	 * @param string|null $selector       The selector to write under, or null for the current one.
	 */
	public function __construct( string $font_attribute, int $index, ?string $selector ) {
		$this->font_attribute = $font_attribute;
		$this->index          = $index;
		$this->selector       = $selector;
	}

	/**
	 * Write the font size.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css  = $input->css();
		$size = Kadence_Blocks_Countdown_Font::from_input( $input, $this->font_attribute )->size( $css, $this->index );

		if ( null === $size ) {
			return;
		}

		if ( null !== $this->selector ) {
			$css->set_selector( str_replace( '{id}', $input->unique_id(), $this->selector ) );
		}

		$css->add_property( 'font-size', $size );
	}
}
