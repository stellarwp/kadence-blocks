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

	/**
	 * The required shadow field map stays exactly the five pre-existing fields: this is the regression
	 * guard for "inset must not become required", since a required sixth field would invalidate every
	 * baseline shadow token that predates it.
	 *
	 * @return void
	 */
	public function testShadowRequiredFieldsStayExactlyTheOriginalFive(): void {
		$this->assertSame(
			[ 'color', 'offsetX', 'offsetY', 'blur', 'spread' ],
			array_keys( Token_Type::composite_fields( Token_Type::get_type_shadow() ) )
		);
	}

	/**
	 * Shadow's optional-field map carries "inset" and nothing else, so an alias/boolean check has
	 * exactly one field to apply to today.
	 *
	 * @return void
	 */
	public function testShadowOptionalFieldsContainInset(): void {
		$this->assertSame(
			[ 'inset' => 'boolean' ],
			Token_Type::optional_fields( Token_Type::get_type_shadow() )
		);
	}

	/**
	 * A non-composite type has no optional sub-fields, mirroring composite_fields()'s empty return.
	 *
	 * @return void
	 */
	public function testNonCompositeTypesHaveNoOptionalFields(): void {
		$this->assertSame( [], Token_Type::optional_fields( Token_Type::get_type_color() ) );
		$this->assertSame( [], Token_Type::optional_fields( Token_Type::get_type_font_weight() ) );
	}

	/**
	 * Every camelCase $type maps to its documented kebab id segment.
	 *
	 * @dataProvider mappedIdSegmentProvider
	 *
	 * @param string $type     The camelCase $type.
	 * @param string $expected The expected kebab id segment.
	 *
	 * @return void
	 */
	public function testGetIdSegmentMapsCamelCaseTypes( string $type, string $expected ): void {
		$this->assertSame( $expected, Token_Type::get_id_segment( $type ) );
	}

	/**
	 * @return Generator
	 */
	public function mappedIdSegmentProvider(): Generator {
		yield 'fontFamily' => [
			'type'     => Token_Type::get_type_font_family(),
			'expected' => 'font-family',
		];

		yield 'fontWeight' => [
			'type'     => Token_Type::get_type_font_weight(),
			'expected' => 'font-weight',
		];

		yield 'lineHeight' => [
			'type'     => Token_Type::get_type_line_height(),
			'expected' => 'line-height',
		];

		yield 'fontStyle' => [
			'type'     => Token_Type::get_type_font_style(),
			'expected' => 'font-style',
		];

		yield 'textTransform' => [
			'type'     => Token_Type::get_type_text_transform(),
			'expected' => 'text-transform',
		];

		yield 'borderStyle' => [
			'type'     => Token_Type::get_type_border_style(),
			'expected' => 'border-style',
		];
	}

	/**
	 * A $type already kebab-safe (or unregistered) maps to itself: get_id_segment() is an identity
	 * function outside its registered map.
	 *
	 * @dataProvider identityIdSegmentProvider
	 *
	 * @param string $type The $type under test.
	 *
	 * @return void
	 */
	public function testGetIdSegmentIsIdentityForKebabSafeTypes( string $type ): void {
		$this->assertSame( $type, Token_Type::get_id_segment( $type ) );
	}

	/**
	 * @return Generator
	 */
	public function identityIdSegmentProvider(): Generator {
		yield 'color' => [ 'type' => Token_Type::get_type_color() ];
		yield 'dimension' => [ 'type' => Token_Type::get_type_dimension() ];
		yield 'shadow' => [ 'type' => Token_Type::get_type_shadow() ];
		yield 'an unregistered type' => [ 'type' => 'bogus' ];
	}

	/**
	 * Every value get_id_segments() returns is itself a valid kebab-case id segment — the
	 * regression pin that stops a future $type from reintroducing the camelCase-id bug the mapping
	 * exists to fix.
	 *
	 * @return void
	 */
	public function testGetIdSegmentsAreAllValidKebabSegments(): void {
		foreach ( Token_Type::get_id_segments() as $segment ) {
			$this->assertMatchesRegularExpression( '/^[a-z0-9]+(-[a-z0-9]+)*$/', $segment );
		}
	}

	/**
	 * get_id_segments() maps every registered $type, in the same order as all().
	 *
	 * @return void
	 */
	public function testGetIdSegmentsMapsEveryTypeInDeclarationOrder(): void {
		$this->assertSame(
			[ 'color', 'dimension', 'font-family', 'font-weight', 'line-height', 'font-style', 'text-transform', 'border-style', 'shadow' ],
			Token_Type::get_id_segments()
		);
	}
}
