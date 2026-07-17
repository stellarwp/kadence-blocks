<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Palette_Slot;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use RuntimeException;

/**
 * Feeds resolved token values into KB's legacy color palette so existing blocks inherit tokens without
 * per-block changes.
 *
 * kadence_blocks_pattern_global_colors — tokens declaring a kadence_slot of palette[1-9] override that
 * --global-paletteN entry. The callback is a transform of the incoming array: a token-claimed slot is
 * rewritten to "var(--kb-token--…, <resolved literal>)" so legacy blocks react to variant overrides of
 * --kb-token--* with the resolved literal as a fallback for contexts that lack the token definitions
 * (e.g. prebuilt-library preview iframes). Everything else passes through untouched.
 *
 * The font-size scale is delivered separately, through the --global-kb-font-size-<slug> slot bridge
 * (Font_Size_Target) in Css_Builder, not this filter.
 *
 * A no-op when the Kadence theme owns the palette. Activation is gated upstream by the Projector (it
 * only calls this when Token_Registry::is_active()).
 *
 * @since TBD
 */
final class Legacy_Filter_Bridge {

	/**
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * @param Token_Registry $registry
	 * @param Token_Resolver $resolver
	 */
	public function __construct( Token_Registry $registry, Token_Resolver $resolver ) {
		$this->registry = $registry;
		$this->resolver = $resolver;
	}

	/**
	 * Filter callback for kadence_blocks_pattern_global_colors.
	 *
	 * A no-op when the Kadence theme is active: KB's existing CSS emits --global-palette* only when
	 * the theme is not active, so mirroring that guard here prevents the editor's JS color swatches
	 * (which use this filter unconditionally) from diverging from the rendered CSS. Token-driven
	 * palette values under the Kadence theme are handled by a separate palette projector.
	 *
	 * @since TBD
	 *
	 * @param array<string,string> $colors The current --global-palette* map.
	 *
	 * @return array<string,string>
	 */
	public function global_colors( array $colors ): array {
		if ( class_exists( 'Kadence\Theme' ) ) {
			return $colors;
		}

		try {
			$resolved = $this->resolver->resolve();
		} catch ( RuntimeException $e ) {
			// A corrupt stored document (alias cycle or dangling alias) must not kill the page.
			// The REST write gate rejects such documents, but a direct DB write could bypass it.
			// Fail open: return the incoming array untouched so existing palette values survive.
			return $colors;
		}

		foreach ( $this->registry->by_projection( Kadence_Palette_Slot::get_projection_key() ) as $id => $token ) {
			$slot = Kadence_Palette_Slot::from_token( $token );
			if ( $slot === null ) {
				continue; // not a palette slot (e.g. a font-size kadence_slot) — leave to font_sizes().
			}

			$value = $resolved->value( $id );
			if ( $value === null ) {
				continue;
			}

			// Point the slot at the token var so blocks react to variant overrides, with the resolved
			// literal as a fallback for preview iframes that build their own palette CSS.
			$colors[ '--global-' . $slot->slug ] = sprintf( 'var(%s, %s)', $token->css_var, $value );
		}

		return $colors;
	}
}
