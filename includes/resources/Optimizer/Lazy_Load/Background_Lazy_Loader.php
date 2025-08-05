<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Lazy_Load;

use KadenceWP\KadenceBlocks\Asset\Asset;
use KadenceWP\KadenceBlocks\Optimizer\Analysis_Registry;
use WP_HTML_Tag_Processor;

/**
 * Handles setting up the Kadence Row Layout Block for background image
 * lazy loading.
 */
final class Background_Lazy_Loader {

	private Asset $asset;
	private Analysis_Registry $registry;

	public function __construct(
		Asset $asset,
		Analysis_Registry $registry
	) {
		$this->asset    = $asset;
		$this->registry = $registry;
	}

	/**
	 * Add lazy loading attributes to the row layout block's wrapper div.
	 *
	 * @filter kadence_blocks_row_wrapper_args
	 *
	 * @note Video posters come in as a bgImg as well.
	 *
	 * @param array<string, mixed> $attrs The wrapper div HTML attributes.
	 * @param array<string, mixed> $attributes The current block attributes.
	 *
	 * @return array<string, mixed>
	 */
	public function lazy_load_row_background_images( array $attrs, array $attributes ): array {
		$bg      = $attributes['bgImg'] ?? '';
		$classes = (string) ( $attrs['class'] ?? '' );

		if ( ! $bg ) {
			return $attrs;
		}

		if ( ! $this->registry->is_optimized() ) {
			return $attrs;
		}

		$background_images = $this->registry->get_background_images();

		if ( $background_images ) {
			$lookup = array_flip( $background_images );

			// Exclude above the fold background images.
			if ( isset( $lookup[ $bg ] ) ) {
				return $attrs;
			}
		}

		$is_inline = $attributes['backgroundInline'] ?? false;

		// Add lazy loading data attributes for CSS backgrounds.
		if ( $classes ) {
			$attrs['data-kadence-lazy-class']   = $classes;
			$attrs['data-kadence-lazy-trigger'] = 'viewport';
			$attrs['data-kadence-lazy-attrs']   = 'class';
			unset( $attrs['class'] );
		}

		// Add lazy loading data attributes for inline style background images.
		if ( $is_inline ) {
			$attrs['data-kadence-lazy-style']     = $attrs['style'] ?? '';
			$attrs['data-kadence-lazy-trigger'] ??= 'viewport';

			if ( ! empty( $attrs['data-kadence-lazy-attrs'] ) ) {
				$attrs['data-kadence-lazy-attrs'] .= ',style';
			} else {
				$attrs['data-kadence-lazy-attrs'] = 'style';
			}

			unset( $attrs['style'] );
		}

		// Enqueue the lazy loader script if we found a bg.
		$this->enqueue_scripts();

		return $attrs;
	}

	/**
	 * Lazy load columns with background images.
	 *
	 * @filter kadence_blocks_column_html
	 *
	 * @param string $html The kadence/column html.
	 * @param array  $attributes The block attributes.
	 *
	 * @return string
	 */
	public function lazy_load_column_backgrounds( string $html, array $attributes ): string {
		$bg = $attributes['backgroundImg'][0]['bgImg'] ?? false;

		if ( ! $bg ) {
			return $html;
		}

		if ( ! $this->registry->is_optimized() ) {
			return $html;
		}

		$background_images = $this->registry->get_background_images();

		if ( $background_images ) {
			$lookup = array_flip( $background_images );

			// Exclude above the fold background images.
			if ( isset( $lookup[ $bg ] ) ) {
				return $html;
			}
		}

		$p = new WP_HTML_Tag_Processor( $html );

		if ( ! $p->next_tag( [ 'class_name' => 'wp-block-kadence-column' ] ) ) {
			return $html;
		}

		$class_attr = $p->get_attribute( 'class' );

		if ( ! $class_attr ) {
			return $html;
		}

		$p->set_attribute( 'data-kadence-lazy-class', $class_attr );
		$p->set_attribute( 'data-kadence-lazy-trigger', 'viewport' );
		$p->set_attribute( 'data-kadence-lazy-attrs', 'class' );

		$p->remove_attribute( 'class' );

		// Enqueue the lazy loader script if we found a bg.
		$this->enqueue_scripts();

		return $p->get_updated_html();
	}

	/**
	 * Enqueue the lazy loading frontend script.
	 *
	 * @return void
	 */
	private function enqueue_scripts(): void {
		$this->asset->enqueue_script( 'lazy-loader', 'dist/lazy-loader' );
	}
}
