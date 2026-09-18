<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Registry\Baseline;

use Tests\Support\Classes\TestCase;

/**
 * Pins the shipped baseline's colorPalettes section: the `$default` / `$current` pointers name real
 * palettes, every palette is an ordered list of groups of self-describing swatches, and the default
 * palette's swatch `$value`s equal the current `primitive.color.*` values — so the baseline colors ARE the
 * default palette and switching to it is a no-op. Guards the bytes on disk so a bad hand-edit fails CI.
 */
final class Baseline_Color_PalettesTest extends TestCase {

	/**
	 * Absolute path to the shipped baseline document.
	 */
	private const BASELINE_PATH = KADENCE_BLOCKS_PATH . 'includes/resources/Design_Tokens/Registry/Baseline/baseline.json';

	/**
	 * The `$extensions` path to the colorPalettes section.
	 *
	 * @var string[]
	 */
	private const PALETTES_PATH = [ '$extensions', 'com.kadence.designTokens', 'colorPalettes' ];

	/**
	 * The section ships, and its `$default` / `$current` pointers each name a palette that exists.
	 *
	 * @return void
	 */
	public function testTheSectionShipsAndItsPointersNameRealPalettes(): void {
		$section = $this->palettes_section();

		$this->assertNotEmpty( $section, 'The baseline should ship a colorPalettes section.' );

		$this->assertArrayHasKey( '$default', $section, 'colorPalettes is missing $default.' );
		$this->assertArrayHasKey( '$current', $section, 'colorPalettes is missing $current.' );

		foreach ( [ '$default', '$current' ] as $pointer ) {
			$target = $section[ $pointer ];
			$this->assertIsString( $target, sprintf( 'colorPalettes %s must be a string.', $pointer ) );
			$this->assertArrayHasKey(
				$target,
				$section,
				sprintf( 'colorPalettes %s "%s" does not name a defined palette.', $pointer, $target )
			);
		}
	}

	/**
	 * Every palette is well-formed: a label, an ordered list of groups, each group an ordered list of
	 * swatches, and each swatch a `token` + `label` + `$value`.
	 *
	 * @return void
	 */
	public function testEveryPaletteIsWellFormed(): void {
		foreach ( $this->named_palettes() as $palette_id => $palette ) {
			$where = sprintf( 'palette "%s"', $palette_id );

			$this->assertIsArray( $palette, sprintf( '%s must be an object.', $where ) );
			$this->assertArrayHasKey( 'label', $palette, sprintf( '%s is missing a label.', $where ) );
			$this->assertArrayHasKey( 'groups', $palette, sprintf( '%s is missing a groups list.', $where ) );
			$this->assertIsArray( $palette['groups'], sprintf( '%s groups must be a list.', $where ) );
			$this->assertNotEmpty( $palette['groups'], sprintf( '%s groups must not be empty.', $where ) );

			foreach ( $palette['groups'] as $index => $group ) {
				$group_where = sprintf( '%s group %d', $where, $index );

				$this->assertIsArray( $group, sprintf( '%s must be an object.', $group_where ) );
				$this->assertArrayHasKey( 'id', $group, sprintf( '%s is missing an id.', $group_where ) );
				$this->assertArrayHasKey( 'label', $group, sprintf( '%s is missing a label.', $group_where ) );
				$this->assertArrayHasKey( 'swatches', $group, sprintf( '%s is missing a swatches list.', $group_where ) );
				$this->assertIsArray( $group['swatches'], sprintf( '%s swatches must be a list.', $group_where ) );
				$this->assertNotEmpty( $group['swatches'], sprintf( '%s swatches must not be empty.', $group_where ) );

				foreach ( $group['swatches'] as $swatch_index => $swatch ) {
					$swatch_where = sprintf( '%s swatch %d', $group_where, $swatch_index );

					$this->assertIsArray( $swatch, sprintf( '%s must be an object.', $swatch_where ) );
					$this->assertArrayHasKey( 'token', $swatch, sprintf( '%s is missing a token.', $swatch_where ) );
					$this->assertArrayHasKey( 'label', $swatch, sprintf( '%s is missing a label.', $swatch_where ) );
					$this->assertArrayHasKey( '$value', $swatch, sprintf( '%s is missing a $value.', $swatch_where ) );
				}
			}
		}
	}

	/**
	 * The default palette's swatch `$value`s equal the current `primitive.color.*` values each `token`
	 * targets, so the baseline colors ARE the default palette and selecting it changes nothing.
	 *
	 * @return void
	 */
	public function testTheDefaultPaletteSwatchesEqualTheCurrentPrimitiveColors(): void {
		$document = $this->decoded();
		$section  = $this->palettes_section();
		$default  = $section[ $section['$default'] ] ?? [];

		$this->assertNotEmpty( $default, 'The default palette should exist.' );

		foreach ( $default['groups'] as $group ) {
			foreach ( $group['swatches'] as $swatch ) {
				$token    = $swatch['token'];
				$expected = $this->leaf_value( $document, $token );

				$this->assertNotNull( $expected, sprintf( 'Swatch token "%s" does not target a color leaf.', $token ) );
				$this->assertSame(
					$expected,
					$swatch['$value'],
					sprintf( 'Swatch "%s" $value must equal the current primitive value.', $token )
				);
			}
		}
	}

	/**
	 * The named palettes in the section (every key except the `$default` / `$current` pointers).
	 *
	 * @return array<string, mixed>
	 */
	private function named_palettes(): array {
		$palettes = [];

		foreach ( $this->palettes_section() as $key => $value ) {
			if ( is_string( $key ) && strpos( $key, '$' ) === 0 ) {
				continue;
			}

			$palettes[ $key ] = $value;
		}

		return $palettes;
	}

	/**
	 * The literal `$value` of a token leaf addressed by dot-path, or null when it is not a value leaf.
	 *
	 * @param array<string, mixed> $document The decoded baseline document.
	 * @param string               $path     The token dot-path.
	 *
	 * @return string|null
	 */
	private function leaf_value( array $document, string $path ): ?string {
		$node = $document;

		foreach ( explode( '.', $path ) as $segment ) {
			if ( ! is_array( $node ) || ! isset( $node[ $segment ] ) ) {
				return null;
			}

			$node = $node[ $segment ];
		}

		return is_array( $node ) && isset( $node['$value'] ) && is_string( $node['$value'] ) ? $node['$value'] : null;
	}

	/**
	 * The colorPalettes section from the shipped baseline, or an empty array when absent. The file is
	 * decoded directly (not via Json_Baseline_Document) so this guards the bytes on disk.
	 *
	 * @return array<string, mixed>
	 */
	private function palettes_section(): array {
		$node = $this->decoded();

		foreach ( self::PALETTES_PATH as $key ) {
			if ( ! is_array( $node ) || ! isset( $node[ $key ] ) ) {
				return [];
			}

			$node = $node[ $key ];
		}

		return is_array( $node ) ? $node : [];
	}

	/**
	 * The decoded shipped baseline document.
	 *
	 * @return array<string, mixed>
	 */
	private function decoded(): array {
		$raw     = (string) file_get_contents( self::BASELINE_PATH ); // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown
		$decoded = json_decode( $raw, true );

		return is_array( $decoded ) ? $decoded : [];
	}
}
