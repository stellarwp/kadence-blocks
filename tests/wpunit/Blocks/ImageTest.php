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
	protected $css;

	protected function setUp(): void {
		parent::setUp();

		$this->block = new Kadence_Blocks_Image_Block();
		$this->css   = new Kadence_Blocks_CSS();
	}

	/**
	 * A shadow with real geometry emits `box-shadow` even though no `displayBoxShadow` attribute is
	 * supplied — the value's own axes are the only gate now that the enable boolean is gone.
	 *
	 * @return void
	 */
	public function testVisibleShadowEmitsWithoutAnEnableFlag(): void {
		$output = $this->render_image(
			[
				'boxShadow' => [
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
	 * An all-zero shadow emits nothing. This is what makes the registered default safe: a fresh image
	 * carries that value and must render exactly as it did when a `false` boolean suppressed it.
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
				'boxShadow' => [
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
