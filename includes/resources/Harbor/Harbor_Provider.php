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
		add_filter( 'kadence_blocks_ai_disabled', [ $this, 'is_ai_disabled' ] );
		add_filter( 'kadence_blocks_ai_disabled_message', [ $this, 'ai_disabled_message' ] );

		$extensions = [
			'kadence-blocks'   => __( 'Kadence Blocks', 'kadence-blocks' ),
			'kadence-insights' => __( 'Kadence Insights', 'kadence-blocks' ),
			'kadence-shop-kit' => __( 'Kadence Shop Kit', 'kadence-blocks' ),
			'kadence-galleries' => __( 'Kadence Galleries', 'kadence-blocks' ),
			'kadence-creative-kit' => __( 'Kadence Creative Kit', 'kadence-blocks' ),
			'kadence-conversions' => __( 'Kadence Conversions', 'kadence-blocks' ),
			'kadence-captcha' => __( 'Kadence Captcha', 'kadence-blocks' ),
			'kadence-theme-pro' => __( 'Kadence Theme Pro', 'kadence-blocks' ),
			'kadence-pattern-hub' => __( 'Kadence Pattern Hub', 'kadence-blocks' ),
			'kadence-white-label' => __( 'Kadence White Label', 'kadence-blocks' ),
		];

		foreach ( $extensions as $hook_prefix => $product_name ) {
			add_action(
				"stellarwp/uplink/{$hook_prefix}/license_field_after_form",
				function() use ( $product_name ) {
					$this->render_harbor_license_notice( $product_name );
				}
			);
		}

		if ( class_exists( 'KadenceWP\KadenceBlocksPro\Uplink\Connect' ) ) {
			remove_action( 'admin_notices', [ \KadenceWP\KadenceBlocksPro\Uplink\Connect::get_instance(), 'inactive_notice' ] );
		}
	}

	/**
	 * Disables Kadence AI for Harbor-licensed customers.
	 * AI features are not yet supported under Harbor licensing.
	 *
	 * @param bool $disabled Whether AI is disabled.
	 *
	 * @return bool
	 */
	public function is_ai_disabled( bool $disabled ): bool {
		if ( $disabled ) {
			return true;
		}

		if ( kadence_blocks_is_legacy_license_authorized() ) {
			return false;
		}

		return lw_harbor_is_product_license_active( 'kadence' );
	}

	/**
	 * Overrides the AI disabled message for Harbor-licensed customers.
	 *
	 * @param string $message The default disabled message.
	 *
	 * @return string
	 */
	public function ai_disabled_message( string $message ): string {
		if ( kadence_blocks_is_legacy_license_authorized() ) {
			return $message;
		}

		if ( lw_harbor_is_product_license_active( 'kadence' ) ) {
			return __( 'Kadence AI is not yet available with your plan.', 'kadence-blocks' );
		}

		return $message;
	}

	/**
	 * Renders a Harbor notice below the save button on a Kadence Uplink license field.
	 *
	 * @param string $product_name The human-readable product name.
	 *
	 * @return void
	 */
	public function render_harbor_license_notice( string $product_name ): void {
		$url = lw_harbor_get_license_page_url();
		if ( empty( $url ) ) {
			return;
		}
		?>
		<hr style="margin: 20px 0;"/>
		<h4><span class="dashicons dashicons-info" style="vertical-align: middle; margin-right: 4px;"></span><?php esc_html_e( 'Liquid Web Software Manager', 'kadence-blocks' ); ?></h4>
		<p class="tooltip description"><?php echo wp_kses(
			sprintf(
				/* translators: 1: product name, 2: URL to the Liquid Web Software Manager page. */
				__( '%1$s is now part of Liquid Web\'s software offerings. This field is still available for managing legacy licenses from your previous %1$s account. If you purchased a new plan through Liquid Web, your products are managed through the <a href="%2$s">Liquid Web Software Manager</a>.', 'kadence-blocks' ),
				esc_html( $product_name ),
				esc_url( $url )
			),
			[ 'a' => [ 'href' => [] ] ]
		); ?></p>
		<?php
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
