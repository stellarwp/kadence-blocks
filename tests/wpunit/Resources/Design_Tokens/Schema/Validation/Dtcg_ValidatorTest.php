<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Schema\Validation;

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

	public function testTheShippedBaselineFixtureValidatesAsABaseline(): void {
		$document = json_decode( $this->fixture( 'design-tokens/baseline.json' ), true );

		$result = $this->validator->validate( $document, Dtcg_Validator::get_context_baseline() );

		$this->assertTrue( $result->is_valid(), $this->describe( $result->errors() ) );
	}

	public function testTheBaselineAlsoValidatesAsOverrides(): void {
		$document = json_decode( $this->fixture( 'design-tokens/baseline.json' ), true );

		$this->assertTrue( $this->validator->validate( $document, Dtcg_Validator::get_context_overrides() )->is_valid() );
	}

	public function testAnEmptyDocumentIsValid(): void {
		$this->assertTrue( $this->validator->validate( [], Dtcg_Validator::get_context_overrides() )->is_valid() );
	}

	public function testItIsResolvableFromTheContainer(): void {
		$this->assertInstanceOf( Dtcg_Validator::class, $this->container->get( Dtcg_Validator::class ) );
	}

	public function testAnUnknownContextThrows(): void {
		$this->expectException( InvalidArgumentException::class );

		$this->validator->validate( [], 'nonsense' );
	}

	/**
	 * @dataProvider invalidProvider
	 *
	 * @param array<string, mixed> $document
	 */
	public function testItReportsTheExpectedErrorAtTheExpectedPath( array $document, string $context, string $code, string $path ): void {
		$errors = $this->validator->validate( $document, $context )->errors();

		$this->assertCount( 1, $errors, $this->describe( $errors ) );
		$this->assertSame( $code, $errors[0]->code );
		$this->assertSame( $path, $errors[0]->path );
	}

	/**
	 * @return array<string, array{0: array<string, mixed>, 1: string, 2: string, 3: string}>
	 */
	public function invalidProvider(): array {
		return [
			'unknown type'            => [
				[
					'primitive' => [
						'x' => [
							'$type'  => 'nope',
							'$value' => '#fff',
						],
					],
				],
				Dtcg_Validator::get_context_baseline(),
				Validation_Error::get_code_type_unknown(),
				'primitive.x.$type',
			],
			'bad color literal'       => [
				[
					'primitive' => [
						'x' => [
							'$type'  => 'color',
							'$value' => 'not-a-color',
						],
					],
				],
				Dtcg_Validator::get_context_baseline(),
				Validation_Error::get_code_value_invalid(),
				'primitive.x.$value',
			],
			'malformed alias'         => [
				[
					'primitive' => [
						'x' => [
							'$type'  => 'color',
							'$value' => '{bad path}',
						],
					],
				],
				Dtcg_Validator::get_context_baseline(),
				Validation_Error::get_code_alias_malformed(),
				'primitive.x.$value',
			],
			'missing value'           => [
				[ 'primitive' => [ 'x' => [ '$type' => 'color' ] ] ],
				Dtcg_Validator::get_context_baseline(),
				Validation_Error::get_code_missing_value(),
				'primitive.x',
			],
			'reset sentinel baseline' => [
				[ 'primitive' => [ 'x' => [ '$value' => null ] ] ],
				Dtcg_Validator::get_context_baseline(),
				Validation_Error::get_code_sentinel_not_allowed(),
				'primitive.x',
			],
			'disabled not true'       => [
				[ 'primitive' => [ 'x' => [ '$disabled' => 'yes' ] ] ],
				Dtcg_Validator::get_context_overrides(),
				Validation_Error::get_code_sentinel_invalid(),
				'primitive.x.$disabled',
			],
			'nested group path'       => [
				[
					'semantic' => [
						'color' => [
							'button-bg' => [
								'$type'  => 'color',
								'$value' => 'banana',
							],
						],
					],
				],
				Dtcg_Validator::get_context_baseline(),
				Validation_Error::get_code_value_invalid(),
				'semantic.color.button-bg.$value',
			],
			'malformed node'          => [
				[ 'primitive' => [ 'x' => 'just-a-string' ] ],
				Dtcg_Validator::get_context_baseline(),
				Validation_Error::get_code_malformed_node(),
				'primitive.x',
			],
			'bad extension value'     => [
				[
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
				Dtcg_Validator::get_context_overrides(),
				Validation_Error::get_code_value_invalid(),
				'$extensions.com.kadence.designTokens.variants.kadence/x.default.tokens.bg',
			],
		];
	}

	public function testSentinelsAreValidInOverrides(): void {
		$document = [
			'primitive' => [
				'reset'  => [ '$value' => null ],
				'remove' => [ '$disabled' => true ],
			],
		];

		$this->assertTrue( $this->validator->validate( $document, Dtcg_Validator::get_context_overrides() )->is_valid() );
	}

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
	 * @param Validation_Error[] $errors
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
