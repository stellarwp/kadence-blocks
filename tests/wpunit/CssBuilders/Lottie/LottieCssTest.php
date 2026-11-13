<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Lottie;

use Generator;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Lottie_Max_Width_Css;
use Kadence_Blocks_Lottie_Width;
use Tests\wpunit\CssBuilders\Entry_Build_Test_Case;

/**
 * The CSS of the lottie block, with the exact rules for a few animations, and the classes it is made of.
 */
final class LottieCssTest extends Entry_Build_Test_Case {

	private const BOX = '.kb-lottie-containerabc';

	private const TABLET = '@media all and (max-width: 1024px)';

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-lottie-css.php';
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
		$this->assertSameCss( $expected, $this->build_entry( 'Kadence_Blocks_Lottie_Css', 'lottie', $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function buildProvider(): Generator {
		yield 'an animation with a width limits the player' => [
			'attributes' => [ 'width' => '300' ],
			'expected'   => self::BOX . ' dotlottie-player{max-width:300px;}',
		];

		yield 'an animation without a width, or with a width of zero, has an automatic width' => [
			'attributes' => [ 'width' => '0' ],
			'expected'   => self::BOX . ' dotlottie-player{max-width:auto;}',
		];

		yield 'an animation that keeps its ratio centers its box and pads it to the ratio' => [
			'attributes' => [
				'useRatio' => true,
				'ratio'    => '56.25',
				'width'    => '300',
			],
			'expected'   => self::BOX . '{max-width:300px;margin:0 auto;}' . self::BOX . ' .kb-is-ratio-animation{padding-bottom:56.25%;}',
		];

		yield 'a ratio that is not a number is a square' => [
			'attributes' => [
				'useRatio' => 1,
				'ratio'    => 'wide',
			],
			'expected'   => self::BOX . '{max-width:auto;margin:0 auto;}' . self::BOX . ' .kb-is-ratio-animation{padding-bottom:100%;}',
		];

		yield 'the margin of an animation that keeps its ratio is always centered, the padding stays' => [
			'attributes' => [
				'useRatio'      => true,
				'marginDesktop' => [ 1, 2, 3, 4 ],
				'marginUnit'    => 'em',
				'paddingTablet' => [ 5, 6, 7, 8 ],
				'paddingUnit'   => 'rem',
			],
			'expected'   => self::BOX . '{margin-top:1em;margin-right:2em;margin-bottom:3em;margin-left:4em;margin:0 auto;max-width:auto;}'
				. self::TABLET . '{' . self::BOX . '{padding-top:5rem;padding-right:6rem;padding-bottom:7rem;padding-left:8rem;}}'
				. self::BOX . ' .kb-is-ratio-animation{padding-bottom:100%;}',
		];

		yield 'the margin and the padding of an animation are written for every device' => [
			'attributes' => [
				'marginDesktop' => [ 1, 2, 3, 4 ],
				'marginUnit'    => 'em',
				'paddingTablet' => [ 5, 6, 7, 8 ],
			],
			'expected'   => self::BOX . '{margin-top:1em;margin-right:2em;margin-bottom:3em;margin-left:4em;}'
				. self::TABLET . '{' . self::BOX . '{padding-top:5px;padding-right:6px;padding-bottom:7px;padding-left:8px;}}'
				. self::BOX . ' dotlottie-player{max-width:auto;}',
		];
	}

	/**
	 * The maximum width is automatic without a width or with a width of zero, and in pixels otherwise.
	 *
	 * @dataProvider widthProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The width expected.
	 *
	 * @return void
	 */
	public function testWidth( array $attributes, string $expected ): void {
		$this->assertSame( $expected, Kadence_Blocks_Lottie_Width::resolve( $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function widthProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/lottie/loader.php';

		yield 'no width' => [
			'attributes' => [],
			'expected'   => 'auto',
		];

		yield 'a width of the string zero' => [
			'attributes' => [ 'width' => '0' ],
			'expected'   => 'auto',
		];

		yield 'a width of the number zero is a width of zero pixels' => [
			'attributes' => [ 'width' => 0 ],
			'expected'   => '0px',
		];

		yield 'a width' => [
			'attributes' => [ 'width' => 250 ],
			'expected'   => '250px',
		];
	}

	/**
	 * A width that is a list is not a width, and PHP warns about turning it into text, as it always did.
	 *
	 * @return void
	 */
	public function testWidthThatIsAListWarns(): void {
		// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_set_error_handler -- The warning is what is pinned.
		set_error_handler(
			static function ( int $number, string $message ): bool {
				throw new \ErrorException( $message, 0, $number );
			}
		);

		try {
			$this->expectException( \ErrorException::class );
			$this->expectExceptionMessage( 'Array to string conversion' );

			Kadence_Blocks_Lottie_Width::resolve( [ 'width' => [ 1 ] ] );
		} finally {
			restore_error_handler();
		}
	}

	/**
	 * The maximum width section writes the width derived from the attributes.
	 *
	 * @return void
	 */
	public function testMaxWidthSection(): void {
		$section = new Kadence_Blocks_Lottie_Max_Width_Css();

		$this->assertInstanceOf( Kadence_Blocks_Css_Section::class, $section );

		$css   = new \Kadence_Blocks_CSS();
		$input = $this->input( [], $css );
		$css->set_style_id( 'lottie-max-width' );
		$css->set_selector( '.s' );
		$section->write( $input->with( 'width', '12px' ) );

		$this->assertSameCss( '.s{max-width:12px;}', $css->css_output() );
	}
}
