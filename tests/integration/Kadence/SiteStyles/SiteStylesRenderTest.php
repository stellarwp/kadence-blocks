<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;

/**
 * Covers how Single Button site-level styles reach the rendered block CSS, on a
 * fixture page with every button style, an instance-coloured button and a
 * button in a template part.
 */
final class SiteStylesRenderTest extends WPTestCase {
	protected \IntegrationTester $tester;

	public function testWithoutSiteValuesTheCssMatchesTheBaseline(): void {
		$this->tester->enable_fse_mode();

		$this->tester->assert_block_css_matches( 'singlebtn-site-styles-baseline', $this->fixture_css() );
	}

	/**
	 * @return array<string, array{string}>
	 */
	public function fillButtonProvider(): array {
		return [
			'fill'             => [ 'ss_fill' ],
			'in template part' => [ 'ss_part' ],
		];
	}

	/**
	 * @dataProvider fillButtonProvider
	 *
	 * @param string $unique_id The button's unique ID in the fixture.
	 */
	public function testSiteValuesReachEveryFillButtonWithoutItsOwn( string $unique_id ): void {
		$this->tester->enable_fse_mode();
		$this->store_background_and_radius( '#cc0000', 20 );

		$rule = $this->button_rule( $this->fixture_css(), $unique_id );

		$this->assertStringContainsString( 'background:#cc0000;', $rule );
		$this->assertStringContainsString( 'border-top-left-radius:20px;', $rule );
		$this->assertStringContainsString( 'border-bottom-right-radius:20px;', $rule );
	}

	public function testAnOutlineButtonTakesTheShapeButNotTheColors(): void {
		$this->tester->enable_fse_mode();
		$this->store_background_and_radius( '#cc0000', 20 );

		$rule = $this->button_rule( $this->fixture_css(), 'ss_outline' );

		$this->assertStringNotContainsString( 'background:', $rule );
		$this->assertStringContainsString( 'border-top-left-radius:20px;', $rule );
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

	public function testTheInstanceBackgroundWins(): void {
		$this->tester->enable_fse_mode();
		$this->store_background_and_radius( '#cc0000', 20 );

		$rule = $this->button_rule( $this->fixture_css(), 'ss_instance' );

		$this->assertStringContainsString( 'background:#00aa00;', $rule );
		$this->assertStringContainsString( 'border-top-left-radius:20px;', $rule );
	}

	public function testAPaletteBackgroundRendersTheKadencePaletteVariable(): void {
		$this->tester->enable_fse_mode();
		$this->store_background_and_radius( 'var:preset|color|theme-palette1', 20 );

		$this->assertStringContainsString( 'background:var(--global-palette1', $this->button_rule( $this->fixture_css(), 'ss_fill' ) );
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
