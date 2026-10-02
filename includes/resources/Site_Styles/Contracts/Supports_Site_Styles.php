<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles\Contracts;

/**
 * A block that takes site-level styles in the Kadence theme's FSE mode. The
 * block's class describes what the module needs to store, render and show its
 * site-level values.
 *
 * @since TBD
 */
interface Supports_Site_Styles {

	/**
	 * The block type name, e.g. `kadence/singlebtn`. `Kadence_Blocks_Abstract_Block` provides it.
	 *
	 * @since TBD
	 *
	 * @return string The block type name.
	 */
	public function get_name(): string;

	/**
	 * The block name without its namespace, e.g. `singlebtn`: the key under
	 * `settings.custom.kadence` and in the block's render-attributes filter.
	 * `Kadence_Blocks_Abstract_Block` provides it.
	 *
	 * @since TBD
	 *
	 * @return string The block slug.
	 */
	public function get_slug(): string;

	/**
	 * Attributes that core's Styles screen also edits, stored at a path in the
	 * block's core style so both surfaces edit one value. Only `color.*` paths
	 * are supported for now.
	 *
	 * @since TBD
	 *
	 * @return array<string, string> Attribute name => path in the block's core style, e.g. `color.background`.
	 */
	public function site_styles_attributes_map(): array;

	/**
	 * The core supports the block type gets in FSE mode.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed> Block supports, as in `block.json`.
	 */
	public function site_styles_supports(): array;

	/**
	 * The core selectors the block type gets in FSE mode.
	 *
	 * @since TBD
	 *
	 * @return array<string, string> Block selectors, as in `block.json`.
	 */
	public function site_styles_selectors(): array;
}
