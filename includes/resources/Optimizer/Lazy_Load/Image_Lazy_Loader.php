<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Lazy_Load;

use KadenceWP\KadenceBlocks\Optimizer\Enums\Viewport;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Rule\Rule_Collection;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Viewport_Trait;
use WP_HTML_Tag_Processor;
use WP_Post;

/**
 * @TODO might need to move this class. Add docblocks.
 * @TODO needs tests.
 */
final class Image_Lazy_Loader {

	use Viewport_Trait;

	private Store $store;
	private Rule_Collection $rules;

	public function __construct( Store $store, Rule_Collection $rules ) {
		$this->store = $store;
		$this->rules = $rules;
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

		ob_start( [ $this, 'process_images' ] );
	}

	/**
	 * Callback that receives the buffer's contents. Ensure images above the fold are not lazy loaded
	 * and ones below have loading="lazy". Ensure that each image is using the optimal sizes attribute.
	 *
	 * @param string $html The HTML WordPress will render.
	 * @param int    $phase The bitmask of the PHP_OUTPUT_HANDLER_* constants.
	 *
	 * @return string The modified HTML with lazy loaded and optimal image sizes.
	 */
	private function process_images( string $html, int $phase ): string {
		if ( ! ( $phase & PHP_OUTPUT_HANDLER_FINAL ) ) {
			return $html;
		}

		global $post, $wp_query;

		if ( ! $post instanceof WP_Post || ! $wp_query->is_main_query() ) {
			return $html;
		}

		$analysis = $this->store->get( $post->ID );

		if ( ! $analysis ) {
			return $html;
		}

		$device          = $analysis->getDevice( Viewport::current( $this->is_mobile() ) );
		$critical_images = $device ? $device->criticalImages : [];
		$images          = $analysis->images;

		static $counter = 0;

		$p = new WP_HTML_Tag_Processor( $html );

		// Add the kb-optimized class to the body.
		if ( $p->next_tag( 'body' ) ) {
			$p->add_class( 'kb-optimized' );
		}

		// Process each image on the page.
		while ( $p->next_tag( 'img' ) ) {
			$src             = $p->get_attribute( 'src' );
			$critical_source = $critical_images[ $counter ] ?? false;

			// TODO: add some filters here.

			// Ensure above the fold images do not have a lazy loading attribute.
			if ( $src === $critical_source ) {
				if ( 'lazy' === $p->get_attribute( 'loading' ) ) {
					$p->remove_attribute( 'loading' );
				}
			} else {
				// Ensure below the fold images have native lazy loading.
				$p->set_attribute( 'loading', 'lazy' );

				// If WordPress somehow added a high fetch priority, remove it.
				if ( 'high' === $p->get_attribute( 'fetchpriority' ) ) {
					$p->remove_attribute( 'fetchpriority' );
				}
			}

			// We don't collect images without a srcset, skip counting.
			if ( ! $p->get_attribute( 'srcset' ) ) {
				continue;
			}

			$image = $images[ $counter ] ?? false;

			// Update the sizes attribute with our optimal sizes.
			if ( $image && $image->optimalSizes && $image->src === $src ) {
				$p->set_attribute( 'sizes', $image->optimalSizes );
			}

			++$counter;
		}

		return $p->get_updated_html();
	}
}
