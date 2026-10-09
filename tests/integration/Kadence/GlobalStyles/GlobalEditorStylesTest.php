<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\GlobalStyles;

use Codeception\TestCase\WPTestCase;

/**
 * Pins the editor CSS of `kadence_blocks_add_global_gutenberg_inline_styles()`
 * with the Kadence theme: the content width comes from the theme's Customizer
 * option, or in Full Site Editing mode from the Global Styles content size
 * plus the edge padding.
 */
final class GlobalEditorStylesTest extends WPTestCase {
	protected \IntegrationTester $tester;

	public function testClassicKadenceEditorCss(): void {
		$this->tester->assert_global_editor_css_matches( 'classic-kadence' );
	}

	public function testFseModeEditorCss(): void {
		$this->tester->enable_fse_mode();

		$this->tester->assert_global_editor_css_matches( 'fse-kadence' );
	}
}
