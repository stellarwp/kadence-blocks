<?php declare( strict_types=1 );

namespace Tests\wpunit\CssWriters;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Numeric_Condition;
use Kadence_Blocks_Css_Sides;
use Tests\Support\Classes\TestCase;

/**
 * The sides writer emits one declaration per numeric box side.
 */
final class SidesTest extends TestCase {

	/**
	 * The CSS builder the sides are written to.
	 *
	 * @var Kadence_Blocks_CSS
	 */
	private $css;

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
		$this->css = new Kadence_Blocks_CSS();
		$this->css->set_style_id( 'sides-test' );
		$this->css->set_selector( '.a' );
	}

	/**
	 * Each side is written in top, right, bottom, left order when numeric.
	 *
	 * @dataProvider sidesProvider
	 *
	 * @param mixed  $values   The stored side values.
	 * @param string $unit     The unit appended to every side.
	 * @param string $expected The CSS the builder outputs.
	 *
	 * @return void
	 */
	public function testWritesNumericSides( $values, string $unit, string $expected ): void {
		( new Kadence_Blocks_Css_Sides( 'padding', new Kadence_Blocks_Css_Numeric_Condition() ) )->write( $this->css, $values, $unit );

		$this->assertSame( $expected, $this->css->css_output() );
	}

	/**
	 * A suffix is added after each side in the property name.
	 *
	 * @return void
	 */
	public function testWritesTheSuffixAfterEachSide(): void {
		( new Kadence_Blocks_Css_Sides( 'border', new Kadence_Blocks_Css_Numeric_Condition(), '-width' ) )->write( $this->css, [ 1, 2 ], 'px' );

		$this->assertSame( '.a{border-top-width:1px;border-right-width:2px;}', $this->css->css_output() );
	}

	/**
	 * @return Generator
	 */
	public function sidesProvider(): Generator {
		yield 'all four' => [
			'values'   => [ 1, 2, 3, 4 ],
			'unit'     => 'px',
			'expected' => '.a{padding-top:1px;padding-right:2px;padding-bottom:3px;padding-left:4px;}',
		];
		yield 'zero is written' => [
			'values'   => [ 0, '', '', 0 ],
			'unit'     => 'em',
			'expected' => '.a{padding-top:0em;padding-left:0em;}',
		];
		yield 'sparse list' => [
			'values'   => [ 5 ],
			'unit'     => 'px',
			'expected' => '.a{padding-top:5px;}',
		];
		yield 'text reads one character per side like the legacy code did' => [
			'values'   => '10',
			'unit'     => 'px',
			'expected' => '.a{padding-top:1px;padding-right:0px;}',
		];
		yield 'a number is not a list of sides' => [
			'values'   => 10,
			'unit'     => 'px',
			'expected' => '',
		];
		yield 'never set' => [
			'values'   => null,
			'unit'     => 'px',
			'expected' => '',
		];
	}
}
