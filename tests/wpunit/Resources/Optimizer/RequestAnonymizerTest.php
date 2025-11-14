<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer;

use KadenceWP\KadenceBlocks\Optimizer\Nonce\Nonce;
use KadenceWP\KadenceBlocks\Optimizer\Request;
use KadenceWP\KadenceBlocks\Optimizer\Request_Anonymizer;
use Tests\Support\Classes\OptimizerTestCase;
use WPDieException;

final class RequestAnonymizerTest extends OptimizerTestCase {

	private Request_Anonymizer $anonymizer;
	private Nonce $nonce;
	private int $user_id;

	protected function setUp(): void {
		parent::setUp();

		$this->nonce      = $this->container->get( Nonce::class );
		$this->anonymizer = $this->container->get( Request_Anonymizer::class );

		// Create a test user.
		$this->user_id = $this->factory()->user->create(
			[
				'role' => 'administrator',
			]
		);

		$this->assertGreaterThan( 0, $this->user_id );
	}

	protected function tearDown(): void {
		// Reset current user.
		wp_set_current_user( 0 );

		// Clean up globals.
		unset( $_GET[ Request::QUERY_TOKEN ] );

		parent::tearDown();
	}

	public function testItDoesNothingWhenNoNonceProvided(): void {
		wp_set_current_user( $this->user_id );
		$this->assertTrue( is_user_logged_in() );

		$this->anonymizer->force_anonymous_request();

		// User should still be logged in.
		$this->assertTrue( is_user_logged_in() );
		$this->assertEquals( $this->user_id, get_current_user_id() );
	}

	public function testItDoesNothingWhenUserNotLoggedIn(): void {
		wp_set_current_user( 0 );
		$this->assertFalse( is_user_logged_in() );

		// Set a valid nonce but user is not logged in.
		$_GET[ Request::QUERY_TOKEN ] = $this->nonce->create();

		$this->anonymizer->force_anonymous_request();

		// User should still not be logged in.
		$this->assertFalse( is_user_logged_in() );
		$this->assertEquals( 0, get_current_user_id() );
	}

	public function testItDiesWithInvalidNonce(): void {
		wp_set_current_user( $this->user_id );
		$this->assertTrue( is_user_logged_in() );

		// Set an invalid nonce.
		$_GET[ Request::QUERY_TOKEN ] = 'invalid_nonce';

		$this->expectException( WPDieException::class );
		$this->expectExceptionMessage( 'Invalid optimizer nonce.' );

		$this->anonymizer->force_anonymous_request();
	}

	public function testItAnonymizesRequestWithValidNonce(): void {
		wp_set_current_user( $this->user_id );
		$this->assertTrue( is_user_logged_in() );
		$this->assertEquals( $this->user_id, get_current_user_id() );

		// Set a valid nonce.
		$_GET[ Request::QUERY_TOKEN ] = $this->nonce->create();

		$this->anonymizer->force_anonymous_request();

		// User should now be anonymous.
		$this->assertFalse( is_user_logged_in() );
		$this->assertEquals( 0, get_current_user_id() );
	}

	public function testItWorksWithDifferentUserRoles(): void {
		$roles = [ 'administrator', 'editor', 'author', 'contributor', 'subscriber' ];

		foreach ( $roles as $role ) {
			// Create user with specific role.
			$user_id = $this->factory()->user->create( [ 'role' => $role ] );
			wp_set_current_user( $user_id );

			$this->assertTrue( is_user_logged_in() );
			$this->assertEquals( $user_id, get_current_user_id() );

			// Set a valid nonce.
			$_GET[ Request::QUERY_TOKEN ] = $this->nonce->create();

			$this->anonymizer->force_anonymous_request();

			// User should be anonymous regardless of role.
			$this->assertFalse( is_user_logged_in() );
			$this->assertEquals( 0, get_current_user_id() );

			// Clean up for next iteration.
			unset( $_GET[ Request::QUERY_TOKEN ] );
		}
	}

	public function testItSanitizesNonceParameter(): void {
		wp_set_current_user( $this->user_id );

		// Test with array (should be sanitized to string).
		$_REQUEST[ Request::QUERY_TOKEN ] = [ 'malicious_array' ];

		$this->anonymizer->force_anonymous_request();

		// Should not have anonymized due to sanitization.
		$this->assertTrue( is_user_logged_in() );
		$this->assertEquals( $this->user_id, get_current_user_id() );
	}

	public function testItHandlesEmptyNonceString(): void {
		wp_set_current_user( $this->user_id );
		$_REQUEST[ Request::QUERY_TOKEN ] = '';

		$this->anonymizer->force_anonymous_request();

		// Should not have anonymized.
		$this->assertTrue( is_user_logged_in() );
		$this->assertEquals( $this->user_id, get_current_user_id() );
	}

	public function testQueryVarConstant(): void {
		$this->assertEquals( 'perf_token', Request::QUERY_TOKEN );
	}
}
