<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Sections;

use Generator;
use Kadence_Blocks_Css_Attribute_Section;
use Kadence_Blocks_Css_Item_Value_Section;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Css_Unit_Measure_Range_Section;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The generic sections that write an attribute, an item of a list with a unit and a range with a unit of its own.
 */
final class ValueSectionsTest extends Free_Section_Test_Case {

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
		$this->assertSameCss( $expected, $this->write_section( $section, $attributes, 'abc', '.box' ) );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';

		yield from $this->attributeProvider();
		yield from $this->itemProvider();
		yield from $this->rangeProvider();
	}

	/**
	 * @return Generator
	 */
	private function attributeProvider(): Generator {
		yield 'an attribute is written as it is stored' => [
			'section'    => new Kadence_Blocks_Css_Attribute_Section( 'background', 'gradient' ),
			'attributes' => [ 'gradient' => 'linear-gradient(red,blue)' ],
			'expected'   => '.box{background:linear-gradient(red,blue);}',
		];
		yield 'a missing attribute writes nothing' => [
			'section'    => new Kadence_Blocks_Css_Attribute_Section( 'background', 'gradient' ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'an empty attribute writes nothing' => [
			'section'    => new Kadence_Blocks_Css_Attribute_Section( 'background', 'gradient' ),
			'attributes' => [ 'gradient' => '' ],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function itemProvider(): Generator {
		yield 'an item with a unit' => [
			'section'    => new Kadence_Blocks_Css_Item_Value_Section( 'font-size', 'sizes', 1, 'px' ),
			'attributes' => [ 'sizes' => [ 10, 20 ] ],
			'expected'   => '.box{font-size:20px;}',
		];
		yield 'an empty item with a unit writes nothing' => [
			'section'    => new Kadence_Blocks_Css_Item_Value_Section( 'font-size', 'sizes', 0, 'px' ),
			'attributes' => [ 'sizes' => [ 0, 20 ] ],
			'expected'   => '',
		];
		yield 'a missing item with a unit writes nothing' => [
			'section'    => new Kadence_Blocks_Css_Item_Value_Section( 'font-size', 'sizes', 2, 'px' ),
			'attributes' => [ 'sizes' => [ 10 ] ],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function rangeProvider(): Generator {
		yield 'a range is written in the unit of its own attribute' => [
			'section'    => new Kadence_Blocks_Css_Unit_Measure_Range_Section( 'radius', 'border-radius', 'radiusUnit' ),
			'attributes' => [
				'radius'     => [ 1, 2, 3, 4 ],
				'radiusUnit' => 'em',
			],
			'expected'   => '.box{border-top-left-radius:1em;border-top-right-radius:2em;border-bottom-right-radius:3em;border-bottom-left-radius:4em;}',
		];
		yield 'a range without a unit is written without one, as the null unit replaces the default one' => [
			'section'    => new Kadence_Blocks_Css_Unit_Measure_Range_Section( 'radius', 'border-radius', 'radiusUnit' ),
			'attributes' => [ 'radius' => [ 1, 2, 3, 4 ] ],
			'expected'   => '.box{border-top-left-radius:1;border-top-right-radius:2;border-bottom-right-radius:3;border-bottom-left-radius:4;}',
		];
		yield 'a missing range writes nothing' => [
			'section'    => new Kadence_Blocks_Css_Unit_Measure_Range_Section( 'radius', 'border-radius', 'radiusUnit' ),
			'attributes' => [],
			'expected'   => '',
		];
	}
}
