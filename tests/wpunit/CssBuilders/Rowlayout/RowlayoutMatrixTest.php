<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Rowlayout;

use Generator;
use Kadence_Blocks_Rowlayout_Block;
use Kadence_Blocks_CSS;
use Tests\Support\Classes\Css_Normalizer;
use Tests\Support\Classes\TestCase;

/**
 * Over a thousand random layouts: the columns and their order, the breakout, the backgrounds, the overlays, the separators and the legacy
 * attributes. Each must mean what the CSS from the original, undecomposed builder meant, as the site it runs on is.
 */
final class RowlayoutMatrixTest extends TestCase {

	/**
	 * The CSS built for the layout means the same as the CSS the original builder wrote for it.
	 *
	 * @dataProvider layoutProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $semantic   The hash of the meaning of the original CSS.
	 *
	 * @return void
	 */
	public function testLayoutMeansWhatItMeant( array $attributes, string $semantic ): void {
		$css = Kadence_Blocks_Rowlayout_Block::get_instance()->build_css( $attributes, new Kadence_Blocks_CSS(), 'fuzz', 'fuzz' );

		$this->assertSame( $semantic, ( new Css_Normalizer() )->hash( (string) $css ) );
	}

	/**
	 * @return Generator
	 */
	public function layoutProvider(): Generator {
		$matrix = json_decode( (string) file_get_contents( codecept_data_dir( 'rowlayout-matrix.json' ) ), true );

		foreach ( $matrix as $name => $case ) {
			yield $name => [
				'attributes' => $case['attributes'],
				'semantic'   => $case['semantic'],
			];
		}
	}
}
