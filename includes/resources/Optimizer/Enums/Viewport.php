<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Enums;

/**
 * A pseudo Viewport enum.
 */
final class Viewport {

	public const DESKTOP = 'desktop';
	public const MOBILE  = 'mobile';

	/**
	 * The view port.
	 *
	 * @var string
	 */
	private string $value;

	private function __construct( string $value ) {
		$this->value = $value;
	}

	public static function desktop(): self {
		return new self( self::DESKTOP );
	}

	public static function mobile(): self {
		return new self( self::MOBILE );
	}

	public static function current( bool $is_mobile ): self {
		return $is_mobile ? self::mobile() : self::desktop();
	}

	public function value(): string {
		return $this->value;
	}

	public function equals( self $other ): bool {
		return $this->value === $other->value;
	}

	public function __toString(): string {
		return $this->value;
	}
}
