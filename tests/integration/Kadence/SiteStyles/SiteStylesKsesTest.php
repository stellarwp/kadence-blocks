<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
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
								'borderRadius'   => [ 20, 20, 20, 20 ],
								'notAnAttribute' => 'x',
								'text'           => 'Buy now',
								'noFollow'       => true,
								'uniqueID'       => 'abc',
								'inheritStyles'  => 'outline',
							],
							'infobox'   => [ 'borderRadius' => [ 20, 20, 20, 20 ] ],
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
}
