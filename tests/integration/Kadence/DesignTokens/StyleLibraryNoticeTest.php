<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\DesignTokens;

use Codeception\TestCase\WPTestCase;
use IntegrationTester;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Style_Library\Screen;

/**
 * Covers the Style Library screen's Global Styles notice with the Kadence theme
 * active, in its classic and Full Site Editing modes.
 */
final class StyleLibraryNoticeTest extends WPTestCase {
	/**
	 * The suite actor.
	 *
	 * @since TBD
	 *
	 * @var IntegrationTester
	 */
	protected IntegrationTester $tester;

	/**
	 * Full Site Editing mode prints an inline info notice above the app that links to the Site
	 * Editor's Styles screen.
	 *
	 * @return void
	 */
	public function testFseModeShowsTheNotice(): void {
		$this->tester->enable_fse_mode();

		$output = $this->render();

		$this->assertStringContainsString( '<div class="notice notice-info inline">', $output );
		$this->assertStringContainsString( 'This site uses the Kadence theme in Full Site Editing mode', $output );
		$this->assertStringContainsString( 'Style Library settings keep applying to the blocks that use them.', $output );
		$this->assertStringContainsString( '<a href="' . admin_url( 'site-editor.php?p=' . rawurlencode( '/styles' ) ) . '">Global Styles</a>', $output );
		$this->assertLessThan(
			strpos( $output, 'kadence-blocks-style-library-wrap' ),
			strpos( $output, 'notice-info' ),
			'The notice prints above the app.'
		);
	}

	/**
	 * Classic mode prints the screen without a notice.
	 *
	 * @return void
	 */
	public function testClassicModeShowsNoNotice(): void {
		$output = $this->render();

		$this->assertStringNotContainsString( 'notice', $output );
		$this->assertStringContainsString( 'id="kadence-blocks-style-library-root"', $output );
	}

	/**
	 * Switching Full Site Editing mode back off removes the notice and restores the classic markup
	 * byte for byte.
	 *
	 * @return void
	 */
	public function testSwitchingBackToClassicModeRemovesTheNotice(): void {
		$classic = $this->render();

		$this->tester->enable_fse_mode();
		$fse = $this->render();

		$this->tester->disable_fse_mode();

		$this->assertStringContainsString( 'notice-info', $fse );
		$this->assertSame( $classic, $this->render() );
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
