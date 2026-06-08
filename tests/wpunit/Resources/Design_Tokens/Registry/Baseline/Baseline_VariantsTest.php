<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Registry\Baseline;

use Tests\Support\Classes\TestCase;

/**
 * Pins the shipped baseline's variant section to the data model SOFT-3393 formalises: every block's
 * `$default` names a variant that actually exists, and every named variant carries a label and a
 * non-empty tokens map. Runtime writes are validated at the endpoint boundary (SOFT-3390); this guards
 * the trusted, shipped document so a bad hand-edit to baseline.json fails CI instead of surfacing later.
 */
final class Baseline_VariantsTest extends TestCase {

	/**
	 * Absolute path to the shipped baseline document.
	 */
	private const BASELINE_PATH = KADENCE_BLOCKS_PATH . 'includes/resources/Design_Tokens/Registry/Baseline/baseline.json';

	/**
	 * The `$extensions` path to the variants section, mirroring Variant_Resolver::VARIANTS_PATH.
	 *
	 * @var string[]
	 */
	private const VARIANTS_PATH = [ '$extensions', 'com.kadence.designTokens', 'variants' ];

	public function testTheShippedBaselineVariantSectionIsWellFormed(): void {
		$section = $this->variants_section();

		// A missing/empty section here would silently pass the per-block loop, so assert it ships first.
		$this->assertNotEmpty( $section, 'The baseline should ship a variants section.' );

		foreach ( $section as $block => $node ) {
			$this->assertIsArray( $node, sprintf( 'Variant node for "%s" must be an object.', $block ) );

			$names = $this->named_variants( $node );
			$this->assertNotEmpty( $names, sprintf( 'Block "%s" declares no named variants.', $block ) );

			// $default must be a non-empty string naming one of the block's own variants.
			$this->assertArrayHasKey( '$default', $node, sprintf( 'Block "%s" is missing $default.', $block ) );
			$default = $node['$default'];
			$this->assertIsString( $default, sprintf( 'Block "%s" $default must be a string.', $block ) );
			$this->assertContains(
				$default,
				$names,
				sprintf( 'Block "%s" $default "%s" does not name a defined variant.', $block, $default )
			);

			foreach ( $names as $name ) {
				$this->assertVariantShape( (string) $block, $name, $node[ $name ] );
			}
		}
	}

	/**
	 * Assert a single variant carries a non-empty label and a non-empty tokens map.
	 *
	 * @param string $block   The block name, for failure messages.
	 * @param string $name    The variant slug, for failure messages.
	 * @param mixed  $variant The raw variant node.
	 *
	 * @return void
	 */
	private function assertVariantShape( string $block, string $name, $variant ): void {
		$where = sprintf( '"%s" variant "%s"', $block, $name );

		$this->assertIsArray( $variant, sprintf( '%s must be an object.', $where ) );

		$this->assertArrayHasKey( 'label', $variant, sprintf( '%s is missing a label.', $where ) );
		$this->assertIsString( $variant['label'], sprintf( '%s label must be a string.', $where ) );
		$this->assertNotSame( '', $variant['label'], sprintf( '%s label must not be empty.', $where ) );

		$this->assertArrayHasKey( 'tokens', $variant, sprintf( '%s is missing a tokens map.', $where ) );
		$this->assertIsArray( $variant['tokens'], sprintf( '%s tokens must be a map.', $where ) );
		$this->assertNotEmpty( $variant['tokens'], sprintf( '%s tokens map must not be empty.', $where ) );
	}

	/**
	 * The named variant slugs in a block node — every key except `$default` and any other `$`-prefixed
	 * DTCG metadata, mirroring Variant_Resolver::names().
	 *
	 * @param array<string, mixed> $node The block's variant node.
	 *
	 * @return string[]
	 */
	private function named_variants( array $node ): array {
		$names = [];

		foreach ( array_keys( $node ) as $key ) {
			if ( is_string( $key ) && strpos( $key, '$' ) === 0 ) {
				continue;
			}

			$names[] = (string) $key;
		}

		return $names;
	}

	/**
	 * The variants section from the shipped baseline, or an empty array when absent. The file is decoded
	 * directly (not via Json_Baseline_Document) so this guards the bytes on disk — that loader caches the
	 * decoded document in the object cache keyed on version, which would otherwise serve a stale copy.
	 *
	 * @return array<string, mixed>
	 */
	private function variants_section(): array {
		$raw  = (string) file_get_contents( self::BASELINE_PATH ); // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown
		$node = json_decode( $raw, true );

		foreach ( self::VARIANTS_PATH as $key ) {
			if ( ! is_array( $node ) || ! isset( $node[ $key ] ) ) {
				return [];
			}

			$node = $node[ $key ];
		}

		return is_array( $node ) ? $node : [];
	}
}
