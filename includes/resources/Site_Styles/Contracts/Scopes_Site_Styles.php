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
	 * The style an instance takes site values as. Usually its scope attribute's
	 * value, but a block can read it from what the instance actually renders.
	 *
	 * @since TBD
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
	 * @since TBD
	 *
	 * @return array<string, list<string>> Style => attribute names.
	 */
	public function site_styles_scoped_attributes(): array;

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
