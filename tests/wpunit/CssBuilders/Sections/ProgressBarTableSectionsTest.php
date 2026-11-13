<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Sections;

use Generator;
use Kadence_Blocks_Css_Fallback_Color_Section;
use Kadence_Blocks_Css_Item_Section;
use Kadence_Blocks_Css_Responsive_Size_Section;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Css_Static_Section;
use Kadence_Blocks_Css_Text_Align_Section;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The generic sections that the progress bar and the table share: a size for every device, a text alignment, a filled entry of a
 * list and a color with a fallback.
 */
final class ProgressBarTableSectionsTest extends Free_Section_Test_Case {

	private const TABLET = '@media all and (max-width: 1024px)';

	private const MOBILE = '@media all and (max-width: 767px)';

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
	}

	/**
	 * A section writes the CSS expected for the attributes.
	 *
	 * @dataProvider sectionProvider
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testSection( Kadence_Blocks_Css_Section $section, array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_section( $section, $attributes, 'abc', '.sel' ) );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';

		$names = [ 'width', 'tabletWidth', 'mobileWidth' ];

		yield 'a size on every device, in the unit saved' => [
			'section'    => new Kadence_Blocks_Css_Responsive_Size_Section( $names, 'width', 'widthUnit' ),
			'attributes' => [
				'width'       => 50,
				'tabletWidth' => 60,
				'mobileWidth' => 70,
				'widthUnit'   => '%',
			],
			'expected'   => '.sel{width:50%;}' . self::TABLET . '{.sel{width:60%;}}' . self::MOBILE . '{.sel{width:70%;}}',
		];
		yield 'a size in pixels when no unit was saved' => [
			'section'    => new Kadence_Blocks_Css_Responsive_Size_Section( $names, 'width', 'widthUnit' ),
			'attributes' => [ 'width' => 50 ],
			'expected'   => '.sel{width:50px;}',
		];
		yield 'a size in the unit named after the first attribute' => [
			'section'    => new Kadence_Blocks_Css_Responsive_Size_Section( $names, 'height', '' ),
			'attributes' => [
				'width'     => 5,
				'widthType' => 'em',
			],
			'expected'   => '.sel{height:5em;}',
		];
		yield 'a text alignment on every device' => [
			'section'    => new Kadence_Blocks_Css_Text_Align_Section(
				'headerAlign',
				[
					'desktop_key' => 'headerAlign',
					'tablet_key'  => 'headerAlignTablet',
					'mobile_key'  => 'headerAlignMobile',
				]
			),
			'attributes' => [
				'headerAlign'       => 'center',
				'headerAlignTablet' => 'left',
				'headerAlignMobile' => 'right',
			],
			'expected'   => '.sel{text-align:center;}' . self::TABLET . '{.sel{text-align:left;}}' . self::MOBILE . '{.sel{text-align:right;}}',
		];
		yield 'a filled entry runs the sections' => [
			'section'    => new Kadence_Blocks_Css_Item_Section( 'limits', 1, [ new Kadence_Blocks_Css_Static_Section( 'overflow', 'auto' ) ] ),
			'attributes' => [ 'limits' => [ '', 'px' ] ],
			'expected'   => '.sel{overflow:auto;}',
		];
		yield 'an empty entry runs nothing' => [
			'section'    => new Kadence_Blocks_Css_Item_Section( 'limits', 0, [ new Kadence_Blocks_Css_Static_Section( 'overflow', 'auto' ) ] ),
			'attributes' => [ 'limits' => [ '', 'px' ] ],
			'expected'   => '',
		];
		yield 'a list that was not saved runs nothing' => [
			'section'    => new Kadence_Blocks_Css_Item_Section( 'limits', 0, [ new Kadence_Blocks_Css_Static_Section( 'overflow', 'auto' ) ] ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'a color that was saved' => [
			'section'    => new Kadence_Blocks_Css_Fallback_Color_Section( 'background-color', 'tint', 'undefined' ),
			'attributes' => [ 'tint' => '#ff0000' ],
			'expected'   => '.sel{background-color:#ff0000;}',
		];
		yield 'a color that was not saved renders the fallback' => [
			'section'    => new Kadence_Blocks_Css_Fallback_Color_Section( 'background-color', 'tint', 'undefined' ),
			'attributes' => [],
			'expected'   => '.sel{background-color:undefined;}',
		];
	}
}
