<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Foundation_Presets\Exception;

use RuntimeException;

/**
 * Thrown when a caller asks for a foundation-preset group or choice that the baseline does not define,
 * or when a preset references a primitive the baseline carries no $type for (a programming error: the
 * shipped presets only ever target shipped primitives).
 *
 * @since TBD
 */
final class Unknown_Preset_Exception extends RuntimeException {

	/**
	 * No such preset group (e.g. "typeScale", "colorPalette").
	 *
	 * @since TBD
	 *
	 * @param string $group The requested group key.
	 *
	 * @return self
	 */
	public static function for_group( string $group ): self {
		return new self( sprintf( 'Unknown foundation preset group "%s".', $group ) );
	}

	/**
	 * No such preset within an existing group.
	 *
	 * @since TBD
	 *
	 * @param string $group  The group key.
	 * @param string $choice The requested preset slug.
	 *
	 * @return self
	 */
	public static function for_choice( string $group, string $choice ): self {
		return new self( sprintf( 'Unknown foundation preset "%s" in group "%s".', $choice, $group ) );
	}

	/**
	 * A preset token targets a dot-path the baseline carries no concrete $type for.
	 *
	 * @since TBD
	 *
	 * @param string $dot_path The token dot-path.
	 *
	 * @return self
	 */
	public static function for_missing_baseline_type( string $dot_path ): self {
		return new self( sprintf( 'Foundation preset token "%s" has no $type in the baseline.', $dot_path ) );
	}
}
