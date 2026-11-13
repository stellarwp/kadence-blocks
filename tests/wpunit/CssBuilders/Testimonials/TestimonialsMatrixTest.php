<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Testimonials;

use Generator;
use Kadence_Blocks_Testimonials_Block;
use Kadence_Blocks_CSS;
use Tests\Support\Classes\Css_Normalizer;
use Tests\Support\Classes\TestCase;

/**
 * Hundreds of random testimonials blocks: the icons, the wrappers, the fonts, the media, the ratings and the
 * carousels. Each must mean what the CSS from the original, undecomposed builder meant.
 */
final class TestimonialsMatrixTest extends TestCase {

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
		$css = Kadence_Blocks_Testimonials_Block::get_instance()->build_css( $attributes, new Kadence_Blocks_CSS(), 'fuzz', 'fuzz' );

		$this->assertSame( $semantic, ( new Css_Normalizer() )->hash( (string) $css ) );
	}

	/**
	 * Random attributes, and hand-made ones for the branches that random attributes rarely reach.
	 *
	 * @return Generator
	 */
	public function layoutProvider(): Generator {
		foreach ( [
			'random' => 'testimonials-matrix.json',
			'hand'   => 'testimonials-hand-matrix.json',
		] as $kind => $file ) {
			$matrix = json_decode( (string) file_get_contents( codecept_data_dir( $file ) ), true );

			foreach ( $matrix as $name => $case ) {
				yield $kind . ' ' . $name => [
					'attributes' => $case['attributes'],
					'semantic'   => $case['semantic'],
				];
			}
		}
	}
}
