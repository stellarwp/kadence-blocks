<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Schema;

// cspell:ignore justinrainbow .

use Generator;
use JsonSchema\Validator as Json_Schema_Validator;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Provider;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Dtcg_Validator;
use KadenceWP\KadenceBlocks\Dev\Design_Tokens\Schema\Dtcg_Schema_Generator;
use ReflectionClass;
use Tests\Support\Classes\TestCase;

/**
 * Holds the three artifacts in lockstep:
 *   1. the committed dtcg.schema.json is exactly what the generator emits (no hand-edits / drift),
 *   2. the shipped baseline validates against that schema (the check requested on SOFT-3378), and
 *   3. for the structural errors both engines can see, the published schema and the PHP validator agree.
 *
 * Literal-grammar errors (a bad color, a malformed alias that is still a string) are out of agreement
 * scope by design: the published schema treats color/dimension literals permissively and the PHP
 * Literals layer is their sole authority. justinrainbow is used here as a DEV-ONLY draft-07 engine; the
 * runtime never loads a schema engine.
 *
 * The conformance target is the real shipped baseline (includes/resources/Design_Tokens/Registry/
 * Baseline/baseline.json), read straight from the plugin source.
 *
 * @since TBD
 */
final class Dtcg_Schema_ConformanceTest extends TestCase {

	/**
	 * @return void
	 */
	public function testTheCommittedSchemaIsExactlyWhatTheGeneratorEmits(): void {
		// json_encode (not wp_json_encode) so the byte comparison matches how the file was generated.
		$generated = json_encode( ( new Dtcg_Schema_Generator() )->generate(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ) . "\n"; // phpcs:ignore WordPress.WP.AlternativeFunctions.json_encode_json_encode

		$this->assertSame(
			$generated,
			file_get_contents( $this->schema_path() ), // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown
			'dtcg.schema.json is stale; regenerate it with `composer generate-dtcg-schema`.'
		);
	}

	/**
	 * @return void
	 */
	public function testTheShippedBaselineValidatesAgainstTheSchema(): void {
		$validator = new Json_Schema_Validator();
		$data      = json_decode( $this->get_baseline() );

		$validator->validate( $data, $this->schema() );

		$this->assertTrue( $validator->isValid(), $this->describe_schema_errors( $validator ) );
	}

	/**
	 * @return void
	 */
	public function testTheBaselinePassesThePhpValidatorToo(): void {
		$document = json_decode( $this->get_baseline(), true );

		$this->assertTrue( ( new Dtcg_Validator() )->validate( $document, Dtcg_Validator::get_context_baseline() )->is_valid() );
	}

	/**
	 * @dataProvider structuralInvalidProvider
	 *
	 * @param array<string, mixed> $document
	 *
	 * @return void
	 */
	public function testStructuralInvalidsAreRejectedByBothEngines( array $document ): void {
		// The PHP validator rejects it.
		$this->assertFalse( ( new Dtcg_Validator() )->validate( $document, Dtcg_Validator::get_context_baseline() )->is_valid() );

		// And the published schema rejects it.
		$validator = new Json_Schema_Validator();
		$data      = json_decode( (string) wp_json_encode( $document ) );
		$validator->validate( $data, $this->schema() );

		$this->assertFalse( $validator->isValid() );
	}

	/**
	 * @return Generator
	 */
	public function structuralInvalidProvider(): Generator {
		yield 'unknown type' => [
			'document' => [
				'primitive' => [
					'x' => [
						'$type'  => 'nope',
						'$value' => '#fff',
					],
				],
			],
		];
		yield 'missing value' => [
			'document' => [ 'primitive' => [ 'x' => [ '$type' => 'color' ] ] ],
		];
		yield 'shadow bad fields' => [
			'document' => [
				'semantic' => [
					's' => [
						'$type'  => 'shadow',
						'$value' => [
							'color'   => '#000',
							'offsetX' => '0px',
							'offsetY' => '0px',
							'blur'    => '1px',
							'bogus'   => 'x',
						],
					],
				],
			],
		];
		yield 'fontFamily scalar' => [
			'document' => [
				'primitive' => [
					'f' => [
						'$type'  => 'fontFamily',
						'$value' => 'Inter',
					],
				],
			],
		];
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
	 * The committed schema decoded as objects for the JSON Schema engine.
	 *
	 * @return object
	 */
	private function schema() {
		return json_decode( (string) file_get_contents( $this->schema_path() ) ); // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown
	}

	/**
	 * Absolute path to the committed schema. It ships at the Schema root next to the Provider (the
	 * generator is a dev-only tool outside the plugin source, so anchor on a class that lives beside
	 * the JSON file).
	 *
	 * @return string
	 */
	private function schema_path(): string {
		return dirname( ( new ReflectionClass( Provider::class ) )->getFileName() ) . '/dtcg.schema.json';
	}

	/**
	 * @param Json_Schema_Validator $validator The validator whose errors to render.
	 *
	 * @return string
	 */
	private function describe_schema_errors( Json_Schema_Validator $validator ): string {
		$lines = [];

		foreach ( $validator->getErrors() as $error ) {
			$lines[] = sprintf( '%s: %s', $error['property'], $error['message'] );
		}

		return implode( "\n", $lines );
	}
}
