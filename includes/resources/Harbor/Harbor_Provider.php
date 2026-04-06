<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Harbor;

use KadenceWP\KadenceBlocks\LiquidWeb\Harbor\Config as HarborConfig;
use KadenceWP\KadenceBlocks\LiquidWeb\Harbor\Harbor;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_authorization_token;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_domain;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\is_authorized;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_key;

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

		foreach ( $this->get_known_plugins() as $slug => $plugin ) {
			add_action(
				"stellarwp/uplink/{$slug}/license_field_after_form",
				function() use ( $plugin ) {
					$this->render_harbor_license_notice( $plugin['name'] );
				}
			);
		}

		add_action( 'admin_init', [ $this, 'suppress_legacy_inactive_notices' ] );
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
		$reported_keys = [];
		$domain        = get_license_domain();

		foreach ( $this->get_known_plugins() as $slug => $plugin ) {
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

	/**
	 * Removes legacy "not activated" admin notices from all Kadence add-ons.
	 *
	 * Each add-on registers its inactive_notice callback during plugins_loaded,
	 * which runs after Harbor_Provider::register(). Hooking to admin_init ensures
	 * all add-on callbacks are already registered before we remove them.
	 *
	 * @return void
	 */
	public function suppress_legacy_inactive_notices(): void {
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

	/**
	 * Returns a map of all known Kadence plugin slugs to their metadata.
	 *
	 * page_url should be a full URL and should point to the plugin's
	 * license settings page.
	 *
	 * @return array<string, array{name: string, page_url: string}>
	 */
	private function get_known_plugins(): array {
		$default_page = admin_url('admin.php?page=kadence-blocks-home');

		return [
			'kadence-blocks'       => [
				'name'       => __( 'Kadence Blocks', 'kadence-blocks' ),
				'page_url'   => $default_page,
			],
			'kadence-blocks-pro'   => [
				'name'       => __( 'Kadence Blocks Pro', 'kadence-blocks' ),
				'page_url'   => $default_page,
			],
			'kadence-creative-kit' => [
				'name'       => __( 'Kadence Creative Kit', 'kadence-blocks' ),
				'page_url'   => admin_url('admin.php?page=kadence-blocks-home&license=show'),
			],
			'kadence-insights'     => [
				'name'       => __( 'Kadence Insights', 'kadence-blocks' ),
				'page_url'   => admin_url('admin.php?page=kadence-insights-settings&license=show'),
			],
			'kadence-shop-kit'     => [
				'name'       => __( 'Kadence Shop Kit', 'kadence-blocks' ),
				'page_url'   => admin_url('admin.php?page=kadence-shop-kit-settings&license=show'),
			],
			'kadence-galleries'    => [
				'name'       => __( 'Kadence Galleries', 'kadence-blocks' ),
				'page_url'   => $default_page,
			],
			'kadence-conversions'  => [
				'name'       => __( 'Kadence Conversions', 'kadence-blocks' ),
				'page_url'   => $default_page,
			],
			'kadence-captcha'      => [
				'name'       => __( 'Kadence Captcha', 'kadence-blocks' ),
				'page_url'   => admin_url('admin.php?page=kadence-recaptcha-settings&license=show'),
			],
			'kadence-theme-pro'    => [
				'name'       => __( 'Kadence Theme Pro', 'kadence-blocks' ),
				'page_url'   => $default_page,
			],
			'kadence-pattern-hub'  => [
				'name'       => __( 'Kadence Pattern Hub', 'kadence-blocks' ),
				'page_url'   => $default_page,
			],
			'kadence-white-label'  => [
				'name'       => __( 'Kadence White Label', 'kadence-blocks' ),
				'page_url'   => admin_url('admin.php?page=kadence-white-label-settings')
			],
		];
	}

}
