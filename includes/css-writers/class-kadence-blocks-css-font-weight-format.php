<?php
/**
 * Renders the value as a font weight.
 *
 * @package Kadence Blocks
 */

/**
 * Renders the value as a font weight.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Font_Weight_Format implements Kadence_Blocks_Css_Value_Format {

	/**
	 * The CSS builder that renders the value.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS
	 */
	private $css;

	/**
	 * Create the format.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css The CSS builder that renders the value.
	 */
	public function __construct( $css ) {
		$this->css = $css;
	}

	/**
	 * Render the value.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The raw attribute value.
	 *
	 * @return mixed
	 */
	public function format( $value ) {
		return $this->css->render_font_weight( $value );
	}
}
