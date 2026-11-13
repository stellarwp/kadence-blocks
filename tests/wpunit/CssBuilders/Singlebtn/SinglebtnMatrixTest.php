<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Singlebtn;

use Generator;
use Kadence_Blocks_Singlebtn_Block;
use Kadence_Blocks_CSS;
use Tests\Support\Classes\Css_Normalizer;
use Tests\Support\Classes\TestCase;

/**
 * Hundreds of random single buttons: the widths, backgrounds, borders, shadows, icons and what each device shows, and hand made ones for the rare branches. Each must
 * mean what the CSS from the original, undecomposed builder meant.
 */
final class SinglebtnMatrixTest extends TestCase {

	/**
	 * The CSS built for a random button means the same as the CSS the original builder wrote for it, or it fails the way the original failed.
	 *
	 * @dataProvider randomProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $semantic   The hash of the meaning of the original CSS.
	 *
	 * @return void
	 */
	public function testRandomButtonMeansWhatItMeant( array $attributes, string $semantic ): void {
		$this->assertMeansWhatItMeant( $attributes, $semantic );
	}

	/**
	 * The CSS built for a hand made button means the same as the CSS the original builder wrote for it.
	 *
	 * @dataProvider handMadeProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $semantic   The hash of the meaning of the original CSS.
	 *
	 * @return void
	 */
	public function testHandMadeButtonMeansWhatItMeant( array $attributes, string $semantic ): void {
		$this->assertMeansWhatItMeant( $attributes, $semantic );
	}

	/**
	 * @return Generator
	 */
	public function randomProvider(): Generator {
		yield from $this->matrix_cases( 'sb-matrix.json' );
	}

	/**
	 * @return Generator
	 */
	public function handMadeProvider(): Generator {
		yield from $this->matrix_cases( 'sbh-matrix.json' );
	}

	/**
	 * Build the button and compare what the CSS means with what the original CSS meant.
	 *
	 * Warnings the original raised for values the editor never saves are swallowed, the way the original ran in production.
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
			$css = (string) Kadence_Blocks_Singlebtn_Block::get_instance()->build_css( $attributes, new Kadence_Blocks_CSS(), 'fuzz', 'fuzz' );
		} catch ( \Throwable $error ) {
			$css = 'EXCEPTION:' . get_class( $error );
		}

		restore_error_handler();

		$this->assertSame( $semantic, ( new Css_Normalizer() )->hash( $css ) );
	}

	/**
	 * The cases of a fixture: the attributes of the button and the hash of what the original CSS meant.
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
