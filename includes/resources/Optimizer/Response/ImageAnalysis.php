<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Response;

/**
 * Data Transfer Object representing comprehensive analysis data for an image element.
 *
 * Contains detailed information about an image including dimensions, loading attributes,
 * computed styles, srcset entries, and optimization recommendations such as optimal sizes.
 */
final class ImageAnalysis {

	public string $path;
	public string $src;

	/**
	 * @var SrcsetEntry[]
	 */
	public array $srcset;
	public int $width;
	public int $height;
	public string $widthAttr;
	public string $heightAttr;
	public int $naturalWidth;
	public int $naturalHeight;
	public ?float $aspectRatio;
	public ?string $alt;
	public string $className;
	public string $loading;
	public string $decoding;
	public ?string $sizes;
	public ComputedStyle $computedStyle;
	public string $optimalSizes;

	/**
	 * @param SrcsetEntry[] $srcset The srcset entry.
	 */
	private function __construct(
		string $path,
		string $src,
		array $srcset,
		int $width,
		int $height,
		string $widthAttr,
		string $heightAttr,
		int $naturalWidth,
		int $naturalHeight,
		?float $aspectRatio,
		?string $alt,
		string $className,
		string $loading,
		string $decoding,
		?string $sizes,
		ComputedStyle $computedStyle,
		string $optimalSizes
	) {
		$this->path          = $path;
		$this->src           = $src;
		$this->srcset        = $srcset;
		$this->width         = $width;
		$this->height        = $height;
		$this->widthAttr     = $widthAttr;
		$this->heightAttr    = $heightAttr;
		$this->naturalWidth  = $naturalWidth;
		$this->naturalHeight = $naturalHeight;
		$this->aspectRatio   = $aspectRatio;
		$this->alt           = $alt;
		$this->className     = $className;
		$this->loading       = $loading;
		$this->decoding      = $decoding;
		$this->sizes         = $sizes;
		$this->computedStyle = $computedStyle;
		$this->optimalSizes  = $optimalSizes;
	}

	/**
	 * @param array{path: string, src: string, srcset: array, width: int, height: int, widthAttr: string, heightAttr: string, naturalWidth: int, naturalHeight: int, aspectRatio: float, alt: ?string, class: ?string, loading: string, decoding: string, sizes: ?string, computedStyle: array, optimalSizes: string} $attributes
	 */
	public static function from( array $attributes ): self {
		$srcset = array_map(
			static function ( array $entry ): SrcsetEntry {
				return SrcsetEntry::from( $entry );
			},
			$attributes['srcset'] ?? []
		);

		return new self(
			$attributes['path'] ?? '',
			$attributes['src'] ?? '',
			$srcset,
			$attributes['width'] ?? 0,
			$attributes['height'] ?? 0,
			$attributes['widthAttr'] ?? '',
			$attributes['heightAttr'] ?? '',
			$attributes['naturalWidth'] ?? 0,
			$attributes['naturalHeight'] ?? 0,
			$attributes['aspectRatio'] ?? null,
			$attributes['alt'],
			$attributes['class'] ?? '',
			$attributes['loading'],
			$attributes['decoding'],
			$attributes['sizes'],
			ComputedStyle::from( $attributes['computedStyle'] ),
			$attributes['optimalSizes']
		);
	}

	/**
	 * @return array{path: string, src: string, srcset: array, width: int, height: int, widthAttr: string, heightAttr: string, naturalWidth: int, naturalHeight: int, aspectRatio: float, alt: ?string, class: string, loading: string, decoding: string, sizes: ?string, computedStyle: array, optimalSizes: string}
	 */
	public function toArray(): array {
		return [
			'path'          => $this->path,
			'src'           => $this->src,
			'srcset'        => array_map(
				static function ( SrcsetEntry $entry ): array {
					return $entry->toArray();
				},
				$this->srcset
			),
			'width'         => $this->width,
			'height'        => $this->height,
			'widthAttr'     => $this->widthAttr,
			'heightAttr'    => $this->heightAttr,
			'naturalWidth'  => $this->naturalWidth,
			'naturalHeight' => $this->naturalHeight,
			'aspectRatio'   => $this->aspectRatio,
			'alt'           => $this->alt,
			'class'         => $this->className,
			'loading'       => $this->loading,
			'decoding'      => $this->decoding,
			'sizes'         => $this->sizes,
			'computedStyle' => $this->computedStyle->toArray(),
			'optimalSizes'  => $this->optimalSizes,
		];
	}
}
