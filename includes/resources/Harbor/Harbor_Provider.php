<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Harbor;

use KadenceWP\KadenceBlocks\LiquidWeb\Harbor\Config as HarborConfig;
use KadenceWP\KadenceBlocks\LiquidWeb\Harbor\Harbor;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_authorization_token;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_domain;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\is_authorized;

final class Harbor_Provider extends Provider {

	/**
	 * @return void
	 */
	public function register(): void {
		HarborConfig::set_container( $this->container );
		Harbor::init();

		lw_harbor_register_submenu( 'kadence-blocks' );
		add_filter( 'lw-harbor/legacy_licenses', [ $this, 'report_legacy_licenses' ] );
	}

	/**
	 * Reports legacy Uplink-managed Kadence licenses to Harbor so they appear
	 * in the unified license UI.
	 *
	 * @param array $licenses Existing legacy licenses from other plugins.
	 *
	 * @return array
	 */
	public function report_legacy_licenses( array $licenses ): array {
		$data = kadence_blocks_get_current_license_data();

		if ( empty( $data['key'] ) ) {
			return $licenses;
		}

		$product_names = [
			'kadence-blocks'       => 'Kadence Blocks',
			'kadence-blocks-pro'   => 'Kadence Blocks Pro',
			'kadence-creative-kit' => 'Kadence Creative Kit',
		];

		$slug      = $data['product'] ?? 'kadence-blocks';
		$name      = $product_names[ $slug ] ?? 'Kadence Blocks';
		$token     = get_authorization_token( 'kadence-blocks' );
		$is_active = is_authorized( $data['key'], 'kadence-blocks', $token ?? '', get_license_domain() );

		$licenses[] = [
			'key'       => $data['key'],
			'slug'      => $slug,
			'name'      => $name,
			'product'   => 'kadence',
			'is_active' => $is_active,
			'page_url'  => admin_url( 'admin.php?page=kadence-blocks-home' ),
		];

		return $licenses;
	}

}
