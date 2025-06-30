<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Response;

/**
 * Data Transfer Object representing analysis data for a specific device viewport.
 *
 * Contains device-specific optimization data including critical image counts,
 * background images, and page sections with their layout information.
 */
final class DeviceAnalysis {

	public int $criticalImages;

	/**
	 * @var string[]
	 */
	public array $backgroundImages;

	/**
	 * @var Section[]
	 */
	public array $sections;

	/**
	 * @param string[]  $backgroundImages The list of URLs of background images found.
	 * @param Section[] $sections The collection of sections.
	 */
	private function __construct(
		int $criticalImages,
		array $backgroundImages = [],
		array $sections = []
	) {
		$this->criticalImages   = $criticalImages;
		$this->backgroundImages = $backgroundImages;
		$this->sections         = $sections;
	}

	/**
	 * @param array{criticalImages: int, backgroundImages?: string[], sections?: array} $attributes
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
	 * @return array{criticalImages: int, backgroundImages?: string[], sections?: array}
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
}
