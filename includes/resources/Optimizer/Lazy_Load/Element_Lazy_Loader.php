<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Lazy_Load;

use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Sections\Lazy_Render_Decider;
use WP_HTML_Tag_Processor;

/**
 * Process section Optimization data to set content visibility on the Kadence row layout and column
 * block.
 *
 * @phpstan-type HtmlClassHeightMap array<string, float> Class attribute => height in pixels.
 */
final class Element_Lazy_Loader {

	private const CONTENT_VISIBILITY     = 'content-visibility';
	private const CONTAIN_INTRINSIC_SIZE = 'contain-intrinsic-size';

	private Lazy_Render_Decider $decider;

	public function __construct(
		Lazy_Render_Decider $decider
	) {
		$this->decider = $decider;
	}

	/**
	 * Add content-visibility CSS to below the fold Kadence row elements.
	 *
	 * @filter kadence_blocks_row_wrapper_args
	 *
	 * @param array<string, mixed> $args The wrapper div HTML attributes.
	 * @param array<string, mixed> $attributes The current block attributes.
	 *
	 * @return array<string, mixed>
	 */
	public function set_content_visibility_for_row( array $args, array $attributes ): array {
		$unique_id = $attributes['uniqueID'] ?? false;

		if ( ! $unique_id ) {
			return $args;
		}

		$classes = (string) ( $args['class'] ?? '' );

		// Explode class string into array for exact matching.
		$class_list = array_filter( preg_split( '/\s+/', $classes ) );

		// Bypass lazy rendering if we find an excluded class (exact match only).
		if ( ! $this->decider->should_lazy_render( $class_list ) ) {
			return $args;
		}

		$height = $this->decider->get_section_height_by_unique_id( $unique_id );

		if ( $height <= 0 ) {
			return $args;
		}

		$current_style = (string) ( $args['style'] ?? '' );

		if ( $this->has_content_visibility( $current_style ) ) {
			return $args;
		}

		$args['style'] = $this->prepend_style( $height, $current_style );

		return $args;
	}

	/**
	 * Set content visibility on found kadence/column sections.
	 *
	 * @filter kadence_blocks_column_html
	 *
	 * @param string $html The kadence/column html.
	 *
	 * @return string
	 */
	public function modify_column_html( string $html ): string {
		$p = new WP_HTML_Tag_Processor( $html );

		if ( ! $p->next_tag( [ 'class_name' => 'wp-block-kadence-column' ] ) ) {
			return $html;
		}

		$class_attr = $p->get_attribute( 'class' );

		if ( ! $class_attr ) {
			return $html;
		}

		$height = $this->decider->get_section_height_by_class_attr( $class_attr );

		if ( $height <= 0 ) {
			return $html;
		}

		$current_style = (string) $p->get_attribute( 'style' );

		if ( $this->has_content_visibility( $current_style ) ) {
			return $html;
		}

		$p->set_attribute( 'style', $this->prepend_style( $height, $current_style ) );

		return $p->get_updated_html();
	}

	/**
	 * Check if a style attribute already has content-visibility.
	 *
	 * @param string $current_style The current style attribute value.
	 *
	 * @return bool
	 */
	private function has_content_visibility( string $current_style ): bool {
		return str_contains( $current_style, self::CONTENT_VISIBILITY ) ||
				str_contains( $current_style, self::CONTAIN_INTRINSIC_SIZE );
	}

	/**
	 * Prepend the content-visibility styles to an existing style string.
	 *
	 * @param float  $height The section height.
	 * @param string $current_style The current style.
	 *
	 * @return string
	 */
	private function prepend_style( float $height, string $current_style ): string {
		return sprintf(
			'%s: auto;%s: auto %dpx;%s',
			self::CONTENT_VISIBILITY,
			self::CONTAIN_INTRINSIC_SIZE,
			$height,
			trim( $current_style )
		);
	}
}
