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

	protected function setUp(): void {
		parent::setUp();

		$this->adv_form_ajax = new KB_Ajax_Advanced_Form();
	}

	protected function _after() {
	}
}
