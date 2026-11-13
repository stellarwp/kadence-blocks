<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\AdvancedForm;

use Generator;
use Kadence_Blocks_Advanced_Form_Block;
use Kadence_Blocks_CSS;
use Tests\Support\Classes\Css_Normalizer;
use Tests\Support\Classes\TestCase;
use Throwable;

/**
 * Hundreds of saved advanced forms: the fields, the labels, the messages, the borders and the shadows. Each must
 * mean what the CSS from the original, undecomposed builder meant.
 *
 * The settings of a form live in the meta of its post, so each case carries them in `__form` and the test
 * serves them as the meta of a post id that only that case uses. The fuzzer of the golden master cannot do that.
 */
final class AdvancedFormMatrixTest extends TestCase {

	/**
	 * The CSS built for the form means the same as the CSS the original builder wrote for it.
	 *
	 * @dataProvider formProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes, and the saved settings of the form in `__form`.
	 * @param string               $semantic   The hash of the meaning of the original CSS.
	 *
	 * @return void
	 */
	public function testFormMeansWhatItMeant( array $attributes, string $semantic ): void {
		$form = $attributes['__form'];
		unset( $attributes['__form'] );

		$meta = [];

		foreach ( $form as $key => $value ) {
			$meta[ '_kad_form_' . $key ] = [ $value ];
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
			$css = (string) Kadence_Blocks_Advanced_Form_Block::get_instance()->build_css( $attributes, new Kadence_Blocks_CSS(), 'fuzz', 'fuzz' );
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
	public function formProvider(): Generator {
		$matrix = json_decode( (string) file_get_contents( codecept_data_dir( 'advanced-form-matrix.json' ) ), true );

		foreach ( $matrix as $name => $case ) {
			yield $name => [
				'attributes' => $case['attributes'],
				'semantic'   => $case['semantic'],
			];
		}
	}
}
