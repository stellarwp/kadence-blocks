<?php
/**
 * Builds the CSS for the advancedbtn block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/advancedbtn/loader.php';

/**
 * Builds the CSS for the advancedbtn block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Css {

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
		$input = new Kadence_Blocks_Css_Build_Input( $attributes, $css, $unique_id, $unique_style_id, $this->context );

		$css->set_style_id( 'kb-' . $this->context->block_name() . $unique_style_id );

		foreach ( $this->sections() as $section ) {
			$section->write( $input );
		}

		return $css->css_output();
	}

	/**
	 * The sections of the block CSS, in the order they are written.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( [ '.wp-block-kadence-advancedbtn.kt-btns{id}', '.site .entry-content .wp-block-kadence-advancedbtn.kt-btns{id}', '.wp-block-kadence-advancedbtn.kb-btns{id}', '.site .entry-content .wp-block-kadence-advancedbtn.kb-btns{id}' ] ),
			new Kadence_Blocks_Advancedbtn_Group_Margin_Css(),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-advancedbtn.kb-btns{id}' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding', [ 'unit_key' => 'paddingUnit' ] ),
			new Kadence_Blocks_Advancedbtn_Group_Gap_Css(),
			new Kadence_Blocks_Advancedbtn_Alignment_Css(),
			new Kadence_Blocks_Advancedbtn_Video_Assets_Css(),
			new Kadence_Blocks_Advancedbtn_Typography_Css(),
			new Kadence_Blocks_Advancedbtn_Buttons_Css(),
		];
	}
}
