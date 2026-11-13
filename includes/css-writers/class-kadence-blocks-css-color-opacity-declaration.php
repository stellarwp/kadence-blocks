<?php
/**
 * A color declaration that applies an optional opacity.
 *
 * @package Kadence Blocks
 */

/**
 * Writes a color property with an opacity, using full opacity when the opacity is not numeric.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Color_Opacity_Declaration {

	/**
	 * The CSS property name, such as `background`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * Create the declaration.
	 *
	 * @since TBD
	 *
	 * @param string $property The CSS property name.
	 */
	public function __construct( string $property ) {
		$this->property = $property;
	}

	/**
	 * Write the color with its opacity when the color is not empty.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css     The CSS builder.
	 * @param mixed                                     $color   The raw color attribute, null when it was never set.
	 * @param mixed                                     $opacity The raw opacity attribute, null when it was never set.
	 *
	 * @return void
	 */
	public function write( $css, $color, $opacity ): void {
		if ( empty( $color ) ) {
			return;
		}

		$alpha = is_numeric( $opacity ) ? $opacity : 1;

		$css->add_property( $this->property, $css->render_color( $color, $alpha ) );
	}
}
