<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Home;

use function KadenceWP\KadenceBlocks\StellarWP\Uplink\build_auth_url;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_domain;

/**
 * View model that produces the kadenceHomeParams.homeContent payload.
 *
 * All home page copy lives here so changes require no JavaScript deployment.
 * The primaryCtaUrl for the authorized banner scenario is intentionally empty —
 * the frontend interprets an empty URL as "open the AI wizard".
 *
 * @since 3.7.0
 */
final class Home_Content_View_Model {

	/**
	 * @since 3.7.0
	 */
	public function exports(): array {
		$is_authorized = ! kadence_blocks_is_ai_disabled() && kadence_blocks_is_legacy_license_authorized();
		$is_liquid_web = ! $is_authorized && lw_harbor_is_product_license_active( 'kadence' );

		return [
			'bannerConfig'  => $this->banner_config( $is_authorized, $is_liquid_web ),
			'actionCards'   => $this->action_cards( $is_authorized ),
			'knowledgeBase' => $this->knowledge_base( $is_authorized ),
		];
	}

	/**
	 * @since 3.7.0
	 *
	 * @param bool $is_authorized Whether the current site has an authorized Kadence license.
	 * @param bool $is_liquid_web Whether the current site is a Liquid Web customer.
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
	private function banner_config( bool $is_authorized, bool $is_liquid_web ): array {
		// (new) customer scenario (liquid web).
		if ( $is_liquid_web ) {
			return [
				'heading'        => __( 'Kadence AI is evolving.', 'kadence-blocks' ),
				'body'           => __( "We're building something new. Kadence AI as you know it is no longer available for new activations — but great things are on the way. Stay tuned for what's next.", 'kadence-blocks' ),
				'primaryCtaText' => __( 'Learn More', 'kadence-blocks' ),
				'primaryCtaUrl'  => 'https://www.kadencewp.com/kadence-blocks/',
			];
		}

		// legacy customer scenario.
		if ( $is_authorized ) {
			return [
				'heading'          => __( 'Kadence is better with AI.', 'kadence-blocks' ),
				'body'             => __( "Elevate your web development game with Kadence AI. Supercharge your pattern and page library's potential with tailored content — get building pages in no time. You have AI credits remaining on your account.", 'kadence-blocks' ),
				'primaryCtaText'   => __( 'Get Started with Kadence AI', 'kadence-blocks' ),
				'primaryCtaUrl'    => '',
				'secondaryCtaText' => __( 'Manage AI Credits', 'kadence-blocks' ),
				'secondaryCtaUrl'  => esc_url( build_auth_url( apply_filters( 'kadence-blocks-auth-slug', 'kadence-blocks' ), get_license_domain() ) ),
			];
		}

		// unknown customer scenario.
		return [
			'heading'          => __( 'Kadence AI is evolving.', 'kadence-blocks' ),
			'body'             => __("If you're using a legacy Kadence plan, activate your license to access your included features. If you're on a new plan, Kadence AI is currently being reimagined to deliver a more powerful experience. During this transition, it's only available on previous Kadence plans.", 'kadence-blocks' ),
			'primaryCtaText'   => __( 'Activate License Key', 'kadence-blocks' ),
			'primaryCtaUrl'    => esc_url( build_auth_url( apply_filters( 'kadence-blocks-auth-slug', 'kadence-blocks' ), get_license_domain() ) ),
			'secondaryCtaText' => __( 'Learn More', 'kadence-blocks' ),
			'secondaryCtaUrl'  => 'https://www.kadencewp.com/kadence-blocks/',
		];
	}

	/**
	 * @since 3.7.0
	 *
	 * @param bool $is_authorized Whether the current site has an authorized Kadence license.
	 *
	 * @return array{
	 *     title: string,
	 *     showAiIcon: bool,
	 *     cards: array<int, array{heading: string, content: string, link: string, variant: string}>,
	 * }
	 */
	private function action_cards( bool $is_authorized ): array {
		if ( $is_authorized ) {
			return [
				'title'      => __( 'Start building with Kadence AI.', 'kadence-blocks' ),
				'showAiIcon' => true,
				'cards'      => [
					[
						'heading' => __( 'Build a page with AI-powered patterns', 'kadence-blocks' ),
						'content' => __( 'Take your site further with hundreds of beautiful patterns filled with custom content developed just for your site.', 'kadence-blocks' ),
						'link'    => admin_url( 'post-new.php?post_type=page' ),
						'variant' => 'blue',
					],
					[
						'heading' => __( 'Get started with full pages', 'kadence-blocks' ),
						'content' => __( 'Choose from a variety of pages featuring exclusively tailored content for your site.', 'kadence-blocks' ),
						'link'    => admin_url( 'post-new.php?post_type=page' ),
						'variant' => 'green',
					],
					[
						'heading' => __( 'Fine-tune your content', 'kadence-blocks' ),
						'content' => __( 'Write your own prompts to generate AI content from scratch or fine-tune existing copy.', 'kadence-blocks' ),
						'link'    => '',
						'variant' => 'yellow',
					],
				],
			];
		}

		return [
			'title'      => __( 'Start building with Kadence', 'kadence-blocks' ),
			'showAiIcon' => false,
			'cards'      => [
				[
					'heading' => __( 'Build a page using pre-designed patterns', 'kadence-blocks' ),
					'content' => __( "Elevate your site's design with hundreds of beautiful patterns, customized with your site's style.", 'kadence-blocks' ),
					// TODO: add query param to open Design Library on Patterns tab once URL param is established.
					'link'    => admin_url( 'post-new.php?post_type=page' ),
					'variant' => 'blue',
				],
				[
					'heading' => __( 'Get started with full pages', 'kadence-blocks' ),
					'content' => __( "Kickstart your site with a variety of pre-designed page layouts, customized with your site's style.", 'kadence-blocks' ),
					// TODO: add query param to open Design Library on Pages tab once URL param is established.
					'link'    => admin_url( 'post-new.php?post_type=page' ),
					'variant' => 'green',
				],
				[
					'heading' => __( 'Start from scratch', 'kadence-blocks' ),
					'content' => __( "Build your website from scratch, using Kadence's blocks for layout, content and interactions.", 'kadence-blocks' ),
					'link'    => admin_url( 'post-new.php?post_type=page' ),
					'variant' => 'yellow',
				],
			],
		];
	}

	/**
	 * @since 3.7.0
	 *
	 * @param bool $is_authorized Whether the current site has an authorized Kadence license.
	 *
	 * @return array{
	 *     heading: string,
	 *     articles: array<int, array{category: string, heading: string, description: string, link: string, linkTarget: string}>,
	 * }
	 */
	private function knowledge_base( bool $is_authorized ): array {
		return [
			'heading'  => __( 'Need Help Getting Started?', 'kadence-blocks' ),
			'articles' => $is_authorized ? $this->knowledge_base_authorized() : $this->knowledge_base_default(),
		];
	}

	/**
	 * @since 3.7.0
	 *
	 * @return array<int, array{category: string, heading: string, description: string, link: string, linkTarget: string}>
	 */
	private function knowledge_base_authorized(): array {
		return [
			[
				'category'    => __( 'Kadence AI', 'kadence-blocks' ),
				'heading'     => __( 'Update AI Settings', 'kadence-blocks' ),
				'description' => __( 'Update Kadence AI settings. Regenerate contexts for patterns and pages to reflect your updated needs.', 'kadence-blocks' ),
				'link'        => 'https://www.kadencewp.com/help-center/docs/kadence-blocks/design-libary-changing-ai-details/',
				'linkTarget'  => '_blank',
			],
			[
				'category'    => __( 'Kadence AI', 'kadence-blocks' ),
				'heading'     => __( 'Customize Image Collections', 'kadence-blocks' ),
				'description' => __( 'Update your Design Library imagery using premade collections or create and customize your own.', 'kadence-blocks' ),
				'link'        => 'https://www.kadencewp.com/help-center/docs/kadence-blocks/design-library-changing-ai-image-collections/',
				'linkTarget'  => '_blank',
			],
			[
				'category'    => __( 'Kadence Blocks', 'kadence-blocks' ),
				'heading'     => __( 'Row Layout Block', 'kadence-blocks' ),
				'description' => __( 'Use the Row Layout block to improve the column functionality and create responsive post/page layouts.', 'kadence-blocks' ),
				'link'        => 'https://www.kadencewp.com/help-center/docs/kadence-blocks/row-layout-block-2/',
				'linkTarget'  => '_blank',
			],
			[
				'category'    => __( 'Kadence Blocks', 'kadence-blocks' ),
				'heading'     => __( 'Advanced Text Block', 'kadence-blocks' ),
				'description' => __( 'Use the Advanced Text block to add text to your page/post with advanced customization - now with AI.', 'kadence-blocks' ),
				'link'        => 'https://www.kadencewp.com/help-center/docs/kadence-blocks/advanced-heading-block/',
				'linkTarget'  => '_blank',
			],
			[
				'category'    => __( 'Support', 'kadence-blocks' ),
				'heading'     => __( 'Need more help?', 'kadence-blocks' ),
				'description' => __( "Didn't find what you were looking for? Find more articles in our knowledge base.", 'kadence-blocks' ),
				'link'        => 'https://www.kadencewp.com/help-center/',
				'linkTarget'  => '_blank',
			],
		];
	}

	/**
	 * @since 3.7.0
	 *
	 * @return array<int, array{category: string, heading: string, description: string, link: string, linkTarget: string}>
	 */
	private function knowledge_base_default(): array {
		return [
			[
				'category'    => __( 'Kadence Blocks', 'kadence-blocks' ),
				'heading'     => __( 'Using the Design Library', 'kadence-blocks' ),
				'description' => __( 'Use fully designed patterns and pages on your site with your own customizer settings - now with AI.', 'kadence-blocks' ),
				'link'        => 'https://www.kadencewp.com/help-center/docs/kadence-blocks/how-to-control-the-kadence-design-library/',
				'linkTarget'  => '_blank',
			],
			[
				'category'    => __( 'Kadence Blocks', 'kadence-blocks' ),
				'heading'     => __( 'Row Layout Block', 'kadence-blocks' ),
				'description' => __( 'Use the Row Layout block to improve the column functionality and create responsive post/page layouts.', 'kadence-blocks' ),
				'link'        => 'https://www.kadencewp.com/help-center/docs/kadence-blocks/row-layout-block-2/',
				'linkTarget'  => '_blank',
			],
			[
				'category'    => __( 'Kadence Blocks', 'kadence-blocks' ),
				'heading'     => __( 'Advanced Text Block', 'kadence-blocks' ),
				'description' => __( 'Use the Advanced Text block to add text to your page/post with advanced customization - now with AI.', 'kadence-blocks' ),
				'link'        => 'https://www.kadencewp.com/help-center/docs/kadence-blocks/advanced-heading-block/',
				'linkTarget'  => '_blank',
			],
			[
				'category'    => __( 'Kadence Blocks Pro', 'kadence-blocks' ),
				'heading'     => __( 'Kadence Blocks Pro Plugin', 'kadence-blocks' ),
				'description' => __( 'Install and activate the Kadence Blocks Pro plugin, and get an overview of the Pro features available.', 'kadence-blocks' ),
				'link'        => 'https://www.kadencewp.com/help-center/docs/kadence-blocks/kadence-blocks-pro-plugin/',
				'linkTarget'  => '_blank',
			],
			[
				'category'    => __( 'Support', 'kadence-blocks' ),
				'heading'     => __( 'Need more help?', 'kadence-blocks' ),
				'description' => __( "Didn't find what you were looking for? Find more articles in our knowledge base.", 'kadence-blocks' ),
				'link'        => 'https://www.kadencewp.com/help-center/',
				'linkTarget'  => '_blank',
			],
		];
	}

}
