<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Lazy_Load;

use KadenceWP\KadenceBlocks\Asset\Asset;
use KadenceWP\KadenceBlocks\Optimizer\Analysis_Registry;

final class Video_Poster_Lazy_Loader {

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
	 * Lazy load video posters.
	 *
	 * @example `<video poster="https://wordpress.test/some-image.jpg">`
	 *
	 * @filter kadence_blocks_row_video_attrs
	 *
	 * @param array<string, mixed> $attrs The HTML attributes.
	 *
	 * @return array<string, mixed>
	 */
	public function lazy_load_row_video_poster( array $attrs ): array {
		$poster = $attrs['poster'] ?? '';

		if ( ! $poster ) {
			return $attrs;
		}

		if ( ! $this->registry->is_optimized() ) {
			return $attrs;
		}

		$critical_images = $this->registry->get_background_images();
		$lookup          = array_flip( $critical_images );

		// Bypass above the fold images.
		if ( isset( $lookup[ $poster ] ) ) {
			return $attrs;
		}

		$attrs['data-kadence-lazy-poster']  = $poster;
		$attrs['data-kadence-lazy-trigger'] = 'viewport';
		$attrs['data-kadence-lazy-attrs']   = 'poster';

		unset( $attrs['poster'] );

		// Enqueue the frontend lazy loader script.
		$this->asset->enqueue_script( 'lazy-loader', 'dist/lazy-loader' );

		return $attrs;
	}
}
