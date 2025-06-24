<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Response;

/**
 * Data Transfer Object representing comprehensive website performance analysis.
 *
 * Contains the complete optimization analysis including device-specific data
 * for desktop and mobile viewports, plus detailed analysis for all images found.
 */
final class WebsiteAnalysis {

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
		DeviceAnalysis $desktop,
		DeviceAnalysis $mobile,
		array $images = []
	) {
		$this->desktop = $desktop;
		$this->mobile  = $mobile;
		$this->images  = $images;
	}

	/**
	 * @param array{desktop: array, mobile: array, images: array} $attributes
	 */
	public static function from( array $attributes ): self {
		$images = array_map(
			static function ( array $result ): ImageAnalysis {
				return ImageAnalysis::from( $result );
			},
			$attributes['images'] ?? []
		);

		return new self(
			DeviceAnalysis::from( $attributes['desktop'] ),
			DeviceAnalysis::from( $attributes['mobile'] ),
			$images
		);
	}

	/**
	 * @return array{desktop: array, mobile: array, images: array}
	 */
	public function toArray(): array {
		return [
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
}
