<?php

namespace Tests\wpunit\Blocks;

use Generator;
use Kadence_Blocks_Accept_Block;
use Kadence_Blocks_Checkbox_Block;
use Kadence_Blocks_Date_Input_Block;
use Kadence_Blocks_Email_Input_Block;
use Kadence_Blocks_File_Block;
use Kadence_Blocks_Hidden_Input_Block;
use Kadence_Blocks_Number_Input_Block;
use Kadence_Blocks_Radio_Block;
use Kadence_Blocks_Select_Block;
use Kadence_Blocks_Telephone_Input_Block;
use Kadence_Blocks_Text_Input_Block;
use Kadence_Blocks_Textarea_Input_Block;
use Kadence_Blocks_Time_Input_Block;
use Tests\wpunit\KadenceBlocksTestCase;
use WP_Block;

/**
 * Default values of the Advanced Form field blocks.
 */
class AdvancedFormFieldDefaultTest extends KadenceBlocksTestCase {

	/**
	 * Query parameter the fields read their default from.
	 *
	 * @var string
	 */
	private const PARAMETER = 'kb_prefill';

	/**
	 * Default value with square brackets.
	 *
	 * @var string
	 */
	private const BRACKETED_VALUE = 'Plan [A]';

	/**
	 * Tag registered for the saved default test.
	 *
	 * @var string
	 */
	private const MARKER = 'kb_test_marker';

	/**
	 * Output of the registered tag.
	 *
	 * @var string
	 */
	private const MARKER_OUTPUT = 'kb-test-marker-output';

	/**
	 * Register the test tag.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		add_shortcode( self::MARKER, static fn() => self::MARKER_OUTPUT );
	}

	/**
	 * Remove the test tag and query parameter.
	 *
	 * @return void
	 */
	protected function tearDown(): void {
		remove_shortcode( self::MARKER );
		unset( $_GET[ self::PARAMETER ] );

		parent::tearDown();
	}

	/**
	 * A default taken from the URL is output as plain text.
	 *
	 * @dataProvider outputFieldProvider
	 *
	 * @param string $field_class The field block class.
	 *
	 * @return void
	 */
	public function testUrlDefaultIsOutputAsPlainText( string $field_class ): void {
		$_GET[ self::PARAMETER ] = self::BRACKETED_VALUE;

		$html = $this->build_field( $field_class, [ 'defaultParameter' => self::PARAMETER ] );

		$this->assertStringNotContainsString( self::BRACKETED_VALUE, $html );
		$this->assertStringContainsString( self::BRACKETED_VALUE, html_entity_decode( $html ) );
	}

	/**
	 * A plain default taken from the URL is returned unchanged.
	 *
	 * @return void
	 */
	public function testPlainUrlDefaultIsUnchanged(): void {
		$value                   = 'utm-campaign-value';
		$_GET[ self::PARAMETER ] = $value;

		$default = Kadence_Blocks_Text_Input_Block::get_instance()->get_default( [ 'defaultParameter' => self::PARAMETER ] );

		$this->assertSame( $value, $default );
	}

	/**
	 * A saved default keeps its rendered output when the URL has no value for the field.
	 *
	 * @return void
	 */
	public function testSavedDefaultIsUnchanged(): void {
		$html = $this->build_field(
			Kadence_Blocks_Text_Input_Block::class,
			[
				'defaultParameter' => self::PARAMETER,
				'defaultValue'     => '[' . self::MARKER . ']',
			]
		);

		$this->assertStringContainsString( 'value="' . self::MARKER_OUTPUT . '"', $html );
	}

	/**
	 * A saved default is returned unchanged when the field has no URL parameter.
	 *
	 * @return void
	 */
	public function testSavedDefaultWithoutParameterIsUnchanged(): void {
		$default = Kadence_Blocks_Text_Input_Block::get_instance()->get_default( [ 'defaultValue' => self::BRACKETED_VALUE ] );

		$this->assertSame( self::BRACKETED_VALUE, $default );
	}

	/**
	 * A default taken from the URL still preselects the matching option.
	 *
	 * @dataProvider optionFieldProvider
	 *
	 * @param string $field_class The field block class.
	 * @param string $expected    The markup of the preselected option.
	 *
	 * @return void
	 */
	public function testUrlDefaultStillPreselectsOption( string $field_class, string $expected ): void {
		$_GET[ self::PARAMETER ] = self::BRACKETED_VALUE;

		$html = $this->build_field(
			$field_class,
			[
				'defaultParameter' => self::PARAMETER,
				'options'          => [
					[
						'label' => self::BRACKETED_VALUE,
						'value' => self::BRACKETED_VALUE,
					],
					[
						'label' => 'Plan B',
						'value' => 'Plan B',
					],
				],
			]
		);

		$this->assertStringContainsString( $expected, $html );
	}

	/**
	 * Fields that output their default value.
	 *
	 * @return Generator
	 */
	public function outputFieldProvider(): Generator {
		yield 'textarea' => [ 'field_class' => Kadence_Blocks_Textarea_Input_Block::class ];
		yield 'text' => [ 'field_class' => Kadence_Blocks_Text_Input_Block::class ];
		yield 'email' => [ 'field_class' => Kadence_Blocks_Email_Input_Block::class ];
		yield 'telephone' => [ 'field_class' => Kadence_Blocks_Telephone_Input_Block::class ];
		yield 'number' => [ 'field_class' => Kadence_Blocks_Number_Input_Block::class ];
		yield 'date' => [ 'field_class' => Kadence_Blocks_Date_Input_Block::class ];
		yield 'time' => [ 'field_class' => Kadence_Blocks_Time_Input_Block::class ];
		yield 'hidden' => [ 'field_class' => Kadence_Blocks_Hidden_Input_Block::class ];
		yield 'file' => [ 'field_class' => Kadence_Blocks_File_Block::class ];
		yield 'accept' => [ 'field_class' => Kadence_Blocks_Accept_Block::class ];
	}

	/**
	 * Fields that match their default value against options.
	 *
	 * @return Generator
	 */
	public function optionFieldProvider(): Generator {
		yield 'select' => [
			'field_class' => Kadence_Blocks_Select_Block::class,
			'expected'    => 'value="' . self::BRACKETED_VALUE . '" selected',
		];
		yield 'radio' => [
			'field_class' => Kadence_Blocks_Radio_Block::class,
			'expected'    => 'checked value="' . self::BRACKETED_VALUE . '"',
		];
		yield 'checkbox' => [
			'field_class' => Kadence_Blocks_Checkbox_Block::class,
			'expected'    => 'checked value="' . self::BRACKETED_VALUE . '"',
		];
	}

	/**
	 * Render a field block with the given attributes.
	 *
	 * @param string                                                                                                       $field_class The field block class.
	 * @param array{defaultParameter: string, defaultValue?: string, options?: list<array{label: string, value: string}>} $attributes  The block attributes.
	 *
	 * @return string The field HTML.
	 */
	private function build_field( string $field_class, array $attributes ): string {
		$attributes = array_merge(
			[
				'uniqueID'    => '1_field',
				'formID'      => '1',
				'description' => '',
			],
			$attributes
		);

		return $field_class::get_instance()->build_html( $attributes, $attributes['uniqueID'], '', new WP_Block( [ 'blockName' => 'kadence/advanced-form-field' ] ) );
	}
}
