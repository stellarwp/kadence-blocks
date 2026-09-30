<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles\Contracts;

/**
 * A block whose instances take only some of the site-level values, depending
 * on a style each instance picks, e.g. a button's Fill / Outline / Inherit.
 *
 * @since TBD
 */
interface Scopes_Site_Styles {

	/**
	 * The attribute that holds the instance's style, e.g. `inheritStyles`.
	 * It must also be excluded, so it is never stored site-wide.
	 *
	 * @since TBD
	 *
	 * @return string Attribute name.
	 */
	public function site_styles_scope_attribute(): string;

	/**
	 * The site attributes each style takes. A style that isn't listed takes
	 * all of them; an empty list takes none.
	 *
	 * @since TBD
	 *
	 * @return array<string, list<string>> Style => attribute names.
	 */
	public function site_styles_scoped_attributes(): array;
}
