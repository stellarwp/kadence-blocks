<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Icon;

use Generator;
use Kadence_Blocks_Css_Static_Section;
use Kadence_Blocks_Icon_Flex_Align_Css;
use Kadence_Blocks_Icon_Item_Selector_Css;
use Kadence_Blocks_Icon_Items_Css;
use Tests\wpunit\CssBuilders\Entry_Build_Test_Case;

/**
 * The CSS of the icon block, with the exact rules for a few icon lists, and the classes it is made of.
 */
final class IconCssTest extends Entry_Build_Test_Case {

	private const ICON = [
		'color'        => '#ff0000',
		'size'         => 30,
		'tabletSize'   => 20,
		'mobileSize'   => 10,
		'style'        => 'stacked',
		'background'   => '#00ff00',
		'border'       => '#0000ff',
		'borderWidth'  => 2,
		'borderRadius' => 5,
		'padding'      => [ 1, 2, 3, 4 ],
		'margin'       => [ 5, 6, 7, 8 ],
		'hColor'       => '#111111',
		'hBackground'  => '#222222',
		'hBorder'      => '#333333',
	];

	private const TABLET = '@media all and (max-width: 1024px)';

	private const MOBILE = '@media all and (max-width: 767px)';

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-icon-css.php';
	}

	/**
	 * The CSS built for the attributes is the CSS expected.
	 *
	 * @dataProvider buildProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testBuild( array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->build_entry( 'Kadence_Blocks_Icon_Css', 'icon', $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function buildProvider(): Generator {
		$item  = '.kt-svg-iconsabc .kt-svg-item-0 .kb-svg-icon-wrap';
		$hover = '.kt-svg-iconsabc .kt-svg-item-0:hover .kb-svg-icon-wrap';
		$list  = '.wp-block-kadence-icon.kt-svg-iconsabc';

		yield 'a stacked icon gets its background, border and padding, and its hover state' => [
			'attributes' => [ 'icons' => [ self::ICON ] ],
			'expected'   => $item . '{color:#ff0000;font-size:30px;background:#00ff00;border-color:#0000ff;border-width:2px;border-radius:5px;'
				. 'padding-top:1px;padding-right:2px;padding-bottom:3px;padding-left:4px;margin-top:5px;margin-right:6px;margin-bottom:7px;margin-left:8px;}'
				. $hover . '{color:#111111;background:#222222;border-color:#333333;}'
				. self::TABLET . '{' . $item . '{font-size:20px;}}'
				. self::MOBILE . '{' . $item . '{font-size:10px;}}',
		];

		yield 'an icon that is not stacked has neither background, border nor padding of its own' => [
			'attributes' => [ 'icons' => [ 'one' => array_merge( self::ICON, [ 'style' => 'default' ] ) ] ],
			'expected'   => '.kt-svg-iconsabc .kt-svg-item-one .kb-svg-icon-wrap{color:#ff0000;font-size:30px;margin-top:5px;margin-right:6px;margin-bottom:7px;margin-left:8px;}'
				. '.kt-svg-iconsabc .kt-svg-item-one:hover .kb-svg-icon-wrap{color:#111111;background:#222222;border-color:#333333;}'
				. self::TABLET . '{.kt-svg-iconsabc .kt-svg-item-one .kb-svg-icon-wrap{font-size:20px;}}'
				. self::MOBILE . '{.kt-svg-iconsabc .kt-svg-item-one .kb-svg-icon-wrap{font-size:10px;}}',
		];

		yield 'a saved icon that is not a list of settings is skipped, its place is kept' => [
			'attributes' => [ 'icons' => [ 'text', 7, [ 'color' => '#ff0000' ] ] ],
			'expected'   => '.kt-svg-iconsabc .kt-svg-item-2 .kb-svg-icon-wrap{color:#ff0000;}',
		];

		yield 'the list is aligned, wrapped and spaced on every device' => [
			'attributes' => [
				'icons'               => 'x',
				'textAlignment'       => 'center',
				'tabletTextAlignment' => 'right',
				'mobileTextAlignment' => 'left',
				'wrapIcons'           => true,
				'gap'                 => [ 10, 20, 30 ],
				'gapUnit'             => 'em',
			],
			'expected'   => $list . '{justify-content:center;flex-wrap:wrap;gap:10em;}'
				. self::TABLET . '{' . $list . '{justify-content:flex-end;gap:20em;}}'
				. self::MOBILE . '{' . $list . '{justify-content:flex-start;gap:30em;}}',
		];

		yield 'an icon block without anything has nothing to write' => [
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * The icons section writes its sections for every icon that is a list of settings, with the key of the icon known.
	 *
	 * @dataProvider itemsProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testItems( array $attributes, string $expected ): void {
		$section = new Kadence_Blocks_Icon_Items_Css(
			[
				new Kadence_Blocks_Icon_Item_Selector_Css( ' .wrap' ),
				new Kadence_Blocks_Css_Static_Section( 'order', '1' ),
			]
		);

		$this->assertSameCss( $expected, $this->write_section( $section, $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function itemsProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/icon/loader.php';

		yield 'a list of icons' => [
			'attributes' => [ 'icons' => [ [ 'a' => 1 ], [ 'a' => 2 ] ] ],
			'expected'   => '.kt-svg-iconsabc .kt-svg-item-0 .wrap{order:1;}.kt-svg-iconsabc .kt-svg-item-1 .wrap{order:1;}',
		];

		yield 'icons by name, and only the ones that are lists' => [
			'attributes' => [
				'icons' => [
					'first' => [ 'a' => 1 ],
					'skip'  => 'text',
					'null'  => null,
				],
			],
			'expected'   => '.kt-svg-iconsabc .kt-svg-item-first .wrap{order:1;}',
		];

		yield 'an empty list of icons' => [
			'attributes' => [ 'icons' => [] ],
			'expected'   => '',
		];

		yield 'icons that are not a list' => [
			'attributes' => [ 'icons' => 'text' ],
			'expected'   => '',
		];

		yield 'no icons' => [
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * The alignment of the list is written for every device, from its own attributes.
	 *
	 * @return void
	 */
	public function testFlexAlign(): void {
		$css = $this->write_section(
			new Kadence_Blocks_Icon_Flex_Align_Css(),
			[
				'textAlignment'       => 'right',
				'tabletTextAlignment' => 'center',
				'mobileTextAlignment' => 'left',
			],
			'abc',
			'.list'
		);

		$this->assertSameCss(
			'.list{justify-content:flex-end;}' . self::TABLET . '{.list{justify-content:center;}}' . self::MOBILE . '{.list{justify-content:flex-start;}}',
			$css
		);
	}
}
