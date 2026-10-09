<?php

declare( strict_types=1 );

namespace Tests\integration\TwentyTwentyThree\GlobalStyles;

use Codeception\TestCase\WPTestCase;
use Kadence_Blocks_Rowlayout_Block;

/**
 * Pins the row layout width CSS without the Kadence theme, with and without a
 * theme `$content_width`.
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

	public function testInheritWidthRowWithoutAContentWidth(): void {
		$this->tester->unset_content_width();

		$this->assert_row_css_matches( 'row-inherit-no-content-width', self::INHERIT_WIDTH_ROW );
	}

	public function testBreakoutRowWithoutAContentWidth(): void {
		$this->tester->unset_content_width();

		$this->assert_row_css_matches( 'row-breakout-no-content-width', self::BREAKOUT_ROW );
	}

	public function testInheritWidthRowWithAContentWidth(): void {
		$this->tester->set_content_width( 840 );

		$this->assert_row_css_matches( 'row-inherit-content-width', self::INHERIT_WIDTH_ROW );
	}

	public function testBreakoutRowWithAContentWidth(): void {
		$this->tester->set_content_width( 840 );

		$this->assert_row_css_matches( 'row-breakout-content-width', self::BREAKOUT_ROW );
	}

	/**
	 * @param string               $name       Stored CSS file name.
	 * @param array<string, mixed> $attributes Row attributes.
	 */
	private function assert_row_css_matches( string $name, array $attributes ): void {
		$this->tester->assert_block_css_matches( $name, $this->tester->block_css( Kadence_Blocks_Rowlayout_Block::get_instance(), $attributes ) );
	}
}
