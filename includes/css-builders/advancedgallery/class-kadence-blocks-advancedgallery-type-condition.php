<?php
/**
 * Tells whether the gallery is one of some types.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the gallery is one of some types.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Type_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The types that scroll.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const CAROUSELS = [ 'carousel', 'fluidcarousel', 'slider', 'thumbslider' ];

	/**
	 * The types.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $types;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param array $types The types.
	 */
	public function __construct( array $types ) {
		$this->types = $types;
	}

	/**
	 * A condition that is met for every type that scrolls.
	 *
	 * @since TBD
	 *
	 * @return self
	 */
	public static function carousel() {
		return new self( self::CAROUSELS );
	}

	/**
	 * Whether the gallery is one of the types.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return in_array( $input->derived( 'gallery_type' ), $this->types, true );
	}
}
