<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\ShowMore;

use Generator;
use Kadence_Blocks_Show_More_Block;
use Kadence_Blocks_CSS;
use Tests\Support\Classes\Css_Normalizer;
use Tests\Support\Classes\TestCase;

/**
 * Hundreds of random show more blocks: the heights, the fade out and the devices that start open. Each must mean what the CSS from the original,
 * undecomposed builder meant, or fail the way the original failed.
 */
final class ShowMoreMatrixTest extends TestCase {

	/**
	 * The CSS built for the layout means the same as the CSS the original builder wrote for it, or it fails the way the original failed.
	 *
	 * @dataProvider layoutProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $semantic   The hash of the meaning of the original CSS.
	 *
	 * @return void
	 */
	public function testLayoutMeansWhatItMeant( array $attributes, string $semantic ): void {
		$this->assertMeansWhatItMeant( $attributes, $semantic );
	}

	/**
	 * The CSS built for hand made blocks, with the rare branches of the heights, the fade out, the open buttons and the devices that start open, means what the original CSS meant.
	 *
	 * @dataProvider handMadeProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $semantic   The hash of the meaning of the original CSS.
	 *
	 * @return void
	 */
	public function testHandMadeCasesMeanWhatTheyMeant( array $attributes, string $semantic ): void {
		$this->assertMeansWhatItMeant( $attributes, $semantic );
	}

	/**
	 * @return Generator
	 */
	public function layoutProvider(): Generator {
		yield from $this->matrix_cases( 'shm-matrix.json' );
	}

	/**
	 * @return Generator
	 */
	public function handMadeProvider(): Generator {
		yield from $this->matrix_cases( 'shmh-matrix.json' );
	}

	/**
	 * Build the block and compare what the CSS means with what the original CSS meant.
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $semantic   The hash of the meaning of the original CSS.
	 *
	 * @return void
	 */
	private function assertMeansWhatItMeant( array $attributes, string $semantic ): void {
		set_error_handler(
			static function () {
				return true;
			}
		);

		try {
			$css = (string) Kadence_Blocks_Show_More_Block::get_instance()->build_css( $attributes, new Kadence_Blocks_CSS(), 'fuzz', 'fuzz' );
		} catch ( \Throwable $error ) {
			$css = 'EXCEPTION:' . get_class( $error );
		}

		restore_error_handler();

		$this->assertSame( $semantic, ( new Css_Normalizer() )->hash( $css ) );
	}

	/**
	 * The cases of a fixture: the attributes of the block and the hash of what the original CSS meant.
	 *
	 * @param string $file The fixture.
	 *
	 * @return Generator
	 */
	private function matrix_cases( string $file ): Generator {
		$matrix = json_decode( (string) file_get_contents( codecept_data_dir( $file ) ), true );

		foreach ( $matrix as $name => $case ) {
			yield $name => [
				'attributes' => $case['attributes'],
				'semantic'   => $case['semantic'],
			];
		}
	}
}
