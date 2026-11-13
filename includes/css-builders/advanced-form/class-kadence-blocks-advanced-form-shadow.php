<?php
/**
 * Writes the legacy box shadow of the fields, when it is switched on.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/class-kadence-blocks-advanced-form-settings.php';

/**
 * Writes the legacy box shadow of the fields, when it is switched on.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advanced_Form_Shadow_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute of the shadow, in the style of the fields.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $key;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $key The attribute of the shadow, in the style of the fields.
	 */
	public function __construct( $key ) {
		$this->key = $key;
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
		$settings = $input->derived( 'settings' );
		$style    = $settings->group( 'style' );
		$shadow   = $style[ $this->key ] ?? null;

		if ( ! is_array( $shadow ) || empty( $shadow[0] ) || true !== $shadow[0] ) {
			return;
		}

		$css = $input->css();

		$css->add_property( 'box-shadow', $css->render_legacy_shadow( $shadow, $this->defaults() ) );
	}

	/**
	 * The values a shadow uses when it does not save its own.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	private function defaults(): array {
		return [
			'hOffset' => '2',
			'vOffset' => '2',
			'blur'    => '3',
			'spread'  => '0',
			'color'   => '#000000',
			'opacity' => 0.4,
		];
	}
}
