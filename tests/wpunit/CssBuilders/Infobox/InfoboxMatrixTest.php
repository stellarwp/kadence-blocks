<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Infobox;

use Generator;
use Kadence_Blocks_Infobox_Block;
use Kadence_Blocks_CSS;
use Tests\Support\Classes\Css_Normalizer;
use Tests\Support\Classes\TestCase;

/**
 * Hundreds of random info boxes: the sizes, the borders, the media, the fonts, the shadows and the legacy
 * attributes. Each must mean what the CSS from the original, undecomposed builder meant.
 */
final class InfoboxMatrixTest extends TestCase {

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
		$css = Kadence_Blocks_Infobox_Block::get_instance()->build_css( $attributes, new Kadence_Blocks_CSS(), 'fuzz', 'fuzz' );

		$this->assertSame( $semantic, ( new Css_Normalizer() )->hash( (string) $css ) );
	}

	/**
	 * @return Generator
	 */
	public function layoutProvider(): Generator {
		$matrix = json_decode( (string) file_get_contents( codecept_data_dir( 'infobox-matrix.json' ) ), true );

		foreach ( $matrix as $name => $case ) {
			yield $name => [
				'attributes' => $case['attributes'],
				'semantic'   => $case['semantic'],
			];
		}
	}
}
