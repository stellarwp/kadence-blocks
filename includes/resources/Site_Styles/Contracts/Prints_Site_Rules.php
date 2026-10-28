<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles\Contracts;

/**
 * A scoped block whose site values off its overlay list render through site
 * rules, one set per style, each scoped by the class an instance of that
 * style carries.
 *
 * A block without site rules renders only its overlay values and the values
 * core's style stores, so it excludes every other attribute.
 *
 * @since TBD
 */
interface Prints_Site_Rules extends Scopes_Site_Styles {

	/**
	 * The class an instance of the style carries, which scopes the site rules
	 * printed for that style.
	 *
	 * @since TBD
	 *
	 * @param string $style The style, e.g. `fill`.
	 *
	 * @return string Class name, e.g. `kb-btn-global-fill`.
	 */
	public function site_styles_scope_class( string $style ): string;
}
