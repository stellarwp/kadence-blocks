<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;

/**
 * Builds the compact per-block attribute-default catalog the `blocks.registerBlockType` filter in
 * early-filters.js reads to seed a freshly inserted block's attribute default from a resolved
 * token, instead of the hardcoded static default in block.json.
 *
 * Scoped to kadence/single-icon's `size` today — the only block/attribute pair this ticket needs.
 * Not a general "any block, any attribute" registry: extend the ENTRIES map (or promote to a
 * declarations-driven shape) only when a second real consumer needs it, matching this module's
 * existing preference for composable-but-not-speculative catalogs (see Variant_Catalog, which
 * itself started scoped to what the variant picker needed).
 *
 * @since TBD
 */
final class Block_Preset_Catalog {

	/**
	 * Block => attribute => resolved-token dot-path. Each entry's value is looked up via the
	 * resolver and, when present, exposed to JS as a raw number (this catalog only supports
	 * numeric attribute defaults today — the one case this ticket has).
	 *
	 * @since TBD
	 *
	 * @var array<string, array<string, string>>
	 */
	private const ENTRIES = [
		'kadence/single-icon' => [
			'size' => 'semantic.icon-size.default',
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
	 * The catalog, keyed by block name then attribute name, each value the resolved numeric
	 * default. A block/attribute whose token does not resolve, or whose resolved value is not a
	 * convertible numeric length, is omitted — the editor filter falls back to block.json's own
	 * default for it.
	 *
	 * @since TBD
	 *
	 * @return array<string, array<string, float>>
	 */
	public function all(): array {
		$resolved = $this->resolver->resolve();
		$out      = [];

		foreach ( self::ENTRIES as $block => $attributes ) {
			foreach ( $attributes as $attribute => $token_id ) {
				$value = $resolved->value( $token_id );

				if ( $value === null ) {
					continue;
				}

				$px = $this->to_px( $value );

				if ( $px === null ) {
					continue;
				}

				$out[ $block ][ $attribute ] = $px;
			}
		}

		return $out;
	}

	/**
	 * Convert a resolved CSS length to a raw pixel number, assuming the browser/CSS default root
	 * font size (16px) for `rem`/`em` — the only units this token family's baseline values use.
	 * Returns null for a value this catalog cannot safely convert (already px, or an unrecognized
	 * unit), so the caller can leave the attribute as block.json's own default rather than guess.
	 *
	 * Deliberately a separate private copy from Icon_Size_Adapter::to_px() rather than a shared
	 * trait/helper — this repo's own AGENTS.md instructs against abstracting a two-caller case,
	 * and no third consumer of this conversion exists.
	 *
	 * @since TBD
	 *
	 * @param string $length A resolved CSS length, e.g. "1.5rem", "24px".
	 *
	 * @return float|null The pixel value, or null when the unit is not rem/em/px.
	 */
	private function to_px( string $length ): ?float {
		if ( ! preg_match( '/^(-?[0-9.]+)(px|rem|em)$/', trim( $length ), $matches ) ) {
			return null;
		}

		$number = (float) $matches[1];

		return $matches[2] === 'px' ? $number : $number * 16.0;
	}
}
