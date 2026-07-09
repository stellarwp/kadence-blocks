<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter\Contracts\Abstract_Adapter;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;

/**
 * Overlays kadence/single-icon's `size` registration default (block.json hardcodes `50`) with the
 * resolved `semantic.icon-size.default` token value, converted to the raw pixel number the
 * attribute stores. This runs on `kadence_blocks_block_default_attributes`, which fires with the
 * block's *registration* defaults, not its stored instance attributes — so overwriting `size` here
 * is safe: `Kadence_Blocks_Abstract_Block::merge_attributes_with_defaults()` still lets a genuinely
 * customized instance value win afterward. Because `size` has no `source` key and defaults to `50`,
 * the block serializer omits it from saved content whenever it was never customized, so an instance
 * with no stored `size` ends up with this token-resolved default — which covers the large majority
 * of currently-published icon blocks, not a narrow legacy case. Intentional: this mirrors the
 * retroactive re-skin behavior kadence/image's borderRadius token already has in production.
 *
 * The rem/em-to-px conversion assumes a 16px root font size — the same assumption an unstyled
 * `rem` makes in a browser. Nothing in this module tracks a site's actual root font size, so this
 * is a known, accepted simplification rather than a silent guess.
 *
 * Does NOT affect a freshly inserted icon block: `single-icon` is a static (client-rendered) block,
 * so a fresh insert's `size` comes from block.json's JS default at insert time, before this
 * render-path filter ever runs. See Phase 3 (the editor-default catalog) for that case.
 *
 * @since TBD
 */
final class Icon_Size_Adapter extends Abstract_Adapter {

	/**
	 * @since TBD
	 *
	 * @var string
	 */
	protected const BLOCK = 'kadence/single-icon';

	/**
	 * The resolved-token dot-path this adapter reads.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TOKEN = 'semantic.icon-size.default';

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
	 * @inheritDoc
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $attributes The block's registration default attributes.
	 *
	 * @return array<string, mixed> The transformed default attributes.
	 */
	public function apply( array $attributes ): array {
		$length = $this->resolver->resolve()->value( self::TOKEN );

		if ( $length === null ) {
			return $attributes;
		}

		$px = $this->to_px( $length );

		if ( $px === null ) {
			return $attributes;
		}

		$attributes['size'] = $px;

		return $attributes;
	}

	/**
	 * Convert a resolved CSS length to a raw pixel number, assuming the browser/CSS default root
	 * font size (16px) for `rem`/`em` — the only units this token family's baseline values use.
	 * Returns null for a value this adapter cannot safely convert (already px, or an unrecognized
	 * unit), so the caller can leave the attribute as WordPress's own default rather than guess.
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
