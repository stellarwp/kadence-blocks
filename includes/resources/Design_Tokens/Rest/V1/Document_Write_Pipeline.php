<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Document_Path;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Reference_Policy;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\User_Primitive_Document_Validator;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\User_Primitive_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Alias_Cycle_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Dangling_Alias_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Dtcg_Validator;
use KadenceWP\KadenceBlocks\StellarWP\DB\Database\Exceptions\DatabaseQueryException;
use WP_Error;
use WP_Http;
use WP_REST_Response;

/**
 * The shared DTCG document write pipeline: load, validate, dry-run resolve, conditional persist.
 * Used by User_Primitives_Controller only.
 *
 * @since TBD
 */
final class Document_Write_Pipeline {

	/**
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @since TBD
	 *
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * @since TBD
	 *
	 * @var Dtcg_Validator
	 */
	private Dtcg_Validator $validator;

	/**
	 * @since TBD
	 *
	 * @var User_Primitive_Document_Validator
	 */
	private User_Primitive_Document_Validator $user_primitive_validator;

	/**
	 * @since TBD
	 *
	 * @var User_Primitive_Index
	 */
	private User_Primitive_Index $user_primitive_index;

	/**
	 * @since TBD
	 *
	 * @var Token_Reference_Policy
	 */
	private Token_Reference_Policy $reference_policy;

	/**
	 * @since TBD
	 *
	 * @param Token_Store                       $store
	 * @param Token_Resolver                    $resolver
	 * @param Dtcg_Validator                    $validator
	 * @param User_Primitive_Document_Validator $user_primitive_validator
	 * @param User_Primitive_Index              $user_primitive_index
	 * @param Token_Reference_Policy            $reference_policy
	 */
	public function __construct(
		Token_Store $store,
		Token_Resolver $resolver,
		Dtcg_Validator $validator,
		User_Primitive_Document_Validator $user_primitive_validator,
		User_Primitive_Index $user_primitive_index,
		Token_Reference_Policy $reference_policy
	) {
		$this->store                    = $store;
		$this->resolver                 = $resolver;
		$this->validator                = $validator;
		$this->user_primitive_validator = $user_primitive_validator;
		$this->user_primitive_index     = $user_primitive_index;
		$this->reference_policy         = $reference_policy;
	}

	/**
	 * Load and decode the stored overrides document for a library.
	 *
	 * @since TBD
	 *
	 * @param string $slug
	 *
	 * @return array<string, mixed>
	 */
	public function load_document( string $slug ): array {
		$raw = $this->store->get_document( $slug );

		if ( $raw === '' ) {
			return [];
		}

		$decoded = json_decode( $raw, true );

		return is_array( $decoded ) ? $decoded : [];
	}

	/**
	 * Read the current cache/concurrency version for a library.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token-library slug.
	 *
	 * @return string
	 */
	public function get_version( string $slug ): string {
		return $this->store->get_version( $slug );
	}

	/**
	 * Read the node at a dot-path within a decoded document.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param string               $path
	 *
	 * @return array<string, mixed>|null
	 */
	public function node_at( array $document, string $path ): ?array {
		return Document_Path::node_at( $document, $path );
	}

	/**
	 * Apply the multi-library document API slug policy.
	 *
	 * @since TBD
	 *
	 * @param string $slug
	 *
	 * @return WP_Error|null
	 */
	public function guard_slug( string $slug ): ?WP_Error {
		if ( $slug === Token_Store::default_slug() || $this->store->exists( $slug ) ) {
			return null;
		}

		return new WP_Error(
			'rest_design_tokens_not_found',
			__( 'The requested design token library does not exist.', 'kadence-blocks' ),
			[
				'status' => WP_Http::NOT_FOUND,
				'slug'   => $slug,
			]
		);
	}

	/**
	 * Check the stored version against the client-supplied version. Returns a 409 on mismatch.
	 *
	 * @since TBD
	 *
	 * @param string $slug           The token library slug.
	 * @param string $client_version The version the client last read. Empty only for first write.
	 *
	 * @return WP_Error|null
	 */
	public function guard_version( string $slug, string $client_version ): ?WP_Error {
		$stored = $this->store->get_version( $slug );

		if ( $stored === '' && $client_version === '' ) {
			return null;
		}

		if ( $stored === $client_version ) {
			return null;
		}

		return new WP_Error(
			'rest_design_tokens_conflict',
			__( 'The token library was modified since you last read it. Reload and try again.', 'kadence-blocks' ),
			[
				'status' => WP_Http::CONFLICT,
				'slug'   => $slug,
			]
		);
	}

	/**
	 * Validate a candidate document, dry-run resolve it, then conditionally persist.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $candidate                            Full candidate overrides document.
	 * @param string               $slug                                 Token library slug.
	 * @param string               $title                                Optional label.
	 * @param string               $expected_version                    The version the caller last read.
	 * @param int                  $success_status                      HTTP status on success (200 or 201).
	 * @param bool                 $skip_user_primitive_reference_check Whether to skip the check that
	 *                                                                   rejects a user-primitive reference
	 *                                                                   from outside the semantic layer.
	 *                                                                   The rename cascade passes true: it
	 *                                                                   already gated on and rewrote those
	 *                                                                   references before building
	 *                                                                   $candidate, so re-checking here
	 *                                                                   would reject the very reference it
	 *                                                                   just rewrote.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function validate_and_save(
		array $candidate,
		string $slug,
		string $title,
		string $expected_version,
		int $success_status = WP_Http::OK,
		bool $skip_user_primitive_reference_check = false
	) {
		if ( $candidate !== [] ) {
			$invariant_errors = $this->user_primitive_validator->validate( $candidate );

			if ( ! empty( $invariant_errors ) ) {
				return new WP_Error(
					'rest_design_tokens_user_primitive_invalid',
					__( 'The user primitive document invariant failed.', 'kadence-blocks' ),
					[
						'status' => WP_Http::UNPROCESSABLE_ENTITY,
						'slug'   => $slug,
						'errors' => array_map(
							static fn( $error ): array => [
								'id'      => $error->get_id(),
								'message' => $error->get_message(),
							],
							$invariant_errors
						),
					]
				);
			}

			if ( ! $skip_user_primitive_reference_check ) {
				foreach ( array_keys( $this->user_primitive_index->all( $candidate ) ) as $user_primitive_id ) {
					$references = $this->reference_policy->find( $candidate, (string) $user_primitive_id );

					if ( ! $this->reference_policy->all_semantic_overrides( $references ) ) {
						return new WP_Error(
							'rest_design_tokens_user_primitive_reference_unsupported',
							__( 'The document contains an unsupported reference to a user primitive.', 'kadence-blocks' ),
							[
								'status' => WP_Http::UNPROCESSABLE_ENTITY,
								'slug'   => $slug,
							]
						);
					}
				}
			}

			$result = $this->validator->validate( $candidate, Dtcg_Validator::get_context_overrides() );

			if ( ! $result->is_valid() ) {
				return new WP_Error(
					'rest_design_tokens_invalid',
					__( 'The design token document failed validation.', 'kadence-blocks' ),
					[
						'status' => WP_Http::UNPROCESSABLE_ENTITY,
						'slug'   => $slug,
						'errors' => $result->to_array(),
					]
				);
			}

			try {
				$this->resolver->resolve_overrides( $candidate );
			} catch ( Alias_Cycle_Exception | Dangling_Alias_Exception $e ) {
				return new WP_Error(
					'rest_design_tokens_unresolvable',
					$e->getMessage(),
					[
						'status' => WP_Http::UNPROCESSABLE_ENTITY,
						'slug'   => $slug,
					]
				);
			}
		}

		return $this->persist( $candidate, $slug, $title, $expected_version, $success_status );
	}

	/**
	 * @since TBD
	 *
	 * @param array<string, mixed> $candidate
	 * @param string               $slug
	 * @param string               $title
	 * @param string               $expected_version
	 * @param int                  $success_status
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	private function persist(
		array $candidate,
		string $slug,
		string $title,
		string $expected_version,
		int $success_status
	) {
		$encoded = $candidate !== [] ? wp_json_encode( $candidate ) : '';

		if ( $candidate !== [] && $encoded === false ) {
			return new WP_Error(
				'rest_design_tokens_save_failed',
				__( 'The design token document could not be encoded.', 'kadence-blocks' ),
				[
					'status' => WP_Http::INTERNAL_SERVER_ERROR,
					'slug'   => $slug,
				]
			);
		}

		try {
			$saved = $this->store->save_document_conditional( (string) $encoded, $expected_version, $slug, $title );
		} catch ( DatabaseQueryException $e ) {
			return new WP_Error(
				'rest_design_tokens_save_failed',
				__( 'The design token library could not be saved.', 'kadence-blocks' ),
				[
					'status' => WP_Http::INTERNAL_SERVER_ERROR,
					'slug'   => $slug,
				]
			);
		}

		if ( ! $saved ) {
			return new WP_Error(
				'rest_design_tokens_conflict',
				__( 'The token library was modified since you last read it. Reload and try again.', 'kadence-blocks' ),
				[
					'status' => WP_Http::CONFLICT,
					'slug'   => $slug,
				]
			);
		}

		return new WP_REST_Response(
			[
				'slug'     => $slug,
				'version'  => $this->store->get_version( $slug ),
				'document' => $candidate,
			],
			$success_status
		);
	}
}
