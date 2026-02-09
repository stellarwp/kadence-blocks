<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Response;

/**
 * Data Transfer Object representing a single entry in an image srcset attribute.
 *
 * Contains the URL and width descriptor for a responsive image source,
 * used to build complete srcset attributes for optimized image delivery.
 */
final class SrcsetEntry {

	public string $url;
	public int $width;

	private function __construct( string $url, int $width ) {
		$this->url   = $url;
		$this->width = $width;
	}

	/**
	 * @param array{url: string, width: int} $attributes
	 */
	public static function from( array $attributes ): self {
		return new self(
			$attributes['url'],
			$attributes['width']
		);
	}

	/**
	 * @return array{url: string, width: int}
	 */
	public function toArray(): array {
		return [
			'url'   => $this->url,
			'width' => $this->width,
		];
	}
}
