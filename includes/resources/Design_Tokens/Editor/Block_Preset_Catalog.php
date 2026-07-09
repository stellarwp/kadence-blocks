<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Converts_Length_To_Px;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;

/**
 * Builds the compact per-block attribute-default catalog the `blocks.registerBlockType` filter in
 * early-filters.js reads to seed a freshly inserted block's attribute default from a resolved
 * token, instead of the hardcoded static default in block.json.
 *
 * Covers kadence/single-icon's `size` (a scalar pixel default) and kadence/singlebtn's
 * `borderRadius` (a 4-corner pixel default) — the anticipated second consumer this module's
 * composable-but-not-speculative preference (see Variant_Catalog) was waiting on before
 * generalizing. Not a general "any block, any attribute" registry: keep extending the ENTRIES
 * map (or promote to a declarations-driven shape) only when a further real consumer needs it,
 * rather than opening it up ahead of demand.
 *
 * @since TBD
 */
final class Block_Preset_Catalog {

	use Converts_Length_To_Px;

	/**
	 * Scalar shape: the resolved token is exposed to JS as a bare float, matching a numeric
	 * attribute default (e.g. kadence/single-icon's `size`).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SHAPE_SCALAR = 'scalar';

	/**
	 * Corners shape: the resolved token is exposed to JS as a 4-element float array — the same
	 * resolved value repeated across the top/right/bottom/left corners, matching a corner-array
	 * attribute default (e.g. kadence/singlebtn's `borderRadius`).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SHAPE_CORNERS = 'corners';

	/**
	 * Block => attribute => { token dot-path, output shape }. Each entry's token is looked up
	 * via the resolver and, when present, converted to a pixel value and emitted to JS in the
	 * entry's shape — a bare float for `scalar`, a 4-element float array for `corners`.
	 *
	 * @since TBD
	 *
	 * @var array<string, array<string, array{token: string, shape: string}>>
	 */
	private const ENTRIES = [
		'kadence/single-icon' => [
			'size' => [
				'token' => 'semantic.icon-size.default',
				'shape' => self::SHAPE_SCALAR,
			],
		],
		'kadence/singlebtn'   => [
			'borderRadius' => [
				'token' => 'semantic.radius.control',
				'shape' => self::SHAPE_CORNERS,
			],
		],
	];

	/**
	 * @since TBD
	 *
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * @since TBD
	 *
	 * @param Token_Resolver $resolver The token resolver.
	 */
	public function __construct( Token_Resolver $resolver ) {
		$this->resolver = $resolver;
	}

	/**
	 * The catalog, keyed by block name then attribute name, each value the resolved pixel
	 * default in the entry's shape — a bare float for `scalar`, a 4-element float array (the
	 * value repeated per corner) for `corners`. A block/attribute whose token does not resolve,
	 * or whose resolved value is not a convertible numeric length, is omitted — the editor
	 * filter falls back to block.json's own default for it.
	 *
	 * @since TBD
	 *
	 * @return array<string, array<string, float|array<int, float>>>
	 */
	public function all(): array {
		$resolved = $this->resolver->resolve();
		$out      = [];

		foreach ( self::ENTRIES as $block => $attributes ) {
			foreach ( $attributes as $attribute => $spec ) {
				$value = $resolved->value( $spec['token'] );

				if ( $value === null ) {
					continue;
				}

				$px = $this->to_px( $value );

				if ( $px === null ) {
					continue;
				}

				$out[ $block ][ $attribute ] = $spec['shape'] === self::SHAPE_CORNERS
					? [ $px, $px, $px, $px ]
					: $px;
			}
		}

		return $out;
	}
}
