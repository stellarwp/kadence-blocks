<?php
/**
 * Tells whether a border was saved the legacy way.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Whether a color or any side of the border width was saved.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tableofcontents_Border_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The attribute that stores the border color.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $color;

	/**
	 * The attribute that stores the border widths.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $border;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $color  The attribute that stores the border color.
	 * @param string $border The attribute that stores the border widths.
	 */
	public function __construct( string $color, string $border ) {
		$this->color  = $color;
		$this->border = $border;
	}

	/**
	 * Whether the color is set or any side of the width is a number.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$attributes = $input->attributes();

		if ( ! empty( $attributes[ $this->color ] ) ) {
			return true;
		}

		return $this->has_number( $input->css(), $attributes );
	}

	/**
	 * Whether any side of the border width is a number.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css        The CSS builder.
	 * @param array                                     $attributes The block attributes.
	 *
	 * @return bool
	 */
	private function has_number( $css, array $attributes ): bool {
		foreach ( [ 0, 1, 2, 3 ] as $side ) {
			// Checked by reference, as the block always did, so a width that is not a list fails the same way.
			if ( $css->is_number( $attributes[ $this->border ][ $side ] ) ) {
				return true;
			}
		}

		return false;
	}
}
