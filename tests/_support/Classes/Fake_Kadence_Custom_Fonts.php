<?php declare( strict_types=1 );

namespace Tests\Support\Classes;

/**
 * Test double for the Kadence Custom Fonts plugin's `kt_font_query()`, aliased to the plugin's global class
 * name. `$behavior` replaces the query result.
 */
final class Fake_Kadence_Custom_Fonts {

	/**
	 * The memoized query result.
	 *
	 * @since TBD
	 *
	 * @var array|null
	 */
	private static $font_query = null;

	/**
	 * Replaces the query result when set.
	 *
	 * @since TBD
	 *
	 * @var callable|null
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
	 * The `kt_font` posts, or whatever `$behavior` returns or throws.
	 *
	 * @return mixed
	 */
	public static function kt_font_query() {
		if ( null !== self::$behavior ) {
			return ( self::$behavior )();
		}

		if ( null === self::$font_query ) {
			self::$font_query = get_posts(
				[
					'post_type'   => 'kt_font',
					'numberposts' => -1,
					'order'       => 'ASC',
					'orderby'     => 'ID',
				] 
			);
		}

		return self::$font_query;
	}

	/**
	 * Clear the memoized query and any `$behavior`.
	 *
	 * @return void
	 */
	public static function reset(): void {
		self::$font_query = null;
		self::$behavior   = null;
	}
}
