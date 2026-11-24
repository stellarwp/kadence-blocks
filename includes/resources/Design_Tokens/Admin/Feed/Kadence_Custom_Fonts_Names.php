<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed;

use Kadence_Custom_Fonts;
use Throwable;
use WP_Post;

/**
 * Adds the Kadence Custom Fonts families to the font catalog.
 *
 * @since 3.9.2
 */
final class Kadence_Custom_Fonts_Names {

	/**
	 * @since 3.9.2
	 *
	 * @param mixed $names The custom family names so far.
	 *
	 * @return mixed The names, with the plugin's families appended.
	 */
	public function add_names( $names ) {
		if ( ! is_array( $names ) || ! class_exists( 'Kadence_Custom_Fonts' ) || ! is_callable( [ 'Kadence_Custom_Fonts', 'kt_font_query' ] ) ) {
			return $names;
		}

		try {
			$posts = Kadence_Custom_Fonts::kt_font_query();
		} catch ( Throwable $e ) {
			return $names;
		}

		if ( ! is_array( $posts ) ) {
			return $names;
		}

		foreach ( $posts as $post ) {
			if ( ! $post instanceof WP_Post ) {
				continue;
			}

			if ( 'adobe' !== get_post_meta( $post->ID, '_kad_font_type', true ) ) {
				$names[] = get_post_meta( $post->ID, '_kad_font_name', true );

				continue;
			}

			$typekit = get_post_meta( $post->ID, '_kad_typekit', true );

			if ( ! is_array( $typekit ) || ! isset( $typekit['families'] ) || ! is_array( $typekit['families'] ) ) {
				continue;
			}

			foreach ( $typekit['families'] as $family ) {
				$names[] = is_array( $family ) ? ( $family['name'] ?? '' ) : '';
			}
		}

		return $names;
	}
}
