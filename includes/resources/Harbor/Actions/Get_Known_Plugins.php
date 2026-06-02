<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Harbor\Actions;

/**
 * Provides the list of Kadence plugins that integrate with Harbor.
 *
 * @since 3.7.0
 */
final class Get_Known_Plugins {

	/**
	 * Returns a map of all known Kadence plugin slugs to their metadata.
	 *
	 * page_url should be a full URL and should point to the plugin's
	 * license settings page.
	 *
	 * @since 3.7.0
	 *
	 * @return array<string, array{name: string, page_url: string}>
	 */
	public function __invoke(): array {
		$default_page = admin_url( 'admin.php?page=kadence-blocks' );

		return [
			'kadence-blocks'       => [
				'name'     => 'Kadence Blocks',
				'page_url' => $default_page,
				'constant' => 'KADENCE_BLOCKS_VERSION',
				'is_premium' => false,
			],
			'kadence-blocks-pro'   => [
				'name'     => 'Kadence Blocks Pro',
				'page_url' => $default_page,
				'constant' => 'KBP_VERSION',
				'is_premium' => true,
			],
			'kadence-creative-kit' => [
				'name'     => 'Kadence Creative Kit',
				'page_url' => admin_url( 'admin.php?page=kadence-blocks-home&license=show' ),
				'constant' => 'KADENCE_CREATIVE_KIT_VERSION',
				'is_premium' => true,
			],
			'kadence-insights'     => [
				'name'     => 'Kadence Insights',
				'page_url' => admin_url( 'admin.php?page=kadence-insights-settings&license=show' ),
				'constant' => 'KADENCE_INSIGHTS_VERSION',
				'is_premium' => true,
			],
			'kadence-shop-kit'     => [
				'name'     => 'Kadence Shop Kit',
				'page_url' => admin_url( 'admin.php?page=kadence-shop-kit-settings&license=show' ),
				'constant' => 'KADENCE_WOO_EXTRAS_VERSION',
				'is_premium' => true,
			],
			'kadence-galleries'    => [
				'name'     => 'Kadence Galleries',
				'page_url' => admin_url('edit.php?post_type=kt_gallery&page=kadence-galleries-settings'),
				'constant' => 'KTG_VERSION',
				'is_premium' => true,
			],
			'kadence-conversions'  => [
				'name'     => 'Kadence Conversions',
				'page_url' => admin_url('admin.php?page=kadence-conversion-settings'),
				'constant' => 'KADENCE_CONVERSIONS_VERSION',
				'is_premium' => true,
			],
			'kadence-captcha'      => [
				'name'     => 'Kadence Captcha',
				'page_url' => admin_url( 'admin.php?page=kadence-recaptcha-settings&license=show' ),
				'constant' => 'KT_RECAPTCHA_VERSION',
				'is_premium' => true,
			],
			'kadence-pattern-hub'  => [
				'name'     => 'Kadence Pattern Hub',
				'page_url' => admin_url('edit.php?post_type=kadence_cloud&page=kadence-cloud-settings&license=show'),
				'constant' => 'KADENCE_CLOUD_VERSION',
				'is_premium' => true,
			],
			'kadence-white-label'  => [
				'name'     => 'Kadence White Label',
				'page_url' => admin_url( 'admin.php?page=kadence-white-label-settings' ),
				'constant' => 'KADENCE_WHITE_VERSION',
				'is_premium' => true,
			],
		];
	}

	/**
	 * Returns constants used to detect active premium plugins for Harbor.
	 *
	 * @since 3.7.2
	 *
	 * @return list<string>
	 */
	public function premium_constants(): array {
		return array_merge(
			array_column(
				array_filter(
					$this(),
					static fn( array $plugin ): bool => $plugin['is_premium']
				),
				'constant'
			),
			[
				'KTP_PLUGIN_FILE',
				'SOLIDWP_BACKUPS_PLUGIN_FILE',
			]
		);
	}

}
