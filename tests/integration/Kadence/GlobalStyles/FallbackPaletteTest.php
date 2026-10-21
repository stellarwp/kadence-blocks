<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\GlobalStyles;

use Codeception\TestCase\WPTestCase;

/**
 * The plugin's hard-coded `--global-palette*` fallback is for sites without the
 * Kadence theme; with the theme active, in either mode, it is never printed.
 */
final class FallbackPaletteTest extends WPTestCase {
	protected \IntegrationTester $tester;

	/**
	 * @after
	 */
	public function deregister_frontend_styles(): void {
		wp_deregister_style( 'kadence-blocks-global-variables' );
	}

	public function testClassicModeFrontendCssHasNoFallbackPalette(): void {
		$this->assertStringNotContainsString( '--global-palette1:', $this->frontend_css() );
	}

	public function testFseModeFrontendCssHasNoFallbackPalette(): void {
		$this->tester->enable_fse_mode();

		$this->assertStringNotContainsString( '--global-palette1:', $this->frontend_css() );
	}

	private function frontend_css(): string {
		wp_deregister_style( 'kadence-blocks-global-variables' );

		kadence_blocks_add_global_gutenberg_styles_frontend();

		return implode( "\n", wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' ) );
	}
}
