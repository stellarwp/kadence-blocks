<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide;

use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Contracts\Style_Guide_Source;
use KadenceWP\KadenceBlocks\Utils\Cast;

/**
 * Reads the Kadence theme's Style Guide: the global palette option and the theme settings the mapper
 * asks for. The only class in this namespace that touches WordPress or the theme.
 *
 * Returns null when the Kadence theme is not active, so every other theme resolves tokens exactly
 * as it did before this layer existed.
 *
 * The theme is not part of the plugin's static-analysis scan, so it is called through a validated
 * callable and every result is narrowed here rather than typed against theme classes.
 *
 * @since TBD
 */
final class Style_Guide_Reader implements Style_Guide_Source {

	/**
	 * The theme's palette option key.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PALETTE_OPTION = 'kadence_global_palette';

	/**
	 * The theme's accessor function; returns its Template_Tags proxy.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const THEME_ACCESSOR = 'Kadence\kadence';

	/**
	 * The theme class whose presence means the theme is active.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const THEME_CLASS = 'Kadence\Theme';

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function snapshot(): ?array {
		$theme = $this->theme();

		if ( $theme === null ) {
			return null;
		}

		$settings = [];
		$option   = [ $theme, 'option' ];

		if ( is_callable( $option ) ) {
			foreach ( Style_Guide_Mapper::setting_keys() as $key ) {
				$settings[ $key ] = call_user_func( $option, $key );
			}
		}

		return [
			'palette'  => $this->palette( $theme ),
			'settings' => $settings,
		];
	}

	/**
	 * The theme's palette option key, for callers that need to invalidate on its change.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_palette_option_key(): string {
		return self::PALETTE_OPTION;
	}

	/**
	 * The decoded palette option, falling back to the theme's (filterable) defaults when the option is
	 * absent, so a never-customized site reads the colors the theme actually renders.
	 *
	 * Read with get_option(), never through the theme's palette_option(): that accessor ends in the
	 * kadence_palette_option filter the projection layer hooks, which resolves tokens, which builds the
	 * baseline this reader feeds — a loop. get_option() still passes the theme's own normalize filter.
	 *
	 * @since TBD
	 *
	 * @param object $theme The theme's Template_Tags proxy.
	 *
	 * @return array<string, mixed>
	 */
	private function palette( object $theme ): array {
		$stored = get_option( self::PALETTE_OPTION );

		// A site can filter option_kadence_global_palette to return the decoded array. Treating that as
		// "absent" would silently swap the user's Style Guide for the theme's defaults, so take it as-is.
		if ( is_array( $stored ) ) {
			return $stored;
		}

		$raw      = is_string( $stored ) ? $stored : '';
		$defaults = [ $theme, 'get_default_palette' ];

		if ( $raw === '' && is_callable( $defaults ) ) {
			$raw = Cast::to_string( call_user_func( $defaults ) );
		}

		$decoded = json_decode( $raw, true );

		return is_array( $decoded ) ? $decoded : [];
	}

	/**
	 * The theme's Template_Tags proxy, or null when the Kadence theme is not active or not yet loaded.
	 *
	 * @since TBD
	 *
	 * @return object|null
	 */
	private function theme(): ?object {
		/** @var callable-string $accessor The theme's accessor; guarded by function_exists() below. */
		$accessor = self::THEME_ACCESSOR;

		// The theme is not in the plugin's static-analysis scope, so its class and function are unknown
		// symbols here. Both checks are real at runtime; the indirection keeps the analyzer from folding
		// them to a constant false and reporting the rest of this method as dead.
		if ( ! class_exists( self::THEME_CLASS ) || ! function_exists( $accessor ) ) {
			return null;
		}

		$theme = call_user_func( $accessor );

		return is_object( $theme ) ? $theme : null;
	}
}
