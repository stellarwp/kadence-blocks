<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Sections;

use Generator;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Context_Post_Attributes;
use Kadence_Blocks_Css_Post_Attributes;
use Kadence_Blocks_Css_Range_Section;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The generic sections the icon blocks and the blocks of saved posts share.
 */
final class RangeAndPostAttributesSectionsTest extends Free_Section_Test_Case {

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
	}

	/**
	 * A range is written with its unit, which is the saved number as it is.
	 *
	 * @dataProvider rangeProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $unit       The unit of the range.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testRange( array $attributes, string $unit, string $expected ): void {
		$section = new Kadence_Blocks_Css_Range_Section( 'borderWidth', 'border-width', $unit );

		$this->assertSameCss( $expected, $this->write_section( $section, $attributes, 'abc', '.s' ) );
	}

	/**
	 * @return Generator
	 */
	public function rangeProvider(): Generator {
		yield 'a range in pixels' => [
			'attributes' => [ 'borderWidth' => 2 ],
			'unit'       => 'px',
			'expected'   => '.s{border-width:2px;}',
		];

		yield 'a range in percent' => [
			'attributes' => [ 'borderWidth' => '25' ],
			'unit'       => '%',
			'expected'   => '.s{border-width:25%;}',
		];

		yield 'a range of zero is written' => [
			'attributes' => [ 'borderWidth' => 0 ],
			'unit'       => 'px',
			'expected'   => '.s{border-width:0px;}',
		];

		yield 'a range that is not saved is not written' => [
			'attributes' => [],
			'unit'       => 'px',
			'expected'   => '',
		];
	}

	/**
	 * The attributes of a post are asked from the block, with the post type and the prefix of its meta keys.
	 *
	 * @return void
	 */
	public function testPostAttributesAreAskedFromTheBlock(): void {
		$asked   = [];
		$context = new Kadence_Blocks_Css_Block_Context(
			'header',
			static function ( ...$arguments ) use ( &$asked ) {
				$asked = $arguments;

				return [ 'margin' => [ 1 ] ];
			}
		);
		$source  = new Kadence_Blocks_Css_Context_Post_Attributes( $context, 'kadence_header', '_kad_header_' );

		$this->assertInstanceOf( Kadence_Blocks_Css_Post_Attributes::class, $source );
		$this->assertSame( [ 'margin' => [ 1 ] ], $source->for_post( 42 ) );
		$this->assertSame( [ 'get_attributes_with_defaults_cpt', 42, 'kadence_header', '_kad_header_' ], $asked );
	}
}
