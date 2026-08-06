<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Schema\Vocabulary;

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
}
