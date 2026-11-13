<?php
/**
 * Renders the value as a sanitized CSS color.
 *
 * @package Kadence Blocks
 */

/**
 * Renders the value through the builder color sanitizer, which keeps colors as stored.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Sanitized_Color_Format implements Kadence_Blocks_Css_Value_Format {

	/**
	 * The CSS builder that sanitizes the value.
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
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css The CSS builder that sanitizes the value.
	 */
	public function __construct( $css ) {
		$this->css = $css;
	}

	/**
	 * Sanitize the color.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The raw attribute value.
	 *
	 * @return mixed
	 */
	public function format( $value ) {
		return $this->css->sanitize_color( $value );
	}
}
