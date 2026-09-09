<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Overlay;

/**
 * The version of a library's EFFECTIVE document — everything the resolved values depend on that can
 * change at runtime: the stored overrides (the store version) and the theme Style Guide the baseline
 * is re-valued from (the overlay signature).
 *
 * Every resolved-tokens and projected-CSS cache keys on this instead of the store version alone, so a
 * Customizer save — which bumps no store version — still invalidates them. On a site where the overlay
 * is empty (no Kadence theme) this IS the store version, so those cache keys are unchanged.
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
	 * @since TBD
	 *
	 * @param Token_Store         $store   The token store.
	 * @param Style_Guide_Overlay $overlay The theme Style Guide overlay.
	 */
	public function __construct( Token_Store $store, Style_Guide_Overlay $overlay ) {
		$this->store   = $store;
		$this->overlay = $overlay;
	}

	/**
	 * The effective version for a library: the store version, extended with the overlay signature when
	 * there is one.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return string
	 */
	public function for_slug( string $slug ): string {
		$version   = $this->store->get_version( $slug );
		$signature = $this->overlay->signature();

		return $signature === '' ? $version : $version . '-' . $signature;
	}
}
