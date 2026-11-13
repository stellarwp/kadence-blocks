<?php declare( strict_types=1 );

namespace Tests\Support\Classes;

/**
 * Deterministic attribute generator for golden-master tests of `build_css()`.
 *
 * Given a block's attribute schema (the `attributes` object of its `block.json`) it produces
 * reproducible pseudo-random attribute sets. The same seed always yields the same attributes on
 * every PHP version, because the generator is a self-contained xorshift, not `mt_rand()`.
 *
 * String values are drawn from a pool made of generic CSS-ish tokens plus the literals the
 * block's own source compares against, so enum-driven branches in `build_css()` are reached.
 */
final class Build_Css_Fuzzer {

	/**
	 * Generic tokens used for string attributes.
	 *
	 * @var string[]
	 */
	private const GENERIC_STRINGS = [
		'',
		'px',
		'em',
		'rem',
		'%',
		'vh',
		'vw',
		'left',
		'right',
		'center',
		'top',
		'bottom',
		'middle',
		'flex-start',
		'flex-end',
		'space-between',
		'row',
		'column',
		'none',
		'inherit',
		'auto',
		'solid',
		'dashed',
		'#ffffff',
		'#000',
		'#c0ffee',
		'palette1',
		'palette9',
		'rgba(10,20,30,0.5)',
		'var(--global-palette1)',
		'10',
		'24',
		'0',
		'1.5',
		'100',
		'400',
		'700',
		'normal',
		'bold',
		'uppercase',
		'Roboto',
		'h2',
		'sm',
		'lg',
	];

	/**
	 * Numbers used for numeric attributes.
	 *
	 * @var float[]|int[]
	 */
	private const NUMBERS = [ 0, 1, 2, 3, 5, 10, 16, 24, 50, 100, 250, -5, 0.5, 1.5, 33.3 ];

	/**
	 * Generator state.
	 *
	 * @var int
	 */
	private $state;

	/**
	 * String pool for the block under test.
	 *
	 * @var string[]
	 */
	private $pool;

	/**
	 * Create a generator.
	 *
	 * @param int      $seed        Seed; the same seed gives the same sequence.
	 * @param string[] $extra_pool  Additional string literals taken from the block source.
	 */
	public function __construct( int $seed, array $extra_pool = [] ) {
		$this->state = ( $seed * 2654435761 ) % 4294967296;
		if ( 0 === $this->state ) {
			$this->state = 88172645;
		}
		$this->pool = array_values( array_unique( array_merge( self::GENERIC_STRINGS, $extra_pool ) ) );
	}

	/**
	 * Collect the string literals a block's source compares against.
	 *
	 * @param string $source PHP source of the block class.
	 *
	 * @return string[]
	 */
	public static function literals_from_source( string $source ): array {
		$found = [];
		$token = "'([^'\\\\\n]{0,24})'";
		if ( preg_match_all( '/(?:===|!==|==|!=)\s*' . $token . '/', $source, $m ) ) {
			$found = array_merge( $found, $m[1] );
		}
		if ( preg_match_all( '/' . $token . '\s*(?:===|!==|==|!=)/', $source, $m ) ) {
			$found = array_merge( $found, $m[1] );
		}
		if ( preg_match_all( '/in_array\(([^;]{0,400}?)\)\s*[)&|;{]/', $source, $m ) ) {
			foreach ( $m[1] as $segment ) {
				if ( preg_match_all( '/' . $token . '/', $segment, $s ) ) {
					$found = array_merge( $found, $s[1] );
				}
			}
		}

		$found = array_values( array_unique( $found ) );
		sort( $found );

		return $found;
	}

	/**
	 * Generate one attribute set from a `block.json` attribute schema.
	 *
	 * @param array<string, array<string, mixed>> $schema Attribute schema.
	 *
	 * @return array<string, mixed>
	 */
	public function attributes( array $schema ): array {
		$attributes = [];
		foreach ( $schema as $name => $definition ) {
			$has_default = array_key_exists( 'default', $definition );
			$roll        = $this->int( 1, 100 );
			if ( $roll <= 25 ) {
				// Leave unset, as a block saved with nothing changed would.
				continue;
			}
			if ( $roll <= 45 && $has_default ) {
				$attributes[ $name ] = $definition['default'];
				continue;
			}
			$attributes[ $name ] = $this->value( $definition );
		}
		$attributes['uniqueID'] = 'fuzz';
		if ( isset( $schema['kbVersion'] ) ) {
			$attributes['kbVersion'] = $this->int( 1, 3 );
		}

		return $attributes;
	}

	/**
	 * Next pseudo-random 32-bit integer.
	 *
	 * @return int
	 */
	private function next(): int {
		$x           = $this->state;
		$x          ^= ( $x << 13 ) & 0xFFFFFFFF;
		$x          ^= ( $x >> 17 );
		$x          ^= ( $x << 5 ) & 0xFFFFFFFF;
		$this->state = $x & 0xFFFFFFFF;

		return $this->state;
	}

	/**
	 * Pseudo-random integer in an inclusive range.
	 *
	 * @param int $min Lower bound.
	 * @param int $max Upper bound.
	 *
	 * @return int
	 */
	private function int( int $min, int $max ): int {
		return $min + ( $this->next() % ( $max - $min + 1 ) );
	}

	/**
	 * Pick one item.
	 *
	 * @param array<int, mixed> $items Candidates.
	 *
	 * @return mixed
	 */
	private function pick( array $items ) {
		return $items[ $this->int( 0, count( $items ) - 1 ) ];
	}

	/**
	 * Generate a value for one attribute definition.
	 *
	 * @param array<string, mixed> $definition The attribute definition.
	 *
	 * @return mixed
	 */
	private function value( array $definition ) {
		$type = $definition['type'] ?? 'string';
		if ( is_array( $type ) ) {
			$type = $this->pick( $type );
		}
		if ( isset( $definition['enum'] ) && is_array( $definition['enum'] ) && $definition['enum'] ) {
			return $this->pick( $definition['enum'] );
		}

		switch ( $type ) {
			case 'boolean':
				return 1 === $this->int( 0, 1 );
			case 'number':
			case 'integer':
				return $this->number();
			case 'array':
			case 'object':
				if ( isset( $definition['default'] ) && is_array( $definition['default'] ) && $definition['default'] ) {
					return $this->mutate( $definition['default'] );
				}

				return $this->free_array( 'array' === $type );
			case 'string':
			default:
				return $this->string();
		}
	}

	/**
	 * A random string from the pool.
	 *
	 * @return string
	 */
	private function string(): string {
		return (string) $this->pick( $this->pool );
	}

	/**
	 * A random number, sometimes stringly typed as the editor stores some of them.
	 *
	 * @return float|int|string
	 */
	private function number() {
		$number = $this->pick( self::NUMBERS );

		return 0 === $this->int( 0, 5 ) ? (string) $number : $number;
	}

	/**
	 * An array with no default to imitate.
	 *
	 * @param bool $is_list Whether to build a list rather than a map.
	 *
	 * @return array<int|string, mixed>
	 */
	private function free_array( bool $is_list ): array {
		if ( ! $is_list ) {
			return 0 === $this->int( 0, 1 ) ? [] : [ 'size' => [ $this->number(), $this->number(), $this->number() ] ];
		}
		$length = $this->int( 0, 4 );
		$list   = [];
		for ( $i = 0; $i < $length; $i++ ) {
			$list[] = 0 === $this->int( 0, 1 ) ? $this->string() : $this->number();
		}

		return $list;
	}

	/**
	 * Randomise the leaves of a default value while keeping its shape.
	 *
	 * @param array<int|string, mixed> $value Default value.
	 *
	 * @return array<int|string, mixed>
	 */
	private function mutate( array $value ): array {
		foreach ( $value as $key => $leaf ) {
			if ( is_array( $leaf ) ) {
				$value[ $key ] = $this->mutate( $leaf );
			} elseif ( is_bool( $leaf ) ) {
				$value[ $key ] = 1 === $this->int( 0, 1 );
			} elseif ( is_int( $leaf ) || is_float( $leaf ) ) {
				$value[ $key ] = $this->number();
			} elseif ( $this->int( 1, 100 ) > 40 ) {
				$value[ $key ] = 0 === $this->int( 0, 2 ) ? $this->number() : $this->string();
			}
		}

		return $value;
	}
}
