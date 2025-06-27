<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Nonce;

use KadenceWP\KadenceBlocks\Optimizer\Nonce\Nonce;
use Tests\Support\Classes\TestCase;

final class NonceTest extends TestCase {

	private Nonce $nonce;
	private int $original_user_id;

	protected function setUp(): void {
		parent::setUp();

		// Create and log in a test user.
		$user_id = $this->factory()->user->create( [ 'role' => 'editor' ] );
		wp_set_current_user( $user_id );

		$this->nonce            = $this->container->get( Nonce::class );
		$this->original_user_id = get_current_user_id();

		$this->assertGreaterThan( 0, $this->original_user_id );
	}

	protected function tearDown(): void {
		// Restore original user.
		wp_set_current_user( $this->original_user_id );

		parent::tearDown();
	}

	public function testItReturnsCorrectNonceIdConstant(): void {
		$this->assertEquals( -1223685899, Nonce::NONCE_ID );
	}

	public function testItCreatesWithDefaultAction(): void {
		$this->assertInstanceOf( Nonce::class, $this->nonce );
	}

	public function testItCreatesWithCustomAction(): void {
		$custom_action = 'custom-test-action';
		$nonce         = new Nonce( $custom_action );

		$this->assertInstanceOf( Nonce::class, $nonce );
	}

	public function testItCreatesValidNonce(): void {
		$nonce_value = $this->nonce->create();

		$this->assertIsString( $nonce_value );
		$this->assertNotEmpty( $nonce_value );
		$this->assertMatchesRegularExpression( '/^[a-f0-9]{10}$/', $nonce_value );
	}

	public function testItCreatesNonceForLoggedOutUserContext(): void {
		// Create a user and log them in.
		$user_id = $this->factory()->user->create( [ 'role' => 'editor' ] );
		wp_set_current_user( $user_id );

		// Verify we're logged in.
		$this->assertEquals( $user_id, get_current_user_id() );

		// Create nonce.
		$nonce_value = $this->nonce->create();

		// Verify user context was restored.
		$this->assertEquals( $user_id, get_current_user_id() );

		// Verify nonce was created for logged-out context by trying to verify it as logged-out user.
		wp_set_current_user( 0 );
		$verified = wp_verify_nonce( $nonce_value, 'kb-optimizer' );
		$this->assertNotFalse( $verified );
	}

	public function testItRestoresOriginalUserAfterCreate(): void {
		// Create a user and log them in.
		$user_id = $this->factory()->user->create( [ 'role' => 'editor' ] );
		wp_set_current_user( $user_id );

		// Verify we're logged in.
		$this->assertEquals( $user_id, get_current_user_id() );

		// Create nonce.
		$this->nonce->create();

		// Verify original user was restored.
		$this->assertEquals( $user_id, get_current_user_id() );
	}

	public function testItVerifiesValidNonce(): void {
		$nonce_value = $this->nonce->create();
		$verified    = $this->nonce->verify( $nonce_value );

		$this->assertNotFalse( $verified );
		$this->assertIsInt( $verified );
	}

	public function testItRejectsInvalidNonce(): void {
		$invalid_nonce = 'invalid-nonce-value';
		$verified      = $this->nonce->verify( $invalid_nonce );

		$this->assertFalse( $verified );
	}

	public function testItVerifiesNonceInLoggedOutUserContext(): void {
		// Create a user and log them in.
		$user_id = $this->factory()->user->create( [ 'role' => 'editor' ] );
		wp_set_current_user( $user_id );

		// Create nonce while logged in.
		$nonce_value = $this->nonce->create();

		// Verify we're still logged in.
		$this->assertEquals( $user_id, get_current_user_id() );

		// Verify nonce.
		$verified = $this->nonce->verify( $nonce_value );

		// Verify user context was restored.
		$this->assertEquals( $user_id, get_current_user_id() );

		// Verify nonce was validated.
		$this->assertNotFalse( $verified );
	}

	public function testItRestoresOriginalUserAfterVerify(): void {
		// Create a user and log them in.
		$user_id = $this->factory()->user->create( [ 'role' => 'editor' ] );
		wp_set_current_user( $user_id );

		// Create and verify nonce.
		$nonce_value = $this->nonce->create();
		$this->nonce->verify( $nonce_value );

		// Verify original user was restored.
		$this->assertEquals( $user_id, get_current_user_id() );
	}

	public function testItWorksWithCustomAction(): void {
		$custom_action = 'custom-test-action';
		$custom_nonce  = new Nonce( $custom_action );

		$nonce_value = $custom_nonce->create();
		$verified    = $custom_nonce->verify( $nonce_value );

		$this->assertNotFalse( $verified );
	}

	public function testItRejectsNonceWithWrongAction(): void {
		// Create nonce with default action.
		$nonce_value = $this->nonce->create();

		// Try to verify with different action.
		$different_action_nonce = new Nonce( 'different-action' );
		$verified               = $different_action_nonce->verify( $nonce_value );

		$this->assertFalse( $verified );
	}

	public function testItHandlesEmptyNonceValue(): void {
		$verified = $this->nonce->verify( '' );

		$this->assertFalse( $verified );
	}

	public function testItCreatesSameNonceOnMultipleCalls(): void {
		$nonce1 = $this->nonce->create();
		$nonce2 = $this->nonce->create();

		// WordPress nonces are designed to be the same for the same user/action within the timeframe.
		$this->assertEquals( $nonce1, $nonce2 );
		$this->assertNotFalse( $this->nonce->verify( $nonce1 ) );
		$this->assertNotFalse( $this->nonce->verify( $nonce2 ) );
	}

	public function testItWorksWhenAlreadyLoggedOut(): void {
		// Ensure we're logged out.
		wp_set_current_user( 0 );
		$this->assertEquals( 0, get_current_user_id() );

		// Create and verify nonce.
		$nonce_value = $this->nonce->create();
		$verified    = $this->nonce->verify( $nonce_value );

		// Should still work and user should remain logged out.
		$this->assertEquals( 0, get_current_user_id() );
		$this->assertNotFalse( $verified );
	}

	public function testItCustomizesNonceIdForLoggedOutUserWithMatchingAction(): void {
		$result = $this->nonce->customize_nonce_id( 0, 'kb-optimizer' );

		$this->assertEquals( Nonce::NONCE_ID, $result );
	}

	public function testItDoesNotCustomizeNonceIdForLoggedInUser(): void {
		$user_id = 123;
		$result  = $this->nonce->customize_nonce_id( $user_id, 'kb-optimizer' );

		$this->assertEquals( $user_id, $result );
	}

	public function testItDoesNotCustomizeNonceIdForDifferentAction(): void {
		$result = $this->nonce->customize_nonce_id( 0, 'different-action' );

		$this->assertEquals( 0, $result );
	}

	public function testItCustomizesNonceIdOnlyForMatchingActionAndLoggedOutUser(): void {
		// Test with custom action nonce.
		$custom_nonce = new Nonce( 'custom-action' );

		// Should customize for matching action and logged-out user.
		$result = $custom_nonce->customize_nonce_id( 0, 'custom-action' );
		$this->assertEquals( Nonce::NONCE_ID, $result );

		// Should not customize for different action.
		$result = $custom_nonce->customize_nonce_id( 0, 'different-action' );
		$this->assertEquals( 0, $result );

		// Should not customize for logged-in user.
		$result = $custom_nonce->customize_nonce_id( 456, 'custom-action' );
		$this->assertEquals( 456, $result );
	}
}
