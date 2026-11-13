<?php
/**
 * Builds the CSS for the identity block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/identity/loader.php';

/**
 * Builds the CSS for the identity block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Identity_Css {

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
		$input = new Kadence_Blocks_Css_Build_Input(
			$attributes,
			$css,
			$unique_id,
			$unique_style_id,
			$this->context
		);

		$css->set_style_id( 'kb-' . $this->context->block_name() . $unique_style_id );

		foreach ( $this->sections() as $section ) {
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
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kb-identity{id}' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding' ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin' ),
			new Kadence_Blocks_Css_Rule_Section(
				'.kb-identity{id} a',
				[
					'text-decoration' => 'inherit',
					'color'           => 'inherit',
				]
			),
			new Kadence_Blocks_Css_Selector_Section( '.kb-identity{id} .wp-block-site-title' ),
			new Kadence_Blocks_Css_Typography_Section( 'titleTypography' ),
			new Kadence_Blocks_Css_Selector_Section( '.kb-identity{id} .wp-block-site-tagline' ),
			new Kadence_Blocks_Css_Typography_Section( 'taglineTypography' ),
			new Kadence_Blocks_Css_Selector_Section( '.kb-identity{id} .kb-identity-layout-container' ),
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Identity_Aligned_Layout_Condition(), [ new Kadence_Blocks_Identity_Vertical_Align_Css() ], [] ),
		];
	}
}
