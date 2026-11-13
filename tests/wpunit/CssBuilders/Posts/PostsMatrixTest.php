<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Posts;

use Generator;
use Kadence_Blocks_Posts_Block;
use Kadence_Blocks_CSS;
use Tests\Support\Classes\Css_Normalizer;
use Tests\Support\Classes\TestCase;

/**
 * Hundreds of random posts blocks, and hand-made ones for the title font and the loop style. Each must mean
 * what the CSS from the original, undecomposed builder meant.
 */
final class PostsMatrixTest extends TestCase {

	/**
	 * The CSS built for the layout means the same as the CSS the original builder wrote for it.
	 *
	 * @dataProvider layoutProvider
	 * @dataProvider handMadeProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $semantic   The hash of the meaning of the original CSS.
	 *
	 * @return void
	 */
	public function testLayoutMeansWhatItMeant( array $attributes, string $semantic ): void {
		$css = Kadence_Blocks_Posts_Block::get_instance()->build_css( $attributes, new Kadence_Blocks_CSS(), 'fuzz', 'fuzz' );

		$this->assertSame( $semantic, ( new Css_Normalizer() )->hash( (string) $css ) );
	}

	/**
	 * @return Generator
	 */
	public function layoutProvider(): Generator {
		yield from $this->cases( 'posts-matrix.json' );
	}

	/**
	 * @return Generator
	 */
	public function handMadeProvider(): Generator {
		yield from $this->cases( 'postshand-matrix.json' );
	}

	/**
	 * The cases of a fixture file, named by prefix.
	 *
	 * @param string $file The fixture file.
	 *
	 * @return Generator
	 */
	private function cases( string $file ): Generator {
		$matrix = json_decode( (string) file_get_contents( codecept_data_dir( $file ) ), true );

		foreach ( $matrix as $name => $case ) {
			yield $file . ' ' . $name => [
				'attributes' => $case['attributes'],
				'semantic'   => $case['semantic'],
			];
		}
	}
}
