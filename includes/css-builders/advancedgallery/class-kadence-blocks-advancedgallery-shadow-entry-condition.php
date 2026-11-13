<?php
/**
 * Tells whether an attribute stores a shadow.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-advancedgallery-shadow-entry.php';

/**
 * Tells whether an attribute stores a shadow.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Shadow_Entry_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The attribute that stores the shadows.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the shadows.
	 */
	public function __construct( $attribute ) {
		$this->attribute = $attribute;
	}

	/**
	 * Whether the attribute stores a shadow.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return null !== ( new Kadence_Blocks_Advancedgallery_Shadow_Entry( $this->attribute, false ) )->first( $input );
	}
}
