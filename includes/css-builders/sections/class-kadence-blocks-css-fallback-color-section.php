<?php
/**
 * Writes a color, or the one named when the attribute is not set.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a color, or the one named when the attribute is not set.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Fallback_Color_Section implements Kadence_Blocks_Css_Section {

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
	 * The color to render when the attribute is not set.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $fallback;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $property  The CSS property.
	 * @param string $attribute The attribute that stores the color.
	 * @param string $fallback  The color to render when the attribute is not set.
	 */
	public function __construct( $property, $attribute, $fallback ) {
		$this->property  = $property;
		$this->attribute = $attribute;
		$this->fallback  = $fallback;
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
		$css = $input->css();

		$css->add_property( $this->property, $css->render_color( $input->attribute( $this->attribute, $this->fallback ) ) );
	}
}
