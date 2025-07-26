<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Lazy_Load;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path_Factory;
use KadenceWP\KadenceBlocks\Optimizer\Response\Section;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Viewport_Trait;

/**
 * Process section Optimization data to set content visibility on the Kadence row layout block.
 */
final class Element_Lazy_Loader {

	use Viewport_Trait;

	/**
	 * Sections cache for this request.
	 *
	 * @var array<int, Section>
	 */
	private ?array $sections;

	/**
	 * CSS classes that will exclude a section from being lazy loaded.
	 *
	 * @var string[]
	 */
	private array $excluded_classes;
	private Path_Factory $path_factory;
	private Store $store;

	/**
	 * @param Store        $store The optimizer store.
	 * @param Path_Factory $path_factory The path factory.
	 * @param string[]     $excluded_classes CSS classes that will exclude a section from being lazy loaded.
	 */
	public function __construct(
		Store $store,
		Path_Factory $path_factory,
		array $excluded_classes
	) {
		$this->store            = $store;
		$this->path_factory     = $path_factory;
		$this->excluded_classes = $excluded_classes;
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
	public function modify_row_layout_block_wrapper_args( array $args, array $attributes ): array {
		try {
			$path = $this->path_factory->make();
		} catch ( InvalidArgumentException $e ) {
			return $args;
		}

		$unique_id = $attributes['uniqueID'] ?? false;

		if ( ! $unique_id ) {
			return $args;
		}

		$classes = (string) ( $args['class'] ?? '' );

		// Explode class string into array for exact matching.
		$class_list = array_filter( preg_split( '/\s+/', $classes ) );

		// Bypass lazy loading if we find an excluded class (exact match only).
		foreach ( $this->excluded_classes as $excluded_class ) {
			if ( in_array( $excluded_class, $class_list, true ) ) {
				return $args;
			}
		}

		$analysis = $this->store->get( $path );

		if ( ! $analysis ) {
			return $args;
		}

		$sections = $this->sections ??= $this->is_mobile() ? $analysis->mobile->sections : $analysis->desktop->sections;

		foreach ( $sections as $key => $section ) {
			// Skip above the fold sections.
			if ( $section->isAboveFold ) {
				unset( $this->sections[ $key ] );

				continue;
			}

			// Search for the unique ID in the class attribute.
			if ( ! str_contains( $section->className, $unique_id ) ) {
				continue;
			}

			if ( $section->height <= 0 ) {
				continue;
			}

			$current_style = $args['style'] ?? '';

			// Prepend our content visibility style.
			$args['style'] = sprintf(
				'content-visibility: auto;contain-intrinsic-size: auto %dpx;%s',
				$section->height,
				$current_style
			);

			unset( $this->sections[ $key ] );
		}

		return $args;
	}

	/**
	 * Flush the memoization cache.
	 *
	 * @return void
	 */
	public function flush(): void {
		unset( $this->sections );
	}
}
