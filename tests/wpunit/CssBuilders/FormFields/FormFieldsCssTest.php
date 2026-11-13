<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\FormFields;

use Generator;
use Tests\wpunit\CssBuilders\Entry_Build_Test_Case;

/**
 * The CSS of the blocks that are a field of the advanced form: each limits the width of its field.
 */
final class FormFieldsCssTest extends Entry_Build_Test_Case {

	private const FIELD = '.wp-block-kadence-advanced-form .kb-fieldformu1';

	private const MOBILE = '@media all and (max-width: 767px)';

	/**
	 * Load the builders.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		foreach ( self::BUILDERS as $file ) {
			require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-' . $file . '-css.php';
		}
	}

	/**
	 * The builders of the fields, by the name of the block, with the file of the builder.
	 *
	 * @var array<string, string>
	 */
	private const BUILDERS = [
		'Kadence_Blocks_Text_Input_Css'      => 'text-input',
		'Kadence_Blocks_Textarea_Input_Css'  => 'textarea-input',
		'Kadence_Blocks_Email_Input_Css'     => 'email-input',
		'Kadence_Blocks_Date_Input_Css'      => 'date-input',
		'Kadence_Blocks_Number_Input_Css'    => 'number-input',
		'Kadence_Blocks_Telephone_Input_Css' => 'telephone-input',
		'Kadence_Blocks_Time_Input_Css'      => 'time-input',
		'Kadence_Blocks_Accept_Css'          => 'accept',
		'Kadence_Blocks_Checkbox_Css'        => 'checkbox',
		'Kadence_Blocks_Radio_Css'           => 'radio',
		'Kadence_Blocks_Select_Css'          => 'select',
		'Kadence_Blocks_File_Css'            => 'file',
		'Kadence_Blocks_Captcha_Css'         => 'captcha',
	];

	/**
	 * The CSS of a field is the width limits of the field, on the class id that the form saved for it.
	 *
	 * @dataProvider builderProvider
	 *
	 * @param string $builder The class of the builder.
	 *
	 * @return void
	 */
	public function testFieldWidths( string $builder ): void {
		$attributes = [
			'uniqueID'     => 'u1',
			'formID'       => 'form',
			'maxWidth'     => [ 100, '', 50 ],
			'maxWidthUnit' => '%',
			'minWidth'     => [ 10 ],
			'minWidthUnit' => 'em',
		];

		$this->assertSameCss(
			self::FIELD . '{max-width:100%;min-width:10em;}' . self::MOBILE . '{' . self::FIELD . '{max-width:50%;}}',
			$this->build_entry( $builder, 'field', $attributes, $this->bridge() )
		);
	}

	/**
	 * A field without widths has no CSS.
	 *
	 * @dataProvider builderProvider
	 *
	 * @param string $builder The class of the builder.
	 *
	 * @return void
	 */
	public function testFieldWithoutWidths( string $builder ): void {
		$this->assertSameCss( '', $this->build_entry( $builder, 'field', [ 'uniqueID' => 'u1' ], $this->bridge() ) );
	}

	/**
	 * The captcha hides the badge of the recaptcha when it is asked to, and only then.
	 *
	 * @dataProvider badgeProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testCaptchaBadge( array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->build_entry( 'Kadence_Blocks_Captcha_Css', 'captcha', $attributes + [ 'uniqueID' => 'u1' ], $this->bridge() ) );
	}

	/**
	 * The builders of the fields.
	 *
	 * @return Generator
	 */
	public function builderProvider(): Generator {
		foreach ( array_keys( self::BUILDERS ) as $builder ) {
			yield $builder => [ 'builder' => $builder ];
		}
	}

	/**
	 * The captchas and the CSS they get.
	 *
	 * @return Generator
	 */
	public function badgeProvider(): Generator {
		yield 'a captcha that hides the badge' => [
			'attributes' => [ 'hideRecaptcha' => true ],
			'expected'   => '.grecaptcha-badge{visibility:hidden;}',
		];

		yield 'a captcha that shows the badge' => [
			'attributes' => [ 'hideRecaptcha' => false ],
			'expected'   => '',
		];

		yield 'a captcha that hides the badge and limits its width' => [
			'attributes' => [
				'hideRecaptcha' => 1,
				'minWidth'      => [ 5 ],
			],
			'expected'   => '.wp-block-kadence-advanced-form .kb-fieldu1{min-width:5px;}.grecaptcha-badge{visibility:hidden;}',
		];
	}

	/**
	 * A fake block that makes the class id of the field as the real block does.
	 *
	 * @return callable
	 */
	private function bridge(): callable {
		return static function ( string $member, array $attributes = [] ) {
			return 'class_id' === $member ? ( $attributes['formID'] ?? '' ) . $attributes['uniqueID'] : null;
		};
	}
}
