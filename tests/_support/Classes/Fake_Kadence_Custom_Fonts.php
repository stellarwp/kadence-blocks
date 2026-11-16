<?php declare( strict_types=1 );

namespace Tests\Support\Classes;

/**
 * Test double for the Kadence Custom Fonts plugin's public query, aliased to the global class name the
 * plugin uses. Same static method and the same per-request memoization, plus hooks so a test can make the
 * query return something unexpected or throw, as a future release of that plugin might.
 */
final class Fake_Kadence_Custom_Fonts {

	/**
	 * @var array|null
	 */
	private static $font_query = null;

	/**
	 * @var callable|null Replaces the query result when set.
	 */
	public static $behavior = null;

	/**
	 * Define the global `Kadence_Custom_Fonts` name once, when the real plugin is not loaded.
	 *
	 * @return void
	 */
	public static function install(): void {
		if ( ! class_exists( 'Kadence_Custom_Fonts', false ) ) {
			class_alias( self::class, 'Kadence_Custom_Fonts' );
		}
	}

	/**
	 * @return mixed
	 */
	public static function kt_font_query() {
		if ( null !== self::$behavior ) {
			return ( self::$behavior )();
		}

		if ( null === self::$font_query ) {
			self::$font_query = get_posts( [ 'post_type' => 'kt_font', 'numberposts' => -1, 'order' => 'ASC', 'orderby' => 'ID' ] );
		}

		return self::$font_query;
	}

	/**
	 * @return void
	 */
	public static function reset(): void {
		self::$font_query = null;
		self::$behavior   = null;
	}
}
