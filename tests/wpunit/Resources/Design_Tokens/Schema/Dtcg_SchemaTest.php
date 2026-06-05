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
	public function testItReadsTheCommittedSchemaFileVerbatim(): void {
		$path = $this->schema_path();
		$json = ( new Dtcg_Schema( $path, 'test-version-read' ) )->json();

		$this->assertSame(
			file_get_contents( $path ), // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown -- Reading the committed fixture to compare bytes.
			$json
		);
		$this->assertStringContainsString( '"$schema"', $json );
	}

	/**
	 * @return void
	 */
	public function testItReturnsAnEmptyStringForAMissingFile(): void {
		$json = ( new Dtcg_Schema( __DIR__ . '/does-not-exist.json', 'test-version-missing' ) )->json();

		$this->assertSame( '', $json );
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
