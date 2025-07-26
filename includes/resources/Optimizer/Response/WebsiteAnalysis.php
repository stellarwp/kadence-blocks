<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Response;

use KadenceWP\KadenceBlocks\Optimizer\Enums\Viewport;

/**
 * Data Transfer Object representing comprehensive website performance analysis.
 *
 * Contains the complete optimization analysis including device-specific data
 * for desktop and mobile viewports, plus detailed analysis for all images found.
 */
final class WebsiteAnalysis {

	public bool $isStale;
	public DeviceAnalysis $desktop;
	public DeviceAnalysis $mobile;

	/**
	 * @var ImageAnalysis[]
	 */
	public array $images;

	/**
	 * @param ImageAnalysis[] $images The image analysis collection.
	 */
	private function __construct(
		bool $isStale,
		DeviceAnalysis $desktop,
		DeviceAnalysis $mobile,
		array $images = []
	) {
		$this->isStale = $isStale;
		$this->desktop = $desktop;
		$this->mobile  = $mobile;
		$this->images  = $images;
	}

	/**
	 * @param array{isStale?: bool, desktop: array, mobile: array, images: array} $attributes
	 *
	 * @throws \Exception If we fail to create a DateTimeImmutable object.
	 */
	public static function from( array $attributes ): self {
		$images = array_map(
			static function ( array $result ): ImageAnalysis {
				return ImageAnalysis::from( $result );
			},
			$attributes['images'] ?? []
		);

		$isStale = (bool) ( $attributes['isStale'] ?? false );

		return new self(
			$isStale,
			DeviceAnalysis::from( $attributes['desktop'] ),
			DeviceAnalysis::from( $attributes['mobile'] ),
			$images
		);
	}

	/**
	 * @return array{isStale: bool, desktop: array, mobile: array, images: array}
	 */
	public function toArray(): array {
		return [
			'isStale' => $this->isStale,
			'desktop' => $this->desktop->toArray(),
			'mobile'  => $this->mobile->toArray(),
			'images'  => array_map(
				static function ( ImageAnalysis $image ): array {
					return $image->toArray();
				},
				$this->images
			),
		];
	}

	/**
	 * Get the device analysis for a specific viewport.
	 *
	 * @param Viewport $vp The viewport to fetch data for.
	 *
	 * @return DeviceAnalysis|null
	 */
	public function getDevice( Viewport $vp ): ?DeviceAnalysis {
		return $this->{$vp} ?? null;
	}
}
