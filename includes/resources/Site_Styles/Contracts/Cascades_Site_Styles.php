<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles\Contracts;

/**
 * A block whose site-level values are one setting kept per device, e.g. a
 * button's padding with its Tablet and Mobile values and the unit they share.
 * A value the instance sets for a device holds for the narrower devices, as in
 * CSS, and is in its own unit, so the site's values must not replace it.
 *
 * Unlike `Groups_Site_Styles`, an instance that sets one attribute of a cascade
 * still takes the site values of the devices its own value doesn't cover.
 *
 * @since TBD
 */
interface Cascades_Site_Styles {

	/**
	 * The attributes that make up one setting. `values` lists them from the
	 * widest device to the narrowest: a site value is dropped when the instance
	 * has its own value for an attribute before it. `unit` is the attribute that
	 * holds the unit the values share: when the instance has its own value or its
	 * own unit in a cascade, and its unit is not the site's, every site value of
	 * the cascade is dropped, as a value can't be shown in the other unit. Each
	 * attribute must also be listed by `site_styles_overlay_attributes()`.
	 *
	 * @since TBD
	 *
	 * @return list<array{unit?: string, values: list<string>}> The cascades.
	 */
	public function site_styles_cascades(): array;
}
