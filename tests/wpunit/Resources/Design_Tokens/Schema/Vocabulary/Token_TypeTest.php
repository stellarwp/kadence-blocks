<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Schema\Vocabulary;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;
use Tests\Support\Classes\TestCase;

final class Token_TypeTest extends TestCase {

	public function testItListsTheV1Types(): void {
		$this->assertSame(
			[ 'color', 'dimension', 'fontFamily', 'shadow', 'typography' ],
			Token_Type::all()
		);
	}

	/**
	 * @dataProvider validTypeProvider
	 */
	public function testItAcceptsKnownTypes( string $type ): void {
		$this->assertTrue( Token_Type::is_valid( $type ) );
	}

	/**
	 * @return array<int, array{0: string}>
	 */
	public function validTypeProvider(): array {
		return [ [ 'color' ], [ 'dimension' ], [ 'fontFamily' ], [ 'shadow' ], [ 'typography' ] ];
	}

	/**
	 * @dataProvider invalidTypeProvider
	 */
	public function testItRejectsUnknownTypes( string $type ): void {
		$this->assertFalse( Token_Type::is_valid( $type ) );
	}

	/**
	 * @return array<int, array{0: string}>
	 */
	public function invalidTypeProvider(): array {
		return [ [ '' ], [ 'Color' ], [ 'number' ], [ 'iconSize' ], [ 'border' ] ];
	}

	public function testOnlyCompositeTypesReportComposite(): void {
		$this->assertTrue( Token_Type::is_composite( Token_Type::get_type_shadow() ) );
		$this->assertTrue( Token_Type::is_composite( Token_Type::get_type_typography() ) );
		$this->assertFalse( Token_Type::is_composite( Token_Type::get_type_color() ) );
		$this->assertFalse( Token_Type::is_composite( Token_Type::get_type_dimension() ) );
		$this->assertFalse( Token_Type::is_composite( Token_Type::get_type_font_family() ) );
	}

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

	public function testTypographyFieldsMapToTheirKinds(): void {
		$this->assertSame(
			[
				'fontFamily' => 'fontFamily',
				'fontSize'   => 'dimension',
				'fontWeight' => 'fontWeight',
				'lineHeight' => 'lineHeight',
			],
			Token_Type::composite_fields( Token_Type::get_type_typography() )
		);
	}

	public function testNonCompositeTypesHaveNoFields(): void {
		$this->assertSame( [], Token_Type::composite_fields( Token_Type::get_type_color() ) );
	}
}
