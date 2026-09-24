<?php

declare( strict_types=1 );

namespace Tests\integration\TwentyTwentyThree\GlobalStyles;

use Codeception\TestCase\WPTestCase;

/**
 * Without the Kadence theme the frontend gets the plugin's hard-coded
 * `--global-palette*` fallback.
 */
final class FallbackPaletteTest extends WPTestCase {

	/**
	 * @after
	 */
	public function deregister_frontend_styles(): void {
		wp_deregister_style( 'kadence-blocks-global-variables' );
	}

	public function testFrontendCssHasTheFallbackPalette(): void {
		wp_deregister_style( 'kadence-blocks-global-variables' );

		kadence_blocks_add_global_gutenberg_styles_frontend();

		$css = implode( "\n", wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' ) );
		$this->assertStringContainsString( ':root {--global-palette1: #3182CE;', $css );
	}
}
