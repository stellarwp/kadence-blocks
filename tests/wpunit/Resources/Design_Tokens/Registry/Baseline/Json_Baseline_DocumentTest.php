<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Registry\Baseline;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline\Json_Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use Tests\Support\Classes\TestCase;

final class Json_Baseline_DocumentTest extends TestCase {

	/**
	 * Absolute path to the shipped baseline document.
	 */
	private const BASELINE_PATH = KADENCE_BLOCKS_PATH . 'includes/resources/Design_Tokens/Registry/Baseline/baseline.json';

	/**
	 * Absolute path to the registry's token declarations.
	 */
	private const DECLARATIONS_PATH = KADENCE_BLOCKS_PATH . 'includes/resources/Design_Tokens/Registry/declarations.php';

	/** @var string[] Temp fixture files to remove in tearDown. */
	private array $temp_files = [];

	protected function tearDown(): void {
		foreach ( $this->temp_files as $file ) {
			if ( is_file( $file ) ) {
				unlink( $file );
			}
		}

		$this->temp_files = [];

		parent::tearDown();
	}

	public function testHasIsTrueForTheRegisteredTokens(): void {
		$baseline = new Json_Baseline_Document( self::BASELINE_PATH, 'test-registered' );

		// The two tokens declarations.php currently registers must both resolve, or the guard fails.
		$this->assertTrue( $baseline->has( 'semantic.color.button-bg' ) );
		$this->assertTrue( $baseline->has( 'semantic.color.button-text' ) );
	}

	public function testHasIsTrueForPrimitiveAndCompositeLeaves(): void {
		$baseline = new Json_Baseline_Document( self::BASELINE_PATH, 'test-leaves' );

		// Simple primitive leaf.
		$this->assertTrue( $baseline->has( 'primitive.color.brand.primary' ) );
		// Numeric-keyed leaf (json_decode turns "0" into an int key).
		$this->assertTrue( $baseline->has( 'primitive.color.neutral.0' ) );
		// fontFamily leaf whose $value is an array.
		$this->assertTrue( $baseline->has( 'primitive.fontFamily.sans' ) );
		// Composite leaves (object $value) are still single tokens, not groups.
		$this->assertTrue( $baseline->has( 'semantic.typography.heading' ) );
		$this->assertTrue( $baseline->has( 'semantic.shadow.card' ) );
	}

	public function testHasIsFalseForGroupNodesAndUnknownPaths(): void {
		$baseline = new Json_Baseline_Document( self::BASELINE_PATH, 'test-groups' );

		// Layer roots and group nodes carry no $value, so they are not tokens.
		$this->assertFalse( $baseline->has( 'primitive' ) );
		$this->assertFalse( $baseline->has( 'semantic.color' ) );
		$this->assertFalse( $baseline->has( 'semantic.typography' ) );
		// Genuinely unknown paths.
		$this->assertFalse( $baseline->has( 'semantic.color.does-not-exist' ) );
		$this->assertFalse( $baseline->has( '' ) );
	}

	public function testHasIsFalseForExtensionsPresetsAndVariants(): void {
		$baseline = new Json_Baseline_Document( self::BASELINE_PATH, 'test-extensions' );

		// The $extensions layer (foundation presets, block presets, variants) is intentionally not
		// indexed — those are not registrable tokens and must never satisfy the guard.
		$this->assertFalse( $baseline->has( '$extensions' ) );
		$this->assertFalse( $baseline->has( 'com.kadence.designTokens' ) );
		$this->assertFalse( $baseline->has( 'kadence/advancedbtn' ) );
		// A variant property key is not a token id.
		$this->assertFalse( $baseline->has( 'button-bg' ) );
	}

	/**
	 * The guard's contract, pinned end-to-end: every token declarations.php registers has a baseline
	 * entry. Adding a token to the registry without a matching baseline leaf breaks this test.
	 */
	public function testEveryRegisteredDeclarationHasABaselineEntry(): void {
		$baseline     = new Json_Baseline_Document( self::BASELINE_PATH, 'test-invariant' );
		$declarations = require self::DECLARATIONS_PATH;

		$registry = new Token_Registry();

		foreach ( $declarations['tokens'] as $token ) {
			$registry->register( $token );
		}

		$this->assertSame(
			[],
			$registry->missing_from_baseline( $baseline ),
			'Every registered token must have a baseline entry at the matching dot-path.'
		);
	}

	public function testLeavesAreDistinguishedFromGroupsInAFixture(): void {
		$path = $this->write_fixture(
			[
				'primitive' => [
					'color' => [
						// Group node -> not a token.
						'brand' => [
							// Leaf -> token.
							'primary' => [ '$type' => 'color', '$value' => '#000000' ],
						],
					],
				],
				'semantic'  => [
					'shadow' => [
						// Composite leaf -> single token, its sub-fields are not tokens.
						'card' => [
							'$type'  => 'shadow',
							'$value' => [ 'color' => '#000', 'offsetX' => '0px' ],
						],
					],
				],
				// Must be ignored entirely.
				'$extensions' => [
					'com.kadence.designTokens' => [
						'variants' => [
							'kadence/advancedbtn' => [ '$default' => 'primary' ],
						],
					],
				],
			]
		);

		$baseline = new Json_Baseline_Document( $path, 'test-fixture' );

		$this->assertTrue( $baseline->has( 'primitive.color.brand.primary' ) );
		$this->assertTrue( $baseline->has( 'semantic.shadow.card' ) );

		$this->assertFalse( $baseline->has( 'primitive.color.brand' ) );
		$this->assertFalse( $baseline->has( 'semantic.shadow.card.color' ) );
		$this->assertFalse( $baseline->has( 'kadence/advancedbtn' ) );
	}

	public function testDocumentReturnsTheFullDecodedBaseline(): void {
		$document = ( new Json_Baseline_Document( self::BASELINE_PATH, 'test-doc' ) )->document();

		// The full document — all layers and real values, unlike the has() index which omits $extensions.
		$this->assertArrayHasKey( 'primitive', $document );
		$this->assertArrayHasKey( 'semantic', $document );
		$this->assertArrayHasKey( '$extensions', $document );
		$this->assertSame( '#3182CE', $document['primitive']['color']['brand']['primary']['$value'] );
		$this->assertArrayHasKey(
			'kadence/advancedbtn',
			$document['$extensions']['com.kadence.designTokens']['variants']
		);
	}

	public function testDocumentIsEmptyWhenTheFileIsMissing(): void {
		$document = ( new Json_Baseline_Document( self::BASELINE_PATH . '.nope', 'test-doc-missing' ) )->document();

		$this->assertSame( [], $document );
	}

	public function testTheDocumentIsServedFromCacheAcrossInstancesOnTheSameVersion(): void {
		$path = $this->write_fixture(
			[
				'semantic' => [
					'color' => [
						'button-bg' => [ '$type' => 'color', '$value' => '#fff' ],
					],
				],
			]
		);

		// First instance loads and caches the document on the version.
		$first = new Json_Baseline_Document( $path, 'test-cache' );
		$this->assertTrue( $first->has( 'semantic.color.button-bg' ) );

		// Remove the source file: a second instance on the same version must still answer from cache —
		// both the full document and the has() index it derives.
		unlink( $path );
		$this->temp_files = [];

		$second = new Json_Baseline_Document( $path, 'test-cache' );
		$this->assertTrue( $second->has( 'semantic.color.button-bg' ) );
		$this->assertArrayHasKey( 'semantic', $second->document() );
	}

	public function testAFailedLoadIsNotCachedSoALaterRequestRecovers(): void {
		$path    = tempnam( sys_get_temp_dir(), 'kb_baseline_' );
		$version = 'test-recover';
		unlink( $path );

		// First read happens while the file is unavailable (e.g. mid-deploy): empty, and must NOT cache.
		$first = new Json_Baseline_Document( $path, $version );
		$this->assertFalse( $first->has( 'semantic.color.button-bg' ) );

		// The file then appears. A fresh instance on the same version must pick it up, not a poisoned
		// empty index from the failed read.
		file_put_contents(
			$path,
			(string) wp_json_encode(
				[ 'semantic' => [ 'color' => [ 'button-bg' => [ '$type' => 'color', '$value' => '#fff' ] ] ] ]
			)
		);
		$this->temp_files[] = $path;

		$second = new Json_Baseline_Document( $path, $version );
		$this->assertTrue( $second->has( 'semantic.color.button-bg' ) );
	}

	public function testAMissingFileYieldsNoTokens(): void {
		$baseline = new Json_Baseline_Document( self::BASELINE_PATH . '.nope', 'test-missing' );

		// Fail closed: with no readable document, nothing resolves.
		$this->assertFalse( $baseline->has( 'semantic.color.button-bg' ) );
	}

	public function testMalformedJsonYieldsNoTokens(): void {
		$path = tempnam( sys_get_temp_dir(), 'kb_baseline_' );
		file_put_contents( $path, '{ not valid json' );
		$this->temp_files[] = $path;

		$baseline = new Json_Baseline_Document( $path, 'test-malformed' );

		$this->assertFalse( $baseline->has( 'semantic.color.button-bg' ) );
	}

	/**
	 * Write a fixture document to a temp file and return its path.
	 *
	 * @param array<string, mixed> $document The document to encode.
	 *
	 * @return string
	 */
	private function write_fixture( array $document ): string {
		$path = tempnam( sys_get_temp_dir(), 'kb_baseline_' );

		file_put_contents( $path, (string) wp_json_encode( $document ) );

		$this->temp_files[] = $path;

		return $path;
	}
}
