<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles\Contracts;

/**
 * A block whose instances take only some of the site-level values, depending
 * on a style each instance picks, e.g. a button's Fill / Outline / Inherit.
 * One that also prints site rules implements `Prints_Site_Rules`.
 *
 * @since 3.9.0
 */
interface Scopes_Site_Styles {

	/**
	 * The attribute that holds the instance's style, e.g. `inheritStyles`.
	 * It must also be excluded, so it is never stored site-wide.
	 *
	 * @since 3.9.0
	 *
	 * @return string Attribute name.
	 */
	public function site_styles_scope_attribute(): string;

	/**
	 * The style an instance takes site values as. Usually its scope attribute's
	 * value, but a block can read it from what the instance actually renders.
	 *
	 * @since 3.9.0
	 *
	 * @param array<string, mixed> $attributes The instance's attributes.
	 *
	 * @return string|null The style, as a key of `site_styles_scoped_attributes()`, or null for the block's default.
	 */
	public function site_styles_scope_style( array $attributes ): ?string;

	/**
	 * The site attributes each style takes. A style that isn't listed takes
	 * all of them; an empty list takes none.
	 *
	 * @since 3.9.0
	 *
	 * @return array<string, list<string>> Style => attribute names.
	 */
	public function site_styles_scoped_attributes(): array;
}
