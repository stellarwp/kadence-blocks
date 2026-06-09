<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Kadence_Option;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option\Palette_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;
use Tests\Support\Classes\TestCase;

final class Palette_BuilderTest extends TestCase {

	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		$this->registry = new Token_Registry();
	}

	private function builder(): Palette_Builder {
		return new Palette_Builder( $this->registry );
	}

	private function resolved_for( array $definitions_and_values ): Resolved_Tokens {
		$by_id  = [];
		$by_var = [];

		foreach ( $definitions_and_values as [ $definition, $value ] ) {
			$this->registry->register( $definition );
			$id           = (string) $definition['id'];
			$by_id[ $id ] = $value;
			$by_var[ Css_Var::from_id( $id ) ] = $value;
		}

		return new Resolved_Tokens( $by_id, $by_var );
	}

	// ---- entries() ---------------------------------------------------------------------------------

	public function testEntriesMapsShippedPaletteTokensToColorAndName(): void {
		$resolved = $this->resolved_for(
			[
				[
					[
						'id'          => 'semantic.color.button-bg',
						'type'        => 'color',
						'label'       => 'Button Background',
						'projections' => [ 'kadence_slot' => 'palette1' ],
					],
					'#3182CE',
				],
				[
					[
						'id'          => 'semantic.color.button-text',
						'type'        => 'color',
						'label'       => 'Button Text',
						'projections' => [ 'kadence_slot' => 'palette2' ],
					],
					'#FFFFFF',
				],
			]
		);

		$entries = $this->builder()->entries( $resolved );

		$this->assertArrayHasKey( 'palette1', $entries );
		$this->assertSame( '#3182CE', $entries['palette1']['color'] );
		$this->assertSame( 'Button Background', $entries['palette1']['name'] );

		$this->assertArrayHasKey( 'palette2', $entries );
		$this->assertSame( '#FFFFFF', $entries['palette2']['color'] );
	}

	public function testEntriesSkipsTokensWithNullResolvedValue(): void {
		$this->registry->register(
			[
				'id'          => 'semantic.color.missing',
				'type'        => 'color',
				'label'       => 'Missing',
				'projections' => [ 'kadence_slot' => 'palette3' ],
			]
		);

		$entries = $this->builder()->entries( new Resolved_Tokens( [], [] ) );

		$this->assertArrayNotHasKey( 'palette3', $entries );
	}

	public function testEntriesSkipsTokensWithEmptyResolvedValue(): void {
		$id = 'semantic.color.empty';
		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'color',
				'label'       => 'Empty',
				'projections' => [ 'kadence_slot' => 'palette4' ],
			]
		);

		$entries = $this->builder()->entries( new Resolved_Tokens( [ $id => '' ], [] ) );

		$this->assertArrayNotHasKey( 'palette4', $entries );
	}

	public function testEntriesSkipsNonPaletteKadenceSlots(): void {
		$id = 'semantic.dimension.font-sm';
		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'dimension',
				'label'       => 'Font Small',
				'projections' => [ 'kadence_slot' => 'sm' ],
			]
		);

		$entries = $this->builder()->entries( new Resolved_Tokens( [ $id => '0.875rem' ], [] ) );

		$this->assertSame( [], $entries );
	}

	// ---- merge_kb_colors() -------------------------------------------------------------------------

	public function testMergeKbColorsOverwritesColorOfExistingEntry(): void {
		$existing = [
			'palette' => [
				[ 'color' => '#old', 'name' => 'Old Name', 'slug' => 'palette1' ],
			],
			'override' => false,
		];

		$result = $this->builder()->merge_kb_colors(
			$existing,
			[ 'palette1' => [ 'color' => '#3182CE', 'name' => 'Button Background' ] ]
		);

		$this->assertSame( '#3182CE', $result['palette']['palette1']['color'] ?? $result['palette'][0]['color'] );
	}

	public function testMergeKbColorsPreservesPositionOfExistingEntry(): void {
		$existing = [
			'palette' => [
				[ 'color' => '#aaa', 'name' => 'First', 'slug' => 'palette3' ],
				[ 'color' => '#old', 'name' => 'Old', 'slug' => 'palette1' ],
			],
			'override' => false,
		];

		$result  = $this->builder()->merge_kb_colors(
			$existing,
			[ 'palette1' => [ 'color' => '#3182CE', 'name' => 'Button Background' ] ]
		);
		$palette = $result['palette'];

		$this->assertSame( 'palette3', $palette[0]['slug'] );
		$this->assertSame( 'palette1', $palette[1]['slug'] );
		$this->assertSame( '#3182CE', $palette[1]['color'] );
	}

	public function testMergeKbColorsAppendsClaimedSlugNotPresent(): void {
		$existing = [
			'palette'  => [],
			'override' => false,
		];

		$result  = $this->builder()->merge_kb_colors(
			$existing,
			[ 'palette1' => [ 'color' => '#3182CE', 'name' => 'Button Background' ] ]
		);
		$palette = $result['palette'];

		$this->assertCount( 1, $palette );
		$this->assertSame( 'palette1', $palette[0]['slug'] );
		$this->assertSame( '#3182CE', $palette[0]['color'] );
		$this->assertSame( 'Button Background', $palette[0]['name'] );
	}

	public function testMergeKbColorsPreservesNonTokenEntry(): void {
		$existing = [
			'palette' => [
				[ 'color' => '#ff0000', 'name' => 'Red', 'slug' => 'palette5' ],
			],
			'override' => false,
		];

		$result  = $this->builder()->merge_kb_colors(
			$existing,
			[ 'palette1' => [ 'color' => '#3182CE', 'name' => 'Button Background' ] ]
		);
		$by_slug = array_column( $result['palette'], null, 'slug' );

		$this->assertArrayHasKey( 'palette5', $by_slug );
		$this->assertSame( '#ff0000', $by_slug['palette5']['color'] );
	}

	public function testMergeKbColorsPreservesOverrideFlagWhenTrue(): void {
		$existing = [
			'palette'  => [],
			'override' => true,
		];

		$result = $this->builder()->merge_kb_colors(
			$existing,
			[ 'palette1' => [ 'color' => '#3182CE', 'name' => 'Button Background' ] ]
		);

		$this->assertTrue( $result['override'] );
	}

	public function testMergeKbColorsPreservesOverrideFlagWhenFalse(): void {
		$existing = [
			'palette'  => [],
			'override' => false,
		];

		$result = $this->builder()->merge_kb_colors(
			$existing,
			[ 'palette1' => [ 'color' => '#3182CE', 'name' => 'Button Background' ] ]
		);

		$this->assertFalse( $result['override'] );
	}

	public function testMergeKbColorsDefaultsOverrideFalseWhenAbsent(): void {
		$result = $this->builder()->merge_kb_colors(
			[],
			[ 'palette1' => [ 'color' => '#3182CE', 'name' => 'Button Background' ] ]
		);

		$this->assertFalse( $result['override'] );
	}

	// ---- merge_theme_palette() -----------------------------------------------------------------------

	public function testMergeThemePaletteOverwritesColorOnly(): void {
		$existing = [
			'palette' => [
				[ 'color' => '#old', 'name' => 'Palette 1', 'slug' => 'palette1' ],
			],
		];

		$result  = $this->builder()->merge_theme_palette(
			$existing,
			[ 'palette1' => [ 'color' => '#3182CE', 'name' => 'Button Background' ] ]
		);
		$palette = $result['palette'];

		$this->assertSame( '#3182CE', $palette[0]['color'] );
		$this->assertSame( 'Palette 1', $palette[0]['name'] ); // name untouched.
	}

	public function testMergeThemePaletteNeverAppends(): void {
		$existing = [
			'palette' => [
				[ 'color' => '#aaa', 'name' => 'Other', 'slug' => 'palette5' ],
			],
		];

		$result = $this->builder()->merge_theme_palette(
			$existing,
			[ 'palette1' => [ 'color' => '#3182CE', 'name' => 'Button Background' ] ]
		);

		// palette1 was not present and must not be appended.
		$this->assertCount( 1, $result['palette'] );
		$this->assertSame( 'palette5', $result['palette'][0]['slug'] );
	}

	public function testMergeThemePalettePreservesUnclaimed(): void {
		$existing = [
			'palette' => [
				[ 'color' => '#aaa', 'name' => 'Unclaimed', 'slug' => 'palette7' ],
				[ 'color' => '#old', 'name' => 'Palette 1', 'slug' => 'palette1' ],
			],
		];

		$result  = $this->builder()->merge_theme_palette(
			$existing,
			[ 'palette1' => [ 'color' => '#new', 'name' => 'Ignored' ] ]
		);
		$by_slug = array_column( $result['palette'], null, 'slug' );

		$this->assertSame( '#aaa', $by_slug['palette7']['color'] );
	}

	public function testMergeThemePaletteReturnsExistingWhenPaletteKeyMissing(): void {
		$existing = [ 'extra_key' => 'value' ];

		$result = $this->builder()->merge_theme_palette(
			$existing,
			[ 'palette1' => [ 'color' => '#3182CE', 'name' => 'Button Background' ] ]
		);

		$this->assertSame( $existing, $result );
	}

	public function testMergeThemePalettePreservesSiblingTopLevelKeys(): void {
		$existing = [
			'palette'   => [ [ 'color' => '#old', 'name' => 'Palette 1', 'slug' => 'palette1' ] ],
			'some_meta' => 'keep-me',
		];

		$result = $this->builder()->merge_theme_palette(
			$existing,
			[ 'palette1' => [ 'color' => '#new', 'name' => 'Ignored' ] ]
		);

		$this->assertSame( 'keep-me', $result['some_meta'] );
	}

	// ---- has_palette_tokens() -----------------------------------------------------------------------

	public function testHasPaletteTokensIsTrueWithShippedTokens(): void {
		$this->registry->register(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'kadence_slot' => 'palette1' ],
			]
		);

		$this->assertTrue( $this->builder()->has_palette_tokens() );
	}

	public function testHasPaletteTokensIsFalseOnEmptyRegistry(): void {
		$this->assertFalse( $this->builder()->has_palette_tokens() );
	}

	public function testHasPaletteTokensIsFalseWhenOnlyFontSizeTokens(): void {
		$this->registry->register(
			[
				'id'          => 'semantic.dimension.font-sm',
				'type'        => 'dimension',
				'label'       => 'Font Small',
				'projections' => [ 'kadence_slot' => 'sm' ],
			]
		);

		$this->assertFalse( $this->builder()->has_palette_tokens() );
	}
}
