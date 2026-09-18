<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Registry\Baseline;

use Tests\Support\Classes\TestCase;

/**
 * Pins the shipped baseline's preset section to the data model SOFT-3393 formalises: every block's
 * `$default` names a preset that actually exists, and every named preset carries a label and a
 * non-empty tokens map. Runtime writes are validated at the endpoint boundary (SOFT-3390); this guards
 * the trusted, shipped document so a bad hand-edit to baseline.json fails CI instead of surfacing later.
 */
final class Baseline_PresetsTest extends TestCase {

	/**
	 * Absolute path to the shipped baseline document.
	 */
	private const BASELINE_PATH = KADENCE_BLOCKS_PATH . 'includes/resources/Design_Tokens/Registry/Baseline/baseline.json';

	/**
	 * The `$extensions` path to the presets section, mirroring Preset_Resolver::PRESETS_PATH.
	 *
	 * @var string[]
	 */
	private const PRESETS_PATH = [ '$extensions', 'com.kadence.designTokens', 'presets' ];

	public function testTheShippedBaselinePresetSectionIsWellFormed(): void {
		$section = $this->presets_section();

		// A missing/empty section here would silently pass the per-block loop, so assert it ships first.
		$this->assertNotEmpty( $section, 'The baseline should ship a presets section.' );

		foreach ( $section as $block => $node ) {
			$this->assertIsArray( $node, sprintf( 'Preset node for "%s" must be an object.', $block ) );

			// A block is either a flat preset collection, or a container of named collections (a named child
			// that is an array without a "tokens" key is itself a collection). Assert each collection's shape either way.
			if ( $this->is_grouped( $node ) ) {
				foreach ( $this->named_presets( $node ) as $group ) {
					$this->assertIsArray( $node[ $group ], sprintf( '"%s" collection "%s" must be an object.', $block, $group ) );
					$this->assertPresetCollectionShape( (string) $block . '.' . $group, $node[ $group ] );
				}

				continue;
			}

			$this->assertPresetCollectionShape( (string) $block, $node );
		}
	}

	/**
	 * Assert one preset collection node is well-formed: a `$default` naming one of its own presets, and every
	 * named preset carrying a label and a non-empty tokens map.
	 *
	 * @param string               $where The block[.collection] label, for failure messages.
	 * @param array<string, mixed> $node  The collection's preset node.
	 *
	 * @return void
	 */
	private function assertPresetCollectionShape( string $where, array $node ): void {
		$names = $this->named_presets( $node );
		$this->assertNotEmpty( $names, sprintf( 'Collection "%s" declares no named presets.', $where ) );

		// $default must be a non-empty string naming one of the collection's own presets.
		$this->assertArrayHasKey( '$default', $node, sprintf( 'Collection "%s" is missing $default.', $where ) );
		$default = $node['$default'];
		$this->assertIsString( $default, sprintf( 'Collection "%s" $default must be a string.', $where ) );
		$this->assertContains(
			$default,
			$names,
			sprintf( 'Collection "%s" $default "%s" does not name a defined preset.', $where, $default )
		);

		foreach ( $names as $name ) {
			$this->assertPresetShape( $where, $name, $node[ $name ] );
		}
	}

	/**
	 * Whether a block node is a container of named collections rather than a flat collection: a named child that is an
	 * array without a "tokens" key is a collection. Mirrors Preset_Resolver's shape detection.
	 *
	 * @param array<string, mixed> $node The block's preset node.
	 *
	 * @return bool
	 */
	private function is_grouped( array $node ): bool {
		foreach ( $this->named_presets( $node ) as $name ) {
			return is_array( $node[ $name ] ) && ! array_key_exists( 'tokens', $node[ $name ] );
		}

		return false;
	}

	/**
	 * Assert a single preset carries a non-empty label and a non-empty tokens map.
	 *
	 * @param string $block   The block name, for failure messages.
	 * @param string $name    The preset slug, for failure messages.
	 * @param mixed  $preset The raw preset node.
	 *
	 * @return void
	 */
	private function assertPresetShape( string $block, string $name, $preset ): void {
		$where = sprintf( '"%s" preset "%s"', $block, $name );

		$this->assertIsArray( $preset, sprintf( '%s must be an object.', $where ) );

		$this->assertArrayHasKey( 'label', $preset, sprintf( '%s is missing a label.', $where ) );
		$this->assertIsString( $preset['label'], sprintf( '%s label must be a string.', $where ) );
		$this->assertNotSame( '', $preset['label'], sprintf( '%s label must not be empty.', $where ) );

		$this->assertArrayHasKey( 'tokens', $preset, sprintf( '%s is missing a tokens map.', $where ) );
		$this->assertIsArray( $preset['tokens'], sprintf( '%s tokens must be a map.', $where ) );
		$this->assertNotEmpty( $preset['tokens'], sprintf( '%s tokens map must not be empty.', $where ) );
	}

	/**
	 * The named preset slugs in a block node — every key except `$default` and any other `$`-prefixed
	 * DTCG metadata, mirroring Preset_Resolver::names().
	 *
	 * @param array<string, mixed> $node The block's preset node.
	 *
	 * @return string[]
	 */
	private function named_presets( array $node ): array {
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
	 * The presets section from the shipped baseline, or an empty array when absent. The file is decoded
	 * directly (not via Json_Baseline_Document) so this guards the bytes on disk — that loader caches the
	 * decoded document in the object cache keyed on version, which would otherwise serve a stale copy.
	 *
	 * @return array<string, mixed>
	 */
	private function presets_section(): array {
		$raw  = (string) file_get_contents( self::BASELINE_PATH ); // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown
		$node = json_decode( $raw, true );

		foreach ( self::PRESETS_PATH as $key ) {
			if ( ! is_array( $node ) || ! isset( $node[ $key ] ) ) {
				return [];
			}

			$node = $node[ $key ];
		}

		return is_array( $node ) ? $node : [];
	}
}
