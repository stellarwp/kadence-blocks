<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Schema\Vocabulary;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use Tests\Support\Classes\TestCase;

/**
 * Pins the $extensions vocabulary accessors, so every reader and the validator agree on the exact spelling
 * of the color-palette section and its structural keys.
 */
final class ExtensionsTest extends TestCase {

	/**
	 * The color-palettes section accessor returns the expected section name.
	 *
	 * @return void
	 */
	public function testItExposesTheColorPalettesSectionName(): void {
		$this->assertSame( 'colorPalettes', Extensions::get_section_color_palettes() );
	}

	/**
	 * The color-palettes section is deliberately NOT among get_sections(): its values live under each
	 * swatch's `$value`, not a `tokens` map, so the tokens-map walk must not descend it.
	 *
	 * @return void
	 */
	public function testTheColorPalettesSectionIsNotAmongTheTokensMapSections(): void {
		$this->assertNotContains( Extensions::get_section_color_palettes(), Extensions::get_sections() );
	}

	/**
	 * The color-palettes path is the presets path with the palettes section swapped in, from the document
	 * root through the module namespace.
	 *
	 * @return void
	 */
	public function testItExposesTheColorPalettesPath(): void {
		$this->assertSame(
			[ '$extensions', 'com.kadence.designTokens', 'colorPalettes' ],
			Extensions::get_color_palettes_path()
		);
	}

	/**
	 * The palette structural-key accessors return the exact keys the baseline, validator and readers share.
	 *
	 * @return void
	 */
	public function testItExposesThePaletteStructuralKeys(): void {
		$this->assertSame( '$current', Extensions::get_current_key() );
		$this->assertSame( 'groups', Extensions::get_groups_key() );
		$this->assertSame( 'swatches', Extensions::get_swatches_key() );
		$this->assertSame( 'token', Extensions::get_swatch_token_key() );
		$this->assertSame( 'id', Extensions::get_group_id_key() );
	}

	/**
	 * A bare preset token entry is its own base value and declares no per-breakpoint overrides, so every
	 * existing preset reads through the new accessors unchanged.
	 *
	 * @dataProvider bareEntryProvider
	 *
	 * @param mixed $entry The bare preset token entry.
	 *
	 * @return void
	 */
	public function testABarePresetEntryIsItsOwnValue( $entry ): void {
		$this->assertSame( $entry, Extensions::preset_value_of( $entry ) );
		$this->assertSame( [], Extensions::preset_responsive_of( $entry ) );
	}

	/**
	 * @return Generator
	 */
	public function bareEntryProvider(): Generator {
		yield 'literal' => [ 'entry' => '#3633e1' ];

		yield 'alias' => [ 'entry' => '{semantic.radius.control}' ];

		yield 'slot list' => [ 'entry' => [ '8px', '4px', '8px', '4px' ] ];

		yield 'numeric' => [ 'entry' => 8 ];
	}

	/**
	 * A preset token entry carrying the responsive envelope exposes its base value and its per-breakpoint
	 * overrides separately, so a consumer never has to hand-roll the unwrap.
	 *
	 * @return void
	 */
	public function testAResponsivePresetEntryExposesItsBaseAndOverrides(): void {
		$entry = [
			'$value'      => [ '8px', '4px', '8px', '4px' ],
			'$extensions' => [
				'com.kadence.designTokens' => [
					'responsive' => [
						'tablet' => '4px',
						'mobile' => '{primitive.dimension.radius.sm}',
					],
				],
			],
		];

		$this->assertSame( [ '8px', '4px', '8px', '4px' ], Extensions::preset_value_of( $entry ) );
		$this->assertSame(
			[
				'tablet' => '4px',
				'mobile' => '{primitive.dimension.radius.sm}',
			],
			Extensions::preset_responsive_of( $entry )
		);
	}

	/**
	 * A slot list is never mistaken for an envelope: it has no `$value` key, so it reads as its own base
	 * value with no overrides even though it is an array.
	 *
	 * @return void
	 */
	public function testASlotListIsNotTreatedAsAnEnvelope(): void {
		$slots = [ '{primitive.dimension.radius.lg}', '8px', '8px', '8px' ];

		$this->assertSame( $slots, Extensions::preset_value_of( $slots ) );
		$this->assertSame( [], Extensions::preset_responsive_of( $slots ) );
	}

	/**
	 * The token-labels section accessor returns the expected section name.
	 *
	 * @return void
	 */
	public function testItExposesTheTokenLabelsSectionName(): void {
		$this->assertSame( 'tokenLabels', Extensions::get_section_token_labels() );
	}

	/**
	 * The token-labels section is deliberately NOT among get_sections(): it is a flat id-keyed
	 * label map, not a preset-shaped `tokens` map, so the tokens-map walk must not descend it.
	 *
	 * @return void
	 */
	public function testTheTokenLabelsSectionIsNotAmongTheTokensMapSections(): void {
		$this->assertNotContains( Extensions::get_section_token_labels(), Extensions::get_sections() );
	}

	/**
	 * get_sections() returns exactly the two preset-shaped sections — the color-palettes and
	 * token-labels exclusions are pinned, not incidental.
	 *
	 * @return void
	 */
	public function testGetSectionsReturnsExactlyThePresetShapedSections(): void {
		$this->assertSame(
			[ Extensions::get_section_foundation_presets(), Extensions::get_section_presets() ],
			Extensions::get_sections()
		);
	}

	/**
	 * The token-order section accessor returns the expected section name.
	 *
	 * @return void
	 */
	public function testItExposesTheTokenOrderSectionName(): void {
		$this->assertSame( 'tokenOrder', Extensions::get_section_token_order() );
	}

	/**
	 * The token-order section is deliberately NOT among get_sections(): it is a group-keyed
	 * id-list map, not a preset-shaped `tokens` map, so the tokens-map walk must not descend it.
	 *
	 * @return void
	 */
	public function testTheTokenOrderSectionIsNotAmongTheTokensMapSections(): void {
		$this->assertNotContains( Extensions::get_section_token_order(), Extensions::get_sections() );
	}
}
