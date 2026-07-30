<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Palette;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Palette\Css_Builder;
use Tests\Support\Classes\TestCase;

/**
 * Covers the per-block palette switch-layer builder: a shared `[data-kb-palette]` rule re-emitting the
 * variant declarations, plus one `[data-kb-palette="<id>"]` selector per palette re-declaring that palette's
 * resolved color vars as literals.
 */
final class Css_BuilderTest extends TestCase {

	/**
	 * A palette emits a `[data-kb-palette="<id>"]` selector that re-declares each resolved color var (already
	 * keyed by its canonical `--kb-token--*` name) to its literal value, sanitized.
	 *
	 * @return void
	 */
	public function testItEmitsASwitchSelectorPerPaletteWithLiteralValues(): void {
		$css = $this->builder()->css(
			[
				'dark' => [
					'--kb-token--primitive--color--brand--primary' => '#0b1020',
					'--kb-token--primitive--color--neutral--900'   => '#ffffff',
				],
			]
		);

		$this->assertStringContainsString(
			'[data-kb-palette="dark"]{'
				. '--kb-token--primitive--color--brand--primary:#0b1020;'
				. '--kb-token--primitive--color--neutral--900:#ffffff;}',
			$css
		);
	}

	/**
	 * The variant declarations are re-emitted under a shared attribute-presence `[data-kb-palette]` rule, so a
	 * variant var re-resolves against the subtree's re-declared semantics inside any palette.
	 *
	 * @return void
	 */
	public function testItEmitsTheVariantDeclarationsUnderTheSharedPresenceSelector(): void {
		$css = $this->builder()->css(
			[ 'dark' => [ '--kb-token--primitive--color--brand--primary' => '#0b1020' ] ],
			'--kb-token--variant--kadence-singlebtn--primary--button-bg:var(--kb-token--semantic--color--button-primary-bg);'
		);

		$this->assertStringContainsString(
			'[data-kb-palette]{--kb-token--variant--kadence-singlebtn--primary--button-bg:var(--kb-token--semantic--color--button-primary-bg);}',
			$css
		);
	}

	/**
	 * With no variant declarations, no shared presence rule is emitted (only the per-palette selectors).
	 *
	 * @return void
	 */
	public function testItOmitsTheSharedRuleWhenThereAreNoVariantDeclarations(): void {
		$css = $this->builder()->css( [ 'dark' => [ '--kb-token--primitive--color--brand--primary' => '#0b1020' ] ] );

		$this->assertStringNotContainsString( '[data-kb-palette]{', $css );
	}

	/**
	 * A palette with no resolved color vars emits no selector, so no empty rule is produced.
	 *
	 * @return void
	 */
	public function testAPaletteWithNoSwatchesEmitsNothing(): void {
		$this->assertSame( '', $this->builder()->css( [ 'dark' => [] ] ) );
	}

	/**
	 * The switch-attribute accessor matches the attribute used in the emitted selector.
	 *
	 * @return void
	 */
	public function testTheSwitchAttributeAccessorMatchesTheEmittedSelector(): void {
		$this->assertSame( 'data-kb-palette', Css_Builder::get_switch_attribute() );
	}

	/**
	 * Builds a fresh palette CSS builder for the tests to exercise.
	 *
	 * @return Css_Builder
	 */
	private function builder(): Css_Builder {
		return new Css_Builder();
	}
}
