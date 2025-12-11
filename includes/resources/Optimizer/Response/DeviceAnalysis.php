<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Response;

/**
 * Data Transfer Object representing analysis data for a specific device viewport.
 *
 * Contains device-specific optimization data including critical image counts,
 * background images, and page sections with their layout information.
 */
final class DeviceAnalysis {

	/**
	 * A list of image src URLs found above the fold.
	 *
	 * @var string[]
	 */
	public array $criticalImages;

	/**
	 * @var string[]
	 */
	public array $backgroundImages;

	/**
	 * @var Section[]
	 */
	public array $sections;

	/**
	 * @param string[]  $criticalImages A list of image src URLs found above the fold.
	 * @param string[]  $backgroundImages The list of URLs of background images found.
	 * @param Section[] $sections The collection of sections.
	 */
	private function __construct(
		array $criticalImages = [],
		array $backgroundImages = [],
		array $sections = []
	) {
		$this->criticalImages   = $criticalImages;
		$this->backgroundImages = $backgroundImages;
		$this->sections         = $sections;
	}

	/**
	 * @param array{criticalImages: string[], backgroundImages?: string[], sections?: array} $attributes
	 */
	public static function from( array $attributes ): self {
		$sections = array_map(
			static function ( array $result ): Section {
				return Section::from( $result );
			},
			$attributes['sections'] ?? []
		);

		return new self(
			$attributes['criticalImages'],
			$attributes['backgroundImages'] ?? [],
			$sections
		);
	}

	/**
	 * @return array{criticalImages: string[], backgroundImages?: string[], sections?: array}
	 */
	public function toArray(): array {
		return [
			'criticalImages'   => $this->criticalImages,
			'backgroundImages' => $this->backgroundImages,
			'sections'         => array_map(
				static function ( Section $section ): array {
					return $section->toArray();
				},
				$this->sections
			),
		];
	}

	/**
	 * Get all the sections that are below the fold.
	 *
	 * @return Section[]
	 */
	public function getBelowTheFoldSections(): array {
		return array_filter( $this->sections, static fn( Section $section ): bool => ! $section->isAboveFold );
	}
}
