<?php
/**
 * Builds the CSS for the header block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Builds the CSS for the header block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Header_Css extends Kadence_Blocks_Css_Block_Builder {

	/**
	 * Whether the block has CSS to build.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return bool
	 */
	protected function applies( $attributes ): bool {
		return ! empty( $attributes['id'] );
	}

	/**
	 * Values worked out once from the attributes, for the sections to read.
	 *
	 * @since TBD
	 *
	 * @param array  $attributes The block attributes.
	 * @param string $unique_id The block unique id.
	 *
	 * @return array
	 */
	protected function derived( $attributes, $unique_id ): array {
		return [
			'post'        => $this->post_attributes()->for_post( $attributes['id'] ),
			'environment' => new Kadence_Blocks_Header_Site_Environment(),
		];
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
	protected function sections(): array {
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
