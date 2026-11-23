<?php

declare( strict_types=1 );

namespace Tests\integration\TwentyTwentyThree\GlobalStyles;

use Codeception\TestCase\WPTestCase;

/**
 * Pins the editor CSS of `kadence_blocks_add_global_gutenberg_inline_styles()`
 * without the Kadence theme, with and without a theme `$content_width`.
 */
final class GlobalEditorStylesTest extends WPTestCase {
	protected \IntegrationTester $tester;

	public function testEditorCssWithoutAContentWidth(): void {
		$this->tester->unset_content_width();

		$this->tester->assert_global_editor_css_matches( 'no-content-width' );
	}

	public function testEditorCssWithAContentWidth(): void {
		$this->tester->set_content_width( 840 );

		$this->tester->assert_global_editor_css_matches( 'content-width' );
	}
}
