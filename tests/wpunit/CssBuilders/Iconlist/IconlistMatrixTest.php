<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Iconlist;

use Generator;
use Kadence_Blocks_Iconlist_Block;
use Kadence_Blocks_CSS;
use Tests\Support\Classes\Css_Normalizer;
use Tests\Support\Classes\TestCase;

/**
 * Hundreds of random icon lists: the margins, the gaps, the columns, the list text, the stacked style and the links. Each must mean what the CSS
 * from the original, undecomposed builder meant.
 */
final class IconlistMatrixTest extends TestCase {

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
		$css = Kadence_Blocks_Iconlist_Block::get_instance()->build_css( $attributes, new Kadence_Blocks_CSS(), 'fuzz', 'fuzz' );

		$this->assertSame( $semantic, ( new Css_Normalizer() )->hash( (string) $css ) );
	}

	/**
	 * The random cases, then the hand made ones for the rare branches.
	 *
	 * @return Generator
	 */
	public function layoutProvider(): Generator {
		foreach ( [ 'il', 'ilh' ] as $prefix ) {
			$matrix = json_decode( (string) file_get_contents( codecept_data_dir( $prefix . '-matrix.json' ) ), true );

			foreach ( $matrix as $name => $case ) {
				yield $prefix . ' ' . $name => [
					'attributes' => $case['attributes'],
					'semantic'   => $case['semantic'],
				];
			}
		}
	}
}
