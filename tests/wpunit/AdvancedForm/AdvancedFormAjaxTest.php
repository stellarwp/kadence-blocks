<?php

namespace Tests\wpunit\AdvancedForm;

use Codeception\TestCase\WPTestCase;
use KB_Ajax_Advanced_Form;

class AdvancedFormAjaxTest extends WPTestCase {

	/**
	 * @var KB_Ajax_Advanced_Form
	 */
	protected $adv_form_ajax;

	public function testActionWasAdded() {
		$this->assertIsInt( has_action( 'wp_ajax_kb_process_advanced_form_submit',
			[ $this->adv_form_ajax, 'process_ajax' ] ) );
		$this->assertIsInt( has_action( 'wp_ajax_nopriv_kb_process_advanced_form_submit',
			[ $this->adv_form_ajax, 'process_ajax' ] ) );
	}

	public function testProcessMissingRequiredField() {
		$mockedForm = $this->getMockBuilder( KB_Ajax_Advanced_Form::class )
		                   ->onlyMethods( [ 'process_bail' ] )
		                   ->getMock();

		$fields = [
			[
				'inputName' => 'field1',
				'uniqueID'  => 1,
				'required'  => true,
			],
		];
		$_POST  = []; // $_POST doesn't contain required field

		$mockedForm->expects( $this->once() )
		           ->method( 'process_bail' )->with(
				$this->equalTo( 'Submission Failed' ),
				$this->equalTo( 'Missing a required field' )
			);

		$mockedForm->process_fields( $fields );
	}

	public function testProcessMissingRequiredFieldWithCustomRequireMessage() {
		$mockedForm = $this->getMockBuilder( KB_Ajax_Advanced_Form::class )
		                   ->onlyMethods( [ 'process_bail' ] )
		                   ->getMock();

		$fields = [
			[
				'inputName'        => 'field1',
				'uniqueID'         => 1,
				'required'         => true,
				'required_message' => 'My custom require message',
			],
		];
		$_POST  = []; // $_POST doesn't contain required field

		$mockedForm->expects( $this->once() )
		           ->method( 'process_bail' )->with(
				$this->equalTo( 'Submission Failed' ),
				$this->equalTo( 'My custom require message' )
			);

		$mockedForm->process_fields( $fields );
	}

	public function testAllowMissingRequiredFieldIfConditional() {
		$mockedForm = $this->getMockBuilder( KB_Ajax_Advanced_Form::class )
		                   ->onlyMethods( [ 'process_bail' ] )
		                   ->getMock();

		$fields = [
			[
				'inputName'               => 'field1',
				'uniqueID'                => 1,
				'required'                => true,
				'kadenceFieldConditional' => [
					'conditionalData' => [
						'enable' => true,
					],
				],
			],
		];
		$_POST  = []; // $_POST doesn't contain required field

		$mockedForm->expects( $this->never() )->method( 'process_bail' );

		$mockedForm->process_fields( $fields );
	}

	public function testFailIfRequiredAndSanitizedValueIsEmpty() {
		$mockedForm = $this->getMockBuilder( KB_Ajax_Advanced_Form::class )
		                   ->onlyMethods( [ 'process_bail' ] )
		                   ->getMock();

		$fields = [
			[
				'inputName' => 'field1',
				'uniqueID'  => 1,
				'type'      => 'text',
				'required'  => true,
			],
		];
		$_POST  = [
			'field1' => '<h1></h1>', // Sanitized value will be ''
		];

		$mockedForm->expects( $this->once() )
		           ->method( 'process_bail' )->with(
				$this->equalTo( 'Submission Failed' ),
				$this->equalTo( 'Missing a required field' )
			);

		$mockedForm->process_fields( $fields );
	}

	public function testFailIfRequireNumberIsNotNumeric() {
		$mockedForm = $this->getMockBuilder( KB_Ajax_Advanced_Form::class )
		                   ->onlyMethods( [ 'process_bail' ] )
		                   ->getMock();

		$fields = [
			[
				'inputName' => 'field1',
				'uniqueID'  => 1,
				'type'      => 'number',
				'required'  => true,
			],
		];
		$_POST  = [
			'field1' => 'test',
		];

		$mockedForm->expects( $this->once() )
		           ->method( 'process_bail' )->with(
				$this->equalTo( 'Submission Failed' ),
				$this->equalTo( 'Missing a required field' )
			);

		$mockedForm->process_fields( $fields );
	}

	public function testAllowZeroAsValidInput() {
		$mockedForm = $this->getMockBuilder(KB_Ajax_Advanced_Form::class)
		                   ->onlyMethods(['process_bail'])
		                   ->getMock();

		$fields = [
			[
				'inputName' => 'field1',
				'uniqueID'  => 1,
				'type'      => 'text',
				'required'  => true,
			],
		];
		$_POST = [
			'field1' => '0',  // Submit "0" as the value
		];

		// We expect process_bail to never be called since "0" should be considered valid input
		$mockedForm->expects($this->never())
		           ->method('process_bail');

		$processed_fields = $mockedForm->process_fields($fields);

		// Verify the processed field contains the "0" value
		$this->assertIsArray($processed_fields);
		$this->assertCount(1, $processed_fields);
		$this->assertEquals('0', $processed_fields[0]['value']);
	}

	public function testAllowZeroAsValidNumberInput() {
		$mockedForm = $this->getMockBuilder(KB_Ajax_Advanced_Form::class)
		                   ->onlyMethods(['process_bail'])
		                   ->getMock();

		$fields = [
			[
				'inputName' => 'field1',
				'uniqueID'  => 1,
				'type'      => 'number',
				'required'  => true,
			],
		];
		$_POST = [
			'field1' => '0',  // Submit "0" as the value
		];

		// We expect process_bail to never be called since "0" is a valid number
		$mockedForm->expects($this->never())
		           ->method('process_bail');

		$processed_fields = $mockedForm->process_fields($fields);

		// Verify the processed field contains the "0" value
		$this->assertIsArray($processed_fields);
		$this->assertCount(1, $processed_fields);
		$this->assertEquals('0', $processed_fields[0]['value']);
	}

	protected function setUp(): void {
		parent::setUp();

		$this->adv_form_ajax = new KB_Ajax_Advanced_Form();
	}

	protected function _after() {
	}
}
