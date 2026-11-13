<?php
/**
 * Builds the CSS for the header block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/header/loader.php';

/**
 * Builds the CSS for the header block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Header_Css {

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
		if ( empty( $attributes['id'] ) ) {
			return;
		}

		$input = new Kadence_Blocks_Css_Build_Input(
			$attributes,
			$css,
			$unique_id,
			$unique_style_id,
			$this->context,
			[
				'post'        => $this->post_attributes()->for_post( $attributes['id'] ),
				'environment' => new Kadence_Blocks_Header_Site_Environment(),
			]
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
			new Kadence_Blocks_Css_Derived_Scope_Section(
				'post',
				[
					new Kadence_Blocks_Css_Sized_Dynamic_Section(),
					new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-header{id} .kb-header-container' ),
					new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin', [ 'unit_key' => 'marginUnit' ] ),
					new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding', [ 'unit_key' => 'paddingUnit' ] ),
					new Kadence_Blocks_Css_Typography_Section( 'typography' ),
					new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Header_Backdrop_Condition(), $this->backdrop_sections(), [] ),
				]
			),
		];
	}

	/**
	 * The sections of the backdrop filter of the header.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function backdrop_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( [ '.wp-block-kadence-header{id} .kb-header-container:not(:has(.item-is-stuck))', '.wp-block-kadence-header{id} .item-is-stuck' ] ),
			new Kadence_Blocks_Css_Static_Section( 'position', 'relative' ),
			new Kadence_Blocks_Css_Static_Section( 'z-index', '10' ),
			new Kadence_Blocks_Css_Attribute_Section( 'backdrop-filter', 'pro_backdropFilterString' ),
		];
	}

	/**
	 * Where the attributes of the header post come from.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Post_Attributes
	 */
	private function post_attributes(): Kadence_Blocks_Css_Post_Attributes {
		return new Kadence_Blocks_Css_Context_Post_Attributes( $this->context, 'kadence_header', '_kad_header_' );
	}
}
