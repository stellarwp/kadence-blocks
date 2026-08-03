<?php

namespace Tests\wpunit\Classes;

use Kadence_Blocks_Prebuilt_Library;
use Kadence_Blocks_Prebuilt_Library_REST_Controller;
use ReflectionClass;
use Tests\wpunit\KadenceBlocksTestCase;
use WP_REST_Request;

/**
 * Tests how the prebuilt library resolves the location it fetches from.
 */
class PrebuiltLibraryUrlTest extends KadenceBlocksTestCase {

	private const ENDPOINT = '/wp-json/kadence-cloud/v1/get/';

	private const KNOWN_HOSTS = [
		'https://patterns.startertemplatecloud.com',
		'https://api.startertemplatecloud.com',
		'https://startertemplatecloud.com',
	];

	private function library(): Kadence_Blocks_Prebuilt_Library {
		return ( new ReflectionClass( Kadence_Blocks_Prebuilt_Library::class ) )
			->newInstanceWithoutConstructor();
	}

	private function controller(): Kadence_Blocks_Prebuilt_Library_REST_Controller {
		return ( new ReflectionClass( Kadence_Blocks_Prebuilt_Library_REST_Controller::class ) )
			->newInstanceWithoutConstructor();
	}

	/**
	 * @param mixed ...$args
	 *
	 * @return mixed
	 */
	private function call( string $method, ...$args ) {
		$library  = $this->library();
		$callable = ( new ReflectionClass( Kadence_Blocks_Prebuilt_Library::class ) )->getMethod( $method );
		$callable->setAccessible( true );

		return $callable->invokeArgs( $library, $args );
	}

	private function set_property( Kadence_Blocks_Prebuilt_Library $library, string $name, $value ): void {
		$property = ( new ReflectionClass( Kadence_Blocks_Prebuilt_Library::class ) )->getProperty( $name );
		$property->setAccessible( true );
		$property->setValue( $library, $value );
	}

	/**
	 * @return string The requested URL, or an empty string if none was made.
	 */
	private function captured_request_url( callable $run ): string {
		$requested = '';
		$capture   = static function ( $preempt, $args, $url ) use ( &$requested ) {
			$requested = (string) $url;

			return [
				'headers'  => [],
				'body'     => '[]',
				'response' => [
					'code'    => 200,
					'message' => 'OK',
				],
			];
		};

		add_filter( 'pre_http_request', $capture, 10, 3 );
		$run();
		remove_filter( 'pre_http_request', $capture, 10 );

		return $requested;
	}

	private function save_connection( string $url ): void {
		update_option( 'kadence_blocks_cloud', wp_json_encode( [ 'connections' => [ [ 'url' => $url ] ] ] ) );
	}

	private function register_custom_library( string $url ): void {
		add_filter(
			'kadence_blocks_custom_prebuilt_libraries',
			static function ( $libraries ) use ( $url ) {
				$libraries[] = [
					'slug'  => 'demo',
					'title' => 'Demo',
					'url'   => $url,
					'key'   => 'demo',
				];

				return $libraries;
			}
		);
	}

	private function allow_library_url( string $url ): void {
		add_filter(
			'kadence_blocks_allowed_library_urls',
			static function ( $urls ) use ( $url ) {
				$urls[] = $url;

				return $urls;
			}
		);
	}

	public function tearDown(): void {
		delete_option( 'kadence_blocks_cloud' );
		parent::tearDown();
	}

	public function testKnownLibraryHostsResolveToTheEndpoint() {
		foreach ( self::KNOWN_HOSTS as $host ) {
			$this->assertSame(
				$host . self::ENDPOINT,
				$this->call( 'resolve_library_url', $host . '/', self::ENDPOINT, '' ),
				$host
			);
		}

		$this->assertSame(
			'https://startertemplatecloud.com/g85' . self::ENDPOINT,
			$this->call( 'resolve_library_url', 'https://startertemplatecloud.com/g85/', self::ENDPOINT, '' )
		);
	}

	public function testSavedConnectionResolvesToTheEndpoint() {
		$this->save_connection( 'https://library.example' );

		$this->assertSame(
			'https://library.example' . self::ENDPOINT,
			$this->call( 'resolve_library_url', 'https://library.example/', self::ENDPOINT, '' )
		);
	}

	public function testCustomPrebuiltLibraryFilterResolvesToTheEndpoint() {
		$this->register_custom_library( 'https://mylib.example' );

		$this->assertSame(
			'https://mylib.example' . self::ENDPOINT,
			$this->call( 'resolve_library_url', 'https://mylib.example/', self::ENDPOINT, '' )
		);
	}

	public function testAllowedUrlFilterResolvesToTheEndpoint() {
		$this->allow_library_url( 'https://mylib.example' );

		$this->assertSame(
			'https://mylib.example' . self::ENDPOINT,
			$this->call( 'resolve_library_url', 'https://mylib.example', self::ENDPOINT, '' )
		);
	}

	public function testAnAllowedHostCoversItsPathsAndSubdomains() {
		$this->allow_library_url( 'https://mylib.example' );

		foreach ( [ 'https://mylib.example/library/one', 'https://cdn.mylib.example' ] as $url ) {
			$this->assertSame( $url . self::ENDPOINT, $this->call( 'resolve_library_url', $url, self::ENDPOINT, '' ), $url );
		}
	}

	public function testSavedConnectionCoversItsPaths() {
		$this->save_connection( 'https://library.example' );

		$this->assertSame(
			'https://library.example/sub' . self::ENDPOINT,
			$this->call( 'resolve_library_url', 'https://library.example/sub', self::ENDPOINT, '' )
		);
	}

	public function testKnownLibrarySubdomainsResolve() {
		$this->assertSame(
			'https://g85.startertemplatecloud.com' . self::ENDPOINT,
			$this->call( 'resolve_library_url', 'https://g85.startertemplatecloud.com', self::ENDPOINT, '' )
		);

		$this->assertTrue( (bool) $this->call( 'is_kadence_api_url', 'https://g85.startertemplatecloud.com/wp-json/x' ) );
	}

	public function testANonArrayCustomLibraryReturnIsIgnored() {
		add_filter( 'kadence_blocks_custom_prebuilt_libraries', static fn() => 'not-an-array' );

		$this->assertSame(
			'',
			$this->call( 'resolve_library_url', 'https://external.example', self::ENDPOINT, '' )
		);
	}

	public function testAValidCustomLibrarySurvivesMalformedEntries() {
		add_filter(
			'kadence_blocks_custom_prebuilt_libraries',
			static fn() => [ [ 'slug' => 'x' ], [ 'url' => [] ], 'nope', [ 'url' => null ], [ 'url' => 'https://ok.example' ] ]
		);

		$this->assertSame(
			'https://ok.example' . self::ENDPOINT,
			$this->call( 'resolve_library_url', 'https://ok.example', self::ENDPOINT, '' )
		);
		$this->assertSame(
			'',
			$this->call( 'resolve_library_url', 'https://external.example', self::ENDPOINT, '' )
		);
	}

	public function testNonHttpSchemesAreRejected() {
		foreach ( [ 'ftp', 'gopher', 'dict', 'javascript' ] as $scheme ) {
			$url = $scheme . '://startertemplatecloud.com';

			$this->assertFalse( (bool) $this->call( 'is_kadence_api_url', $url ), $url );
			$this->assertSame( '', $this->call( 'resolve_library_url', $url, self::ENDPOINT, '' ), $url );
		}
	}

	public function testHostsWithIllegalCharactersAreRejected() {
		$hosts = [
			'https://evil.com\.startertemplatecloud.com/',
			'https://evil.com%2f.startertemplatecloud.com/',
			'https://evil.com%00.startertemplatecloud.com',
			'https://startertemplatecloud.com@evil.example/x',
			'https://startertemplatecloud.com.',
		];

		foreach ( $hosts as $url ) {
			$this->assertFalse( (bool) $this->call( 'is_kadence_api_url', $url ), $url );
			$this->assertSame( '', $this->call( 'resolve_library_url', $url, self::ENDPOINT, '' ), $url );
		}
	}

	public function testUnknownLocationResolvesToNothing() {
		$this->assertSame(
			'',
			$this->call( 'resolve_library_url', 'https://external.example', self::ENDPOINT, 'https://fallback.test' )
		);
	}

	public function testNoRequestedLocationFallsBackToTheDefault() {
		$this->assertSame(
			'https://fallback.test',
			$this->call( 'resolve_library_url', '', self::ENDPOINT, 'https://fallback.test' )
		);
	}

	public function testHostDetectionMatchesOnlyTheKnownHosts() {
		foreach ( self::KNOWN_HOSTS as $host ) {
			$this->assertTrue( (bool) $this->call( 'is_kadence_api_url', $host . '/wp-json/x' ), $host );
		}

		$rejected = [
			'',
			'not-a-url',
			'https://external.example',
			'https://startertemplatecloud.com.external.example',
			'https://evilstartertemplatecloud.com',
			'https://startertemplatecloud.com.external.example.com',
		];

		foreach ( $rejected as $url ) {
			$this->assertFalse( (bool) $this->call( 'is_kadence_api_url', $url ), $url ?: '(empty)' );
		}
	}

	public function testConnectionLookupAllowsAManager() {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$this->assertSame(
			'https://new-library.example' . self::ENDPOINT,
			$this->call( 'resolve_connection_url', 'https://new-library.example', self::ENDPOINT )
		);
	}

	public function testConnectionLookupBlocksANonManager() {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'contributor' ] ) );

		$this->assertSame(
			'',
			$this->call( 'resolve_connection_url', 'https://new-library.example', self::ENDPOINT )
		);
	}

	public function testLicenseDataIsAddedForAKnownHost() {
		$library = $this->library();
		$this->set_property( $library, 'url', 'https://startertemplatecloud.com' . self::ENDPOINT );
		$this->set_property( $library, 'key', 'kadence-blocks' );
		$this->set_property( $library, 'is_template', true );
		$this->set_property( $library, 'api_key', 'license-key' );
		$this->set_property( $library, 'api_email', 'license@example.com' );

		$requested = $this->captured_request_url(
			static function () use ( $library ) {
				$library->get_remote_url_contents();
			}
		);

		$this->assertStringStartsWith( 'https://startertemplatecloud.com', $requested );
		$this->assertStringContainsString( 'api_key=license-key', $requested );
		$this->assertStringContainsString( 'api_email=license@example.com', $requested );
	}

	public function testLicenseDataIsAddedForAKnownSubdomain() {
		$library = $this->library();
		$this->set_property( $library, 'url', 'https://g85.startertemplatecloud.com' . self::ENDPOINT );
		$this->set_property( $library, 'key', 'kadence-blocks' );
		$this->set_property( $library, 'is_template', true );
		$this->set_property( $library, 'api_key', 'license-key' );
		$this->set_property( $library, 'api_email', 'license@example.com' );

		$requested = $this->captured_request_url(
			static function () use ( $library ) {
				$library->get_remote_url_contents();
			}
		);

		$this->assertStringStartsWith( 'https://g85.startertemplatecloud.com', $requested );
		$this->assertStringContainsString( 'api_key=license-key', $requested );
	}

	public function testLicenseDataIsOmittedForACustomLibrary() {
		$this->register_custom_library( 'https://mylib.example' );

		$library = $this->library();
		$this->set_property( $library, 'url', 'https://mylib.example' . self::ENDPOINT );
		$this->set_property( $library, 'key', 'kadence-blocks' );
		$this->set_property( $library, 'is_template', true );
		$this->set_property( $library, 'api_key', 'license-key' );
		$this->set_property( $library, 'api_email', 'license@example.com' );

		$requested = $this->captured_request_url(
			static function () use ( $library ) {
				$library->get_remote_url_contents();
			}
		);

		$this->assertStringStartsWith( 'https://mylib.example', $requested );
		$this->assertStringNotContainsString( 'license-key', $requested );
		$this->assertStringNotContainsString( 'license@example.com', $requested );
	}

	public function testLicenseDataIsOmittedForASavedConnection() {
		$this->save_connection( 'https://library.example' );

		$library = $this->library();
		$this->set_property( $library, 'url', 'https://library.example' . self::ENDPOINT );
		$this->set_property( $library, 'key', 'kadence-blocks' );
		$this->set_property( $library, 'is_template', true );
		$this->set_property( $library, 'api_key', 'license-key' );
		$this->set_property( $library, 'api_email', 'license@example.com' );

		$requested = $this->captured_request_url(
			static function () use ( $library ) {
				$library->get_remote_url_contents();
			}
		);

		$this->assertStringStartsWith( 'https://library.example', $requested );
		$this->assertStringNotContainsString( 'license-key', $requested );
		$this->assertStringNotContainsString( 'license@example.com', $requested );
	}

	public function testLibraryRoutesAreRegistered() {
		$routes = rest_get_server()->get_routes();

		foreach ( [ 'get_library', 'get_library_categories', 'get_connection', 'get_pattern_content' ] as $route ) {
			$this->assertArrayHasKey( '/kb-design-library/v1/' . $route, $routes );
		}
	}

	public function testLibraryPermissionAllowsContributorDeniesSubscriber() {
		$controller = $this->controller();
		$request    = new WP_REST_Request( 'GET', '/kb-design-library/v1/get_library' );

		wp_set_current_user( self::factory()->user->create( [ 'role' => 'subscriber' ] ) );
		$this->assertFalse( (bool) $controller->get_items_permission_check( $request ) );

		wp_set_current_user( self::factory()->user->create( [ 'role' => 'contributor' ] ) );
		$this->assertTrue( (bool) $controller->get_items_permission_check( $request ) );
	}
}
