<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Schema\Validation\Values;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Validation_Error;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Border_Style_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Color_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Dimension_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Font_Family_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Font_Style_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Font_Weight_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Line_Height_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Shadow_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Values\Text_Transform_Value;
use Tests\Support\Classes\TestCase;

final class Value_ValidatorsTest extends TestCase {

	/**
	 * @return void
	 */
	public function testColorAcceptsLiteralAndAlias(): void {
		$validator = new Color_Value();

		$this->assertSame( [], $validator->validate( '#3182CE', 'p.$value' ) );
		$this->assertSame( [], $validator->validate( '{primitive.color.brand.primary}', 'p.$value' ) );
	}

	/**
	 * @return void
	 */
	public function testColorRejectsBadLiteralWithValueInvalid(): void {
		$errors = ( new Color_Value() )->validate( 'not-a-color', 'p.x.$value' );

		$this->assertCount( 1, $errors );
		$this->assertSame( Validation_Error::get_code_value_invalid(), $errors[0]->code );
		$this->assertSame( 'p.x.$value', $errors[0]->path );
	}

	/**
	 * @return void
	 */
	public function testColorRejectsMalformedAliasWithAliasMalformed(): void {
		$errors = ( new Color_Value() )->validate( '{bad path}', 'p.x.$value' );

		$this->assertCount( 1, $errors );
		$this->assertSame( Validation_Error::get_code_alias_malformed(), $errors[0]->code );
	}

	/**
	 * @return void
	 */
	public function testDimensionAcceptsLiteralAndAlias(): void {
		$validator = new Dimension_Value();

		$this->assertSame( [], $validator->validate( '0.5rem', 'p.$value' ) );
		$this->assertSame( [], $validator->validate( '0', 'p.$value' ) );
		$this->assertSame( [], $validator->validate( '{primitive.dimension.space.md}', 'p.$value' ) );
	}

	/**
	 * @return void
	 */
	public function testFontFamilyAcceptsArrayAndAlias(): void {
		$validator = new Font_Family_Value();

		$this->assertSame( [], $validator->validate( [ 'Inter', 'system-ui', 'sans-serif' ], 'p.$value' ) );
		$this->assertSame( [], $validator->validate( '{primitive.fontFamily.sans}', 'p.$value' ) );
	}

	/**
	 * @return void
	 */
	public function testFontFamilyRejectsEmptyArray(): void {
		$errors = ( new Font_Family_Value() )->validate( [], 'p.$value' );

		$this->assertCount( 1, $errors );
		$this->assertSame( Validation_Error::get_code_value_invalid(), $errors[0]->code );
	}

	/**
	 * @return void
	 */
	public function testShadowAcceptsWholeAlias(): void {
		$this->assertSame( [], ( new Shadow_Value() )->validate( '{semantic.shadow.card}', 'p.$value' ) );
	}

	/**
	 * @return void
	 */
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

	/**
	 * @return void
	 */
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

	/**
	 * @return void
	 */
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

	/**
	 * @return void
	 */
	public function testShadowRejectsNonObjectLiteral(): void {
		$errors = ( new Shadow_Value() )->validate( 5, 's.$value' );

		$this->assertCount( 1, $errors );
		$this->assertSame( Validation_Error::get_code_value_invalid(), $errors[0]->code );
	}

	/**
	 * A fontWeight value accepts a numeric weight, a keyword, or an alias, and rejects an out-of-range or
	 * bogus literal.
	 *
	 * @return void
	 */
	public function testFontWeightAcceptsWeightsAndRejectsBogus(): void {
		$this->assertSame( [], ( new Font_Weight_Value() )->validate( 700, 'p.$value' ) );
		$this->assertSame( [], ( new Font_Weight_Value() )->validate( 'bold', 'p.$value' ) );
		$this->assertSame( [], ( new Font_Weight_Value() )->validate( '{semantic.font-weight.control}', 'p.$value' ) );

		$errors = ( new Font_Weight_Value() )->validate( 'heavy', 'p.$value' );
		$this->assertCount( 1, $errors );
		$this->assertSame( Validation_Error::get_code_value_invalid(), $errors[0]->code );
	}

	/**
	 * A lineHeight value accepts a unit-less number, "normal", a dimension, or an alias.
	 *
	 * @return void
	 */
	public function testLineHeightAcceptsNumbersAndKeyword(): void {
		$this->assertSame( [], ( new Line_Height_Value() )->validate( 1.5, 'p.$value' ) );
		$this->assertSame( [], ( new Line_Height_Value() )->validate( 'normal', 'p.$value' ) );
		$this->assertSame( [], ( new Line_Height_Value() )->validate( '1.5rem', 'p.$value' ) );

		$errors = ( new Line_Height_Value() )->validate( 'tall', 'p.$value' );
		$this->assertCount( 1, $errors );
		$this->assertSame( Validation_Error::get_code_value_invalid(), $errors[0]->code );
	}

	/**
	 * A fontStyle value accepts the CSS keywords and rejects anything else.
	 *
	 * @return void
	 */
	public function testFontStyleAcceptsKeywords(): void {
		$this->assertSame( [], ( new Font_Style_Value() )->validate( 'italic', 'p.$value' ) );

		$errors = ( new Font_Style_Value() )->validate( 'slanted', 'p.$value' );
		$this->assertCount( 1, $errors );
		$this->assertSame( Validation_Error::get_code_value_invalid(), $errors[0]->code );
	}

	/**
	 * A textTransform value accepts the CSS keywords and rejects anything else.
	 *
	 * @return void
	 */
	public function testTextTransformAcceptsKeywords(): void {
		$this->assertSame( [], ( new Text_Transform_Value() )->validate( 'uppercase', 'p.$value' ) );

		$errors = ( new Text_Transform_Value() )->validate( 'bogus', 'p.$value' );
		$this->assertCount( 1, $errors );
		$this->assertSame( Validation_Error::get_code_value_invalid(), $errors[0]->code );
	}

	/**
	 * A borderStyle value accepts the CSS keywords and rejects anything else.
	 *
	 * @return void
	 */
	public function testBorderStyleAcceptsKeywords(): void {
		$this->assertSame( [], ( new Border_Style_Value() )->validate( 'solid', 'p.$value' ) );

		$errors = ( new Border_Style_Value() )->validate( 'bogus', 'p.$value' );
		$this->assertCount( 1, $errors );
		$this->assertSame( Validation_Error::get_code_value_invalid(), $errors[0]->code );
	}
}
