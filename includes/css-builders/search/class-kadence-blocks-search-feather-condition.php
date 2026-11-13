<?php
/**
 * Tells whether an icon is a Feather icon.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';

/**
 * Tells whether an icon attribute names a Feather icon, which is drawn with a stroke instead of a fill.
 *
 * @since TBD
 */
final class Kadence_Blocks_Search_Feather_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The attribute that stores the icon name.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * Create the object.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the icon name.
	 */
	public function __construct( string $attribute ) {
		$this->attribute = $attribute;
	}

	/**
	 * Whether the icon is a Feather icon.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$icon = $input->attribute( $this->attribute );

		return ! empty( $icon ) && 'fe' === substr( $icon, 0, 2 );
	}
}
