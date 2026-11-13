<?php
/**
 * Builds the CSS for the captcha block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';

/**
 * Builds the CSS for the captcha block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Captcha_Css {

	/**
	 * What this builder needs from the block.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Block_Context
	 */
	private $context;

	/**
	 * Create the builder.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Block_Context $context What this builder needs from the block.
	 */
	public function __construct( Kadence_Blocks_Css_Block_Context $context ) {
		$this->context = $context;
	}

	/**
	 * Build the block CSS.
	 *
	 * @since TBD
	 *
	 * @param array                                     $attributes      The block attributes.
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css             The CSS builder.
	 * @param string                                    $unique_id       The block unique id.
	 * @param string                                    $unique_style_id The unique id used for the style handle.
	 *
	 * @return string|null
	 */
	public function build( $attributes, $css, $unique_id, $unique_style_id ) {
		$class_id = $this->context->call( 'class_id', $attributes );

		$input = new Kadence_Blocks_Css_Build_Input(
			$attributes,
			$css,
			$unique_id,
			$unique_style_id,
			$this->context
		);

		$css->set_style_id( 'kb-' . $this->context->block_name() . $unique_style_id );

		foreach ( $this->sections( $class_id ) as $section ) {
			$section->write( $input );
		}

		return $css->css_output();
	}

	/**
	 * The sections of the block CSS, in the order they are written.
	 *
	 * The sections share one CSS builder, its current selector and its media state, so their order matters.
	 *
	 * @since TBD
	 *
	 * @param string $class_id The id of the field that the form saved for the block.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function sections( $class_id ): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-advanced-form .kb-field' . $class_id ),
			new Kadence_Blocks_Css_Responsive_Range_Section( 'maxWidth', 'max-width', 'maxWidthUnit' ),
			new Kadence_Blocks_Css_Responsive_Range_Section( 'minWidth', 'min-width', 'minWidthUnit' ),
			new Kadence_Blocks_Css_Enabled_Section( 'hideRecaptcha', [ new Kadence_Blocks_Css_Selector_Section( '.grecaptcha-badge' ), new Kadence_Blocks_Css_Static_Section( 'visibility', 'hidden' ) ] ),
		];
	}
}
