<?php

/* cspell:ignore nopriv svgz HrEf */

namespace Tests\wpunit\AdvancedForm;

use Codeception\TestCase\WPTestCase;
use KB_Ajax_Advanced_Form;
use WP_Filesystem_Direct;

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

	public function testSanitizesValuesForAllFieldTypes() {
		$mockedForm = $this->getMockBuilder( KB_Ajax_Advanced_Form::class )
		                   ->onlyMethods( [ 'process_bail' ] )
		                   ->getMock();

		$fields = [
			[
				'inputName' => 'field1',
				'uniqueID'  => 1,
				'type'      => 'number',
			],
			[
				'inputName' => 'field2',
				'uniqueID'  => 2,
				'type'      => 'range',
			],
		];
		$_POST = [
			'field1' => '<b>one</b>',
			'field2' => '<i>two</i>',
		];

		$mockedForm->expects( $this->never() )->method( 'process_bail' );

		$processed_fields = $mockedForm->process_fields( $fields );

		$this->assertEquals( 'one', $processed_fields[0]['value'] );
		$this->assertEquals( 'two', $processed_fields[1]['value'] );
	}

	public function testSanitizeFilterOutputIsSanitized() {
		add_filter( 'kadence_blocks_form_sanitize_number', static function () {
			return '<b>filtered</b>';
		} );

		$mockedForm = $this->getMockBuilder( KB_Ajax_Advanced_Form::class )
		                   ->onlyMethods( [ 'process_bail' ] )
		                   ->getMock();

		$fields = [
			[
				'inputName' => 'field1',
				'uniqueID'  => 1,
				'type'      => 'number',
			],
		];
		$_POST = [
			'field1' => '5',
		];

		$processed_fields = $mockedForm->process_fields( $fields );

		remove_all_filters( 'kadence_blocks_form_sanitize_number' );

		$this->assertEquals( 'filtered', $processed_fields[0]['value'] );
	}

	public function testSanitizeSvgUploadRemovesScripts() {
		$path = $this->create_temp_file( '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><script>alert(2)</script><rect width="10" height="10"/></svg>' );

		$this->assertTrue( $this->adv_form_ajax->sanitize_svg_upload( $path, 'image.SVG', MB_IN_BYTES ) );

		$content = $this->read_temp_file( $path );

		$this->assertStringNotContainsString( '<script', $content );
		$this->assertStringNotContainsString( 'onload', $content );
		$this->assertStringContainsString( '<rect', $content );
	}

	public function testSanitizeSvgUploadRemovesRemoteReferences() {
		$path = $this->create_temp_file( '<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" fill="url(\'https://example.com/paint.svg#p\')"/></svg>' );

		$this->assertTrue( $this->adv_form_ajax->sanitize_svg_upload( $path, 'image.svg', MB_IN_BYTES ) );

		$content = $this->read_temp_file( $path );

		$this->assertStringNotContainsString( 'example.com', $content );
		$this->assertStringContainsString( '<rect', $content );
	}

	public function testSanitizeSvgUploadKeepsCompressedFilesCompressed() {
		$path = $this->create_temp_file( gzencode( '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><rect width="10" height="10"/></svg>' ) );

		$this->assertTrue( $this->adv_form_ajax->sanitize_svg_upload( $path, 'image.svgz', MB_IN_BYTES ) );

		$content = gzdecode( $this->read_temp_file( $path ) );

		$this->assertStringNotContainsString( '<script', $content );
		$this->assertStringContainsString( '<rect', $content );
	}

	public function testSanitizeSvgUploadRejectsInvalidSvg() {
		$path = $this->create_temp_file( 'not an svg' );

		$result = $this->adv_form_ajax->sanitize_svg_upload( $path, 'image.svg', MB_IN_BYTES );
		wp_delete_file( $path );

		$this->assertFalse( $result );
	}

	public function testSanitizeSvgUploadRejectsCustomDtdEntities() {
		$svg  = '<?xml version="1.0"?><!DOCTYPE svg [<!ENTITY Tab "#">]>';
		$svg .= '<svg xmlns="http://www.w3.org/2000/svg"><a href="&Tab;javascript:void(0)"><text>x</text></a></svg>';
		$path = $this->create_temp_file( $svg );

		$result = $this->adv_form_ajax->sanitize_svg_upload( $path, 'image.svg', MB_IN_BYTES );
		wp_delete_file( $path );

		$this->assertFalse( $result );
	}

	public function testSanitizeSvgUploadHandlesDtdAttributeDefaults() {
		$svg  = '<?xml version="1.0"?><!DOCTYPE svg [<!ATTLIST svg badhref CDATA #FIXED "javascript:void(0)">]>';
		$svg .= '<svg xmlns="http://www.w3.org/2000/svg" badhref="x"><rect width="10" height="10"/></svg>';
		$path = $this->create_temp_file( $svg );

		// This input used to crash the PHP process, so reaching the assertions is part of the test.
		$result = $this->adv_form_ajax->sanitize_svg_upload( $path, 'image.svg', MB_IN_BYTES );

		$content = $result ? $this->read_temp_file( $path ) : '';
		wp_delete_file( $path );

		$this->assertStringNotContainsString( 'javascript:', $content );
		$this->assertStringNotContainsString( '<!DOCTYPE', $content );
	}

	public function testSanitizeSvgUploadTreatsMixedCaseUseHrefLikeLowerCase() {
		$sanitize = function ( string $attribute ): string {
			$svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs>';
			for ( $i = 0; $i < 12; $i++ ) {
				$svg .= '<g id="g' . $i . '">';
				if ( $i ) {
					$svg .= str_repeat( '<use ' . $attribute . '="#g' . ( $i - 1 ) . '"/>', 3 );
				} else {
					$svg .= '<rect width="1" height="1"/>';
				}
				$svg .= '</g>';
			}
			$svg .= '</defs><use ' . $attribute . '="#g11"/></svg>';

			$path = $this->create_temp_file( $svg );
			$this->assertTrue( $this->adv_form_ajax->sanitize_svg_upload( $path, 'image.svg', MB_IN_BYTES ) );

			return $this->read_temp_file( $path );
		};

		$this->assertSame( $sanitize( 'xlink:href' ), $sanitize( 'xlink:HrEf' ) );
	}

	public function testSanitizeSvgUploadRejectsNonSvgDocuments() {
		foreach ( [ '<foo/>', '<g xmlns="http://www.w3.org/2000/svg"><svg><rect/></svg></g>' ] as $xml ) {
			$path = $this->create_temp_file( $xml );

			$result = $this->adv_form_ajax->sanitize_svg_upload( $path, 'image.svg', MB_IN_BYTES );
			wp_delete_file( $path );

			$this->assertFalse( $result, $xml );
		}
	}

	public function testSanitizeSvgUploadRejectsContentOverSizeLimit() {
		$svg  = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"/></svg>';
		$path = $this->create_temp_file( gzencode( $svg ) );

		$result = $this->adv_form_ajax->sanitize_svg_upload( $path, 'image.svgz', strlen( $svg ) - 1 );
		wp_delete_file( $path );

		$this->assertFalse( $result );
	}

	public function testSanitizeSvgUploadIgnoresOtherFileTypes() {
		$original = '<script>alert(1)</script>';
		$path     = $this->create_temp_file( $original );

		$this->assertTrue( $this->adv_form_ajax->sanitize_svg_upload( $path, 'notes.txt', MB_IN_BYTES ) );

		$content = $this->read_temp_file( $path );

		$this->assertSame( $original, $content );
	}

	protected function setUp(): void {
		parent::setUp();

		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/class-wp-filesystem-base.php';
		require_once ABSPATH . 'wp-admin/includes/class-wp-filesystem-direct.php';

		$this->adv_form_ajax = new KB_Ajax_Advanced_Form();
	}

	protected function _after() {
	}

	private function create_temp_file( string $content ): string {
		$path = wp_tempnam( 'kb-form-upload' );
		file_put_contents( $path, $content );

		return $path;
	}

	private function read_temp_file( string $path ): string {
		$content = ( new WP_Filesystem_Direct( null ) )->get_contents( $path );
		wp_delete_file( $path );

		return $content;
	}
}
