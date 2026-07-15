<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Schema\Vocabulary;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;
use Tests\Support\Classes\TestCase;

final class Token_TypeTest extends TestCase {

	/**
	 * @return void
	 */
	public function testItListsTheV1Types(): void {
		$this->assertSame(
			[ 'color', 'dimension', 'fontFamily', 'shadow', 'typography' ],
			Token_Type::all()
		);
	}

	/**
	 * @dataProvider validTypeProvider
	 *
	 * @param string $type
	 *
	 * @return void
	 */
	public function testItAcceptsKnownTypes( string $type ): void {
		$this->assertTrue( Token_Type::is_valid( $type ) );
	}

	/**
	 * @return Generator
	 */
	public function validTypeProvider(): Generator {
		yield 'color' => [ 'type' => 'color' ];
		yield 'dimension' => [ 'type' => 'dimension' ];
		yield 'fontFamily' => [ 'type' => 'fontFamily' ];
		yield 'shadow' => [ 'type' => 'shadow' ];
		yield 'typography' => [ 'type' => 'typography' ];
	}

	/**
	 * @dataProvider invalidTypeProvider
	 *
	 * @param string $type
	 *
	 * @return void
	 */
	public function testItRejectsUnknownTypes( string $type ): void {
		$this->assertFalse( Token_Type::is_valid( $type ) );
	}

	/**
	 * @return Generator
	 */
	public function invalidTypeProvider(): Generator {
		yield 'empty' => [ 'type' => '' ];
		yield 'capitalized' => [ 'type' => 'Color' ];
		yield 'number' => [ 'type' => 'number' ];
		yield 'icon size' => [ 'type' => 'iconSize' ];
		yield 'border' => [ 'type' => 'border' ];
	}

	/**
	 * @return void
	 */
	public function testOnlyCompositeTypesReportComposite(): void {
		$this->assertTrue( Token_Type::is_composite( Token_Type::get_type_shadow() ) );
		$this->assertTrue( Token_Type::is_composite( Token_Type::get_type_typography() ) );
		$this->assertFalse( Token_Type::is_composite( Token_Type::get_type_color() ) );
		$this->assertFalse( Token_Type::is_composite( Token_Type::get_type_dimension() ) );
		$this->assertFalse( Token_Type::is_composite( Token_Type::get_type_font_family() ) );
	}

	/**
	 * @return void
	 */
	public function testShadowFieldsMapToTheirKinds(): void {
		$this->assertSame(
			[
				'color'   => 'color',
				'offsetX' => 'dimension',
				'offsetY' => 'dimension',
				'blur'    => 'dimension',
				'spread'  => 'dimension',
			],
			Token_Type::composite_fields( Token_Type::get_type_shadow() )
		);
	}

	/**
	 * Typography requires only fontFamily; the other text-style properties are optional.
	 *
	 * @return void
	 */
	public function testTypographyFieldsMapToTheirKinds(): void {
		$this->assertSame(
			[
				'fontFamily' => 'fontFamily',
			],
			Token_Type::composite_fields( Token_Type::get_type_typography() )
		);
	}

	/**
	 * Typography's optional sub-fields map to their kinds so a token may carry any of them.
	 *
	 * @return void
	 */
	public function testTypographyOptionalFieldsMapToTheirKinds(): void {
		$this->assertSame(
			[
				'fontSize'      => 'dimension',
				'fontWeight'    => 'fontWeight',
				'lineHeight'    => 'lineHeight',
				'fontStyle'     => 'fontStyle',
				'textTransform' => 'textTransform',
				'letterSpacing' => 'dimension',
			],
			Token_Type::optional_composite_fields( Token_Type::get_type_typography() )
		);
	}

	/**
	 * A non-composite type has no required and no optional sub-fields.
	 *
	 * @return void
	 */
	public function testNonCompositeTypesHaveNoFields(): void {
		$this->assertSame( [], Token_Type::composite_fields( Token_Type::get_type_color() ) );
		$this->assertSame( [], Token_Type::optional_composite_fields( Token_Type::get_type_color() ) );
	}
}
