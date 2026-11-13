<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Sections;

use Generator;
use Kadence_Blocks_Css_Item_Value_Section;
use Kadence_Blocks_Css_Numeric_Attribute_Condition;
use Kadence_Blocks_Css_Numeric_Unit_Section;
use Kadence_Blocks_Css_Section;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The generic numeric and list item sections and the numeric condition.
 */
final class NumericSectionsTest extends Free_Section_Test_Case {

	/**
	 * A numeric section writes the CSS expected for the attributes.
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
		$this->assertSameCss( $expected, $this->write_section( $section, $attributes, 'abc', '.box' ) );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';

		yield 'a number gets the unit' => [
			'section'    => new Kadence_Blocks_Css_Numeric_Unit_Section( 'height', 'size', 'px' ),
			'attributes' => [ 'size' => 12 ],
			'expected'   => '.box{height:12px;}',
		];
		yield 'a numeric text gets the unit' => [
			'section'    => new Kadence_Blocks_Css_Numeric_Unit_Section( 'height', 'size', 'em' ),
			'attributes' => [ 'size' => '1.5' ],
			'expected'   => '.box{height:1.5em;}',
		];
		yield 'zero is a number' => [
			'section'    => new Kadence_Blocks_Css_Numeric_Unit_Section( 'height', 'size', 'px' ),
			'attributes' => [ 'size' => 0 ],
			'expected'   => '.box{height:0px;}',
		];
		yield 'text that is not a number writes nothing' => [
			'section'    => new Kadence_Blocks_Css_Numeric_Unit_Section( 'height', 'size', 'px' ),
			'attributes' => [ 'size' => 'big' ],
			'expected'   => '',
		];
		yield 'a missing attribute writes nothing' => [
			'section'    => new Kadence_Blocks_Css_Numeric_Unit_Section( 'height', 'size', 'px' ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'an item of a list is read by its index' => [
			'section'    => new Kadence_Blocks_Css_Numeric_Unit_Section( 'height', 'sizes', 'px', 1 ),
			'attributes' => [ 'sizes' => [ 5, 6, 7 ] ],
			'expected'   => '.box{height:6px;}',
		];
		yield 'a missing item writes nothing' => [
			'section'    => new Kadence_Blocks_Css_Numeric_Unit_Section( 'height', 'sizes', 'px', 2 ),
			'attributes' => [ 'sizes' => [ 5 ] ],
			'expected'   => '',
		];
		yield 'an item of a list is written as it is stored' => [
			'section'    => new Kadence_Blocks_Css_Item_Value_Section( 'text-align', 'aligns', 1 ),
			'attributes' => [ 'aligns' => [ 'left', 'center' ] ],
			'expected'   => '.box{text-align:center;}',
		];
		yield 'an empty item writes nothing' => [
			'section'    => new Kadence_Blocks_Css_Item_Value_Section( 'text-align', 'aligns', 0 ),
			'attributes' => [ 'aligns' => [ '', 'center' ] ],
			'expected'   => '',
		];
		yield 'a missing list writes nothing to the item' => [
			'section'    => new Kadence_Blocks_Css_Item_Value_Section( 'text-align', 'aligns', 0 ),
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * The condition is met when the attribute is a number.
	 *
	 * @dataProvider conditionProvider
	 *
	 * @param mixed $value    The stored value.
	 * @param bool  $expected Whether the condition is met.
	 *
	 * @return void
	 */
	public function testCondition( $value, bool $expected ): void {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';

		$condition = new Kadence_Blocks_Css_Numeric_Attribute_Condition( 'size' );

		$this->assertSame( $expected, $condition->is_met( $this->input( [ 'size' => $value ], new \Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * @return Generator
	 */
	public function conditionProvider(): Generator {
		yield 'an integer' => [
			'value'    => 3,
			'expected' => true,
		];
		yield 'a numeric text' => [
			'value'    => '3.5',
			'expected' => true,
		];
		yield 'text' => [
			'value'    => 'x',
			'expected' => false,
		];
		yield 'an empty text' => [
			'value'    => '',
			'expected' => false,
		];
		yield 'null' => [
			'value'    => null,
			'expected' => false,
		];
	}
}
