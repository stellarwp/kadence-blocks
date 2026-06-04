<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary;

/**
 * The top-level DTCG document layers, single-sourced so the baseline index, the deep-merge and the
 * Resolver agree on exactly which layers carry resolvable tokens.
 *
 * A v1 document has three layers: "primitive" and "semantic" hold registrable token trees, while
 * "$extensions" (foundation presets, block presets, variants) is NOT a token tree and must never be
 * walked, merged or indexed as one. token_layers() returns the resolvable pair so consumers cannot
 * drift on the list (it previously lived as a literal in three classes).
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
