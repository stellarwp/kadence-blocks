<?php declare( strict_types=1 );

namespace Tests\wpunit\CssWriters;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Color_Opacity_Declaration;
use Tests\Support\Classes\TestCase;

/**
 * The color opacity declaration writes a color with full opacity unless a numeric opacity is given.
 */
final class ColorOpacityDeclarationTest extends TestCase {

	/**
	 * The CSS builder the declaration writes to.
	 *
	 * @var Kadence_Blocks_CSS
	 */
	private $css;

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
		$this->css = new Kadence_Blocks_CSS();
		$this->css->set_style_id( 'color-opacity-test' );
		$this->css->set_selector( '.a' );
	}

	/**
	 * The declaration matches the legacy `$alpha` plus `render_color()` pair for every input.
	 *
	 * @dataProvider colorProvider
	 *
	 * @param mixed  $color    The raw color attribute.
	 * @param mixed  $opacity  The raw opacity attribute.
	 * @param string $expected The CSS the builder outputs.
	 *
	 * @return void
	 */
	public function testWritesColorWithOpacity( $color, $opacity, string $expected ): void {
		( new Kadence_Blocks_Css_Color_Opacity_Declaration( 'background' ) )->write( $this->css, $color, $opacity );

		$this->assertSame( $expected, $this->css->css_output() );
	}

	/**
	 * @return Generator
	 */
	public function colorProvider(): Generator {
		yield 'no color writes nothing' => [
			'color'    => '',
			'opacity'  => 0.5,
			'expected' => '',
		];
		yield 'color never set' => [
			'color'    => null,
			'opacity'  => null,
			'expected' => '',
		];
		yield 'full opacity when none given' => [
			'color'    => '#ff0000',
			'opacity'  => null,
			'expected' => '.a{background:#ff0000;}',
		];
		yield 'full opacity when not numeric' => [
			'color'    => '#ff0000',
			'opacity'  => 'half',
			'expected' => '.a{background:#ff0000;}',
		];
		yield 'numeric opacity applies' => [
			'color'    => '#ff0000',
			'opacity'  => 0.5,
			'expected' => '.a{background:rgba(255, 0, 0, 0.5);}',
		];
		yield 'zero opacity applies' => [
			'color'    => '#ff0000',
			'opacity'  => 0,
			'expected' => '.a{background:rgba(255, 0, 0, 0);}',
		];
	}
}
