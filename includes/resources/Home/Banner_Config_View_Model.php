<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Home;

use function KadenceWP\KadenceBlocks\StellarWP\Uplink\build_auth_url;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_domain;

/**
 * View model that produces the kadenceHomeParams.bannerConfig payload.
 *
 * All banner copy lives here so changes require no JavaScript deployment.
 * The primaryCtaUrl for the authorized scenario is intentionally empty — the frontend
 * interprets an empty URL as "open the AI wizard" rather than navigating to a link.
 */
final class Banner_Config_View_Model {

	/**
	 * Returns the banner configuration array for the current license state.
	 *
	 * @return array{
	 *     heading: string,
	 *     body: string,
	 *     primaryCtaText: string,
	 *     primaryCtaUrl: string,
	 *     secondaryCtaText?: string,
	 *     secondaryCtaUrl?: string,
	 * }
	 */
	public function exports(): array {
		$is_authorized = ! kadence_blocks_is_ai_disabled() && kadence_blocks_is_legacy_license_authorized();

		if ( ! $is_authorized && lw_harbor_is_product_license_active( 'kadence' ) ) {
			return [
				'heading'        => __( 'Kadence AI is evolving.', 'kadence-blocks' ),
				'body'           => __( "We're building something new. Kadence AI as you know it is no longer available for new activations — but great things are on the way. Stay tuned for what's next.", 'kadence-blocks' ),
				'primaryCtaText' => __( 'Learn More', 'kadence-blocks' ),
				'primaryCtaUrl'  => 'https://www.kadencewp.com/kadence-blocks/',
			];
		}

		if ( $is_authorized ) {
			return [
				'heading'          => __( 'Kadence is better with AI.', 'kadence-blocks' ),
				'body'             => __( "Elevate your web development game with Kadence AI. Supercharge your pattern and page library's potential with tailored content — get building pages in no time. You have AI credits remaining on your account.", 'kadence-blocks' ),
				'primaryCtaText'   => __( 'Open Kadence AI', 'kadence-blocks' ),
				'primaryCtaUrl'    => '',
				'secondaryCtaText' => __( 'Manage AI Credits', 'kadence-blocks' ),
				'secondaryCtaUrl'  => 'https://app.kadencewp.com/',
			];
		}

		return [
			'heading'          => __( 'Kadence AI is evolving.', 'kadence-blocks' ),
			'body'             => __( "Kadence AI is being reimagined. Activate your license key to check whether you have existing AI credits — or stay tuned for what's coming next.", 'kadence-blocks' ),
			'primaryCtaText'   => __( 'Activate License Key', 'kadence-blocks' ),
			'primaryCtaUrl'    => esc_url( build_auth_url( apply_filters( 'kadence-blocks-auth-slug', 'kadence-blocks' ), get_license_domain() ) ),
			'secondaryCtaText' => __( 'Learn More', 'kadence-blocks' ),
			'secondaryCtaUrl'  => 'https://www.kadencewp.com/kadence-blocks/',
		];
	}

}
