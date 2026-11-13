<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Header;

use Generator;
use Kadence_Blocks_Header_Block;
use Kadence_Blocks_CSS;
use Tests\Support\Classes\Css_Normalizer;
use Tests\Support\Classes\TestCase;
use Throwable;

/**
 * Hundreds of saved headers: the margins, the paddings, the typography, the borders, the backgrounds and the shadows. Each must mean what the CSS from the original, undecomposed builder meant.
 *
 * The settings live in the meta of a post, so each case carries them in `__post` and the test serves them as the
 * meta of a post id that only that case uses. The fuzzer of the golden master cannot do that.
 */
final class HeaderMatrixTest extends TestCase {

	/**
	 * The CSS built for the saved settings means the same as the CSS the original builder wrote for them.
	 *
	 * @dataProvider headerProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes, and the saved settings in `__post`.
	 * @param string               $semantic   The hash of the meaning of the original CSS.
	 *
	 * @return void
	 */
	public function testSettingsMeanWhatTheyMeant( array $attributes, string $semantic ): void {
		$settings = $attributes['__post'];
		unset( $attributes['__post'] );

		$meta = [];

		foreach ( $settings as $key => $value ) {
			$meta[ '_kad_header_' . $key ] = [ $value ];
		}

		$filter = static function ( $check, $object_id ) use ( $meta, $attributes ) {
			return isset( $attributes['id'] ) && $object_id === $attributes['id'] ? $meta : $check;
		};

		add_filter( 'get_post_metadata', $filter, 10, 2 );
		// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_set_error_handler -- Matches what the original builder did with warnings.
		set_error_handler(
			static function () {
				return true;
			}
		);

		try {
			$css = (string) Kadence_Blocks_Header_Block::get_instance()->build_css( $attributes, new Kadence_Blocks_CSS(), 'fuzz', 'fuzz' );
		} catch ( Throwable $thrown ) {
			$css = 'EXCEPTION:' . get_class( $thrown );
		}

		restore_error_handler();
		remove_filter( 'get_post_metadata', $filter, 10 );

		$this->assertSame( $semantic, ( new Css_Normalizer() )->hash( $css ) );
	}

	/**
	 * The cases of the matrix, by name.
	 *
	 * @return Generator
	 */
	public function headerProvider(): Generator {
		$matrix = json_decode( (string) file_get_contents( codecept_data_dir( 'hd-matrix.json' ) ), true );

		foreach ( $matrix as $name => $case ) {
			yield $name => [
				'attributes' => $case['attributes'],
				'semantic'   => $case['semantic'],
			];
		}
	}
}
