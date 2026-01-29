<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path_Factory;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;

/**
 * A registry to fetch custom data from the WebsiteAnalysis DTO.
 *
 * @phpstan-type HtmlClassHeightMap array<string, float> Class attribute => height in pixels.
 */
class Analysis_Registry {

	private const SECTIONS = 'sections';

	/**
	 * Memoization cache.
	 *
	 * @var array<string, mixed>
	 */
	private array $cache               = [];
	private ?Path $path                = null;
	private ?WebsiteAnalysis $analysis = null;
	private Store $store;
	private bool $is_mobile;

	public function __construct(
		Store $store,
		Path_Factory $path_factory,
		bool $is_mobile
	) {
		$this->store     = $store;
		$this->is_mobile = $is_mobile;

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
		$this->analysis = null;
		$this->cache    = [];
	}

	/**
	 * Build the WebsiteAnalysis DTO based on the current path.
	 *
	 * @return WebsiteAnalysis|null
	 */
	public function get_analysis(): ?WebsiteAnalysis {
		if ( $this->analysis !== null ) {
			return $this->analysis;
		}

		if ( ! $this->path ) {
			return null;
		}

		$this->analysis = $this->store->get( $this->path );

		return $this->analysis;
	}

	/**
	 * Check if this request is optimized.
	 *
	 * @return bool
	 */
	public function is_optimized(): bool {
		return $this->get_analysis() instanceof WebsiteAnalysis;
	}

	/**
	 * Get the above the fold background images for the current viewport.
	 *
	 * @return string[]
	 */
	public function get_background_images(): array {
		$analysis = $this->get_analysis();

		return $analysis
			? ( $this->is_mobile ? $analysis->mobile->backgroundImages : $analysis->desktop->backgroundImages )
			: [];
	}

	/**
	 * Get the list of the above the fold image URLs.
	 *
	 * @return string[]
	 */
	public function get_critical_images(): array {
		$analysis = $this->get_analysis();

		return $analysis
			? ( $this->is_mobile ? $analysis->mobile->criticalImages : $analysis->desktop->criticalImages )
			: [];
	}

	/**
	 * For the current viewport, get all the "below the fold" sections that have a height
	 * greater than 0.
	 *
	 * @return HtmlClassHeightMap
	 */
	public function get_valid_sections(): array {
		if ( isset( $this->cache[ self::SECTIONS ] ) ) {
			return $this->cache[ self::SECTIONS ];
		}

		$analysis = $this->get_analysis();

		if ( ! $analysis ) {
			$this->cache[ self::SECTIONS ] = [];

			return [];
		}

		$sections = $this->is_mobile
			? $analysis->mobile->getBelowTheFoldSections()
			: $analysis->desktop->getBelowTheFoldSections();

		$results = [];

		foreach ( $sections as $section ) {
			if ( $section->height > 0 ) {
				$results[ $section->className ] = $section->height;
			}
		}

		$this->cache[ self::SECTIONS ] = $results;

		return $this->cache[ self::SECTIONS ];
	}
}
