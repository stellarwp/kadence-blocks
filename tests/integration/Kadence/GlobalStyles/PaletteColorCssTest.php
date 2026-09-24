<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\GlobalStyles;

use Codeception\TestCase\WPTestCase;
use Kadence_Blocks_Advancedheading_Block;
use Kadence_Blocks_Rowlayout_Block;
use Kadence_Blocks_Settings;

/**
 * Covers palette colors that also carry a preset class: the block adds no
 * color CSS and leaves the color to the class. In Full Site Editing mode core
 * generates the theme palette classes from Global Styles, so the colors follow
 * Global Styles. Colors from the stored Kadence Blocks palette are left to the
 * plugin's class CSS in both modes.
 */
final class PaletteColorCssTest extends WPTestCase {
	private const HEADING = [
		'uniqueID'             => '10_heading',
		'color'                => 'palette1',
		'colorClass'           => 'theme-palette1',
		'background'           => 'palette2',
		'backgroundColorClass' => 'theme-palette2',
	];

	private const ROW = [
		'uniqueID'     => '10_row',
		'bgColor'      => 'palette3',
		'bgColorClass' => 'theme-palette3',
	];

	protected \IntegrationTester $tester;

	public function testClassicHeadingCss(): void {
		$this->tester->assert_block_css_matches( 'heading-palette-classic-kadence', $this->heading_css() );
	}

	public function testClassicRowCss(): void {
		$this->tester->assert_block_css_matches( 'row-palette-classic-kadence', $this->row_css() );
	}

	public function testFseModeHeadingCss(): void {
		$this->tester->enable_fse_mode();

		$this->tester->assert_block_css_matches( 'heading-palette-classic-kadence', $this->heading_css() );
	}

	public function testFseModeRowCss(): void {
		$this->tester->enable_fse_mode();

		$this->tester->assert_block_css_matches( 'row-palette-classic-kadence', $this->row_css() );
	}

	public function testFseModeHeadingLeavesAStoredPaletteColorToTheClassCss(): void {
		[ $text, $background ] = $this->tester->store_palette();
		$this->tester->enable_fse_mode();

		$css = $this->tester->block_css(
			Kadence_Blocks_Advancedheading_Block::get_instance(),
			[
				'uniqueID'             => '10_heading',
				'color'                => $text['color'],
				'colorClass'           => $text['slug'],
				'background'           => $background['color'],
				'backgroundColorClass' => $background['slug'],
			]
		);

		$this->assertStringNotContainsString( $text['color'], $css );
		$this->assertStringNotContainsString( $background['color'], $css );
		$this->assertStringContainsString( '.has-' . $text['slug'] . '-color{color:' . $text['color'] . '}', $this->palette_css() );
		$this->assertStringContainsString( '.has-' . $background['slug'] . '-background-color{background-color:' . $background['color'] . '}', $this->palette_css() );
	}

	public function testFseModeRowLeavesAStoredPaletteBackgroundToTheClassCss(): void {
		[ $background ] = $this->tester->store_palette();
		$this->tester->enable_fse_mode();

		$css = $this->tester->block_css(
			Kadence_Blocks_Rowlayout_Block::get_instance(),
			[
				'uniqueID'     => '10_row',
				'bgColor'      => $background['color'],
				'bgColorClass' => $background['slug'],
			]
		);

		$this->assertStringNotContainsString( $background['color'], $css );
		$this->assertStringContainsString( '.has-' . $background['slug'] . '-background-color{background-color:' . $background['color'] . '}', $this->palette_css() );
	}

	private function heading_css(): string {
		return $this->tester->block_css( Kadence_Blocks_Advancedheading_Block::get_instance(), self::HEADING );
	}

	private function row_css(): string {
		return $this->tester->block_css( Kadence_Blocks_Rowlayout_Block::get_instance(), self::ROW );
	}

	private function palette_css(): string {
		ob_start();
		Kadence_Blocks_Settings::get_instance()->print_color_palette_css();

		$css = ob_get_clean();

		return false === $css ? '' : $css;
	}
}
