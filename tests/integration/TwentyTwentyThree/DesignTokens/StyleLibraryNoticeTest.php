<?php

declare( strict_types=1 );

namespace Tests\integration\TwentyTwentyThree\DesignTokens;

use Codeception\TestCase\WPTestCase;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Style_Library\Screen;

/**
 * Covers the Style Library screen's Global Styles notice with a block theme
 * that is not Kadence.
 */
final class StyleLibraryNoticeTest extends WPTestCase {

	/**
	 * A block theme other than Kadence prints the screen without a notice.
	 *
	 * @return void
	 */
	public function testNoNoticeWithoutTheKadenceTheme(): void {
		$output = $this->render();

		$this->assertStringNotContainsString( 'notice', $output );
		$this->assertStringContainsString( 'id="kadence-blocks-style-library-root"', $output );
	}

	/**
	 * The Kadence theme's stored mode, left behind after switching away from it in Full Site
	 * Editing mode, prints no notice either.
	 *
	 * @return void
	 */
	public function testALeftoverKadenceModeShowsNoNotice(): void {
		$output = $this->render();

		update_option( 'kadence_fse_mode', 'enabled' );

		$this->assertSame( $output, $this->render() );
	}

	/**
	 * The Style Library screen's rendered markup.
	 *
	 * @return string
	 */
	private function render(): string {
		ob_start();
		App::instance()->container()->get( Screen::class )->render();

		return (string) ob_get_clean();
	}
}
