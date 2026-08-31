<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Image_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class ImageTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'image';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Image_Block
	 */
	protected $block;

	/**
	 * The CSS builder each render writes into.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_CSS
	 */
	protected Kadence_Blocks_CSS $css;

	protected function setUp(): void {
		parent::setUp();

		$this->block = new Kadence_Blocks_Image_Block();
		$this->css   = new Kadence_Blocks_CSS();
	}

	/**
	 * A shadow with real geometry and its flag set emits `box-shadow`. This is the shape the editor
	 * writes now: the flag is no longer a control, but it is still stored, derived from the value.
	 *
	 * @return void
	 */
	public function testVisibleShadowEmits(): void {
		$output = $this->render_image(
			[
				'displayBoxShadow' => true,
				'boxShadow'        => [
					[
						'color'   => '#000000',
						'opacity' => 0.2,
						'hOffset' => 0,
						'vOffset' => 4,
						'blur'    => 14,
						'spread'  => 0,
						'inset'   => false,
					],
				],
			]
		);

		$this->assertStringContainsString( 'box-shadow', $output );
	}

	/**
	 * The case this flag exists to protect: a block saved before the enable toggle was removed, with
	 * real shadow values behind a toggle that was switched OFF. Gutenberg omits an attribute equal to
	 * its default, and that toggle defaulted to false, so such a block stores its values and NO flag —
	 * geometry alone would start rendering a shadow the page has never shown.
	 *
	 * @return void
	 */
	public function testLegacyShadowLeftOffStaysOff(): void {
		$output = $this->render_image(
			[
				// No `displayBoxShadow` key at all, exactly as that content serializes.
				'boxShadow' => [
					[
						'color'   => '#04ff00',
						'opacity' => 1,
						'hOffset' => 10,
						'vOffset' => 10,
						'blur'    => 0,
						'spread'  => 0,
						'inset'   => false,
					],
				],
			]
		);

		$this->assertStringNotContainsString( 'box-shadow', $output );
	}

	/**
	 * An all-zero shadow emits nothing — geometry alone decides, so the value the "None" pick writes
	 * paints nothing whatever its color says.
	 *
	 * @return void
	 */
	public function testAllZeroShadowEmitsNothing(): void {
		$output = $this->render_image(
			[
				'boxShadow' => [
					[
						'color'   => 'transparent',
						'opacity' => 1,
						'hOffset' => 0,
						'vOffset' => 0,
						'blur'    => 0,
						'spread'  => 0,
						'inset'   => false,
					],
				],
			]
		);

		$this->assertStringNotContainsString( 'box-shadow', $output );
	}

	/**
	 * A colored shadow with no geometry paints nothing on the page, so it emits nothing either —
	 * color alone never makes a shadow visible.
	 *
	 * @return void
	 */
	public function testColoredShadowWithNoGeometryEmitsNothing(): void {
		$output = $this->render_image(
			[
				'boxShadow' => [
					[
						'color'   => '#ff0000',
						'opacity' => 1,
						'hOffset' => 0,
						'vOffset' => 0,
						'blur'    => 0,
						'spread'  => 0,
						'inset'   => false,
					],
				],
			]
		);

		$this->assertStringNotContainsString( 'box-shadow', $output );
	}

	/**
	 * A design-token alias in a geometry leg counts as visible: it resolves to a `var()` whose value
	 * the renderer cannot read, and treating it as a zero would drop a shadow the token does paint.
	 *
	 * @return void
	 */
	public function testTokenAliasGeometryCountsAsVisible(): void {
		$output = $this->render_image(
			[
				'displayBoxShadow' => true,
				'boxShadow'        => [
					[
						'color'   => '#000000',
						'opacity' => 0.2,
						'hOffset' => 0,
						'vOffset' => '{semantic.shadow.media}',
						'blur'    => 0,
						'spread'  => 0,
						'inset'   => false,
					],
				],
			]
		);

		$this->assertStringContainsString( 'box-shadow', $output );
	}

	/**
	 * A border radius stored as a design-token alias reaches the rendered CSS as that token's
	 * variable rather than as a literal, which is what the editor's own inline style has to agree
	 * with.
	 *
	 * @return void
	 */
	public function testBorderRadiusTokenAliasRendersAsAVariable(): void {
		$output = $this->render_image(
			[
				'borderRadius'     => [ '{semantic.radius.media}', '', '', '' ],
				'borderRadiusUnit' => 'px',
			]
		);

		$this->assertStringContainsString( 'var(--kb-token--semantic--radius--media)', $output );
	}

	/**
	 * A fresh image arrives with the shipped schema defaults — a VISIBLE `boxShadow` value paired with
	 * a lowered `displayBoxShadow` — and must still paint nothing. The visible value exists only so a
	 * legacy image that saved no value key of its own keeps its shadow; the lowered flag is what keeps
	 * a brand-new image clean.
	 *
	 * @return void
	 */
	public function testFreshImageEmitsNoBoxShadowDespiteTheShippedVisibleDefault(): void {
		$output = $this->render_image(
			[
				'displayBoxShadow' => false,
				'boxShadow'        => [ $this->shipped_shadow_default() ],
			]
		);

		$this->assertStringNotContainsString( 'box-shadow', $output );
	}

	/**
	 * An image switched on before its shadow was ever customized saved the flag and NO `boxShadow`
	 * key, because the value matched the registered default. It arrives with that default filled back
	 * in and must render the shadow it has always rendered — the regression a lowered value default
	 * causes, which nothing downstream repairs.
	 *
	 * @return void
	 */
	public function testLegacyImageWithNoStoredShadowValueStillRendersItsShippedShadow(): void {
		$output = $this->render_image(
			[
				'displayBoxShadow' => true,
				'boxShadow'        => [ $this->shipped_shadow_default() ],
			]
		);

		$this->assertStringContainsString(
			'box-shadow:0px 0px 14px 0px rgba(0, 0, 0, 0.2)',
			$output,
			'A raised flag with no stored shadow value must render the shipped default shadow.'
		);
	}

	/**
	 * The `boxShadow` attribute default `block.json` has always registered, spelled out here so a
	 * change to that schema fails these tests loudly instead of silently weakening them.
	 *
	 * @return array<string, mixed> The shipped default shadow item.
	 */
	private function shipped_shadow_default(): array {
		return [
			'color'   => '#000000',
			'opacity' => 0.2,
			'spread'  => 0,
			'blur'    => 14,
			'hOffset' => 0,
			'vOffset' => 0,
			'inset'   => false,
		];
	}

	/**
	 * Build the block's CSS for a set of attributes, mirroring `SinglebtnTest::render_button()`.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $attributes The block attributes to render.
	 *
	 * @return string The rendered CSS.
	 */
	private function render_image( array $attributes ): string {
		$unique_id = '123';

		return $this->block->build_css(
			array_merge( [ 'uniqueID' => $unique_id ], $attributes ),
			$this->css,
			$unique_id,
			$unique_id
		);
	}
}
