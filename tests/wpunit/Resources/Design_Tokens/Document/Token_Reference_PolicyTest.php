<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Document;

use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Reference;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Reference_Policy;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use Tests\Support\Classes\TestCase;

/**
 * Covers Token_Reference_Policy::find() and all_supported().
 */
final class Token_Reference_PolicyTest extends TestCase {

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->policy = new Token_Reference_Policy();
	}

	/**
	 * @var Token_Reference_Policy
	 */
	private Token_Reference_Policy $policy;

	// -------------------------------------------------------------------------
	// no references
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testEmptyDocumentReturnsNoReferences(): void {
		$refs = $this->policy->find( [], 'primitive.color.custom.brand' );

		$this->assertSame( [], $refs );
	}

	/**
	 * @return void
	 */
	public function testDocumentWithNoAliasReturnsNoReferences(): void {
		$doc = [
			'semantic' => [
				'color' => [
					'button-bg' => [
						'$type'  => 'color',
						'$value' => '#FFFFFF',
					],
				],
			],
		];

		$refs = $this->policy->find( $doc, 'primitive.color.custom.brand' );

		$this->assertSame( [], $refs );
	}

	// -------------------------------------------------------------------------
	// semantic layer: direct $value alias (supported)
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testSemanticDirectValueAliasReturnsSupportedSemanticOverrideReference(): void {
		$id  = 'primitive.color.custom.brand';
		$doc = [
			'semantic' => [
				'color' => [
					'button-bg' => [
						'$type'  => 'color',
						'$value' => '{' . $id . '}',
					],
				],
			],
		];

		$refs = $this->policy->find( $doc, $id );

		$this->assertCount( 1, $refs );
		$this->assertSame( Token_Reference::get_kind_semantic_override(), $refs[0]->kind );
		$this->assertSame( 'semantic.color.button-bg', $refs[0]->path );
		$this->assertTrue( $refs[0]->supported );
	}

	// -------------------------------------------------------------------------
	// primitive layer: direct $value alias (supported)
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testPrimitiveLayerDirectValueAliasReturnsSupportedPrimitiveOverrideReference(): void {
		$id  = 'primitive.color.custom.brand';
		$doc = [
			'primitive' => [
				'color' => [
					'alias-token' => [
						'$type'  => 'color',
						'$value' => '{' . $id . '}',
					],
				],
			],
		];

		$refs = $this->policy->find( $doc, $id );

		$this->assertCount( 1, $refs );
		$this->assertSame( Token_Reference::get_kind_primitive_override(), $refs[0]->kind );
		$this->assertSame( 'primitive.color.alias-token', $refs[0]->path );
		$this->assertTrue( $refs[0]->supported );
	}

	// -------------------------------------------------------------------------
	// composite field alias (unsupported)
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testCompositeFieldAliasReturnsUnsupportedCompositeFieldReference(): void {
		$id  = 'primitive.color.custom.shadow-base';
		$doc = [
			'semantic' => [
				'shadow' => [
					'card' => [
						'$type'  => 'shadow',
						'$value' => [
							'color'   => '{' . $id . '}',
							'offsetX' => '0px',
							'offsetY' => '4px',
							'blur'    => '8px',
							'spread'  => '0px',
						],
					],
				],
			],
		];

		$refs = $this->policy->find( $doc, $id );

		$this->assertCount( 1, $refs );
		$this->assertSame( Token_Reference::get_kind_composite_field(), $refs[0]->kind );
		$this->assertSame( 'semantic.shadow.card.$value.color', $refs[0]->path );
		$this->assertFalse( $refs[0]->supported );
	}

	// -------------------------------------------------------------------------
	// nested composite field alias (unsupported) — recursion is generic, not a
	// fixed field-list walk, so a sub-field nested inside an array is still found
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testNestedCompositeFieldAliasReturnsUnsupportedCompositeFieldReference(): void {
		$id  = 'primitive.color.custom.shadow-base';
		$doc = [
			'semantic' => [
				'shadow' => [
					'layered' => [
						'$type'  => 'shadow',
						'$value' => [
							'layers' => [
								[
									'color' => '{' . $id . '}',
								],
							],
						],
					],
				],
			],
		];

		$refs = $this->policy->find( $doc, $id );

		$this->assertCount( 1, $refs );
		$this->assertSame( Token_Reference::get_kind_composite_field(), $refs[0]->kind );
		$this->assertSame( 'semantic.shadow.layered.$value.layers.0.color', $refs[0]->path );
		$this->assertFalse( $refs[0]->supported );
	}

	// -------------------------------------------------------------------------
	// extension preset tokens map (unsupported)
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testExtensionPresetTokensMapAliasReturnsUnsupportedExtensionReference(): void {
		$id      = 'primitive.color.custom.brand';
		$section = Extensions::get_section_presets();
		$doc     = [
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					$section => [
						'buttons' => [
							Extensions::get_default_key() => 'default',
							'dark'                        => [
								Extensions::get_tokens_key() => [
									'semantic.color.button-bg' => '{' . $id . '}',
								],
							],
						],
					],
				],
			],
		];

		$refs = $this->policy->find( $doc, $id );

		$this->assertCount( 1, $refs );
		$this->assertSame( Token_Reference::get_kind_extension(), $refs[0]->kind );
		$this->assertFalse( $refs[0]->supported );
	}

	// -------------------------------------------------------------------------
	// all_supported
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testAllSupportedReturnsTrueWhenAllReferencesAreSupported(): void {
		$refs = [
			new Token_Reference( Token_Reference::get_kind_semantic_override(), 'semantic.color.a', true ),
			new Token_Reference( Token_Reference::get_kind_semantic_override(), 'semantic.color.b', true ),
		];

		$this->assertTrue( $this->policy->all_supported( $refs ) );
	}

	/**
	 * @return void
	 */
	public function testAllSupportedReturnsTrueForEmptyArray(): void {
		$this->assertTrue( $this->policy->all_supported( [] ) );
	}

	/**
	 * @return void
	 */
	public function testAllSupportedReturnsFalseWhenAnyReferenceIsUnsupported(): void {
		$refs = [
			new Token_Reference( Token_Reference::get_kind_semantic_override(), 'semantic.color.a', true ),
			new Token_Reference( Token_Reference::get_kind_composite_field(), 'semantic.shadow.b.$value.color', false ),
		];

		$this->assertFalse( $this->policy->all_supported( $refs ) );
	}

	// -------------------------------------------------------------------------
	// $ -prefixed keys are skipped
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testDollarPrefixedKeysAreNotEmittedAsReferencePaths(): void {
		$id  = 'primitive.color.custom.brand';
		$doc = [
			'semantic' => [
				'$type'  => 'color',
				'$value' => '{' . $id . '}',
				'color'  => [
					'button-bg' => [
						'$type'  => 'color',
						'$value' => '#FFFFFF',
					],
				],
			],
		];

		$refs = $this->policy->find( $doc, $id );

		$this->assertSame( [], $refs );
	}

	// -------------------------------------------------------------------------
	// null $value (reset sentinel) is not matched
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testNullValueIsNotMatched(): void {
		$id  = 'primitive.color.custom.brand';
		$doc = [
			'semantic' => [
				'color' => [
					'button-bg' => [
						'$type'  => 'color',
						'$value' => null,
					],
				],
			],
		];

		$refs = $this->policy->find( $doc, $id );

		$this->assertSame( [], $refs );
	}

	// -------------------------------------------------------------------------
	// multiple references to the same id
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testMultipleReferencesToSameIdAreAllReturned(): void {
		$id  = 'primitive.color.custom.brand';
		$doc = [
			'semantic' => [
				'color' => [
					'button-bg'  => [
						'$type'  => 'color',
						'$value' => '{' . $id . '}',
					],
					'link-color' => [
						'$type'  => 'color',
						'$value' => '{' . $id . '}',
					],
					'focus-ring' => [
						'$type'  => 'color',
						'$value' => '{' . $id . '}',
					],
				],
			],
		];

		$refs = $this->policy->find( $doc, $id );

		$this->assertCount( 3, $refs );

		foreach ( $refs as $ref ) {
			$this->assertSame( Token_Reference::get_kind_semantic_override(), $ref->kind );
			$this->assertTrue( $ref->supported );
		}
	}

	// -------------------------------------------------------------------------
	// $default sentinel key is skipped in extension scan
	// -------------------------------------------------------------------------

	/**
	 * The $default metadata key (value: a string preset slug) is skipped and does not produce
	 * references, while actual preset entries ARE scanned.
	 *
	 * @return void
	 */
	public function testDollarDefaultSentinelKeyDoesNotProduceReferences(): void {
		$id      = 'primitive.color.custom.brand';
		$section = Extensions::get_section_presets();
		$doc     = [
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					$section => [
						'buttons' => [
							Extensions::get_default_key() => 'light',
						],
					],
				],
			],
		];

		$refs = $this->policy->find( $doc, $id );

		$this->assertSame( [], $refs );
	}
}
