<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Response;

/**
 * Data Transfer Object representing CSS computed style properties for an element.
 *
 * Contains the computed CSS values for width, height, object-fit, and object-position
 * properties as extracted from the browser's computed styles.
 */
final class ComputedStyle {

	public string $width;
	public string $height;
	public string $objectFit;
	public string $objectPosition;

	private function __construct(
		string $width,
		string $height,
		string $objectFit,
		string $objectPosition
	) {
		$this->width          = $width;
		$this->height         = $height;
		$this->objectFit      = $objectFit;
		$this->objectPosition = $objectPosition;
	}

	/**
	 * @param array{width: string, height: string, objectFit: string, objectPosition: string} $attributes
	 */
	public static function from( array $attributes ): self {
		return new self(
			$attributes['width'],
			$attributes['height'],
			$attributes['objectFit'],
			$attributes['objectPosition']
		);
	}

	/**
	 * @return array{width: string, height: string, objectFit: string, objectPosition: string}
	 */
	public function toArray(): array {
		return [
			'width'          => $this->width,
			'height'         => $this->height,
			'objectFit'      => $this->objectFit,
			'objectPosition' => $this->objectPosition,
		];
	}
}
