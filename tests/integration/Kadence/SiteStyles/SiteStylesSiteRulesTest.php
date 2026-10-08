<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use Kadence_Blocks_CSS;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Site_Styles\Fse_Stylesheets;
use KadenceWP\KadenceBlocks\Site_Styles\Site_Rules;

/**
 * Covers the site rules Single Button's own builder prints for its
 * Kadence-only site values, and the FSE copies of the default stylesheets.
 */
final class SiteStylesSiteRulesTest extends WPTestCase {
	protected \IntegrationTester $tester;

	public function testEachStylePrintsTheValuesItTakesUnderItsClass(): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles(
			[
				'settings' => [
					'custom' => [
						'kadence' => [
							'singlebtn' => [
								'borderRadius' => [ 20, 20, 20, 20 ],
								'colorHover'   => '#123456',
							],
						],
					],
				],
				'styles'   => [ 'blocks' => [ 'kadence/singlebtn' => [ 'color' => [ 'background' => '#cc0000' ] ] ] ],
			]
		);

		$css = $this->site_rules()->css( 'kadence/singlebtn' );

		$this->assertStringContainsString( '.wp-block-kadence-advancedbtn :where(.kb-btn-global-fill).kb-button{border-top-left-radius:20px;', $css );
		$this->assertStringContainsString( ':where(.kb-btn-global-fill).kb-button:hover', $css );
		$this->assertStringContainsString( '#123456', $css );
		$this->assertStringContainsString( '.wp-block-kadence-advancedbtn :where(.kb-btn-global-outline).kb-button{border-top-left-radius:20px;', $css );
		$this->assertStringNotContainsString( ':where(.kb-btn-global-outline).kb-button:hover', $css );
		$this->assertStringNotContainsString( 'kb-btn-global-inherit', $css );
		$this->assertStringNotContainsString( '#cc0000', $css );
		$this->assertSame( [], preg_grep( '/site-rules/', array_keys( Kadence_Blocks_CSS::$styles ) ) );
	}

	public function testOverlayValuesAloneOrClassicModePrintNothing(): void {
		$this->tester->store_user_global_styles(
			[ 'settings' => [ 'custom' => [ 'kadence' => [ 'singlebtn' => [ 'borderRadius' => [ 20, 20, 20, 20 ] ] ] ] ] ]
		);

		$this->assertSame( '', $this->site_rules()->css( 'kadence/singlebtn' ) );

		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles(
			[ 'settings' => [ 'custom' => [ 'kadence' => [ 'singlebtn' => [ 'sizePreset' => 'large' ] ] ] ] ]
		);

		$this->assertSame( '', $this->site_rules()->css( 'kadence/singlebtn' ) );
	}

	public function testTheFrontEndLoadsTheCopyForTheColorsTheSiteSets(): void {
		$stylesheets = App::instance()->container()->get( Fse_Stylesheets::class );
		$front_end   = KADENCE_BLOCKS_URL . 'dist/style-blocks-advancedbtn.css?ver=1';
		$editor      = KADENCE_BLOCKS_URL . 'dist/blocks-advancedbtn.css?ver=1';
		$heading     = KADENCE_BLOCKS_URL . 'dist/style-blocks-advancedheading.css?ver=1';
		$this->tester->store_user_global_styles(
			[ 'styles' => [ 'blocks' => [ 'kadence/singlebtn' => [ '@mobile' => [ 'color' => [ 'background' => '#cc0000' ] ] ] ] ] ]
		);

		$this->assertSame( $front_end, $stylesheets->filter_src( $front_end ), 'Classic mode keeps the original.' );

		$this->tester->enable_fse_mode();

		$this->assertSame( KADENCE_BLOCKS_URL . 'dist/style-blocks-advancedbtn-fse-background.css?ver=1', $stylesheets->filter_src( $front_end ) );
		$this->assertSame( KADENCE_BLOCKS_URL . 'dist/blocks-advancedbtn-fse-background-text.css?ver=1', $stylesheets->filter_src( $editor ) );
		$this->assertSame( $heading, $stylesheets->filter_src( $heading ) );

		$this->tester->store_user_global_styles( [ 'settings' => [ 'color' => [ 'custom' => true ] ] ] );

		$this->assertSame( $front_end, $stylesheets->filter_src( $front_end ), 'Without site colors the front end keeps the original.' );
	}

	private function site_rules(): Site_Rules {
		return App::instance()->container()->get( Site_Rules::class );
	}
}
