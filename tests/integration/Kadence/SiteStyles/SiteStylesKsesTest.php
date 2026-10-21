<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Supports_Site_Styles;
use KadenceWP\KadenceBlocks\Site_Styles\Kses_Keeper;
use KadenceWP\KadenceBlocks\Site_Styles\Supported_Blocks;
use WP_Theme_JSON_Resolver;

/**
 * Covers keeping the Kadence site-level values through core's KSES pass when a
 * user without `unfiltered_html` saves Global Styles.
 */
final class SiteStylesKsesTest extends WPTestCase {
	protected \IntegrationTester $tester;

	public function testTheValuesSurviveASaveWithoutUnfilteredHtml(): void {
		$kadence = [ 'singlebtn' => [ 'borderRadius' => [ 20, 20, 20, 20 ] ] ];
		$color   = [ 'background' => '#cc0000' ];

		$saved = $this->save_without_unfiltered_html(
			[
				'settings' => [ 'custom' => [ 'kadence' => $kadence ] ],
				'styles'   => [ 'blocks' => [ 'kadence/singlebtn' => [ 'color' => $color ] ] ],
			]
		);

		$this->assertSame( $kadence, $saved['settings']['custom']['kadence'] );
		$this->assertSame( $color, $saved['styles']['blocks']['kadence/singlebtn']['color'] );
	}

	public function testStringsAreSanitizedLikeBlockAttributes(): void {
		$icon = '<script>alert(1)</script>fe_arrowRight';

		$saved = $this->save_without_unfiltered_html(
			[ 'settings' => [ 'custom' => [ 'kadence' => [ 'singlebtn' => [ 'icon' => $icon ] ] ] ] ]
		);

		$this->assertSame( filter_block_kses_value( $icon, 'post' ), $saved['settings']['custom']['kadence']['singlebtn']['icon'] );
		$this->assertStringNotContainsString( '<script>', $saved['settings']['custom']['kadence']['singlebtn']['icon'] );
	}

	public function testUnknownBlocksAttributesAndExcludedAttributesAreDropped(): void {
		$saved = $this->save_without_unfiltered_html(
			[
				'settings' => [
					'custom' => [
						'kadence' => [
							'singlebtn' => [
								'borderRadius'     => [ 20, 20, 20, 20 ],
								'notAnAttribute'   => 'x',
								'text'             => 'Buy now',
								'noFollow'         => true,
								'uniqueID'         => 'abc',
								'inheritStyles'    => 'outline',
								'label'            => 'Site label',
								'buttonRole'       => true,
								'iconTitle'        => 'Site icon title',
								'tooltip'          => 'Site tooltip',
								'tooltipPlacement' => 'bottom',
								'isSubmit'         => true,
							],
							'lottie'    => [ 'borderRadius' => [ 20, 20, 20, 20 ] ],
						],
					],
				],
			]
		);

		$this->assertSame(
			[ 'singlebtn' => [ 'borderRadius' => [ 20, 20, 20, 20 ] ] ],
			$saved['settings']['custom']['kadence']
		);
	}

	public function testASaveWithUnfilteredHtmlIsUnchanged(): void {
		$post_id = $this->tester->store_user_global_styles( [] );
		$content = wp_json_encode(
			[
				'version'                     => 3,
				'isGlobalStylesUserThemeJSON' => true,
				'settings'                    => [ 'custom' => [ 'kadence' => [ 'singlebtn' => [ 'text' => 'kept for admins' ] ] ] ],
			]
		);
		$this->assertIsString( $content );
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		wp_update_post(
			[
				'ID'           => $post_id,
				'post_content' => wp_slash( $content ),
			]
		);

		$this->assertSame( $content, get_post( $post_id )->post_content );
	}

	/**
	 * A block without a scope keeps only its overlay attributes when core's KSES filters remove the Kadence values,
	 * so attributes the editor adds outside the server registry are dropped too.
	 *
	 * @return void
	 */
	public function testABlockWithoutAScopeKeepsOnlyItsOverlayAttributes(): void {
		$keeper = new Kses_Keeper( new Supported_Blocks( [ $this->unscoped_show_more() ] ) );
		$base   = [
			'version'                     => 3,
			'isGlobalStylesUserThemeJSON' => true,
		];
		$values = [
			'heightDesktop'   => 300,
			'showHideMore'    => false,
			'kadenceBlockCSS' => 'selector { color: red; }',
			'uniqueID'        => 'abc',
		];

		$keeper->capture( wp_slash( (string) wp_json_encode( $base + [ 'settings' => [ 'custom' => [ 'kadence' => [ 'show-more' => $values ] ] ] ] ) ) );
		$restored = json_decode( wp_unslash( $keeper->restore( wp_slash( (string) wp_json_encode( $base ) ) ) ), true );

		$this->assertSame( [ 'show-more' => [ 'heightDesktop' => 300 ] ], $restored['settings']['custom']['kadence'] );
	}

	/**
	 * Saves Global Styles as a user without `unfiltered_html`, so core's KSES
	 * filters run.
	 *
	 * @param array<string, mixed> $data Global Styles data.
	 *
	 * @return array<string, mixed> The decoded saved content.
	 */
	private function save_without_unfiltered_html( array $data ): array {
		$post_id = $this->tester->store_user_global_styles( [] );
		$content = wp_json_encode(
			array_merge(
				[
					'version'                     => 3,
					'isGlobalStylesUserThemeJSON' => true,
				],
				$data
			)
		);
		$this->assertIsString( $content );

		wp_set_current_user( self::factory()->user->create( [ 'role' => 'author' ] ) );
		$this->assertFalse( current_user_can( 'unfiltered_html' ) );

		wp_update_post(
			[
				'ID'           => $post_id,
				'post_content' => wp_slash( $content ),
			]
		);

		$post = WP_Theme_JSON_Resolver::get_user_data_from_wp_global_styles( wp_get_theme() );

		return json_decode( $post['post_content'], true );
	}

	/**
	 * A Show More stand-in without a scope, whose only site value is `heightDesktop`.
	 *
	 * @return Supports_Site_Styles The block.
	 */
	private function unscoped_show_more(): Supports_Site_Styles {
		return new class() implements Supports_Site_Styles {

			public function get_name(): string {
				return 'kadence/show-more';
			}

			public function get_slug(): string {
				return 'show-more';
			}

			public function site_styles_overlay_attributes(): array {
				return [ 'heightDesktop' ];
			}

			public function site_styles_attributes_map(): array {
				return [];
			}

			public function site_styles_supports(): array {
				return [];
			}

			public function site_styles_selectors(): array {
				return [];
			}
		};
	}
}
