<?php

declare( strict_types=1 );

namespace Helper;

use Codeception\Module;
use Kadence_Blocks_Abstract_Block;
use Kadence_Blocks_CSS;

/**
 * Builds a block's CSS the way its render callback does and compares it with a
 * stored copy under `tests/_data/block-css/`.
 */
final class BlockCss extends Module {

	/**
	 * @param Kadence_Blocks_Abstract_Block $block      The block.
	 * @param array<string, mixed>          $attributes Block attributes, `uniqueID` included.
	 *
	 * @return string
	 */
	public function block_css( Kadence_Blocks_Abstract_Block $block, array $attributes ): string {
		return $block->build_css( $attributes, new Kadence_Blocks_CSS(), $attributes['uniqueID'], $attributes['uniqueID'] );
	}

	/**
	 * Renders block markup the way a page renders it and returns the CSS Kadence
	 * collected for one block type.
	 *
	 * Rendering goes through each block's render callback, so the
	 * `kadence_blocks_{block}_render_block_attributes` filter applies. Each entry
	 * of `$template_parts` is stored as a template part of the active theme, so
	 * `wp:template-part` blocks in the markup find it.
	 *
	 * @param string                $markup         Block markup.
	 * @param string                $block_name     Kadence block name without the namespace, e.g. `singlebtn`.
	 * @param array<string, string> $template_parts Template part slug => block markup.
	 *
	 * @return string The block type's CSS, in render order.
	 */
	public function rendered_block_css( string $markup, string $block_name, array $template_parts = [] ): string {
		Kadence_Blocks_CSS::$styles        = [];
		Kadence_Blocks_CSS::$head_styles   = [];
		Kadence_Blocks_CSS::$custom_styles = [];

		foreach ( $template_parts as $slug => $part_markup ) {
			$part_id = wp_insert_post(
				[
					'post_type'    => 'wp_template_part',
					'post_status'  => 'publish',
					'post_name'    => $slug,
					'post_title'   => $slug,
					'post_content' => $part_markup,
				]
			);
			$this->assertIsInt( $part_id, 'Could not create the template part.' );
			wp_set_post_terms( $part_id, get_stylesheet(), 'wp_theme' );
		}

		do_blocks( $markup );

		$css = '';
		foreach ( Kadence_Blocks_CSS::$styles as $style_id => $style ) {
			if ( str_starts_with( $style_id, 'kb-' . $block_name ) ) {
				$css .= $style;
			}
		}

		return $css;
	}

	/**
	 * @param string $name File name, without extension, in `tests/_data/block-css/`.
	 * @param string $css  The CSS to compare.
	 */
	public function assert_block_css_matches( string $name, string $css ): void {
		$this->assertStringEqualsFile( codecept_data_dir( 'block-css/' . $name . '.css' ), $css );
	}
}
