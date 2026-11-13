<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Countup;

use Error;
use Generator;
use Kadence_Blocks_Countup_Font_Condition;
use Kadence_Blocks_Countup_Min_Height_Condition;
use Kadence_Blocks_Countup_Number_Height_Css;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Input_Condition;
use Kadence_Blocks_Css_Section;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The sections and the conditions of the countup CSS, one by one.
 */
final class CountupSectionsTest extends Free_Section_Test_Case {

	private const SELECTOR = '.kb-count-up-abc .kb-count-up-number';

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
		$this->assertSameCss( $expected, $this->write_section( $section, $attributes, 'abc', self::SELECTOR ) );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/countup/loader.php';

		yield 'a numeric height of tablet is written in pixels' => [
			'section'    => new Kadence_Blocks_Countup_Number_Height_Css( 1 ),
			'attributes' => [ 'numberMinHeight' => [ 1, '20', 3 ] ],
			'expected'   => self::SELECTOR . '{min-height:20px;}',
		];
		yield 'a numeric height of mobile is written in pixels' => [
			'section'    => new Kadence_Blocks_Countup_Number_Height_Css( 2 ),
			'attributes' => [ 'numberMinHeight' => [ 1, 2, 3.5 ] ],
			'expected'   => self::SELECTOR . '{min-height:3.5px;}',
		];
		yield 'a height that is not a number is not written' => [
			'section'    => new Kadence_Blocks_Countup_Number_Height_Css( 1 ),
			'attributes' => [ 'numberMinHeight' => [ 1, 'tall' ] ],
			'expected'   => '',
		];
		yield 'a missing height is not written' => [
			'section'    => new Kadence_Blocks_Countup_Number_Height_Css( 2 ),
			'attributes' => [ 'numberMinHeight' => [ 1 ] ],
			'expected'   => '',
		];
		yield 'a missing list is not written' => [
			'section'    => new Kadence_Blocks_Countup_Number_Height_Css( 1 ),
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * A height that is stored as text or as a number fails, as it failed in the original builder, which read the list by reference.
	 *
	 * @dataProvider scalarProvider
	 *
	 * @param mixed $value The stored height.
	 *
	 * @return void
	 */
	public function testScalarHeightFails( $value ): void {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/countup/loader.php';

		$this->expectException( Error::class );

		$this->write_section( new Kadence_Blocks_Countup_Number_Height_Css( 1 ), [ 'numberMinHeight' => $value ], 'abc', self::SELECTOR );
	}

	/**
	 * @return Generator
	 */
	public function scalarProvider(): Generator {
		yield 'text' => [ 'value' => 'tall' ];
		yield 'number' => [ 'value' => 5 ];
	}

	/**
	 * The condition is met or not for the attributes.
	 *
	 * @dataProvider conditionProvider
	 *
	 * @param Kadence_Blocks_Css_Input_Condition $condition  The condition under test.
	 * @param array<string, mixed>               $attributes The block attributes.
	 * @param bool                               $expected   Whether the condition is met.
	 *
	 * @return void
	 */
	public function testCondition( Kadence_Blocks_Css_Input_Condition $condition, array $attributes, bool $expected ): void {
		$this->assertSame( $expected, $condition->is_met( $this->input( $attributes, new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * @return Generator
	 */
	public function conditionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/countup/loader.php';

		$height = new Kadence_Blocks_Countup_Min_Height_Condition( 'height' );
		$font   = new Kadence_Blocks_Countup_Font_Condition( 'font' );

		yield 'a list with a first item has a height' => [
			'condition'  => $height,
			'attributes' => [ 'height' => [ 0 ] ],
			'expected'   => true,
		];
		yield 'a list without a first item has no height' => [
			'condition'  => $height,
			'attributes' => [ 'height' => [ 1 => 5 ] ],
			'expected'   => false,
		];
		yield 'a list that starts with null has no height' => [
			'condition'  => $height,
			'attributes' => [ 'height' => [ null, 5 ] ],
			'expected'   => false,
		];
		yield 'text has no height' => [
			'condition'  => $height,
			'attributes' => [ 'height' => 'abc' ],
			'expected'   => false,
		];
		yield 'a missing attribute has no height' => [
			'condition'  => $height,
			'attributes' => [],
			'expected'   => false,
		];
		yield 'a list of lists has a font' => [
			'condition'  => $font,
			'attributes' => [ 'font' => [ [ 'size' => 1 ] ] ],
			'expected'   => true,
		];
		yield 'a list of an empty list has a font' => [
			'condition'  => $font,
			'attributes' => [ 'font' => [ [] ] ],
			'expected'   => true,
		];
		yield 'a list of text has no font' => [
			'condition'  => $font,
			'attributes' => [ 'font' => [ 'x' ] ],
			'expected'   => false,
		];
		yield 'text has no font' => [
			'condition'  => $font,
			'attributes' => [ 'font' => 'abc' ],
			'expected'   => false,
		];
		yield 'a missing font has no font' => [
			'condition'  => $font,
			'attributes' => [],
			'expected'   => false,
		];
	}
}
