<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Theme_Button_Styles_Overlay;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Overlay;

/**
 * The version of a library's EFFECTIVE document — everything the resolved values depend on that can
 * change at runtime: the stored overrides (the store version), the theme Style Guide the baseline is
 * re-valued from (the Style Guide overlay signature) and the button styles the theme offers as presets
 * (the theme buttons overlay signature).
 *
 * Every resolved-tokens and projected-CSS cache keys on this instead of the store version alone, so a
 * Customizer save or a theme switch — which bumps no store version — still invalidates them. On a site
 * where both overlays are empty this IS the store version, so those cache keys are unchanged.
 *
 * Not for optimistic concurrency: the REST layer keeps comparing the store version, because a
 * Customizer save does not change the stored document a client is editing.
 *
 * @since TBD
 */
final class Effective_Version {

	/**
	 * The token store.
	 *
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * The theme-derived overlay whose signature is folded in.
	 *
	 * @since TBD
	 *
	 * @var Style_Guide_Overlay
	 */
	private Style_Guide_Overlay $overlay;

	/**
	 * The theme button styles overlay whose signature is folded in.
	 *
	 * @since TBD
	 *
	 * @var Theme_Button_Styles_Overlay
	 */
	private Theme_Button_Styles_Overlay $buttons;

	/**
	 * @since TBD
	 *
	 * @param Token_Store                 $store   The token store.
	 * @param Style_Guide_Overlay         $overlay The theme Style Guide overlay.
	 * @param Theme_Button_Styles_Overlay $buttons The theme button styles overlay.
	 */
	public function __construct( Token_Store $store, Style_Guide_Overlay $overlay, Theme_Button_Styles_Overlay $buttons ) {
		$this->store   = $store;
		$this->overlay = $overlay;
		$this->buttons = $buttons;
	}

	/**
	 * The effective version for a library: the store version, extended with each overlay signature that
	 * is not empty.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return string
	 */
	public function for_slug( string $slug ): string {
		$version = $this->store->get_version( $slug );

		foreach ( [ $this->overlay->signature(), $this->buttons->signature() ] as $signature ) {
			if ( $signature !== '' ) {
				$version .= '-' . $signature;
			}
		}

		return $version;
	}
}
