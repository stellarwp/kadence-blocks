<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Image;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Optimizer\Enums\Viewport;
use KadenceWP\KadenceBlocks\Optimizer\Image\Contracts\Processor;
use KadenceWP\KadenceBlocks\Optimizer\Image\Traits\Image_Key_Generator_Trait;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path_Factory;
use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rule_Collection;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
use KadenceWP\KadenceBlocks\StellarWP\SuperGlobals\SuperGlobals as SG;
use KadenceWP\KadenceBlocks\Traits\Viewport_Trait;
use WP_HTML_Tag_Processor;

/**
 * Modify HTML img tags before the HTML is sent back to the browser:
 *
 *  - 1. Set correct lazy load attributes.
 *  - 2. Set the optimal sizes attribute.
 */
final class Image_Processor {

	use Viewport_Trait;
	use Image_Key_Generator_Trait;

	private Store $store;
	private Rule_Collection $rules;
	private Path_Factory $path_factory;

	/**
	 * The list of image processors.
	 *
	 * @var Processor[]
	 */
	private array $processors;

	/**
	 * The logger.
	 *
	 * @var LoggerInterface
	 */
	private LoggerInterface $logger;

	/**
	 * @param Store           $store The optimization store.
	 * @param Rule_Collection $rules The rule collection.
	 * @param Path_Factory    $path_factory The path factory.
	 * @param LoggerInterface $logger The logger.
	 * @param Processor[]     $processors The list of image processors.
	 */
	public function __construct(
		Store $store,
		Rule_Collection $rules,
		Path_Factory $path_factory,
		LoggerInterface $logger,
		array $processors
	) {
		$this->store        = $store;
		$this->rules        = $rules;
		$this->path_factory = $path_factory;
		$this->logger       = $logger;
		$this->processors   = $processors;
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
				$this->logger->debug(
					'Skipping Image Processor Buffering: skip rule',
					[
						'rule'        => get_class( $rule ),
						'request_uri' => SG::get_server_var( 'REQUEST_URI', 'unknown' ),
					]
				);

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
	 * @param string $html The HTML WordPress will render.
	 * @param Path   $path The current path object.
	 *
	 * @return string
	 */
	public function process_images( string $html, Path $path ): string {
		$analysis = $this->store->get( $path );

		if ( ! $analysis ) {
			return $html;
		}

		$device          = $analysis->getDevice( Viewport::current( $this->is_mobile() ) );
		$critical_images = $device ? $device->criticalImages : [];
		$images          = $analysis->images;

		$images_by_key = [];

		// Reshape the array so we can do O(1) lookups.
		foreach ( $images as $image ) {
			if ( isset( $image->src, $image->sizes ) ) {
				$key = $this->generate_image_key( $image->src, $image->sizes );

				if ( $key !== null ) {
					$images_by_key[ $key ] = $image;
				}
			}
		}

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

				/**
				 * Allow short-circuiting of processing this image for the
				 * current processor.
				 *
				 * @param bool $should_process Whether we proceed with processing. Defaults to true.
				 * @param string $src The image src.
				 * @param string|null $classes The classes assigned to the img tag.
				 * @param Processor $processor The current processor instance.
				 * @param Path $post The current path object.
				 */
				$should_process = apply_filters(
					'kadence_blocks_optimizer_image_processor',
					true,
					$src,
					$classes,
					$processor,
					$path
				);

				if ( $should_process ) {
					$processor->process( $p, $critical_images, $images_by_key );
				}
			}
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

		try {
			$path = $this->path_factory->make();
		} catch ( InvalidArgumentException $e ) {
			$this->logger->error(
				'Failed to get path in image processor buffering',
				[
					'exception' => $e,
				]
			);

			return $html;
		}

		return $this->process_images( $html, $path );
	}
}
