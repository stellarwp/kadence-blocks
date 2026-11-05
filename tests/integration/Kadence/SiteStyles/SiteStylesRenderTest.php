<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;

/**
 * Covers the rendered instance CSS of Single Buttons with site-level styles, on
 * a fixture page with every button style, an instance-coloured button and a
 * button in a template part. Core's Global Styles and the site rules render
 * the site values, so the instance CSS keeps only the instance's own, except
 * the box values, which land in it after the preset bridge.
 */
final class SiteStylesRenderTest extends WPTestCase {
	protected \IntegrationTester $tester;

	public function testWithoutSiteValuesTheCssMatchesTheBaseline(): void {
		$this->tester->enable_fse_mode();

		$this->tester->assert_block_css_matches( 'singlebtn-site-styles-baseline', $this->fixture_css() );
	}

	public function testSiteValuesStayOutOfTheInstanceCss(): void {
		$this->tester->enable_fse_mode();
		$this->store_background_and_radius( '#cc0000', 20 );

		$css = $this->fixture_css();

		$this->assertStringNotContainsString( '#cc0000', $css );
		$this->assertStringNotContainsString( 'radius:20px', $css );
	}

	/**
	 * @return array<string, array{string}>
	 */
	public function themeStyledButtonProvider(): array {
		return [
			'theme base'      => [ 'ss_base' ],
			'theme secondary' => [ 'ss_secondary' ],
		];
	}

	/**
	 * @dataProvider themeStyledButtonProvider
	 *
	 * @param string $unique_id The button's unique ID in the fixture.
	 */
	public function testAThemeStyledButtonTakesNoSiteValue( string $unique_id ): void {
		$this->tester->enable_fse_mode();
		$this->store_background_and_radius( '#cc0000', 20 );

		$css  = $this->fixture_css();
		$main = '.wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button{';

		$this->assertStringNotContainsString( '}' . $main, $css );
		$this->assertStringNotContainsString( "\n" . $main, $css );
	}

	/**
	 * A Fill button's own rule puts the site's box values after the preset bridge, so they win it, and the hover rule takes the site's shadow in place of the preset variable.
	 *
	 * @return void
	 */
	public function testSiteBoxValuesLandAfterThePresetBridgeInTheInstanceCss(): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_single_button_box_values();

		$unique_id = 'ss_fill';
		$css       = $this->fixture_css();
		$rule      = $this->button_rule( $css, $unique_id );

		$this->assertStringContainsString( 'padding:var(--kb-btn-padding);margin:var(--kb-btn-margin);', $rule );
		$this->assertStringContainsString( 'padding-top:20px;padding-right:40px;padding-bottom:20px;padding-left:40px;', $rule );
		$this->assertStringContainsString( 'margin-top:10px;margin-right:12px;margin-bottom:10px;margin-left:12px;', $rule );
		$this->assertStringContainsString( 'box-shadow:4px 4px 10px 0px', $rule );
		$this->assertLessThan( strpos( $rule, 'padding-top:20px;' ), strpos( $rule, 'padding:var(--kb-btn-padding);' ) );
		$this->assertStringContainsString( '.kb-btn' . $unique_id . '.kb-button:focus{box-shadow:0px 4px 8px 0px', $css );
	}

	/**
	 * The site's Mobile values land in the button's own Mobile rule, after the bridge in the desktop rule.
	 *
	 * @return void
	 */
	public function testSiteMobileBoxValuesLandInTheInstanceMobileRule(): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_single_button_box_values();

		$unique_id = 'ss_fill';
		$css       = $this->fixture_css();
		$mobile    = '@media all and (max-width: 767px){.wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button{';

		$this->assertStringContainsString( $mobile . 'padding-top:6px;padding-right:12px;padding-bottom:6px;padding-left:12px;margin-top:4px;margin-right:6px;margin-bottom:4px;margin-left:6px;', $css );
		$this->assertLessThan( strpos( $css, $mobile ), strpos( $css, 'padding:var(--kb-btn-padding);' ) );
	}

	/**
	 * A button with its own padding keeps it on every device: the site's Mobile padding stays out of its rules, while the margin, which it did not set, still takes the site's.
	 *
	 * @return void
	 */
	public function testAButtonWithItsOwnPaddingKeepsItOnEveryDevice(): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_single_button_box_values();

		$unique_id = 'ss_own';
		$css       = $this->tester->rendered_block_css(
			'<!-- wp:kadence/advancedbtn {"uniqueID":"ss_btns"} --><div class="wp-block-kadence-advancedbtn kb-buttons-wrap"><!-- wp:kadence/singlebtn {"uniqueID":"' . $unique_id . '","text":"Own","padding":[2,10,2,10]} /--></div><!-- /wp:kadence/advancedbtn -->',
			'singlebtn'
		);
		$rule      = $this->button_rule( $css, $unique_id );

		$this->assertStringContainsString( 'padding-top:2px;padding-right:10px;padding-bottom:2px;padding-left:10px;', $rule );
		$this->assertStringNotContainsString( 'padding-top:20px', $rule );
		$this->assertStringNotContainsString( '.kb-btn' . $unique_id . '.kb-button{padding-top:6px', $css );
		$this->assertStringContainsString( 'margin-top:10px;margin-right:12px;margin-bottom:10px;margin-left:12px;', $rule );
	}

	/**
	 * A theme-styled button takes none of the site's box values, so it keeps no rule of its own.
	 *
	 * @dataProvider themeStyledButtonProvider
	 *
	 * @param string $unique_id The button's unique ID in the fixture.
	 *
	 * @return void
	 */
	public function testAThemeStyledButtonTakesNoSiteBoxValue( string $unique_id ): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_single_button_box_values();

		$css  = $this->fixture_css();
		$main = '.wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button{';

		$this->assertStringNotContainsString( '}' . $main, $css );
		$this->assertStringNotContainsString( "\n" . $main, $css );
	}

	public function testTheInstanceKeepsItsOwnBackground(): void {
		$this->tester->enable_fse_mode();
		$this->store_background_and_radius( '#cc0000', 20 );

		$rule = $this->button_rule( $this->fixture_css(), 'ss_instance' );

		$this->assertStringContainsString( 'background:#00aa00;', $rule );
		$this->assertStringNotContainsString( 'radius:20px', $rule );
	}

	public function testClassicModeIgnoresTheSiteValues(): void {
		$this->store_background_and_radius( '#cc0000', 20 );

		$this->assertStringNotContainsString( '#cc0000', $this->fixture_css() );
	}

	private function store_background_and_radius( string $background, int $radius ): void {
		$this->tester->store_user_global_styles(
			[
				'settings' => [ 'custom' => [ 'kadence' => [ 'singlebtn' => [ 'borderRadius' => array_fill( 0, 4, $radius ) ] ] ] ],
				'styles'   => [ 'blocks' => [ 'kadence/singlebtn' => [ 'color' => [ 'background' => $background ] ] ] ],
			]
		);
	}

	/**
	 * @param string $css       The fixture page's Single Button CSS.
	 * @param string $unique_id The button's unique ID.
	 *
	 * @return string The declarations of the button's main rule.
	 */
	private function button_rule( string $css, string $unique_id ): string {
		$selector = '.wp-block-kadence-advancedbtn .kb-btn' . $unique_id . '.kb-button{';
		$start    = strpos( $css, "\n" . $selector );
		$start    = false === $start ? strpos( $css, '}' . $selector ) : $start;

		$this->assertNotFalse( $start, 'No rule for ' . $unique_id . '.' );

		$open = strpos( $css, '{', $start );

		return substr( $css, $open + 1, strpos( $css, '}', $open ) - $open - 1 );
	}

	/**
	 * @return string The fixture page's Single Button CSS.
	 */
	private function fixture_css(): string {
		return $this->tester->rendered_block_css(
			$this->markup( 'singlebtn-page' ),
			'singlebtn',
			[ 'site-styles-part' => $this->markup( 'singlebtn-template-part' ) ]
		);
	}

	/**
	 * @param string $name File name, without extension, in `tests/_data/site-styles/`.
	 *
	 * @return string The file's block markup.
	 */
	private function markup( string $name ): string {
		$markup = file_get_contents( codecept_data_dir( 'site-styles/' . $name . '.html' ) );

		$this->assertIsString( $markup );

		return $markup;
	}
}
