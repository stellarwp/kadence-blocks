<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Harbor\Actions;

use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_authorization_token;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_domain;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_key;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\is_authorized;

final class Report_Legacy_Licenses {

	/**
	 * Reports legacy Uplink-managed Kadence licenses to Harbor so they appear
	 * in the unified license UI.
	 *
	 * @param array $licenses Existing legacy licenses from other plugins.
	 *
	 * @return array
	 */
	public function __invoke( array $licenses ): array {
		$reported_keys = [];
		$domain        = get_license_domain();

		foreach ( ( new Get_Known_Plugins() )() as $slug => $plugin ) {
			$key = get_license_key( $slug );

			if ( empty( $key ) || isset( $reported_keys[ $key ] ) ) {
				continue;
			}

			$reported_keys[ $key ] = true;
			$token                 = get_authorization_token( $slug );
			$is_active             = is_authorized( $key, $slug, $token ?? '', $domain );

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
