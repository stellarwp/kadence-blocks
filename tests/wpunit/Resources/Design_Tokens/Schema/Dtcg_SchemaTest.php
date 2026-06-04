<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Schema;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Dtcg_Schema;
use ReflectionClass;
use Tests\Support\Classes\TestCase;

/**
 * Covers the runtime accessor for the committed dtcg.schema.json.
 */
final class Dtcg_SchemaTest extends TestCase {

	/**
	 * @return void
	 */
	public function testItDecodesTheCommittedSchemaFile(): void {
		$path   = $this->schema_path();
		$schema = ( new Dtcg_Schema( $path, 'test-version-decode' ) )->document();

		$this->assertSame(
			wp_json_file_decode( $path, [ 'associative' => true ] ),
			$schema
		);
		$this->assertArrayHasKey( '$schema', $schema );
		$this->assertArrayHasKey( 'definitions', $schema );
	}

	/**
	 * @return void
	 */
	public function testItReturnsAnEmptyArrayForAMissingFile(): void {
		$schema = ( new Dtcg_Schema( __DIR__ . '/does-not-exist.json', 'test-version-missing' ) )->document();

		$this->assertSame( [], $schema );
	}

	/**
	 * Absolute path to the committed dtcg.schema.json, which ships next to the Dtcg_Schema class.
	 *
	 * @return string
	 */
	private function schema_path(): string {
		return dirname( ( new ReflectionClass( Dtcg_Schema::class ) )->getFileName() ) . '/dtcg.schema.json';
	}
}
