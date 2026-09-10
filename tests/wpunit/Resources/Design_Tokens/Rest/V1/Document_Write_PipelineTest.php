<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Document_Write_Pipeline;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use Tests\Support\Classes\TestCase;
use WP_Error;
use WP_Http;
use WP_REST_Response;

/**
 * Covers the Document_Write_Pipeline service: guard methods and the validate-and-save pipeline.
 */
final class Document_Write_PipelineTest extends TestCase {

	/**
	 * @var Document_Write_Pipeline
	 */
	private Document_Write_Pipeline $pipeline;

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->pipeline = $this->container->get( Document_Write_Pipeline::class );
		$this->store    = $this->container->get( Token_Store::class );
	}

	// -------------------------------------------------------------------------
	// guard_slug
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testGuardSlugAllowsTheDefaultSlug(): void {
		$result = $this->pipeline->guard_slug( Token_Store::default_slug() );

		$this->assertNull( $result );
	}

	/**
	 * @return void
	 */
	public function testGuardSlugAllowsAnExistingNamedSet(): void {
		$this->store->save_document( '{}', 'my-set' );

		$result = $this->pipeline->guard_slug( 'my-set' );

		$this->assertNull( $result );
	}

	/**
	 * @return void
	 */
	public function testGuardSlugReturns404ForAnUnknownSlug(): void {
		$result = $this->pipeline->guard_slug( 'does-not-exist' );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_not_found', $result->get_error_code() );
		$this->assertSame( WP_Http::NOT_FOUND, $result->get_error_data()['status'] );
	}

	// -------------------------------------------------------------------------
	// guard_version
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testGuardVersionReturnNullWhenBothVersionsAreEmpty(): void {
		$result = $this->pipeline->guard_version( Token_Store::default_slug(), '' );

		$this->assertNull( $result );
	}

	/**
	 * @return void
	 */
	public function testGuardVersionReturnNullWhenVersionsMatch(): void {
		$this->store->save_document( '{"primitive":{}}', Token_Store::default_slug() );
		$version = $this->store->get_version( Token_Store::default_slug() );

		$result = $this->pipeline->guard_version( Token_Store::default_slug(), $version );

		$this->assertNull( $result );
	}

	/**
	 * @return void
	 */
	public function testGuardVersionReturns409OnMismatch(): void {
		$this->store->save_document( '{"primitive":{}}', Token_Store::default_slug() );

		$result = $this->pipeline->guard_version( Token_Store::default_slug(), 'stale-version' );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_conflict', $result->get_error_code() );
		$this->assertSame( WP_Http::CONFLICT, $result->get_error_data()['status'] );
	}

	// -------------------------------------------------------------------------
	// validate_and_save: user primitive invariant failure
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testValidateAndSaveReturns422WhenUserPrimitiveInvariantFails(): void {
		// Envelope entry present but no matching tree leaf — invariant violation.
		$id        = 'primitive.color.custom.brand';
		$candidate = [
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					Extensions::get_section_user_primitives() => [
						$id => [ 'label' => 'Brand' ],
					],
				],
			],
		];

		$result = $this->pipeline->validate_and_save( $candidate, Token_Store::default_slug(), '', '', WP_Http::CREATED );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_user_primitive_invalid', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );

		$errors = $result->get_error_data()['errors'];

		$this->assertNotEmpty( $errors );
		$this->assertArrayHasKey( 'id', $errors[0] );
		$this->assertArrayHasKey( 'message', $errors[0] );
		$this->assertSame( $id, $errors[0]['id'] );
	}

	// -------------------------------------------------------------------------
	// validate_and_save: unsupported user-primitive reference
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testValidateAndSaveReturns422WhenUserPrimitiveHasUnsupportedReference(): void {
		// A user primitive referenced from the primitive layer is unsupported.
		$id        = 'primitive.color.custom.brand';
		$candidate = [
			'primitive'                      => [
				'color' => [
					'custom'          => [
						'brand' => [
							'$type'  => 'color',
							'$value' => '#3182CE',
						],
					],
					// Unsupported: alias to a user primitive from another primitive token.
					'alias-to-custom' => [
						'$type'  => 'color',
						'$value' => '{' . $id . '}',
					],
				],
			],
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					Extensions::get_section_user_primitives() => [
						$id => [ 'label' => 'Brand' ],
					],
				],
			],
		];

		$result = $this->pipeline->validate_and_save( $candidate, Token_Store::default_slug(), '', '', WP_Http::CREATED );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_user_primitive_reference_unsupported', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
	}

	// -------------------------------------------------------------------------
	// validate_and_save: DTCG validation failure
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testValidateAndSaveReturns422OnInvalidDtcg(): void {
		$candidate = [
			'primitive' => [
				'color' => [
					'bad-type' => [
						'$type'  => 'bogus-unknown-type',
						'$value' => '#ffffff',
					],
				],
			],
		];

		$result = $this->pipeline->validate_and_save( $candidate, Token_Store::default_slug(), '', '', WP_Http::CREATED );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_invalid', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
		$this->assertNotEmpty( $result->get_error_data()['errors'] );
	}

	// -------------------------------------------------------------------------
	// validate_and_save: resolver alias cycle
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testValidateAndSaveReturns422OnAliasCycle(): void {
		$candidate = [
			'primitive' => [
				'color' => [
					'cycle-a' => [
						'$type'  => 'color',
						'$value' => '{primitive.color.cycle-b}',
					],
					'cycle-b' => [
						'$type'  => 'color',
						'$value' => '{primitive.color.cycle-a}',
					],
				],
			],
		];

		$result = $this->pipeline->validate_and_save( $candidate, Token_Store::default_slug(), '', '', WP_Http::CREATED );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_unresolvable', $result->get_error_code() );
		$this->assertSame( WP_Http::UNPROCESSABLE_ENTITY, $result->get_error_data()['status'] );
		$this->assertSame( '', $this->store->get_document( Token_Store::default_slug() ) );
	}

	// -------------------------------------------------------------------------
	// validate_and_save: version mismatch → 409
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testValidateAndSaveReturns409WhenVersionMismatches(): void {
		$this->store->save_document_conditional(
			'{"primitive":{"color":{"brand":{"primary":{"$type":"color","$value":"#336699"}}}}}',
			'',
			Token_Store::default_slug()
		);

		$candidate = [
			'primitive' => [
				'color' => [
					'brand' => [
						'primary' => [
							'$type'  => 'color',
							'$value' => '#ff0000',
						],
					],
				],
			],
		];

		$result = $this->pipeline->validate_and_save(
			$candidate,
			Token_Store::default_slug(),
			'',
			'stale-version-xyz',
			WP_Http::OK
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'rest_design_tokens_conflict', $result->get_error_code() );
		$this->assertSame( WP_Http::CONFLICT, $result->get_error_data()['status'] );
	}

	// -------------------------------------------------------------------------
	// validate_and_save: first write → 201
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testValidateAndSaveReturns201OnFirstWriteWithEmptyVersion(): void {
		$slug      = 'brand-new-set';
		$candidate = [
			'primitive' => [
				'color' => [
					'brand' => [
						'primary' => [
							'$type'  => 'color',
							'$value' => '#3182CE',
						],
					],
				],
			],
		];

		$result = $this->pipeline->validate_and_save( $candidate, $slug, 'Brand Set', '', WP_Http::CREATED );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
		$this->assertSame( WP_Http::CREATED, $result->get_status() );

		$data = $result->get_data();

		$this->assertSame( $slug, $data['slug'] );
		$this->assertNotEmpty( $data['version'] );
		$this->assertSame( $candidate, $data['document'] );
	}

	// -------------------------------------------------------------------------
	// validate_and_save: successful update → 200
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testValidateAndSaveReturns200OnSuccessfulUpdateWithCorrectVersion(): void {
		$slug = Token_Store::default_slug();

		$this->store->save_document_conditional(
			'{"primitive":{"color":{"brand":{"primary":{"$type":"color","$value":"#336699"}}}}}',
			'',
			$slug
		);

		$version   = $this->store->get_version( $slug );
		$candidate = [
			'primitive' => [
				'color' => [
					'brand' => [
						'primary' => [
							'$type'  => 'color',
							'$value' => '#ff0000',
						],
					],
				],
			],
		];

		$result = $this->pipeline->validate_and_save( $candidate, $slug, '', $version, WP_Http::OK );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
		$this->assertSame( WP_Http::OK, $result->get_status() );

		$data = $result->get_data();

		$this->assertSame( $slug, $data['slug'] );
		$this->assertNotEmpty( $data['version'] );
		$this->assertNotSame( $version, $data['version'] );
		$this->assertSame( $candidate, $data['document'] );
	}
}
