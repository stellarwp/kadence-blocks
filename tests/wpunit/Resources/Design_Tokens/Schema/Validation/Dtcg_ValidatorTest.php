<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Schema\Validation;

use Generator;
use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Dtcg_Validator;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Validation_Error;
use Tests\Support\Classes\TestCase;

final class Dtcg_ValidatorTest extends TestCase {

	private Dtcg_Validator $validator;

	protected function setUp(): void {
		parent::setUp();

		$this->validator = new Dtcg_Validator();
	}

	/**
	 * @return void
	 */
	public function testTheShippedBaselineValidatesAsABaseline(): void {
		$document = json_decode( $this->get_baseline(), true );

		$result = $this->validator->validate( $document, Dtcg_Validator::get_context_baseline() );

		$this->assertTrue( $result->is_valid(), $this->describe( $result->errors() ) );
	}

	/**
	 * @return void
	 */
	public function testTheBaselineAlsoValidatesAsOverrides(): void {
		$document = json_decode( $this->get_baseline(), true );

		$this->assertTrue( $this->validator->validate( $document, Dtcg_Validator::get_context_overrides() )->is_valid() );
	}

	/**
	 * @return void
	 */
	public function testAnEmptyDocumentIsValid(): void {
		$this->assertTrue( $this->validator->validate( [], Dtcg_Validator::get_context_overrides() )->is_valid() );
	}

	/**
	 * A well-formed colorPalettes section validates: a swatch `$value` may be a literal color or a
	 * whole-string alias, both accepted by the palette branch's alias-or-literal grammar.
	 *
	 * @return void
	 */
	public function testAWellFormedColorPalettesSectionValidates(): void {
		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'colorPalettes' => [
						'$default' => 'default',
						'$current' => 'default',
						'default'  => [
							'label'  => 'Default',
							'groups' => [
								[
									'id'       => 'accent',
									'label'    => 'Accent',
									'swatches' => [
										[
											'token'  => 'primitive.color.brand.primary',
											'label'  => 'Main 1',
											'$value' => '#3182CE',
										],
										[
											'token'  => 'semantic.color.link',
											'label'  => 'Link',
											'$value' => '{primitive.color.brand.primary}',
										],
									],
								],
							],
						],
					],
				],
			],
		];

		$result = $this->validator->validate( $document, Dtcg_Validator::get_context_overrides() );

		$this->assertTrue( $result->is_valid(), $this->describe( $result->errors() ) );
	}

	/**
	 * A well-formed tokenLabels section validates: every entry maps a non-empty string id to a
	 * non-empty string label.
	 *
	 * @return void
	 */
	public function testAWellFormedTokenLabelsSectionValidates(): void {
		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'tokenLabels' => [
						'semantic.color.button-bg' => 'Brand Button',
					],
				],
			],
		];

		$result = $this->validator->validate( $document, Dtcg_Validator::get_context_overrides() );

		$this->assertTrue( $result->is_valid(), $this->describe( $result->errors() ) );
	}

	/**
	 * A document without a tokenLabels section produces no new errors, and a non-Kadence
	 * extension namespace alongside it is passed through untouched.
	 *
	 * @return void
	 */
	public function testADocumentWithoutTheTokenLabelsSectionIsUnaffected(): void {
		$document = [
			'$extensions' => [
				'some.other.vendor' => [
					'tokenLabels' => [ 0 => 'not-kadence-owned' ],
				],
			],
		];

		$result = $this->validator->validate( $document, Dtcg_Validator::get_context_overrides() );

		$this->assertTrue( $result->is_valid(), $this->describe( $result->errors() ) );
	}

	/**
	 * A well-formed tokenOrder section validates: a sequential list of non-empty string token ids.
	 *
	 * @return void
	 */
	public function testAWellFormedTokenOrderSectionValidates(): void {
		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'tokenOrder' => [ 'semantic.color.button-bg', 'semantic.color.button-text' ],
				],
			],
		];

		$result = $this->validator->validate( $document, Dtcg_Validator::get_context_overrides() );

		$this->assertTrue( $result->is_valid(), $this->describe( $result->errors() ) );
	}

	/**
	 * A stored id that names no registered token does not fail validation: whether it resolves is
	 * data drift, enforced by the REST write guard and the feed merge, not full-document grammar.
	 *
	 * @return void
	 */
	public function testATokenOrderEntryNamingAnUnregisteredIdStillValidates(): void {
		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'tokenOrder' => [ 'semantic.color.does-not-exist' ],
				],
			],
		];

		$result = $this->validator->validate( $document, Dtcg_Validator::get_context_overrides() );

		$this->assertTrue( $result->is_valid(), $this->describe( $result->errors() ) );
	}

	/**
	 * A well-formed favoriteFonts section validates: a sequential list of non-empty family names.
	 *
	 * @return void
	 */
	public function testAWellFormedFavoriteFontsSectionValidates(): void {
		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'favoriteFonts' => [ 'Inter', 'Abril Fatface' ],
				],
			],
		];

		$result = $this->validator->validate( $document, Dtcg_Validator::get_context_overrides() );

		$this->assertTrue( $result->is_valid(), $this->describe( $result->errors() ) );
	}

	/**
	 * A stored favorite naming a family the site's catalog does not carry does not fail validation:
	 * a theme switch stranding a favorite is data drift, enforced by the REST write guard, not
	 * full-document grammar — and the removal path deliberately accepts such a family so it can be
	 * cleared.
	 *
	 * @return void
	 */
	public function testAFavoriteFontNamingAnUncataloguedFamilyStillValidates(): void {
		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'favoriteFonts' => [ 'A Font No Catalog Carries' ],
				],
			],
		];

		$result = $this->validator->validate( $document, Dtcg_Validator::get_context_overrides() );

		$this->assertTrue( $result->is_valid(), $this->describe( $result->errors() ) );
	}

	/**
	 * Every one of the four metadata sections contracts for an array, so a scalar or a null stored
	 * under any of their keys is a malformed document and has to be reported as one. Each section
	 * used to be reached through a guard that required an array before it would run its validator,
	 * which meant exactly the values that are wrong were the values that skipped the check.
	 *
	 * @dataProvider nonArrayExtensionSectionProvider
	 *
	 * @param string $section The `$extensions.com.kadence.designTokens` section key.
	 * @param mixed  $value   The malformed value stored under it.
	 *
	 * @return void
	 */
	public function testANonArrayExtensionSectionIsRejected( string $section, $value ): void {
		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					$section => $value,
				],
			],
		];

		$errors = $this->validator->validate( $document, Dtcg_Validator::get_context_overrides() )->errors();

		$this->assertCount( 1, $errors, $this->describe( $errors ) );
		$this->assertSame( Validation_Error::get_code_value_invalid(), $errors[0]->code );
		$this->assertSame( '$extensions.com.kadence.designTokens.' . $section, $errors[0]->path );
	}

	/**
	 * Each of the four sections against each way a stored value can fail to be an array. Written as a
	 * cross-product so tightening one section can never quietly leave a sibling behind.
	 *
	 * @return Generator
	 */
	public function nonArrayExtensionSectionProvider(): Generator {
		$sections = [ 'colorPalettes', 'tokenLabels', 'tokenOrder', 'favoriteFonts' ];
		$values   = [
			'string'  => 'Inter',
			'empty string' => '',
			'int'     => 42,
			'float'   => 1.5,
			'true'    => true,
			'false'   => false,
			'null'    => null,
		];

		foreach ( $sections as $section ) {
			foreach ( $values as $label => $value ) {
				yield $section . ' as a ' . $label => [
					'section' => $section,
					'value'   => $value,
				];
			}
		}
	}

	/**
	 * The array control for the case above: each section's own well-formed shape still validates, so
	 * the rejection cannot be passing by refusing every value stored under these keys.
	 *
	 * @dataProvider wellFormedExtensionSectionProvider
	 *
	 * @param string               $section The `$extensions.com.kadence.designTokens` section key.
	 * @param array<int|string, mixed> $value The section's well-formed value.
	 *
	 * @return void
	 */
	public function testAWellFormedExtensionSectionStillValidates( string $section, array $value ): void {
		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					$section => $value,
				],
			],
		];

		$result = $this->validator->validate( $document, Dtcg_Validator::get_context_overrides() );

		$this->assertTrue( $result->is_valid(), $this->describe( $result->errors() ) );
	}

	/**
	 * One well-formed value per section, plus the empty array each of them accepts.
	 *
	 * @return Generator
	 */
	public function wellFormedExtensionSectionProvider(): Generator {
		yield 'colorPalettes' => [
			'section' => 'colorPalettes',
			'value'   => [
				'default' => [
					'groups' => [
						[ 'swatches' => [ [ '$value' => '#3182CE' ] ] ],
					],
				],
			],
		];
		yield 'tokenLabels' => [
			'section' => 'tokenLabels',
			'value'   => [ 'semantic.color.button-bg' => 'Button Background' ],
		];
		yield 'tokenOrder' => [
			'section' => 'tokenOrder',
			'value'   => [ 'semantic.color.button-bg', 'semantic.color.button-text' ],
		];
		yield 'favoriteFonts' => [
			'section' => 'favoriteFonts',
			'value'   => [ 'Inter', 'Abril Fatface' ],
		];
		yield 'colorPalettes empty' => [
			'section' => 'colorPalettes',
			'value'   => [],
		];
		yield 'tokenLabels empty' => [
			'section' => 'tokenLabels',
			'value'   => [],
		];
		yield 'tokenOrder empty' => [
			'section' => 'tokenOrder',
			'value'   => [],
		];
		yield 'favoriteFonts empty' => [
			'section' => 'favoriteFonts',
			'value'   => [],
		];
	}

	/**
	 * A document without a tokenOrder section produces no new errors, and a non-Kadence extension
	 * namespace alongside it is passed through untouched.
	 *
	 * @return void
	 */
	public function testADocumentWithoutTheTokenOrderSectionIsUnaffected(): void {
		$document = [
			'$extensions' => [
				'some.other.vendor' => [
					'tokenOrder' => [ 0 => 'not-kadence-owned' ],
				],
			],
		];

		$result = $this->validator->validate( $document, Dtcg_Validator::get_context_overrides() );

		$this->assertTrue( $result->is_valid(), $this->describe( $result->errors() ) );
	}

	/**
	 * @return void
	 */
	public function testItIsResolvableFromTheContainer(): void {
		$this->assertInstanceOf( Dtcg_Validator::class, $this->container->get( Dtcg_Validator::class ) );
	}

	/**
	 * @return void
	 */
	public function testAnUnknownContextThrows(): void {
		$this->expectException( InvalidArgumentException::class );

		$this->validator->validate( [], 'nonsense' );
	}

	/**
	 * @dataProvider invalidProvider
	 *
	 * @param array<string, mixed> $document
	 * @param string               $context
	 * @param string               $code
	 * @param string               $path
	 *
	 * @return void
	 */
	public function testItReportsTheExpectedErrorAtTheExpectedPath( array $document, string $context, string $code, string $path ): void {
		$errors = $this->validator->validate( $document, $context )->errors();

		$this->assertCount( 1, $errors, $this->describe( $errors ) );
		$this->assertSame( $code, $errors[0]->code );
		$this->assertSame( $path, $errors[0]->path );
	}

	/**
	 * @return Generator
	 */
	public function invalidProvider(): Generator {
		yield 'unknown type' => [
			'document' => [
				'primitive' => [
					'x' => [
						'$type'  => 'nope',
						'$value' => '#fff',
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_baseline(),
			'code'     => Validation_Error::get_code_type_unknown(),
			'path'     => 'primitive.x.$type',
		];
		yield 'bad color literal' => [
			'document' => [
				'primitive' => [
					'x' => [
						'$type'  => 'color',
						'$value' => 'not-a-color',
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_baseline(),
			'code'     => Validation_Error::get_code_value_invalid(),
			'path'     => 'primitive.x.$value',
		];
		yield 'malformed alias' => [
			'document' => [
				'primitive' => [
					'x' => [
						'$type'  => 'color',
						'$value' => '{bad path}',
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_baseline(),
			'code'     => Validation_Error::get_code_alias_malformed(),
			'path'     => 'primitive.x.$value',
		];
		yield 'missing value' => [
			'document' => [ 'primitive' => [ 'x' => [ '$type' => 'color' ] ] ],
			'context'  => Dtcg_Validator::get_context_baseline(),
			'code'     => Validation_Error::get_code_missing_value(),
			'path'     => 'primitive.x',
		];
		yield 'reset sentinel baseline' => [
			'document' => [ 'primitive' => [ 'x' => [ '$value' => null ] ] ],
			'context'  => Dtcg_Validator::get_context_baseline(),
			'code'     => Validation_Error::get_code_sentinel_not_allowed(),
			'path'     => 'primitive.x.$value',
		];
		yield 'disabled not true' => [
			'document' => [ 'primitive' => [ 'x' => [ '$disabled' => 'yes' ] ] ],
			'context'  => Dtcg_Validator::get_context_overrides(),
			'code'     => Validation_Error::get_code_sentinel_invalid(),
			'path'     => 'primitive.x.$disabled',
		];
		yield 'nested group path' => [
			'document' => [
				'semantic' => [
					'color' => [
						'button-bg' => [
							'$type'  => 'color',
							'$value' => 'banana',
						],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_baseline(),
			'code'     => Validation_Error::get_code_value_invalid(),
			'path'     => 'semantic.color.button-bg.$value',
		];
		yield 'malformed node' => [
			'document' => [ 'primitive' => [ 'x' => 'just-a-string' ] ],
			'context'  => Dtcg_Validator::get_context_baseline(),
			'code'     => Validation_Error::get_code_malformed_node(),
			'path'     => 'primitive.x',
		];
		yield 'unknown leaf field' => [
			'document' => [
				'primitive' => [
					'x' => [
						'$type'  => 'color',
						'$value' => '#fff',
						'extra'  => 'oops',
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_baseline(),
			'code'     => Validation_Error::get_code_leaf_field_unknown(),
			'path'     => 'primitive.x.extra',
		];
		yield 'bad extension value' => [
			'document' => [
				'$extensions' => [
					'com.kadence.designTokens' => [
						'presets' => [
							'kadence/x' => [
								'$default' => 'default',
								'default'  => [
									'label'  => 'Default',
									'tokens' => [ 'bg' => [ 'nested' => 1 ] ],
								],
							],
						],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_overrides(),
			'code'     => Validation_Error::get_code_value_invalid(),
			'path'     => '$extensions.com.kadence.designTokens.presets.kadence/x.default.tokens.bg',
		];
		// A grouped (multi-axis) preset nests its tokens one level deeper, under a group: the validator
		// descends to the tokens map wherever it sits, so the deep value is still reported.
		yield 'bad grouped extension value' => [
			'document' => [
				'$extensions' => [
					'com.kadence.designTokens' => [
						'presets' => [
							'kadence/x' => [
								'emphasis' => [
									'$default' => 'solid',
									'solid'    => [
										'label'  => 'Solid',
										'tokens' => [ 'bg' => [ 'nested' => 1 ] ],
									],
								],
							],
						],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_overrides(),
			'code'     => Validation_Error::get_code_value_invalid(),
			'path'     => '$extensions.com.kadence.designTokens.presets.kadence/x.emphasis.solid.tokens.bg',
		];
		// A colorPalettes swatch value lives under `$value` (not a `tokens` map), so it is covered by the
		// dedicated palette branch: an empty swatch value is rejected as an invalid literal.
		yield 'bad colorPalettes swatch value' => [
			'document' => [
				'$extensions' => [
					'com.kadence.designTokens' => [
						'colorPalettes' => [
							'$default' => 'default',
							'$current' => 'default',
							'default'  => [
								'label'  => 'Default',
								'groups' => [
									[
										'id'       => 'accent',
										'label'    => 'Accent',
										'swatches' => [
											[
												'token'  => 'primitive.color.brand.primary',
												'label'  => 'Main 1',
												'$value' => '',
											],
										],
									],
								],
							],
						],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_overrides(),
			'code'     => Validation_Error::get_code_value_invalid(),
			'path'     => '$extensions.com.kadence.designTokens.colorPalettes.default.groups.0.swatches.0.$value',
		];
		// A swatch value that embeds a `{dot.path}` reference but is not a whole-string alias is malformed.
		yield 'malformed alias colorPalettes swatch value' => [
			'document' => [
				'$extensions' => [
					'com.kadence.designTokens' => [
						'colorPalettes' => [
							'default' => [
								'label'  => 'Default',
								'groups' => [
									[
										'id'       => 'accent',
										'label'    => 'Accent',
										'swatches' => [
											[
												'token'  => 'primitive.color.brand.primary',
												'label'  => 'Main 1',
												'$value' => 'rgb({primitive.color.brand.primary})',
											],
										],
									],
								],
							],
						],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_overrides(),
			'code'     => Validation_Error::get_code_alias_malformed(),
			'path'     => '$extensions.com.kadence.designTokens.colorPalettes.default.groups.0.swatches.0.$value',
		];
		// A tokenLabels entry keyed by an integer (rather than a token dot-path string) is rejected
		// by the section's own explicit branch.
		yield 'integer-keyed tokenLabels entry' => [
			'document' => [
				'$extensions' => [
					'com.kadence.designTokens' => [
						'tokenLabels' => [ 0 => 'Numeric Key' ],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_overrides(),
			'code'     => Validation_Error::get_code_value_invalid(),
			'path'     => '$extensions.com.kadence.designTokens.tokenLabels.0',
		];
		yield 'non-string tokenLabels label' => [
			'document' => [
				'$extensions' => [
					'com.kadence.designTokens' => [
						'tokenLabels' => [ 'semantic.color.button-bg' => 42 ],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_overrides(),
			'code'     => Validation_Error::get_code_value_invalid(),
			'path'     => '$extensions.com.kadence.designTokens.tokenLabels.semantic.color.button-bg',
		];
		yield 'empty-string tokenLabels label' => [
			'document' => [
				'$extensions' => [
					'com.kadence.designTokens' => [
						'tokenLabels' => [ 'semantic.color.button-bg' => '' ],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_overrides(),
			'code'     => Validation_Error::get_code_value_invalid(),
			'path'     => '$extensions.com.kadence.designTokens.tokenLabels.semantic.color.button-bg',
		];
		// tokenOrder must be a single flat sequential list (see Token_Order_Index for why it is
		// never keyed by group); a map-shaped (non-sequential) value is rejected wholesale.
		yield 'map-shaped (non-sequential) tokenOrder value' => [
			'document' => [
				'$extensions' => [
					'com.kadence.designTokens' => [
						'tokenOrder' => [ 'a' => 'semantic.color.button-bg' ],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_overrides(),
			'code'     => Validation_Error::get_code_value_invalid(),
			'path'     => '$extensions.com.kadence.designTokens.tokenOrder',
		];
		yield 'non-string tokenOrder id' => [
			'document' => [
				'$extensions' => [
					'com.kadence.designTokens' => [
						'tokenOrder' => [ 'semantic.color.button-bg', 42 ],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_overrides(),
			'code'     => Validation_Error::get_code_value_invalid(),
			'path'     => '$extensions.com.kadence.designTokens.tokenOrder.1',
		];
		yield 'empty-string tokenOrder id' => [
			'document' => [
				'$extensions' => [
					'com.kadence.designTokens' => [
						'tokenOrder' => [ '' ],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_overrides(),
			'code'     => Validation_Error::get_code_value_invalid(),
			'path'     => '$extensions.com.kadence.designTokens.tokenOrder.0',
		];
		// favoriteFonts is an ordered list of family names, so a map-shaped value is rejected
		// wholesale and a non-string or blank family is rejected per entry.
		yield 'map-shaped (non-sequential) favoriteFonts value' => [
			'document' => [
				'$extensions' => [
					'com.kadence.designTokens' => [
						'favoriteFonts' => [ 'a' => 'Inter' ],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_overrides(),
			'code'     => Validation_Error::get_code_value_invalid(),
			'path'     => '$extensions.com.kadence.designTokens.favoriteFonts',
		];
		yield 'non-string favoriteFonts family' => [
			'document' => [
				'$extensions' => [
					'com.kadence.designTokens' => [
						'favoriteFonts' => [ 'Inter', 42 ],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_overrides(),
			'code'     => Validation_Error::get_code_value_invalid(),
			'path'     => '$extensions.com.kadence.designTokens.favoriteFonts.1',
		];
		yield 'whitespace-only favoriteFonts family' => [
			'document' => [
				'$extensions' => [
					'com.kadence.designTokens' => [
						'favoriteFonts' => [ '   ' ],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_overrides(),
			'code'     => Validation_Error::get_code_value_invalid(),
			'path'     => '$extensions.com.kadence.designTokens.favoriteFonts.0',
		];
		yield 'responsive on non-capable type' => [
			'document' => [
				'semantic' => [
					'x' => [
						'$type'       => 'fontWeight',
						'$value'      => 'normal',
						'$extensions' => [
							'com.kadence.designTokens' => [
								'responsive' => [ 'tablet' => 'bold' ],
							],
						],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_baseline(),
			'code'     => Validation_Error::get_code_responsive_not_allowed(),
			'path'     => 'semantic.x.$extensions.com.kadence.designTokens',
		];
		yield 'responsive and clamp conflict' => [
			'document' => [
				'semantic' => [
					'x' => [
						'$type'       => 'dimension',
						'$value'      => '1rem',
						'$extensions' => [
							'com.kadence.designTokens' => [
								'responsive' => [ 'tablet' => '0.9rem' ],
								'clamp'      => [
									'min'       => '1rem',
									'preferred' => '1vw',
									'max'       => '2rem',
								],
							],
						],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_baseline(),
			'code'     => Validation_Error::get_code_responsive_clamp_conflict(),
			'path'     => 'semantic.x.$extensions.com.kadence.designTokens',
		];
		yield 'unknown breakpoint' => [
			'document' => [
				'semantic' => [
					'x' => [
						'$type'       => 'dimension',
						'$value'      => '1rem',
						'$extensions' => [
							'com.kadence.designTokens' => [
								'responsive' => [ 'desktop' => '1rem' ],
							],
						],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_baseline(),
			'code'     => Validation_Error::get_code_composite_field_unknown(),
			'path'     => 'semantic.x.$extensions.com.kadence.designTokens.responsive.desktop',
		];
		yield 'bad breakpoint value' => [
			'document' => [
				'semantic' => [
					'x' => [
						'$type'       => 'dimension',
						'$value'      => '1rem',
						'$extensions' => [
							'com.kadence.designTokens' => [
								'responsive' => [ 'tablet' => 'red' ],
							],
						],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_baseline(),
			'code'     => Validation_Error::get_code_value_invalid(),
			'path'     => 'semantic.x.$extensions.com.kadence.designTokens.responsive.tablet',
		];
		yield 'responsive not an object' => [
			'document' => [
				'semantic' => [
					'x' => [
						'$type'       => 'dimension',
						'$value'      => '1rem',
						'$extensions' => [
							'com.kadence.designTokens' => [
								'responsive' => '0.9rem',
							],
						],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_baseline(),
			'code'     => Validation_Error::get_code_value_invalid(),
			'path'     => 'semantic.x.$extensions.com.kadence.designTokens.responsive',
		];
		yield 'clamp missing a slot' => [
			'document' => [
				'semantic' => [
					'x' => [
						'$type'       => 'dimension',
						'$value'      => '1rem',
						'$extensions' => [
							'com.kadence.designTokens' => [
								'clamp' => [
									'min' => '1rem',
									'max' => '2rem',
								],
							],
						],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_baseline(),
			'code'     => Validation_Error::get_code_composite_field_missing(),
			'path'     => 'semantic.x.$extensions.com.kadence.designTokens.clamp.preferred',
		];
		yield 'unknown clamp slot' => [
			'document' => [
				'semantic' => [
					'x' => [
						'$type'       => 'dimension',
						'$value'      => '1rem',
						'$extensions' => [
							'com.kadence.designTokens' => [
								'clamp' => [
									'min'       => '1rem',
									'preferred' => '1vw',
									'max'       => '2rem',
									'ideal'     => '1.5rem',
								],
							],
						],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_baseline(),
			'code'     => Validation_Error::get_code_composite_field_unknown(),
			'path'     => 'semantic.x.$extensions.com.kadence.designTokens.clamp.ideal',
		];
		yield 'bad clamp preferred' => [
			'document' => [
				'semantic' => [
					'x' => [
						'$type'       => 'dimension',
						'$value'      => '1rem',
						'$extensions' => [
							'com.kadence.designTokens' => [
								'clamp' => [
									'min'       => '1rem',
									'preferred' => 'fluid',
									'max'       => '2rem',
								],
							],
						],
					],
				],
			],
			'context'  => Dtcg_Validator::get_context_baseline(),
			'code'     => Validation_Error::get_code_value_invalid(),
			'path'     => 'semantic.x.$extensions.com.kadence.designTokens.clamp.preferred',
		];
	}

	/**
	 * A preset token value may be a per-corner slot list of exactly 1 or 4 entries, each an alias or a
	 * literal, so a block storing a 4-side measure attribute can persist its corners into a preset.
	 *
	 * @dataProvider validSlotListProvider
	 *
	 * @param mixed $value The preset token value under test.
	 *
	 * @return void
	 */
	public function testAValidSlotListValidates( $value ): void {
		$result = $this->validator->validate(
			$this->preset_document( $value ),
			Dtcg_Validator::get_context_overrides()
		);

		$this->assertTrue( $result->is_valid(), $this->describe( $result->errors() ) );
	}

	/**
	 * @return Generator
	 */
	public function validSlotListProvider(): Generator {
		yield 'four aliases' => [
			'value' => [
				'{primitive.dimension.radius.md}',
				'{primitive.dimension.radius.sm}',
				'{primitive.dimension.radius.md}',
				'{primitive.dimension.radius.sm}',
			],
		];

		yield 'four literals' => [ 'value' => [ '8px', '8px', '4px', '4px' ] ];

		yield 'mixed alias and literal' => [
			'value' => [ '{primitive.dimension.radius.md}', '8px', '{primitive.dimension.radius.sm}', '4px' ],
		];

		yield 'numeric literal slots' => [ 'value' => [ 0, 8, 0, 8 ] ];
	}

	/**
	 * A preset token slot list is rejected when its length is not 1 or 4, when a slot nests another list,
	 * when a slot is empty, or when a slot carries braces without being a whole-string alias.
	 *
	 * @dataProvider invalidSlotListProvider
	 *
	 * @param mixed  $value The preset token value under test.
	 * @param string $code  The expected validation-error code.
	 * @param string $path  The expected dot-path the error is reported at.
	 *
	 * @return void
	 */
	public function testAnInvalidSlotListIsRejected( $value, string $code, string $path ): void {
		$errors = $this->validator->validate(
			$this->preset_document( $value ),
			Dtcg_Validator::get_context_overrides()
		)->errors();

		$this->assertCount( 1, $errors, $this->describe( $errors ) );
		$this->assertSame( $code, $errors[0]->code );
		$this->assertSame( $path, $errors[0]->path );
	}

	/**
	 * @return Generator
	 */
	public function invalidSlotListProvider(): Generator {
		$base = '$extensions.com.kadence.designTokens.presets.kadence/x.default.tokens.button-radius';

		yield 'one slot' => [
			'value' => [ '8px' ],
			'code'  => Validation_Error::get_code_value_invalid(),
			'path'  => $base,
		];

		yield 'two slots' => [
			'value' => [ '8px', '4px' ],
			'code'  => Validation_Error::get_code_value_invalid(),
			'path'  => $base,
		];

		yield 'three slots' => [
			'value' => [ '8px', '4px', '8px' ],
			'code'  => Validation_Error::get_code_value_invalid(),
			'path'  => $base,
		];

		yield 'five slots' => [
			'value' => [ '8px', '4px', '8px', '4px', '2px' ],
			'code'  => Validation_Error::get_code_value_invalid(),
			'path'  => $base,
		];

		yield 'empty list' => [
			'value' => [],
			'code'  => Validation_Error::get_code_value_invalid(),
			'path'  => $base,
		];

		yield 'nested list in a slot' => [
			'value' => [ '8px', [ '4px' ], '8px', '4px' ],
			'code'  => Validation_Error::get_code_value_invalid(),
			'path'  => $base . '.1',
		];

		yield 'empty slot' => [
			'value' => [ '8px', '', '8px', '4px' ],
			'code'  => Validation_Error::get_code_value_invalid(),
			'path'  => $base . '.1',
		];

		yield 'brace-bearing slot that is not a whole-string alias' => [
			'value' => [ '8px', '{primitive.dimension.radius.sm}px', '8px', '4px' ],
			'code'  => Validation_Error::get_code_alias_malformed(),
			'path'  => $base . '.1',
		];
	}

	/**
	 * A preset token entry may carry per-breakpoint overrides in the same envelope a responsive token leaf
	 * uses, and each override follows the same alias / literal / slot-list rules as the base value.
	 *
	 * @dataProvider validResponsivePresetProvider
	 *
	 * @param mixed $entry The preset token entry under test.
	 *
	 * @return void
	 */
	public function testAResponsivePresetEntryValidates( $entry ): void {
		$result = $this->validator->validate(
			$this->preset_document( $entry ),
			Dtcg_Validator::get_context_overrides()
		);

		$this->assertTrue( $result->is_valid(), $this->describe( $result->errors() ) );
	}

	/**
	 * @return Generator
	 */
	public function validResponsivePresetProvider(): Generator {
		yield 'scalar base, literal overrides' => [
			'entry' => $this->responsive_entry(
				'8px',
				[
					'tablet' => '4px',
					'mobile' => '2px',
				] 
			),
		];

		yield 'slot-list base, scalar overrides' => [
			'entry' => $this->responsive_entry(
				[ '8px', '4px', '8px', '4px' ],
				[ 'mobile' => '{primitive.dimension.radius.sm}' ]
			),
		];

		yield 'slot-list base, slot-list overrides' => [
			'entry' => $this->responsive_entry(
				[ '8px', '4px', '8px', '4px' ],
				[ 'tablet' => [ '4px', '2px', '4px', '2px' ] ]
			),
		];

		yield 'slot-list base, slot-list override with a gap' => [
			'entry' => $this->responsive_entry(
				[ '8px', '4px', '8px', '4px' ],
				[ 'tablet' => [ '2px', '', '', '' ] ]
			),
		];

		yield 'alias base, alias override' => [
			'entry' => $this->responsive_entry(
				'{semantic.radius.control}',
				[ 'mobile' => '{primitive.dimension.radius.none}' ]
			),
		];

		yield 'single breakpoint only' => [
			'entry' => $this->responsive_entry( '8px', [ 'mobile' => '2px' ] ),
		];
	}

	/**
	 * A malformed responsive preset entry is rejected: an unknown breakpoint, an empty override map, a
	 * missing base value, and a bad value at a breakpoint each fail at their own path.
	 *
	 * @dataProvider invalidResponsivePresetProvider
	 *
	 * @param mixed  $entry The preset token entry under test.
	 * @param string $code  The expected validation-error code.
	 * @param string $path  The expected dot-path the error is reported at.
	 *
	 * @return void
	 */
	public function testAnInvalidResponsivePresetEntryIsRejected( $entry, string $code, string $path ): void {
		$errors = $this->validator->validate(
			$this->preset_document( $entry ),
			Dtcg_Validator::get_context_overrides()
		)->errors();

		$this->assertCount( 1, $errors, $this->describe( $errors ) );
		$this->assertSame( $code, $errors[0]->code );
		$this->assertSame( $path, $errors[0]->path );
	}

	/**
	 * @return Generator
	 */
	public function invalidResponsivePresetProvider(): Generator {
		$base = '$extensions.com.kadence.designTokens.presets.kadence/x.default.tokens.button-radius';

		yield 'unknown breakpoint' => [
			'entry' => $this->responsive_entry( '8px', [ 'watch' => '2px' ] ),
			'code'  => Validation_Error::get_code_composite_field_unknown(),
			'path'  => $base . '.watch',
		];

		yield 'empty responsive map' => [
			'entry' => $this->responsive_entry( '8px', [] ),
			'code'  => Validation_Error::get_code_value_invalid(),
			'path'  => $base,
		];

		yield 'empty override value' => [
			'entry' => $this->responsive_entry( '8px', [ 'tablet' => '' ] ),
			'code'  => Validation_Error::get_code_value_invalid(),
			'path'  => $base . '.tablet',
		];

		yield 'brace-bearing override that is not a whole-string alias' => [
			'entry' => $this->responsive_entry( '8px', [ 'mobile' => '{semantic.radius.control}px' ] ),
			'code'  => Validation_Error::get_code_alias_malformed(),
			'path'  => $base . '.mobile',
		];

		yield 'bad slot count in an override' => [
			'entry' => $this->responsive_entry( '8px', [ 'tablet' => [ '4px', '2px' ] ] ),
			'code'  => Validation_Error::get_code_value_invalid(),
			'path'  => $base . '.tablet',
		];

		yield 'bad base value under a valid responsive map' => [
			'entry' => $this->responsive_entry( '', [ 'tablet' => '4px' ] ),
			'code'  => Validation_Error::get_code_value_invalid(),
			'path'  => $base,
		];

		yield 'gap in the slot-list base under a valid responsive map' => [
			'entry' => $this->responsive_entry(
				[ '8px', '', '8px', '4px' ],
				[ 'tablet' => [ '4px', '2px', '4px', '2px' ] ]
			),
			'code'  => Validation_Error::get_code_value_invalid(),
			'path'  => $base . '.1',
		];
	}

	/**
	 * A dimension leaf carrying a well-formed per-breakpoint responsive map (literal and alias slots)
	 * validates.
	 *
	 * @return void
	 */
	public function testAValidResponsiveShapeValidates(): void {
		$document = [
			'semantic' => [
				'font-size' => [
					'control' => [
						'$type'       => 'dimension',
						'$value'      => '1.125rem',
						'$extensions' => [
							'com.kadence.designTokens' => [
								'responsive' => [
									'tablet' => '1rem',
									'mobile' => '{primitive.dimension.font-size.mobile}',
								],
							],
						],
					],
				],
			],
		];

		$result = $this->validator->validate( $document, Dtcg_Validator::get_context_baseline() );

		$this->assertTrue( $result->is_valid(), $this->describe( $result->errors() ) );
	}

	/**
	 * A dimension leaf carrying a structured clamp (bare calc-style preferred, alias min) validates.
	 *
	 * @return void
	 */
	public function testAValidClampShapeValidates(): void {
		$document = [
			'semantic' => [
				'font-size' => [
					'control' => [
						'$type'       => 'dimension',
						'$value'      => 'clamp(1.1rem, 0.995rem + 0.326vw, 1.25rem)',
						'$extensions' => [
							'com.kadence.designTokens' => [
								'clamp' => [
									'min'       => '{primitive.dimension.font-size.min}',
									'preferred' => '0.995rem + 0.326vw',
									'max'       => '1.25rem',
								],
							],
						],
					],
				],
			],
		];

		$result = $this->validator->validate( $document, Dtcg_Validator::get_context_baseline() );

		$this->assertTrue( $result->is_valid(), $this->describe( $result->errors() ) );
	}

	/**
	 * A lineHeight leaf carrying a structured clamp with a unitless preferred validates: the preferred slot
	 * is checked against the leaf's own $type, so a bare "1.35" is accepted exactly as its min / max slots.
	 *
	 * @return void
	 */
	public function testALineHeightClampWithUnitlessPreferredValidates(): void {
		$document = [
			'semantic' => [
				'line-height' => [
					'control' => [
						'$type'       => 'lineHeight',
						'$value'      => 'clamp(1.2, 1.35, 1.5)',
						'$extensions' => [
							'com.kadence.designTokens' => [
								'clamp' => [
									'min'       => '1.2',
									'preferred' => '1.35',
									'max'       => '1.5',
								],
							],
						],
					],
				],
			],
		];

		$result = $this->validator->validate( $document, Dtcg_Validator::get_context_baseline() );

		$this->assertTrue( $result->is_valid(), $this->describe( $result->errors() ) );
	}

	/**
	 * A flat dimension leaf with no responsive / clamp extension still validates, so enabling responsive
	 * on a previously-flat token is safe against already-stored flat overrides.
	 *
	 * @return void
	 */
	public function testAFlatResponsiveCapableLeafRemainsValid(): void {
		$document = [
			'semantic' => [
				'font-size' => [
					'control' => [
						'$type'  => 'dimension',
						'$value' => '1.125rem',
					],
				],
			],
		];

		$this->assertTrue( $this->validator->validate( $document, Dtcg_Validator::get_context_baseline() )->is_valid() );
	}

	/**
	 * @return void
	 */
	public function testSentinelsAreValidInOverrides(): void {
		$document = [
			'primitive' => [
				'reset'  => [ '$value' => null ],
				'remove' => [ '$disabled' => true ],
			],
		];

		$this->assertTrue( $this->validator->validate( $document, Dtcg_Validator::get_context_overrides() )->is_valid() );
	}

	/**
	 * @return void
	 */
	public function testItCollectsEveryErrorInOnePass(): void {
		$document = [
			'primitive' => [
				'a' => [
					'$type'  => 'color',
					'$value' => 'not-a-color',
				],
				'b' => [
					'$type'  => 'nope',
					'$value' => '#fff',
				],
			],
		];

		$this->assertCount( 2, $this->validator->validate( $document, Dtcg_Validator::get_context_baseline() )->errors() );
	}

	/**
	 * @return void
	 */
	public function testItCollectsEveryUnknownLeafFieldInOnePass(): void {
		$document = [
			'primitive' => [
				'x' => [
					'$type'  => 'color',
					'$value' => '#fff',
					'foo'    => 'bar',
					'baz'    => 'qux',
				],
			],
		];

		$errors = $this->validator->validate( $document, Dtcg_Validator::get_context_baseline() )->errors();

		$this->assertCount( 2, $errors );
		$this->assertSame( Validation_Error::get_code_leaf_field_unknown(), $errors[0]->code );
		$this->assertSame( Validation_Error::get_code_leaf_field_unknown(), $errors[1]->code );
		$this->assertSame( 'primitive.x.foo', $errors[0]->path );
		$this->assertSame( 'primitive.x.baz', $errors[1]->path );
	}

	/**
	 * @return void
	 */
	public function testLeafExtensionsArePassedThrough(): void {
		$document = [
			'primitive' => [
				'x' => [
					'$type'        => 'dimension',
					'$value'       => '1rem',
					'$extensions'  => [ 'com.kadence.responsive' => [ 'tablet' => '0.9rem' ] ],
					'$description' => 'A leaf with a forward-looking extension.',
				],
			],
		];

		$this->assertTrue( $this->validator->validate( $document, Dtcg_Validator::get_context_baseline() )->is_valid() );
	}

	/**
	 * The shipped baseline DTCG document, read straight from the plugin source.
	 *
	 * @return string
	 */
	private function get_baseline(): string {
		// phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown
		return (string) file_get_contents( KADENCE_BLOCKS_PATH . 'includes/resources/Design_Tokens/Registry/Baseline/baseline.json' );
	}

	/**
	 * A preset token entry carrying per-breakpoint overrides, in the same envelope a responsive token leaf
	 * uses.
	 *
	 * @param mixed                $base       The entry's base value.
	 * @param array<string, mixed> $responsive Breakpoint => override value.
	 *
	 * @return array<string, mixed> The entry.
	 */
	private function responsive_entry( $base, array $responsive ): array {
		return [
			'$value'      => $base,
			'$extensions' => [
				'com.kadence.designTokens' => [
					'responsive' => $responsive,
				],
			],
		];
	}

	/**
	 * A minimal overrides document carrying one block preset whose `button-radius` token holds the given
	 * value, so a preset token value can be exercised in isolation.
	 *
	 * @param mixed $value The preset token value to place under `button-radius`.
	 *
	 * @return array<string, mixed> The document.
	 */
	private function preset_document( $value ): array {
		return [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'presets' => [
						'kadence/x' => [
							'$default' => 'default',
							'default'  => [
								'label'  => 'Default',
								'tokens' => [ 'button-radius' => $value ],
							],
						],
					],
				],
			],
		];
	}

	/**
	 * Render a list of validation errors as a readable multi-line string for assertion messages.
	 *
	 * @param Validation_Error[] $errors The errors to describe.
	 *
	 * @return string
	 */
	private function describe( array $errors ): string {
		return implode(
			"\n",
			array_map(
				static function ( Validation_Error $e ): string {
					return sprintf( '[%s] %s: %s', $e->code, $e->path, $e->message );
				},
				$errors
			)
		);
	}
}
