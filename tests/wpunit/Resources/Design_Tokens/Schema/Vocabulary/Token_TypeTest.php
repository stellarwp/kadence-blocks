<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Schema\Vocabulary;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;
use Tests\Support\Classes\TestCase;

final class Token_TypeTest extends TestCase {

	/**
	 * The v1 $type vocabulary is the scalar types (color, dimension, fontFamily and the text-style
	 * scalars) plus the shadow composite — there is no typography composite.
	 *
	 * @return void
	 */
	public function testItListsTheV1Types(): void {
		$this->assertSame(
			[ 'color', 'dimension', 'fontFamily', 'fontWeight', 'lineHeight', 'fontStyle', 'textTransform', 'borderStyle', 'shadow' ],
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
		yield 'fontWeight' => [ 'type' => 'fontWeight' ];
		yield 'lineHeight' => [ 'type' => 'lineHeight' ];
		yield 'fontStyle' => [ 'type' => 'fontStyle' ];
		yield 'textTransform' => [ 'type' => 'textTransform' ];
		yield 'borderStyle' => [ 'type' => 'borderStyle' ];
		yield 'shadow' => [ 'type' => 'shadow' ];
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
	 * Shadow is the only composite type; every scalar type (including the text-style scalars) is not.
	 *
	 * @return void
	 */
	public function testOnlyCompositeTypesReportComposite(): void {
		$this->assertTrue( Token_Type::is_composite( Token_Type::get_type_shadow() ) );
		$this->assertFalse( Token_Type::is_composite( Token_Type::get_type_color() ) );
		$this->assertFalse( Token_Type::is_composite( Token_Type::get_type_dimension() ) );
		$this->assertFalse( Token_Type::is_composite( Token_Type::get_type_font_family() ) );
		$this->assertFalse( Token_Type::is_composite( Token_Type::get_type_font_weight() ) );
		$this->assertFalse( Token_Type::is_composite( Token_Type::get_type_text_transform() ) );
		$this->assertFalse( Token_Type::is_composite( Token_Type::get_type_border_style() ) );
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
	 * A scalar type has no composite sub-fields.
	 *
	 * @return void
	 */
	public function testNonCompositeTypesHaveNoFields(): void {
		$this->assertSame( [], Token_Type::composite_fields( Token_Type::get_type_color() ) );
		$this->assertSame( [], Token_Type::composite_fields( Token_Type::get_type_font_weight() ) );
	}
}
