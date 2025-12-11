<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Response;

/**
 * Data Transfer Object representing a page section or element with layout information.
 *
 * Contains section metadata including dimensions, DOM path, fold position,
 * and content flags for images and background elements.
 */
final class Section {

	public string $id;
	public float $height;
	public string $tagName;
	public string $className;
	public string $path;
	public bool $isAboveFold;
	public bool $hasImages;
	public bool $hasBackground;

	private function __construct(
		string $id,
		float $height,
		string $tagName,
		string $className,
		string $path,
		bool $isAboveFold,
		bool $hasImages,
		bool $hasBackground
	) {
		$this->id            = $id;
		$this->height        = $height;
		$this->tagName       = $tagName;
		$this->className     = $className;
		$this->path          = $path;
		$this->isAboveFold   = $isAboveFold;
		$this->hasImages     = $hasImages;
		$this->hasBackground = $hasBackground;
	}

	/**
	 * @param array{id: string, height: float, tagName: string, className: string, path: string, isAboveFold: bool, hasImages: bool, hasBackground: bool} $attributes
	 */
	public static function from( array $attributes ): self {
		return new self(
			$attributes['id'],
			$attributes['height'],
			$attributes['tagName'],
			$attributes['className'],
			$attributes['path'],
			$attributes['isAboveFold'],
			$attributes['hasImages'],
			$attributes['hasBackground']
		);
	}

	/**
	 * @return array{id: string, height: float, tagName: string, className: string, path: string, isAboveFold: bool, hasImages: bool, hasBackground: bool}
	 */
	public function toArray(): array {
		return [
			'id'            => $this->id,
			'height'        => $this->height,
			'tagName'       => $this->tagName,
			'className'     => $this->className,
			'path'          => $this->path,
			'isAboveFold'   => $this->isAboveFold,
			'hasImages'     => $this->hasImages,
			'hasBackground' => $this->hasBackground,
		];
	}
}
