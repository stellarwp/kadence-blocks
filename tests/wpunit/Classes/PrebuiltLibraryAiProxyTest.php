<?php

namespace Tests\wpunit\Classes;

use Kadence_Blocks_Prebuilt_Library_REST_Controller;
use ReflectionClass;
use Tests\wpunit\KadenceBlocksTestCase;
use WP_REST_Request;

/**
 * Tests the server-side AI proxy that replaces direct, key-bearing client calls.
 *
 * The inline AI and AI Wizard used to read `proData.api_key` in the browser and
 * call Kadence's servers directly. These requests now go through same-origin
 * proxy routes that inject the stored license token server-side.
 */
class PrebuiltLibraryAiProxyTest extends KadenceBlocksTestCase {

	/**
	 * Build the controller without its constructor so the unit assertions do not
	 * depend on the DI container. Property defaults (e.g. $remote_ai_url) are
	 * still initialised by PHP.
	 */
	private function controller(): Kadence_Blocks_Prebuilt_Library_REST_Controller {
		return ( new ReflectionClass( Kadence_Blocks_Prebuilt_Library_REST_Controller::class ) )
			->newInstanceWithoutConstructor();
	}

	public function testAiProxyRoutesAreRegistered() {
		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( '/kb-design-library/v1/ai/generate-content', $routes );
		$this->assertArrayHasKey( '/kb-design-library/v1/ai/mission-statement', $routes );

		$has_transform = false;
		foreach ( array_keys( $routes ) as $route ) {
			if ( strpos( $route, '/kb-design-library/v1/ai/transform/' ) === 0 ) {
				$has_transform = true;
				break;
			}
		}
		$this->assertTrue( $has_transform, 'The AI transform proxy route should be registered.' );
	}

	public function testPermissionAllowsContributorDeniesSubscriber() {
		$controller = $this->controller();
		$request    = new WP_REST_Request( 'POST', '/kb-design-library/v1/ai/generate-content' );

		$subscriber = self::factory()->user->create( [ 'role' => 'subscriber' ] );
		wp_set_current_user( $subscriber );
		$this->assertFalse( (bool) $controller->get_items_permission_check( $request ) );

		$contributor = self::factory()->user->create( [ 'role' => 'contributor' ] );
		wp_set_current_user( $contributor );
		$this->assertTrue( (bool) $controller->get_items_permission_check( $request ) );
	}

	public function testBuildAiProxyRequestComposesUpstreamUrlAndBody() {
		$controller = $this->controller();
		$body       = [
			'prompt' => 'Write a tagline',
			'lang'   => 'en-US',
			'stream' => true,
		];

		$result = $controller->build_ai_proxy_request( 'proxy/generate/content', $body );

		$this->assertSame(
			'https://content.startertemplatecloud.com/wp-json/prophecy/v1/proxy/generate/content',
			$result['url']
		);
		$this->assertSame( $body, $result['body'] );
	}

	public function testTokenHeaderIsBuiltServerSide() {
		$controller = $this->controller();

		$token = json_decode( base64_decode( $controller->get_token_header() ), true );

		$this->assertIsArray( $token );
		// Server-derived identity fields are always present; the key comes from
		// server storage (empty in the test env) and never from client input.
		foreach ( [ 'domain', 'key', 'site_name', 'product_slug', 'product_version' ] as $field ) {
			$this->assertArrayHasKey( $field, $token );
		}
		$this->assertSame( KADENCE_BLOCKS_VERSION, $token['product_version'] );
	}
}
