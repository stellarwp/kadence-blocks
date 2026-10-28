<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles\Contracts;

/**
 * A grouped block whose older saved content can still carry attributes that
 * stand in for a group, e.g. separate top, right, bottom and left padding
 * numbers in place of the padding group.
 *
 * Such an instance renders its older attributes instead of the group, so it
 * sets the group itself: it takes none of the group's site values, and a
 * migration that writes the group stores no site value either.
 *
 * @since TBD
 */
interface Legacy_Group_Attributes extends Groups_Site_Styles {

	/**
	 * The older attributes, keyed by the first attribute of the group they
	 * stand in for. An instance sets the group when any of them holds a
	 * number or a string that isn't empty, anywhere in its value.
	 *
	 * @since TBD
	 *
	 * @return array<string, list<string>> First attribute of a group => older attribute names.
	 */
	public function site_styles_legacy_group_attributes(): array;
}
