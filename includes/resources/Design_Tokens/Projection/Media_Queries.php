<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Responsive;

/**
 * The breakpoint => media-query map every responsive projection layer wraps its `@media` blocks in.
 *
 * Resolved at emit time so the filterable KB breakpoints are final, keyed to match the resolver's
 * breakpoint keys, and reading the same filters the block CSS does — a site that moves its breakpoints
 * moves the token, preset and block-default projections together. Desktop is the base (`:root`), so
 * only the tablet / mobile max-width overrides are listed.
 *
 * @since TBD
 */
final class Media_Queries {

	/**
	 * @since TBD
	 *
	 * @return array<string, string> Breakpoint key => media-query string.
	 */
	public static function all(): array {
		return [
			/** This filter is documented in includes/class-kadence-blocks-css.php. */
			Responsive::get_tablet_key() => (string) apply_filters( 'kadence_tablet_media_query', '(max-width: 1024px)' ),
			/** This filter is documented in includes/class-kadence-blocks-css.php. */
			Responsive::get_mobile_key() => (string) apply_filters( 'kadence_mobile_media_query', '(max-width: 767px)' ),
		];
	}
}
