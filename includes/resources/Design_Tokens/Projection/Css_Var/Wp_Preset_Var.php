<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var;

/**
 * Derives a WordPress preset custom-property name from a (category, slug) pair.
 *
 * WordPress exposes theme.json presets as custom properties of the form
 * "--wp--preset--<category>--<slug>" (e.g. --wp--preset--color--button-bg). This class never
 * declares those names by hand — it derives them by one deterministic rule so they cannot drift
 * from the token that feeds them.
 *
 * @since TBD
 */
final class Wp_Preset_Var {

	/**
	 * @since TBD
	 *
	 * @var string
	 */
	public const PREFIX = '--wp--preset--';

	/**
	 * Derive the "--wp--preset--<category>--<slug>" custom-property name.
	 *
	 * @since TBD
	 *
	 * @param string $category The preset category, e.g. "color" or "font-size".
	 * @param string $slug     The preset slug, e.g. "button-bg".
	 *
	 * @return string The derived "--wp--preset--<category>--<slug>" name.
	 */
	public static function from( string $category, string $slug ): string {
		return self::PREFIX . $category . '--' . $slug;
	}
}
