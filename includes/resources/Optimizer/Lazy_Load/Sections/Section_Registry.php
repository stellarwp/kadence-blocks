<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Sections;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path_Factory;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Viewport_Trait;

/**
 * A Registry of valid sections for the current viewport.
 *
 * @phpstan-type HtmlClassHeightMap array<string, float> Class attribute => height in pixels.
 */
class Section_Registry {

	use Viewport_Trait;

	private ?Path $path;

	/**
	 * The class attribute => height cache.
	 *
	 * @memoized
	 *
	 * @var HtmlClassHeightMap
	 */
	private ?array $valid_sections = null;
	private Store $store;

	public function __construct(
		Store $store,
		Path_Factory $path_factory
	) {
		$this->store = $store;

		try {
			$this->path = $path_factory->make();
		} catch ( InvalidArgumentException $e ) {
			$this->path = null;
		}
	}

	/**
	 * Flush the memoization cache.
	 *
	 * @return void
	 */
	public function flush(): void {
		$this->valid_sections = null;
	}

	/**
	 * For the current viewport, get all the "below the fold" sections that have a height
	 * greater than 0.
	 *
	 * @return HtmlClassHeightMap
	 */
	public function get_valid_sections(): array {
		if ( isset( $this->valid_sections ) ) {
			return $this->valid_sections;
		}

		if ( ! $this->path ) {
			$this->valid_sections = [];

			return $this->valid_sections;
		}

		$analysis = $this->store->get( $this->path );

		if ( ! $analysis ) {
			$this->valid_sections = [];

			return $this->valid_sections;
		}

		$sections = $this->is_mobile()
			? $analysis->mobile->getBelowTheFoldSections()
			: $analysis->desktop->getBelowTheFoldSections();

		$result = [];

		foreach ( $sections as $section ) {
			if ( $section->height > 0 ) {
				$result[ $section->className ] = $section->height;
			}
		}

		$this->valid_sections = $result;

		return $this->valid_sections;
	}
}
