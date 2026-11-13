<?php
/**
 * Writes one color when it was saved.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes one color when it was saved.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Color_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The selector.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $selector;

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The attribute that stores the color.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $selector  The selector, `{id}` stands for the block unique id.
	 * @param string $property  The CSS property.
	 * @param string $attribute The attribute that stores the color.
	 */
	public function __construct( $selector, $property, $attribute ) {
		$this->selector  = $selector;
		$this->property  = $property;
		$this->attribute = $attribute;
	}

	/**
	 * Write the color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$color = $input->attribute( $this->attribute );

		if ( empty( $color ) ) {
			return;
		}

		$css = $input->css();

		$css->set_selector( str_replace( '{id}', $input->unique_id(), $this->selector ) );
		$css->add_property( $this->property, $css->render_color( $color ) );
	}
}
