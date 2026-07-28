<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Palette;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Palette\Css_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use Tests\Support\Classes\TestCase;

/**
 * Covers the per-block palette switch-layer builder: one `[data-kb-palette="<id>"]` selector per palette
 * re-pointing the canonical color vars, with literal and alias swatch values rendered correctly.
 */
final class Css_BuilderTest extends TestCase {

	/**
	 * A palette emits a `[data-kb-palette="<id>"]` selector that re-points each swatch's canonical color var
	 * to the swatch's literal value.
	 *
	 * @return void
	 */
	public function testItEmitsASwitchSelectorPerPaletteWithLiteralValues(): void {
		$css = $this->builder()->css(
			[
				'dark' => [
					'primitive.color.brand.primary' => '#0b1020',
					'primitive.color.neutral.900'   => '#ffffff',
				],
			]
		);

		$this->assertStringContainsString(
			'[data-kb-palette="dark"]{'
				. Css_Var::from_id( 'primitive.color.brand.primary' ) . ':#0b1020;'
				. Css_Var::from_id( 'primitive.color.neutral.900' ) . ':#ffffff;}',
			$css
		);
	}

	/**
	 * An alias swatch value renders as a var() reference to the canonical target token, so it chains through
	 * the cascade rather than freezing a literal.
	 *
	 * @return void
	 */
	public function testItRendersAnAliasSwatchAsAVarReference(): void {
		$css = $this->builder()->css(
			[
				'dark' => [
					'semantic.color.link' => '{primitive.color.brand.primary}',
				],
			]
		);

		$this->assertStringContainsString(
			Css_Var::from_id( 'semantic.color.link' ) . ':var(' . Css_Var::from_id( 'primitive.color.brand.primary' ) . ');',
			$css
		);
	}

	/**
	 * A palette with no swatches emits no selector, so no empty rule is produced.
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
