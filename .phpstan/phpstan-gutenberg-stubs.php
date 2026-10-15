<?php
/**
 * PHPStan stubs for Gutenberg plugin classes.
 *
 * These are not included in php-stubs/wordpress-stubs.
 */

declare( strict_types=1 );

/**
 * The Gutenberg plugin's copy of WP_Theme_JSON_Data. It doesn't extend core's class.
 */
class WP_Theme_JSON_Data_Gutenberg {

	/**
	 * @param array  $data   Array following the theme.json specification.
	 * @param string $origin The origin of the data: default, theme, user.
	 */
	public function __construct( $data = [], $origin = 'theme' ) {}

	/**
	 * @return array
	 */
	public function get_data() {
		return [];
	}
}
