<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary;

/**
 * Single source of truth for the top-level DTCG document layers that carry resolvable tokens.
 *
 * A v1 document has three top-level keys: "primitive" and "semantic" hold registrable token trees,
 * while "$extensions" (foundation presets, block presets, variants) is NOT a token tree and must
 * never be walked, merged, or indexed as one.
 *
 * @since TBD
 */
final class Layers {

	/**
	 * The "primitive" layer: raw, context-free token values.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PRIMITIVE = 'primitive';

	/**
	 * The "semantic" layer: role-based tokens, often aliasing into the primitive layer.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SEMANTIC = 'semantic';

	/**
	 * The DTCG layers that carry resolvable tokens, in walk order. The "$extensions" layer is
	 * excluded by design — its entries are presets/variants, not registrable tokens.
	 *
	 * @var string[]
	 *
	 * @since TBD
	 */
	private const TOKEN_LAYERS = [
		self::PRIMITIVE,
		self::SEMANTIC,
	];

	/**
	 * The DTCG layers that carry resolvable tokens.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function token_layers(): array {
		return self::TOKEN_LAYERS;
	}
}
