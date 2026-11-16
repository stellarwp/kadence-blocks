<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed;

/**
 * Adds the families registered with the Kadence Custom Fonts plugin to the font catalog.
 *
 * That plugin keeps its fonts in `kt_font` posts and hands them to the block editor through the
 * `kadence.typography_options` JS filter only, so neither the `kadence_blocks_custom_fonts` PHP filter
 * nor any script on the Style Library screen ever sees them. This callback on
 * `kadence_blocks_font_catalog_custom_names` is the whole bridge: it is the same filter any other plugin
 * would use.
 *
 * Keep this in place for as long as Custom Fonts releases that do not hook the filter themselves are in
 * use. A site may update either plugin first, so removing it would silently bring the missing-fonts
 * problem back for anyone still on an older Custom Fonts. It never calls into Custom Fonts without
 * checking the class and the method exist, and it treats any failure there as "no extra names".
 *
 * @since TBD
 */
final class Kadence_Custom_Fonts_Names {

	/**
	 * Add the Custom Fonts plugin's family names, when it is active.
	 *
	 * Mirrors how that plugin builds its own list: an Adobe Fonts entry carries its families in the
	 * `_kad_typekit` meta, every other entry names a single family in `_kad_font_name`. Fail-soft to the
	 * incoming list when the plugin is absent or its query is not callable.
	 *
	 * @since TBD
	 *
	 * @param mixed $names The custom family names so far.
	 *
	 * @return mixed The names, with the plugin's families appended.
	 */
	public function add_names( $names ) {
		if ( ! is_array( $names ) || ! class_exists( 'Kadence_Custom_Fonts' ) || ! is_callable( [ 'Kadence_Custom_Fonts', 'kt_font_query' ] ) ) {
			return $names;
		}

		// The two plugins update independently, so nothing the other one does may take this site down: a
		// renamed, re-signatured or throwing query just means no extra names.
		try {
			$posts = \Kadence_Custom_Fonts::kt_font_query();
		} catch ( \Throwable $e ) {
			return $names;
		}

		if ( ! is_array( $posts ) ) {
			return $names;
		}

		foreach ( $posts as $post ) {
			if ( ! $post instanceof \WP_Post ) {
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
