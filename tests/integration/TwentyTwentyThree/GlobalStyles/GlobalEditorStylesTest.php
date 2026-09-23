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

	/**
	 * The theme's `$content_width` before the test, null when unset.
	 */
	private ?int $content_width = null;

	/**
	 * @before
	 */
	public function unset_content_width(): void {
		$this->content_width = $GLOBALS['content_width'] ?? null;
		unset( $GLOBALS['content_width'] );
	}

	/**
	 * @after
	 */
	public function restore_content_width(): void {
		unset( $GLOBALS['content_width'] );

		if ( null !== $this->content_width ) {
			$GLOBALS['content_width'] = $this->content_width;
		}
	}

	public function testEditorCssWithoutAContentWidth(): void {
		$this->tester->assert_global_editor_css_matches( 'no-content-width' );
	}

	public function testEditorCssWithAContentWidth(): void {
		$GLOBALS['content_width'] = 840;

		$this->tester->assert_global_editor_css_matches( 'content-width' );
	}
}
