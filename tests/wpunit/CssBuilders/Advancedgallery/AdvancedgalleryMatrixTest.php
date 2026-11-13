<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Advancedgallery;

use Generator;
use Kadence_Blocks_Advancedgallery_Block;
use Kadence_Blocks_CSS;
use Tests\Support\Classes\Css_Normalizer;
use Tests\Support\Classes\TestCase;

/**
 * Hundreds of random galleries and many made by hand to reach the rare branches: the gutters, the heights, the
 * shadows, the captions, the arrows and the dots. Each must mean what the CSS from the original, undecomposed builder meant.
 */
final class AdvancedgalleryMatrixTest extends TestCase {

	/**
	 * The CSS built for a random gallery means the same as the CSS the original builder wrote for it.
	 *
	 * @dataProvider randomProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $semantic   The hash of the meaning of the original CSS.
	 *
	 * @return void
	 */
	public function testRandomGalleryMeansWhatItMeant( array $attributes, string $semantic ): void {
		$css = Kadence_Blocks_Advancedgallery_Block::get_instance()->build_css( $attributes, new Kadence_Blocks_CSS(), 'fuzz', 'fuzz' );

		$this->assertSame( $semantic, ( new Css_Normalizer() )->hash( (string) $css ) );
	}

	/**
	 * The CSS built for a gallery made by hand means the same as the CSS the original builder wrote for it.
	 *
	 * @dataProvider handMadeProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $semantic   The hash of the meaning of the original CSS.
	 *
	 * @return void
	 */
	public function testHandMadeGalleryMeansWhatItMeant( array $attributes, string $semantic ): void {
		$css = Kadence_Blocks_Advancedgallery_Block::get_instance()->build_css( $attributes, new Kadence_Blocks_CSS(), 'fuzz', 'fuzz' );

		$this->assertSame( $semantic, ( new Css_Normalizer() )->hash( (string) $css ) );
	}

	/**
	 * @return Generator
	 */
	public function handMadeProvider(): Generator {
		$matrix = json_decode( (string) file_get_contents( codecept_data_dir( 'agh-matrix.json' ) ), true );

		foreach ( $matrix as $name => $case ) {
			yield $name => [
				'attributes' => $case['attributes'],
				'semantic'   => $case['semantic'],
			];
		}
	}

	/**
	 * @return Generator
	 */
	public function randomProvider(): Generator {
		$matrix = json_decode( (string) file_get_contents( codecept_data_dir( 'agx-matrix.json' ) ), true );

		foreach ( $matrix as $name => $case ) {
			yield $name => [
				'attributes' => $case['attributes'],
				'semantic'   => $case['semantic'],
			];
		}
	}
}
