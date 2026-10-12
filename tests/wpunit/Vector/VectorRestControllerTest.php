<?php

namespace Tests\wpunit\Vector;

use Codeception\TestCase\WPTestCase;
use Kadence_Vector_post_REST_Controller;
use WP_Error;
use WP_REST_Request;

class VectorRestControllerTest extends WPTestCase {

	/**
	 * @var Kadence_Vector_post_REST_Controller
	 */
	protected $controller;

	public function setUp(): void {
		parent::setUp();

		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$this->controller = new Kadence_Vector_post_REST_Controller();
	}

	public function testCreateVectorStoresSanitizedSvg() {
		$result = $this->create_vector(
			'<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><script>alert(2)</script><rect width="10" height="10"/></svg>'
		);

		$this->assertIsArray( $result );
		$this->assertArrayNotHasKey( 'error', $result );
		$this->assertSame( 'My vector', $result['label'] );

		$post = get_post( $result['value'] );

		$this->assertSame( 'kadence_vector', $post->post_type );
		$this->assertStringContainsString( '<rect', $post->post_content );
		$this->assertStringNotContainsString( '<script', $post->post_content );
		$this->assertStringNotContainsString( 'onload', $post->post_content );
	}

	public function testCreateVectorRejectsCustomDtdEntities() {
		$svg = '<?xml version="1.0"?><!DOCTYPE svg [<!ENTITY Tab "#">]>';
		$svg .= '<svg xmlns="http://www.w3.org/2000/svg"><a href="&Tab;javascript:void(0)"><text>x</text></a></svg>';

		$this->assertVectorRejected( $svg );
	}

	public function testCreateVectorRejectsUnparsableSvg() {
		$this->assertVectorRejected( 'not an svg' );
	}

	public function testCreateVectorRejectsEmptySvg() {
		$this->assertVectorRejected( '' );
	}

	/**
	 * Runs create_vector() with the given SVG and returns the controller's response.
	 *
	 * @param string $svg The SVG markup.
	 *
	 * @return array|WP_Error
	 */
	private function create_vector( string $svg ) {
		$request = new WP_REST_Request( 'POST', '/kb-vector/v1/vectors' );
		$request->set_header( 'content-type', 'application/json' );
		$request->set_body( wp_json_encode( [ 'title' => 'My vector', 'vectorSVG' => $svg ] ) );

		return $this->controller->create_vector( $request );
	}

	/**
	 * Asserts the SVG is refused and no vector post is created.
	 *
	 * @param string $svg The SVG markup.
	 */
	private function assertVectorRejected( string $svg ): void {
		$before = $this->count_vectors();

		$result = $this->create_vector( $svg );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'invalid_svg', $result->get_error_code() );
		$this->assertSame( $before, $this->count_vectors() );
	}

	private function count_vectors(): int {
		return count(
			get_posts(
				[
					'post_type'      => 'kadence_vector',
					'post_status'    => 'any',
					'posts_per_page' => -1,
					'fields'         => 'ids',
				]
			)
		);
	}
}
