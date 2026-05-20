<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Harbor\Actions;

use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_key;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_resource;

/**
 * Reports Kadence's legacy Uplink licenses into Harbor's unified license listing.
 *
 * @since 3.7.0
 */
final class Report_Legacy_Licenses {

	/**
	 * Reports legacy Uplink-managed Kadence licenses to Harbor so they appear
	 * in the unified license UI.
	 *
	 * @since 3.7.0
	 *
	 * @param array $licenses Existing legacy licenses from other plugins.
	 *
	 * @return array
	 */
	public function __invoke( array $licenses ): array {
		$reported_keys = [];

		foreach ( ( new Get_Known_Plugins() )() as $slug => $plugin ) {
			$key = get_license_key( $slug );

			if ( empty( $key ) || isset( $reported_keys[ $key ] ) ) {
				continue;
			}

			$resource = get_resource( $slug );

			if ( ! $resource ) {
				continue;
			}

			$reported_keys[ $key ] = true;

			$is_active = $resource->has_valid_license();

			$licenses[] = [
				'key'       => $key,
				'slug'      => $slug,
				'name'      => $plugin['name'],
				'product'   => 'kadence',
				'is_active' => $is_active,
				'page_url'  => esc_url( $plugin['page_url'] ),
			];
		}

		return $licenses;
	}

}
