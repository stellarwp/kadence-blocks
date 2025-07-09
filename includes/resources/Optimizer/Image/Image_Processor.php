<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Image;

use KadenceWP\KadenceBlocks\Optimizer\Enums\Viewport;
use KadenceWP\KadenceBlocks\Optimizer\Image\Contracts\Processor;
use KadenceWP\KadenceBlocks\Optimizer\Image\Processors\Sizes_Attribute_Processor;
use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rule_Collection;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Viewport_Trait;
use WP_HTML_Tag_Processor;
use WP_Post;

/**
 * Modify HTML img tags before the HTML is sent back to the browser:
 *
 *  - 1. Set correct lazy load attributes.
 *  - 2. Set the optimal sizes attribute.
 */
final class Image_Processor {

	use Viewport_Trait;

	/**
	 * Counts the image index to match up what's found
	 * with our parsed images.
	 *
	 * @var int
	 */
	private int $counter = 0;
	private Store $store;
	private Rule_Collection $rules;

	/**
	 * The list of image processors.
	 *
	 * @var Processor[]
	 */
	private array $processors;

	/**
	 * @param Store           $store The optimization store.
	 * @param Rule_Collection $rules The rule collection.
	 * @param Processor[]     $processors The list of image processors.
	 */
	public function __construct(
		Store $store,
		Rule_Collection $rules,
		array $processors
	) {
		$this->store      = $store;
		$this->rules      = $rules;
		$this->processors = $processors;
	}

	/**
	 * Reset the static counter, helpful for tests.
	 *
	 * @return void
	 */
	public function reset_counter(): void {
		$this->counter = 0;
	}

	/**
	 * Begin buffering the request.
	 *
	 * @action template_redirect
	 *
	 * @return void
	 */
	public function start_buffering(): void {
		// Process skip rules and bypass buffering.
		foreach ( $this->rules->all() as $rule ) {
			if ( $rule->should_skip() ) {
				return;
			}
		}

		ob_start( [ $this, 'stop_buffering' ] );
	}

	/**
	 * Modify each image using our collection of image processors.
	 *
	 * @see self::stop_buffering()
	 *
	 * @param string  $html The HTML WordPress will render.
	 * @param WP_Post $post The current post.
	 *
	 * @return string
	 */
	public function process_images( string $html, WP_Post $post ): string {
		$analysis = $this->store->get( $post->ID );

		if ( ! $analysis ) {
			return $html;
		}

		$device          = $analysis->getDevice( Viewport::current( $this->is_mobile() ) );
		$critical_images = $device ? $device->criticalImages : [];
		$images          = $analysis->images;

		$p = new WP_HTML_Tag_Processor( $html );

		// Add the kb-optimized class to the body.
		if ( $p->next_tag( 'body' ) ) {
			$p->add_class( 'kb-optimized' );
		}

		// Run each image through all image processors.
		while ( $p->next_tag( 'img' ) ) {
			$src     = $p->get_attribute( 'src' );
			$classes = $p->get_attribute( 'class' );

			foreach ( $this->processors as $processor ) {
				// We don't collect images without a srcset, skip counting/processing if processing the sizes attr.
				if ( $processor instanceof Sizes_Attribute_Processor && ! $p->get_attribute( 'srcset' ) ) {
					continue;
				}

				/**
				 * Allow short-circuiting of processing this image for the
				 * current processor.
				 *
				 * @param bool $should_process Whether we proceed with processing. Defaults to true.
				 * @param string $src The image src.
				 * @param string|null $classes The classes assigned to the img tag.
				 * @param Processor $processor The current processor instance.
				 * @param WP_Post $post The current post object.
				 */
				$should_process = apply_filters(
					'kadence_blocks_optimizer_image_processor',
					true,
					$src,
					$classes,
					$processor,
					$post
				);

				if ( $should_process ) {
					$processor->process( $p, $critical_images, $images, $this->counter );
				}
			}

			++$this->counter;
		}

		return $p->get_updated_html();
	}

	/**
	 * Callback that receives the buffer's contents.
	 *
	 * @see wp_ob_end_flush_all()
	 * @action shutdown
	 *
	 * @param string $html The HTML WordPress will render.
	 * @param int    $phase The bitmask of the PHP_OUTPUT_HANDLER_* constants.
	 *
	 * @return string The modified HTML with lazy loaded and optimal image sizes.
	 */
	private function stop_buffering( string $html, int $phase ): string {
		if ( ! ( $phase & PHP_OUTPUT_HANDLER_FINAL ) ) {
			return $html;
		}

		global $post, $wp_query;

		if ( ! $post instanceof WP_Post || ! $wp_query->is_main_query() ) {
			return $html;
		}

		return $this->process_images( $html, $post );
	}
}
