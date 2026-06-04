<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;

/**
 * Feeds resolved token values into KB's legacy variable families so existing blocks inherit tokens
 * without per-block changes.
 *
 *   kadence_blocks_pattern_global_colors  — tokens with a kadence_slot of palette[1-9] -> --global-paletteN
 *   kadence_blocks_variable_font_sizes    — tokens with a kadence_slot font key       -> that size key
 *
 * Each callback is a transform of the incoming array: a token-claimed slot is rewritten to
 * "var(--kb-token--…, <resolved literal>)" so legacy blocks react to variant overrides of
 * --kb-token--* with the resolved literal as a fallback for contexts that lack the token definitions
 * (e.g. prebuilt-library preview iframes). Everything else passes through untouched.
 *
 * The color half is a no-op when the Kadence theme owns the palette. Activation is gated upstream
 * by the Provider (it only registers these filters when Token_Registry::is_active()).
 *
 * @since TBD
 */
final class Legacy_Filter_Bridge {

	/**
	 * The projection key a token uses to claim a Kadence slot.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SLOT = 'kadence_slot';

	/**
	 * The font-size keys KB ships; a slot matching one of these feeds the font-size filter.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const FONT_SIZE_KEYS = [ 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl' ];

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

		$resolved = $this->resolver->resolve();

		foreach ( $this->registry->by_projection( self::SLOT ) as $id => $token ) {
			$slot = $token->projections[ self::SLOT ] ?? null;
			if ( ! is_string( $slot ) || preg_match( '/^palette[1-9]$/', $slot ) !== 1 ) {
				continue;
			}

			$value = $resolved->value( $id );
			if ( $value === null ) {
				continue;
			}

			// Point the slot at the token var so blocks react to variant overrides, with the
			// resolved literal as a fallback for preview iframes that build their own palette
			// CSS without the token definitions.
			$colors[ '--global-' . $slot ] = sprintf( 'var(%s, %s)', $token->css_var, $value );
		}

		return $colors;
	}

	/**
	 * Filter callback for kadence_blocks_variable_font_sizes.
	 *
	 * @since TBD
	 *
	 * @param array<string,string> $sizes The current size-key => clamp() map.
	 *
	 * @return array<string,string>
	 */
	public function font_sizes( array $sizes ): array {
		$resolved = $this->resolver->resolve();

		foreach ( $this->registry->by_projection( self::SLOT ) as $id => $token ) {
			$slot = $token->projections[ self::SLOT ] ?? null;
			if ( ! is_string( $slot ) || ! in_array( $slot, self::FONT_SIZE_KEYS, true ) ) {
				continue;
			}

			$value = $resolved->value( $id );
			if ( $value === null ) {
				continue;
			}

			// Same indirection + literal fallback as global_colors(): reactive where the token vars
			// exist, falling back to the resolved clamp/length in iframes that lack them.
			$sizes[ $slot ] = sprintf( 'var(%s, %s)', $token->css_var, $value );
		}

		return $sizes;
	}
}
