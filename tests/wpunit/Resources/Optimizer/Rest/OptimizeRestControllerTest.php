<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Rest;

use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Rest\Optimize_Rest_Controller;
use KadenceWP\KadenceBlocks\Optimizer\Status\Status;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use Tests\Support\Classes\OptimizerTestCase;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Server;
use WP_User;

final class OptimizeRestControllerTest extends OptimizerTestCase {

	use Permalink_Trait;

	private Optimize_Rest_Controller $controller;
	private Store $store;
	private Status $status;
	private int $post_id;
	private Path $path;
	private WP_User $admin_user;
	private WP_User $editor_user;
	private WP_User $subscriber_user;
	private WP_REST_Server $rest_server;

	protected function setUp(): void {
		parent::setUp();

		// Set pretty permalinks.
		update_option( 'permalink_structure', '/%postname%/' );

		$this->store      = $this->container->get( Store::class );
		$this->status     = $this->container->get( Status::class );
		$this->controller = $this->container->get( Optimize_Rest_Controller::class );

		// Create test post.
		$this->post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Test Optimization Post',
				'post_status' => 'publish',
			]
		);

		$post_path = $this->get_post_path( $this->post_id );

		$this->assertNotEmpty( $post_path );

		$this->path = new Path( $post_path );

		// Create test users with different capabilities.
		$this->admin_user = $this->factory()->user->create_and_get(
			[
				'role' => 'administrator',
			]
		);

		$this->editor_user = $this->factory()->user->create_and_get(
			[
				'role' => 'editor',
			]
		);

		$this->subscriber_user = $this->factory()->user->create_and_get(
			[
				'role' => 'subscriber',
			]
		);

		// Initialize the REST server.
		global $wp_rest_server;
		$this->rest_server = new WP_REST_Server();
		$wp_rest_server    = $this->rest_server;
		do_action( 'rest_api_init' );

		// Clean up any existing optimizer data.
		$this->store->delete( $this->path );
	}

	protected function tearDown(): void {
		$this->store->delete( $this->path );
		$this->status->delete( $this->post_id );
		wp_set_current_user( 0 );

		// Reset the global REST server.
		global $wp_rest_server;
		$wp_rest_server = null;

		parent::tearDown();
	}

	public function testRoutesAreRegistered(): void {
		$routes    = $this->rest_server->get_routes();
		$namespace = 'kb-optimizer/v1';
		$route     = '/optimize';

		$this->assertArrayHasKey( "/$namespace$route", $routes );

		$route_options = $routes[ "/$namespace$route" ];
		// POST, GET, DELETE.
		$this->assertCount( 3, $route_options );
	}

	public function testCreateItemSuccess(): void {
		wp_set_current_user( $this->admin_user->ID );

		$request_data = $this->getTestAnalysisData();
		$request      = new WP_REST_Request( WP_REST_Server::CREATABLE, Optimize_Rest_Controller::ROUTE );
		$request->set_param( Optimize_Rest_Controller::POST_PATH, $this->path->path() );
		$request->set_param( Optimize_Rest_Controller::POST_ID, $this->post_id );
		$request->set_param( Optimize_Rest_Controller::RESULTS, $request_data );

		$response = $this->controller->create_item( $request );

		$this->assertNotInstanceOf( WP_Error::class, $response );
		$this->assertEquals( WP_Http::CREATED, $response->get_status() );

		$data = $response->get_data();
		$this->assertTrue( $data['data']['success'] );
		$this->assertEquals( $this->post_id, $data['data'][ Optimize_Rest_Controller::POST_ID ] );

		// Verify data was stored.
		$stored_analysis = $this->store->get( $this->path );
		$this->assertInstanceOf( WebsiteAnalysis::class, $stored_analysis );
		$this->assertSame(
			Status::OPTIMIZED,
			$this->status->get( $this->post_id )
		);
	}

	public function testCreateItemAsEditor(): void {
		wp_set_current_user( $this->editor_user->ID );

		$request_data = $this->getTestAnalysisData();
		$request      = new WP_REST_Request( WP_REST_Server::CREATABLE, Optimize_Rest_Controller::ROUTE );
		$request->set_param( Optimize_Rest_Controller::POST_PATH, $this->path->path() );
		$request->set_param( Optimize_Rest_Controller::POST_ID, $this->post_id );
		$request->set_param( Optimize_Rest_Controller::RESULTS, $request_data );

		$response = $this->controller->create_item( $request );

		$this->assertNotInstanceOf( WP_Error::class, $response );
		$this->assertEquals( WP_Http::CREATED, $response->get_status() );
	}

	public function testCreateItemPermissionDeniedForSubscriber(): void {
		wp_set_current_user( $this->subscriber_user->ID );

		$request = new WP_REST_Request( WP_REST_Server::CREATABLE, Optimize_Rest_Controller::ROUTE );
		$request->set_param( Optimize_Rest_Controller::POST_PATH, $this->path->path() );
		$request->set_param( Optimize_Rest_Controller::POST_ID, $this->post_id );

		$permission_result = $this->controller->create_item_permissions_check( $request );

		$this->assertInstanceOf( WP_Error::class, $permission_result );
		$this->assertEquals( 'rest_kb_optimizer_create_forbidden', $permission_result->get_error_code() );
	}

	public function testCreateItemPermissionDeniedForUnauthenticated(): void {
		wp_set_current_user( 0 );

		$request = new WP_REST_Request( WP_REST_Server::CREATABLE, Optimize_Rest_Controller::ROUTE );
		$request->set_param( Optimize_Rest_Controller::POST_PATH, $this->path->path() );
		$request->set_param( Optimize_Rest_Controller::POST_ID, $this->post_id );

		$permission_result = $this->controller->create_item_permissions_check( $request );

		$this->assertInstanceOf( WP_Error::class, $permission_result );
		$this->assertEquals( 'rest_kb_optimizer_create_forbidden', $permission_result->get_error_code() );
	}

	public function testCreateItemPermissionCheckPostDoesNotExist(): void {
		wp_set_current_user( $this->admin_user->ID );

		$non_existent_post_id = 999999;
		$request              = new WP_REST_Request( WP_REST_Server::CREATABLE, Optimize_Rest_Controller::ROUTE );
		$request->set_param( Optimize_Rest_Controller::POST_PATH, $this->path->path() );
		$request->set_param( Optimize_Rest_Controller::POST_ID, $non_existent_post_id );

		$permission_result = $this->controller->create_item_permissions_check( $request );

		$this->assertInstanceOf( WP_Error::class, $permission_result );
		$this->assertEquals( 'rest_kb_optimizer_post_does_not_exist', $permission_result->get_error_code() );
		$this->assertEquals( WP_Http::NOT_FOUND, $permission_result->get_error_data()['status'] );
		$this->assertEquals( $non_existent_post_id, $permission_result->get_error_data()['post_id'] );
	}

	public function testGetItemSuccess(): void {
		// First store some data.
		$test_data = $this->getTestAnalysisData();
		$analysis  = WebsiteAnalysis::from( $test_data );
		$this->store->set( $this->path, $analysis );

		wp_set_current_user( $this->admin_user->ID );

		$request = new WP_REST_Request( WP_REST_Server::READABLE, Optimize_Rest_Controller::ROUTE );
		$request->set_param( Optimize_Rest_Controller::POST_PATH, $this->path->path() );
		$request->set_param( Optimize_Rest_Controller::POST_ID, $this->post_id );

		$response = $this->controller->get_item( $request );

		$this->assertNotInstanceOf( WP_Error::class, $response );
		$this->assertEquals( WP_Http::OK, $response->get_status() );

		$data = $response->get_data();
		$this->assertArrayHasKey( 'data', $data );
		$this->assertArrayHasKey( 'desktop', $data['data'] );
		$this->assertArrayHasKey( 'mobile', $data['data'] );
		$this->assertArrayHasKey( 'images', $data['data'] );
	}

	public function testGetItemNotFound(): void {
		wp_set_current_user( $this->admin_user->ID );

		$request = new WP_REST_Request( WP_REST_Server::READABLE, Optimize_Rest_Controller::ROUTE );
		$request->set_param( Optimize_Rest_Controller::POST_PATH, $this->path->path() );
		$request->set_param( Optimize_Rest_Controller::POST_ID, $this->post_id );

		$response = $this->controller->get_item( $request );

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertEquals( 'rest_kb_optimizer_read_not_found', $response->get_error_code() );
		$this->assertEquals( WP_Http::NOT_FOUND, $response->get_error_data()['status'] );
	}

	public function testGetItemPermissionDeniedForSubscriber(): void {
		wp_set_current_user( $this->subscriber_user->ID );

		$request = new WP_REST_Request( WP_REST_Server::READABLE, Optimize_Rest_Controller::ROUTE );
		$request->set_param( Optimize_Rest_Controller::POST_PATH, $this->path->path() );
		$request->set_param( Optimize_Rest_Controller::POST_ID, $this->post_id );

		$permission_result = $this->controller->get_item_permissions_check( $request );

		$this->assertInstanceOf( WP_Error::class, $permission_result );
		$this->assertEquals( 'rest_kb_optimizer_read_forbidden', $permission_result->get_error_code() );
	}

	public function testGetItemPermissionCheckPostDoesNotExist(): void {
		wp_set_current_user( $this->admin_user->ID );

		$non_existent_post_id = 999999;
		$request              = new WP_REST_Request( WP_REST_Server::READABLE, Optimize_Rest_Controller::ROUTE );
		$request->set_param( Optimize_Rest_Controller::POST_PATH, 'random-path' );
		$request->set_param( Optimize_Rest_Controller::POST_ID, $non_existent_post_id );

		$permission_result = $this->controller->get_item_permissions_check( $request );

		$this->assertInstanceOf( WP_Error::class, $permission_result );
		$this->assertEquals( 'rest_kb_optimizer_post_does_not_exist', $permission_result->get_error_code() );
		$this->assertEquals( WP_Http::NOT_FOUND, $permission_result->get_error_data()['status'] );
		$this->assertEquals( $non_existent_post_id, $permission_result->get_error_data()['post_id'] );
	}

	public function testDeleteItemSuccess(): void {
		// First store some data.
		$test_data = $this->getTestAnalysisData();
		$analysis  = WebsiteAnalysis::from( $test_data );
		$this->store->set( $this->path, $analysis );

		wp_set_current_user( $this->admin_user->ID );

		$request = new WP_REST_Request( WP_REST_Server::DELETABLE, Optimize_Rest_Controller::ROUTE );
		$request->set_param( Optimize_Rest_Controller::POST_PATH, $this->path->path() );
		$request->set_param( Optimize_Rest_Controller::POST_ID, $this->post_id );

		$response = $this->controller->delete_item( $request );

		$this->assertNotInstanceOf( WP_Error::class, $response );
		$this->assertEquals( WP_Http::OK, $response->get_status() );

		$data = $response->get_data();
		$this->assertTrue( $data['data']['success'] );
		$this->assertEquals( $this->post_id, $data['data'][ Optimize_Rest_Controller::POST_ID ] );

		// Verify data was deleted.
		$this->assertNull( $this->store->get( $this->path ) );
		$this->assertSame(
			Status::NOT_OPTIMIZED,
			$this->status->get( $this->post_id )
		);
	}

	public function testDeleteItemNonExistentData(): void {
		wp_set_current_user( $this->admin_user->ID );

		$request = new WP_REST_Request( WP_REST_Server::DELETABLE, Optimize_Rest_Controller::ROUTE );
		$request->set_param( Optimize_Rest_Controller::POST_PATH, $this->path->path() );
		$request->set_param( Optimize_Rest_Controller::POST_ID, $this->post_id );

		$response = $this->controller->delete_item( $request );

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertEquals( 'rest_kb_optimizer_delete_failed', $response->get_error_code() );
		$this->assertEquals( WP_Http::INTERNAL_SERVER_ERROR, $response->get_error_data()['status'] );
	}

	public function testDeleteItemPermissionDeniedForSubscriber(): void {
		wp_set_current_user( $this->subscriber_user->ID );

		$request = new WP_REST_Request( WP_REST_Server::DELETABLE, Optimize_Rest_Controller::ROUTE );
		$request->set_param( Optimize_Rest_Controller::POST_PATH, $this->path->path() );
		$request->set_param( Optimize_Rest_Controller::POST_ID, $this->post_id );

		$permission_result = $this->controller->delete_item_permissions_check( $request );

		$this->assertInstanceOf( WP_Error::class, $permission_result );
		$this->assertEquals( 'rest_kb_optimizer_delete_forbidden', $permission_result->get_error_code() );
	}

	public function testDeleteItemPermissionCheckPostDoesNotExist(): void {
		wp_set_current_user( $this->admin_user->ID );

		$non_existent_post_id = 999999;
		$request              = new WP_REST_Request( WP_REST_Server::DELETABLE, Optimize_Rest_Controller::ROUTE );
		$request->set_param( Optimize_Rest_Controller::POST_PATH, 'random-path' );
		$request->set_param( Optimize_Rest_Controller::POST_ID, $non_existent_post_id );

		$permission_result = $this->controller->delete_item_permissions_check( $request );

		$this->assertInstanceOf( WP_Error::class, $permission_result );
		$this->assertEquals( 'rest_kb_optimizer_post_does_not_exist', $permission_result->get_error_code() );
		$this->assertEquals( WP_Http::NOT_FOUND, $permission_result->get_error_data()['status'] );
		$this->assertEquals( $non_existent_post_id, $permission_result->get_error_data()['post_id'] );
	}

	public function testMissingPostIdParameter(): void {
		wp_set_current_user( $this->admin_user->ID );

		$request = new WP_REST_Request( WP_REST_Server::READABLE, Optimize_Rest_Controller::ROUTE );
		// Don't set POST_ID parameter.

		$permission_result = $this->controller->get_item_permissions_check( $request );

		$this->assertInstanceOf( WP_Error::class, $permission_result );
	}

	public function testParameterSanitizationViaRestApi(): void {
		wp_set_current_user( $this->admin_user->ID );

		// Test that REST API dispatch automatically sanitizes parameters.
		$request = new WP_REST_Request( 'GET', Optimize_Rest_Controller::ROUTE );
		$request->set_param( Optimize_Rest_Controller::POST_PATH, $this->path->path() );
		$request->set_param( Optimize_Rest_Controller::POST_ID, 'invalid_string' );

		// Before dispatch, parameter is raw.
		$this->assertEquals( 'invalid_string', $request->get_param( Optimize_Rest_Controller::POST_ID ) );

		// Dispatch the request through REST API (this triggers sanitization).
		$response = $this->rest_server->dispatch( $request );

		// After dispatch, parameter should be sanitized by custom callback.
		$this->assertEquals( 0, $request->get_param( Optimize_Rest_Controller::POST_ID ) );
		// Should return permission error because the post won't be found.
		$this->assertEquals( WP_Http::NOT_FOUND, $response->get_status() );

		// Test with numeric string.
		$request2 = new WP_REST_Request( 'GET', Optimize_Rest_Controller::ROUTE );
		$request2->set_param( Optimize_Rest_Controller::POST_PATH, $this->path->path() );
		$request2->set_param( Optimize_Rest_Controller::POST_ID, '123abc' );
		// Before dispatch.
		$this->assertEquals( '123abc', $request2->get_param( Optimize_Rest_Controller::POST_ID ) );

		$response2 = $this->rest_server->dispatch( $request2 );
		// After dispatch.
		$this->assertEquals( 123, $request2->get_param( Optimize_Rest_Controller::POST_ID ) );
		// Should return permission error post 123 does not exist.
		$this->assertEquals( WP_Http::NOT_FOUND, $response2->get_status() );

		// Test with negative number - should return validation error.
		$request3 = new WP_REST_Request( 'GET', Optimize_Rest_Controller::ROUTE );
		$request3->set_param( Optimize_Rest_Controller::POST_PATH, $this->path->path() );
		$request3->set_param( Optimize_Rest_Controller::POST_ID, '-456' );
		$this->assertEquals( '-456', $request3->get_param( Optimize_Rest_Controller::POST_ID ) );

		$response3 = $this->rest_server->dispatch( $request3 );
		$this->assertEquals( -456, $request3->get_param( Optimize_Rest_Controller::POST_ID ) );
		// Should return permission error because current_user_can('read_post', -456) returns false.
		$this->assertEquals( WP_Http::NOT_FOUND, $response3->get_status() );
	}

	public function testParameterValidationThroughRestApi(): void {
		wp_set_current_user( $this->admin_user->ID );

		// Test with invalid POST_ID through actual REST API dispatch.
		$request = new WP_REST_Request( 'GET', Optimize_Rest_Controller::ROUTE );
		$request->set_param( Optimize_Rest_Controller::POST_PATH, 'random-path' );
		$request->set_param( Optimize_Rest_Controller::POST_ID, 'invalid_string' );

		$response = $this->rest_server->dispatch( $request );

		// Should get permission error because (int)'invalid_string' = 0,
		// and the post does not exit.
		$this->assertEquals( WP_Http::NOT_FOUND, $response->get_status() );

		// Check if response is a WP_Error or if the data contains error information.
		$response_data = $response->get_data();

		$this->assertArrayHasKey( 'code', $response_data );
		$this->assertEquals( 'rest_kb_optimizer_post_does_not_exist', $response_data['code'] );
	}

	public function testItFailsToOptimizeADraftPost(): void {
		$draft_post_id = $this->factory()->post->create(
			[
				'post_status' => 'draft',
			]
		);

		wp_set_current_user( $this->admin_user->ID );

		$request = new WP_REST_Request( WP_REST_Server::CREATABLE, Optimize_Rest_Controller::ROUTE );
		$request->set_param( Optimize_Rest_Controller::POST_PATH, '?draft' );
		$request->set_param( Optimize_Rest_Controller::POST_ID, $draft_post_id );
		$request->set_param( Optimize_Rest_Controller::RESULTS, $this->getTestAnalysisData() );

		$response = $this->controller->create_item( $request );

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertEquals( 'rest_kb_optimizer_create_failed_not_published', $response->get_error_code() );
	}

	public function testItFailsToOptimizeAnExcludedPost(): void {
		$post_id = $this->factory()->post->create(
			[
				'post_status' => 'publish',
			]
		);

		wp_set_current_user( $this->admin_user->ID );

		$this->assertTrue( $this->status->set_excluded( $post_id ) );

		$request = new WP_REST_Request( WP_REST_Server::CREATABLE, Optimize_Rest_Controller::ROUTE );
		$request->set_param( Optimize_Rest_Controller::POST_ID, $post_id );
		$request->set_param( Optimize_Rest_Controller::RESULTS, $this->getTestAnalysisData() );

		$response = $this->controller->create_item( $request );

		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertEquals( 'rest_kb_optimizer_create_failed_excluded', $response->get_error_code() );
	}

	private function getTestAnalysisData(): array {
		$decoded = json_decode(
			$this->fixture( 'resources/optimizer/result.json' ),
			true
		);

		$decoded['isStale'] = false;

		return $decoded;
	}
}
