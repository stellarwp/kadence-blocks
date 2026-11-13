<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\OffCanvasTrigger;

use Generator;
use Kadence_Blocks_Off_Canvas_Trigger_Block;
use Kadence_Blocks_CSS;
use Tests\Support\Classes\Css_Normalizer;
use Tests\Support\Classes\TestCase;
use Throwable;

/**
 * Hundreds of random off canvas triggers: the colors, the icon sizes, the measures and the borders on every device. Each must mean what the CSS from the original, undecomposed builder meant.
 */
final class OffCanvasTriggerMatrixTest extends TestCase {

	/**
	 * The CSS built for the attributes means the same as the CSS the original builder wrote for them.
	 *
	 * @dataProvider matrixProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $semantic   The hash of the meaning of the original CSS.
	 *
	 * @return void
	 */
	public function testAttributesMeanWhatTheyMeant( array $attributes, string $semantic ): void {
		// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_set_error_handler -- Matches what the original builder did with warnings.
		set_error_handler(
			static function () {
				return true;
			}
		);

		try {
			$css = (string) Kadence_Blocks_Off_Canvas_Trigger_Block::get_instance()->build_css( $attributes, new Kadence_Blocks_CSS(), 'fuzz', 'fuzz' );
		} catch ( Throwable $thrown ) {
			$css = 'EXCEPTION:' . get_class( $thrown );
		}

		restore_error_handler();

		$this->assertSame( $semantic, ( new Css_Normalizer() )->hash( $css ) );
	}

	/**
	 * The cases of the matrix, by name.
	 *
	 * @return Generator
	 */
	public function matrixProvider(): Generator {
		$matrix = json_decode( (string) file_get_contents( codecept_data_dir( 'oct-matrix.json' ) ), true );

		foreach ( $matrix as $name => $case ) {
			yield $name => [
				'attributes' => $case['attributes'],
				'semantic'   => $case['semantic'],
			];
		}
	}
}
