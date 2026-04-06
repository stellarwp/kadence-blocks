<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Harbor\Actions;

final class Get_Known_Plugins {

	/**
	 * Returns a map of all known Kadence plugin slugs to their metadata.
	 *
	 * page_url should be a full URL and should point to the plugin's
	 * license settings page.
	 *
	 * @return array<string, array{name: string, page_url: string}>
	 */
	public function __invoke(): array {
		$default_page = admin_url( 'admin.php?page=kadence-blocks' );

		return [
			'kadence-blocks'       => [
				'name'     => __( 'Kadence Blocks', 'kadence-blocks' ),
				'page_url' => $default_page,
			],
			'kadence-blocks-pro'   => [
				'name'     => __( 'Kadence Blocks Pro', 'kadence-blocks' ),
				'page_url' => $default_page,
			],
			'kadence-creative-kit' => [
				'name'     => __( 'Kadence Creative Kit', 'kadence-blocks' ),
				'page_url' => admin_url( 'admin.php?page=kadence-blocks-home&license=show' ),
			],
			'kadence-insights'     => [
				'name'     => __( 'Kadence Insights', 'kadence-blocks' ),
				'page_url' => admin_url( 'admin.php?page=kadence-insights-settings&license=show' ),
			],
			'kadence-shop-kit'     => [
				'name'     => __( 'Kadence Shop Kit', 'kadence-blocks' ),
				'page_url' => admin_url( 'admin.php?page=kadence-shop-kit-settings&license=show' ),
			],
			'kadence-galleries'    => [
				'name'     => __( 'Kadence Galleries', 'kadence-blocks' ),
				'page_url' => $default_page,
			],
			'kadence-conversions'  => [
				'name'     => __( 'Kadence Conversions', 'kadence-blocks' ),
				'page_url' => $default_page,
			],
			'kadence-captcha'      => [
				'name'     => __( 'Kadence Captcha', 'kadence-blocks' ),
				'page_url' => admin_url( 'admin.php?page=kadence-recaptcha-settings&license=show' ),
			],
			'kadence-theme-pro'    => [
				'name'     => __( 'Kadence Theme Pro', 'kadence-blocks' ),
				'page_url' => $default_page,
			],
			'kadence-pattern-hub'  => [
				'name'     => __( 'Kadence Pattern Hub', 'kadence-blocks' ),
				'page_url' => $default_page,
			],
			'kadence-white-label'  => [
				'name'     => __( 'Kadence White Label', 'kadence-blocks' ),
				'page_url' => admin_url( 'admin.php?page=kadence-white-label-settings' ),
			],
		];
	}

}
