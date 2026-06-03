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
						'variants' => [
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
			'path'     => '$extensions.com.kadence.designTokens.variants.kadence/x.default.tokens.bg',
		];
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
	 * @param Validation_Error[] $errors
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
