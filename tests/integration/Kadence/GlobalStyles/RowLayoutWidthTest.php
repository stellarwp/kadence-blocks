<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\GlobalStyles;

use Codeception\TestCase\WPTestCase;
use Kadence_Blocks_Rowlayout_Block;

/**
 * Covers where the row layout takes its content width from. Rows use the
 * Kadence width variables in both modes; in Full Site Editing mode a Global
 * Styles content size set as a plain length also moves the breakout
 * breakpoint, since media queries can't use variables.
 */
final class RowLayoutWidthTest extends WPTestCase {
	private const INHERIT_WIDTH_ROW = [
		'uniqueID'        => '10_inherit',
		'inheritMaxWidth' => true,
	];

	private const BREAKOUT_ROW = [
		'uniqueID'        => '10_breakout',
		'inheritMaxWidth' => true,
		'align'           => 'full',
		'columns'         => 2,
		'colLayout'       => 'equal',
		'breakoutLeft'    => true,
	];

	protected \IntegrationTester $tester;

	public function testClassicInheritWidthRow(): void {
		$this->tester->assert_block_css_matches( 'row-inherit-classic-kadence', $this->row_css( self::INHERIT_WIDTH_ROW ) );
	}

	public function testClassicBreakoutRow(): void {
		$this->tester->assert_block_css_matches( 'row-breakout-classic-kadence', $this->row_css( self::BREAKOUT_ROW ) );
	}

	public function testFseModeInheritWidthRowKeepsTheThemeWidth(): void {
		$this->tester->enable_fse_mode();

		$this->tester->assert_block_css_matches( 'row-inherit-classic-kadence', $this->row_css( self::INHERIT_WIDTH_ROW ) );
	}

	public function testFseModeBreakoutRowKeepsTheThemeWidthWithoutAGlobalStylesLength(): void {
		$this->tester->enable_fse_mode();

		$this->tester->assert_block_css_matches( 'row-breakout-classic-kadence', $this->row_css( self::BREAKOUT_ROW ) );
	}

	public function testFseModeBreakoutRowStartsAtAGlobalStylesContentSize(): void {
		$this->tester->enable_fse_mode();
		$this->tester->set_global_styles_layout( '650px', '1200px' );

		$css = $this->row_css( self::BREAKOUT_ROW );

		$this->assertStringContainsString( '(min-width:650px)', $css );
		$this->assertStringContainsString( 'max-width:var( --global-content-width, 1290px );padding-left:var(--global-content-edge-padding);', $css );
	}

	public function testFseModeBreakoutRowFollowsAGlobalStylesContentSizeChange(): void {
		$this->tester->enable_fse_mode();
		$this->tester->set_global_styles_layout( '650px', '1200px' );
		$before = $this->row_css( self::BREAKOUT_ROW );

		$this->tester->set_global_styles_layout( '42rem', '1200px' );
		$after = $this->row_css( self::BREAKOUT_ROW );

		$this->assertStringContainsString( '(min-width:650px)', $before );
		$this->assertStringContainsString( '(min-width:42rem)', $after );
	}

	public function testFseModeBreakoutRowKeepsTheThemeWidthForAnEmLength(): void {
		$this->tester->enable_fse_mode();
		$this->tester->set_global_styles_layout( '42em', '1200px' );

		$this->tester->assert_block_css_matches( 'row-breakout-classic-kadence', $this->row_css( self::BREAKOUT_ROW ) );
	}

	public function testFseModeBreakoutRowKeepsTheThemeWidthForAnExpression(): void {
		$this->tester->enable_fse_mode();
		$this->tester->set_global_styles_layout( 'clamp(40rem, 60vw, 60rem)', '1200px' );

		$this->tester->assert_block_css_matches( 'row-breakout-classic-kadence', $this->row_css( self::BREAKOUT_ROW ) );
	}

	/**
	 * @param array<string, mixed> $attributes Row attributes.
	 *
	 * @return string
	 */
	private function row_css( array $attributes ): string {
		return $this->tester->block_css( Kadence_Blocks_Rowlayout_Block::get_instance(), $attributes );
	}
}
