<?php
/**
 * Advanced Buttons button shadow.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a button box shadow saved in the older list format.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Legacy_Shadow_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the shadow.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The values used for whatever the saved shadow leaves out.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $defaults;

	/**
	 * Whether the shadow must be an inset one (true), must not be (false) or has no such check (null).
	 *
	 * @since TBD
	 *
	 * @var bool|null
	 */
	private $inset;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string    $attribute The attribute that stores the shadow.
	 * @param array     $defaults  The values used for whatever the saved shadow leaves out.
	 * @param bool|null $inset     Whether the shadow must be an inset one (true), must not be (false) or has no such check (null).
	 */
	public function __construct( $attribute, array $defaults, $inset ) {
		$this->attribute = $attribute;
		$this->defaults  = $defaults;
		$this->inset     = $inset;
	}

	/**
	 * Write the shadow when it is switched on and matches the inset check.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$shadow = $input->attribute( $this->attribute );

		if ( ! $this->applies( $shadow ) ) {
			return;
		}

		$input->css()->add_property( 'box-shadow', $input->css()->render_legacy_shadow( $shadow, $this->defaults ) );
	}

	/**
	 * Whether the saved shadow is switched on and matches the inset check.
	 *
	 * @since TBD
	 *
	 * @param mixed $shadow The saved shadow.
	 *
	 * @return bool
	 */
	private function applies( $shadow ): bool {
		if ( ! is_array( $shadow ) || true !== ( $shadow[0] ?? null ) ) {
			return false;
		}

		if ( null === $this->inset ) {
			return true;
		}

		return isset( $shadow[7] ) && $this->inset === ( true === $shadow[7] );
	}
}
