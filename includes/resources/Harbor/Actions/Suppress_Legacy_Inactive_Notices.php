<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Harbor\Actions;

/**
 * Suppresses legacy Kadence add-on "license not activated" admin notices in favor of Harbor's unified UI.
 *
 * @since 3.7.0
 */
final class Suppress_Legacy_Inactive_Notices {

	/**
	 * Removes legacy "not activated" admin notices from all Kadence add-ons.
	 *
	 * Each add-on registers its inactive_notice callback during plugins_loaded,
	 * which runs after Harbor_Provider::register(). Hooking to admin_init ensures
	 * all add-on callbacks are already registered before we remove them.
	 *
	 * @since 3.7.0
	 *
	 * @return void
	 */
	public function __invoke(): void {
		global $wp_filter;

		if ( empty( $wp_filter['admin_notices'] ) ) {
			return;
		}

		foreach ( $wp_filter['admin_notices']->callbacks as $priority => $callbacks ) {
			foreach ( $callbacks as $key => $callback ) {
				$function = $callback['function'];

				if ( ! is_array( $function )
					|| ! is_object( $function[0] )
					|| $function[1] !== 'inactive_notice'
				) {
					continue;
				}

				if ( strpos( get_class( $function[0] ), 'KadenceWP\\' ) === 0 ) {
					unset( $wp_filter['admin_notices']->callbacks[ $priority ][ $key ] );
				}
			}
		}
	}

}
