<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\ClassicFeatures;

use Codeception\TestCase\WPTestCase;
use Kadence_Blocks_Advancedheading_Block;

/**
 * Covers the heading margin fix for the Kadence theme's `.single-content`
 * wrapper, which the plugin adds in both modes.
 */
final class AdvancedHeadingTest extends WPTestCase {
	protected \IntegrationTester $tester;

	/**
	 * @after
	 */
	public function deregister_heading_styles(): void {
		wp_deregister_style( 'kadence-blocks-advancedheading' );
	}

	public function testClassicAddsTheSingleContentMarginFix(): void {
		$this->assertStringContainsString( '.single-content .kadence-advanced-heading-wrapper h1', $this->heading_inline_css() );
	}

	public function testFseModeAddsTheSingleContentMarginFix(): void {
		$this->tester->enable_fse_mode();

		$this->assertStringContainsString( '.single-content .kadence-advanced-heading-wrapper h1', $this->heading_inline_css() );
	}

	private function heading_inline_css(): string {
		wp_deregister_style( 'kadence-blocks-advancedheading' );

		Kadence_Blocks_Advancedheading_Block::get_instance()->register_scripts();

		return implode( "\n", wp_styles()->get_data( 'kadence-blocks-advancedheading', 'after' ) );
	}
}
