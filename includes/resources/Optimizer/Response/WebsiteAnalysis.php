<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Response;

use DateTimeImmutable;
use DateTimeZone;
use KadenceWP\KadenceBlocks\Optimizer\Enums\Viewport;

/**
 * Data Transfer Object representing comprehensive website performance analysis.
 *
 * Contains the complete optimization analysis including device-specific data
 * for desktop and mobile viewports, plus detailed analysis for all images found.
 */
final class WebsiteAnalysis {

	public DateTimeImmutable $lastModified;
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
		DateTimeImmutable $lastModified,
		DeviceAnalysis $desktop,
		DeviceAnalysis $mobile,
		array $images = []
	) {
		$this->lastModified = $lastModified;
		$this->desktop      = $desktop;
		$this->mobile       = $mobile;
		$this->images       = $images;
	}

	/**
	 * @param array{lastModified?: DateTimeImmutable|string, desktop: array, mobile: array, images: array} $attributes
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

		$timestamp = $attributes['lastModified'] ?? null;
		$timezone  = new DateTimeZone( 'UTC' );

		$lastModified = is_string( $timestamp )
			? new DateTimeImmutable( $timestamp, $timezone )
			: ( $timestamp ?? new DateTimeImmutable( 'now', $timezone ) );

		return new self(
			$lastModified,
			DeviceAnalysis::from( $attributes['desktop'] ),
			DeviceAnalysis::from( $attributes['mobile'] ),
			$images
		);
	}

	/**
	 * @return array{lastModified: string, desktop: array, mobile: array, images: array}
	 */
	public function toArray(): array {
		return [
			'lastModified' => $this->lastModified->format( 'Y-m-d H:i:s' ),
			'desktop'      => $this->desktop->toArray(),
			'mobile'       => $this->mobile->toArray(),
			'images'       => array_map(
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
