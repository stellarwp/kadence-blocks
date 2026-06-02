<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Schema\Validation\Values;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Validation_Error;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Color_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Dimension_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Font_Family_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Shadow_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Typography_Value;
use Tests\Support\Classes\TestCase;

final class Value_ValidatorsTest extends TestCase {

	public function testColorAcceptsLiteralAndAlias(): void {
		$validator = new Color_Value();

		$this->assertSame( [], $validator->validate( '#3182CE', 'p.$value' ) );
		$this->assertSame( [], $validator->validate( '{primitive.color.brand.primary}', 'p.$value' ) );
	}

	public function testColorRejectsBadLiteralWithValueInvalid(): void {
		$errors = ( new Color_Value() )->validate( 'not-a-color', 'p.x.$value' );

		$this->assertCount( 1, $errors );
		$this->assertSame( Validation_Error::get_code_value_invalid(), $errors[0]->code );
		$this->assertSame( 'p.x.$value', $errors[0]->path );
	}

	public function testColorRejectsMalformedAliasWithAliasMalformed(): void {
		$errors = ( new Color_Value() )->validate( '{bad path}', 'p.x.$value' );

		$this->assertCount( 1, $errors );
		$this->assertSame( Validation_Error::get_code_alias_malformed(), $errors[0]->code );
	}

	public function testDimensionAcceptsLiteralAndAlias(): void {
		$validator = new Dimension_Value();

		$this->assertSame( [], $validator->validate( '0.5rem', 'p.$value' ) );
		$this->assertSame( [], $validator->validate( '0', 'p.$value' ) );
		$this->assertSame( [], $validator->validate( '{primitive.dimension.space.md}', 'p.$value' ) );
	}

	public function testFontFamilyAcceptsArrayAndAlias(): void {
		$validator = new Font_Family_Value();

		$this->assertSame( [], $validator->validate( [ 'Inter', 'system-ui', 'sans-serif' ], 'p.$value' ) );
		$this->assertSame( [], $validator->validate( '{primitive.fontFamily.sans}', 'p.$value' ) );
	}

	public function testFontFamilyRejectsEmptyArray(): void {
		$errors = ( new Font_Family_Value() )->validate( [], 'p.$value' );

		$this->assertCount( 1, $errors );
		$this->assertSame( Validation_Error::get_code_value_invalid(), $errors[0]->code );
	}

	public function testShadowAcceptsWholeAlias(): void {
		$this->assertSame( [], ( new Shadow_Value() )->validate( '{semantic.shadow.card}', 'p.$value' ) );
	}

	public function testShadowAcceptsObjectWithAliasedSubField(): void {
		$value = [
			'color'   => '{primitive.color.neutral.900}',
			'offsetX' => '0px',
			'offsetY' => '2px',
			'blur'    => '8px',
			'spread'  => '0px',
		];

		$this->assertSame( [], ( new Shadow_Value() )->validate( $value, 's.$value' ) );
	}

	public function testShadowReportsMissingAndUnknownSubFields(): void {
		$value = [
			'color'   => '#000',
			'offsetX' => '0px',
			'offsetY' => '0px',
			'blur'    => '1px',
			'bogus'   => 'x',
		];

		$errors = ( new Shadow_Value() )->validate( $value, 's.$value' );
		$codes  = array_map(
			static function ( Validation_Error $e ): string {
				return $e->code;
			},
			$errors
		);

		$this->assertContains( Validation_Error::get_code_composite_field_missing(), $codes );
		$this->assertContains( Validation_Error::get_code_composite_field_unknown(), $codes );
	}

	public function testShadowSubFieldPathIsDotted(): void {
		$value = [
			'color'   => 'not-a-color',
			'offsetX' => '0px',
			'offsetY' => '0px',
			'blur'    => '1px',
			'spread'  => '0px',
		];

		$errors = ( new Shadow_Value() )->validate( $value, 'semantic.shadow.card.$value' );

		$this->assertCount( 1, $errors );
		$this->assertSame( 'semantic.shadow.card.$value.color', $errors[0]->path );
		$this->assertSame( Validation_Error::get_code_value_invalid(), $errors[0]->code );
	}

	public function testShadowRejectsNonObjectLiteral(): void {
		$errors = ( new Shadow_Value() )->validate( 5, 's.$value' );

		$this->assertCount( 1, $errors );
		$this->assertSame( Validation_Error::get_code_malformed_node(), $errors[0]->code );
	}

	public function testTypographyAcceptsMixedLiteralsAndAliases(): void {
		$value = [
			'fontFamily' => '{primitive.fontFamily.sans}',
			'fontSize'   => '{primitive.fontSize.2xl}',
			'fontWeight' => 700,
			'lineHeight' => 1.2,
		];

		$this->assertSame( [], ( new Typography_Value() )->validate( $value, 't.$value' ) );
	}

	public function testTypographyRejectsBadWeight(): void {
		$value = [
			'fontFamily' => '{primitive.fontFamily.sans}',
			'fontSize'   => '1rem',
			'fontWeight' => 'heavy',
			'lineHeight' => 1.5,
		];

		$errors = ( new Typography_Value() )->validate( $value, 't.$value' );

		$this->assertCount( 1, $errors );
		$this->assertSame( 't.$value.fontWeight', $errors[0]->path );
		$this->assertSame( Validation_Error::get_code_value_invalid(), $errors[0]->code );
	}
}
