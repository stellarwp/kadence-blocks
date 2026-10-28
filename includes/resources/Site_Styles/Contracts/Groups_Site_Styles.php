<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles\Contracts;

/**
 * A block whose site-level values come in groups that only make sense
 * together, e.g. a height with its tablet and mobile heights and its unit, or
 * a color with its opacity.
 *
 * An instance that sets any attribute of a group itself takes none of the
 * group's site values, so the site's unit never turns the instance's own
 * number into another length, and a site tablet value never overrides the
 * instance's own desktop value.
 *
 * In the editor, a change that starts an instance setting a group stores the
 * whole group as shown, so the block keeps looking as it did apart from the
 * change. An instance nobody changes stores no site value.
 *
 * @since TBD
 */
interface Groups_Site_Styles {

	/**
	 * The groups. Every attribute in a group must be on the block's overlay
	 * list, and an attribute can be in only one group.
	 *
	 * @since TBD
	 *
	 * @return list<list<string>> Groups of attribute names.
	 */
	public function site_styles_attribute_groups(): array;
}
