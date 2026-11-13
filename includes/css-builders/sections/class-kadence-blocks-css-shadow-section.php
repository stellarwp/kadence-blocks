<?php
/**
 * Writes the box shadow of the column.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the box shadow of the column.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Shadow_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The shadow written when the editor saved none and the block gives no other.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const FALLBACK = 'rgba(0, 0, 0, 0.2) 0px 0px 14px 0px';

	/**
	 * The attribute that stores the shadow.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The shadow written when the editor saved none.
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
	 * @param string      $attribute The attribute that stores the shadow.
	 * @param string|null $fallback  The shadow written when the editor saved none, or null for the usual one.
	 */
	public function __construct( $attribute, $fallback = null ) {
		$this->attribute = $attribute;
		$this->fallback  = $fallback ?? self::FALLBACK;
	}

	/**
	 * Write the shadow.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$shadow = $input->attribute( $this->attribute );
		$css    = $input->css();

		if ( is_array( $shadow ) && is_array( $shadow[0] ?? null ) ) {
			$css->add_property( 'box-shadow', $css->render_shadow( $shadow[0], $this->defaults() ) );
			return;
		}

		$css->add_property( 'box-shadow', $this->fallback );
	}

	/**
	 * The shadow used for what the editor did not save.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	private function defaults(): array {
		return [
			'hOffset' => '0',
			'vOffset' => '0',
			'blur'    => '14',
			'spread'  => '0',
			'color'   => '#000000',
			'opacity' => 0.2,
		];
	}
}
