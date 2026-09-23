<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\GlobalStyles;

use Codeception\TestCase\WPTestCase;

/**
 * Pins the editor CSS of `kadence_blocks_add_global_gutenberg_inline_styles()`
 * on the classic Kadence theme, where the content width comes from the theme's
 * Customizer option.
 */
final class GlobalEditorStylesTest extends WPTestCase {
	protected \IntegrationTester $tester;

	public function testClassicKadenceEditorCss(): void {
		$this->tester->assert_global_editor_css_matches( 'classic-kadence' );
	}
}
