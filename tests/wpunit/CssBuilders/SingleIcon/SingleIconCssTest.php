<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\SingleIcon;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Single_Icon_Array_Condition;
use Tests\wpunit\CssBuilders\Entry_Build_Test_Case;

/**
 * The CSS of the single icon block, with the exact rules for a few icons, and the class it is made of.
 */
final class SingleIconCssTest extends Entry_Build_Test_Case {

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
		'paddingUnit'  => 'rem',
		'margin'       => [ 5, 6, 7, 8 ],
		'marginUnit'   => 'em',
		'hColor'       => '#111111',
		'hBackground'  => '#222222',
		'hBorder'      => '#333333',
	];

	private const SELECTOR = '.kt-svg-item-abc .kb-svg-icon-wrap, .kt-svg-style-stacked.kt-svg-item-abc .kb-svg-icon-wrap';

	private const HOVER = '.kt-svg-item-abc:hover .kb-svg-icon-wrap';

	private const TABLET = '@media all and (max-width: 1024px)';

	private const MOBILE = '@media all and (max-width: 767px)';

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-single-icon-css.php';
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
		$this->assertSameCss( $expected, $this->build_entry( 'Kadence_Blocks_Single_Icon_Css', 'single-icon', $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function buildProvider(): Generator {
		yield 'a stacked icon gets its background, border, padding and radius in percent, and its hover state' => [
			'attributes' => self::ICON,
			'expected'   => self::SELECTOR . '{color:#ff0000;font-size:30px;margin-top:5em;margin-right:6em;margin-bottom:7em;margin-left:8em;'
				. 'background:#00ff00;border-color:#0000ff;border-width:2px;border-radius:5%;padding-top:1rem;padding-right:2rem;padding-bottom:3rem;padding-left:4rem;}'
				. self::HOVER . '{background:#222222;border-color:#333333;color:#111111;}'
				. self::TABLET . '{' . self::SELECTOR . '{font-size:20px;}}'
				. self::MOBILE . '{' . self::SELECTOR . '{font-size:10px;}}',
		];

		yield 'an icon that is not stacked only has a color, a size, a margin and a hover color' => [
			'attributes' => array_merge( self::ICON, [ 'style' => 'default' ] ),
			'expected'   => self::SELECTOR . '{color:#ff0000;font-size:30px;margin-top:5em;margin-right:6em;margin-bottom:7em;margin-left:8em;}'
				. self::HOVER . '{color:#111111;}'
				. self::TABLET . '{' . self::SELECTOR . '{font-size:20px;}}'
				. self::MOBILE . '{' . self::SELECTOR . '{font-size:10px;}}',
		];

		yield 'an icon without settings has nothing to write' => [
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * The condition is met by a list of attributes, and by nothing else.
	 *
	 * @dataProvider attributesProvider
	 *
	 * @param mixed $attributes The block attributes.
	 * @param bool  $expected   Whether the condition is met.
	 *
	 * @return void
	 */
	public function testArrayCondition( $attributes, bool $expected ): void {
		$context = new Kadence_Blocks_Css_Block_Context(
			'single-icon',
			static function () {
				return null;
			}
		);
		$input   = new Kadence_Blocks_Css_Build_Input( $attributes, new Kadence_Blocks_CSS(), 'abc', 'abc', $context );

		$this->assertSame( $expected, ( new Kadence_Blocks_Single_Icon_Array_Condition() )->is_met( $input ) );
	}

	/**
	 * @return Generator
	 */
	public function attributesProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/single-icon/loader.php';

		yield 'a list' => [
			'attributes' => [ 'color' => '#fff' ],
			'expected'   => true,
		];

		yield 'an empty list' => [
			'attributes' => [],
			'expected'   => true,
		];

		yield 'nothing' => [
			'attributes' => null,
			'expected'   => false,
		];

		yield 'text' => [
			'attributes' => 'icon',
			'expected'   => false,
		];
	}
}
