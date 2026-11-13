<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\AdvancedForm;

use Kadence_Blocks_Advanced_Form_Css;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Tests\Support\Classes\Css_Normalizer;
use Tests\Support\Classes\TestCase;

/**
 * The advanced form builder, fed the saved settings of a form by a fake block instead of a post.
 */
final class AdvancedFormBuilderTest extends TestCase {

	/**
	 * The calls the builder made to the block, in order.
	 *
	 * @var array<int, array<int, mixed>>
	 */
	private $calls = [];

	/**
	 * A form with no id writes nothing and does not even ask the block for its settings.
	 *
	 * @return void
	 */
	public function testFormWithoutIdWritesNothing(): void {
		$css = new Kadence_Blocks_CSS();

		$this->assertNull( $this->builder( [] )->build( [], $css, 'abc', 'af-no-id' ) );
		$this->assertSame( [], $this->calls );
	}

	/**
	 * The builder asks the block for the settings of the form post and writes the CSS they mean.
	 *
	 * @return void
	 */
	public function testFormWritesTheCssOfItsSettings(): void {
		$settings = [
			'style'      => [
				'isDark'           => true,
				'color'            => '#111',
				'placeholderColor' => '#999',
			],
			'background' => [
				'backgroundType' => 'gradient',
				'gradient'       => 'linear-gradient(#000,#fff)',
			],
			'helpFont'   => [ 'style' => 'normal' ],
			'padding'    => [ '1', '2', '3', '4' ],
		];

		$output = $this->builder( $settings )->build( [ 'id' => 77 ], new Kadence_Blocks_CSS(), 'abc', 'af-settings' );

		$expected = '.wp-block-kadence-advanced-formabc, .wp-block-kadence-advanced-formabc.kb-form-has-background{padding-top:1px;padding-right:2px;padding-bottom:3px;padding-left:4px;}'
			. '.wp-block-kadence-advanced-formabc{background:linear-gradient(#000,#fff);color-scheme:dark;--kb-form-text-focus-color:#111;--kb-form-placeholder-color:#999;}'
			. '.wp-block-kadence-advanced-formabc .kb-adv-form-help{font-style:normal;}';

		$this->assertSame( [ [ 'get_form_attributes', 77 ] ], $this->calls );
		$this->assertSame( ( new Css_Normalizer() )->hash( $expected ), ( new Css_Normalizer() )->hash( (string) $output ) );
	}

	/**
	 * Build the advanced form builder on a fake block that gives the settings of a form.
	 *
	 * @param array<string, mixed> $settings The saved settings of the form.
	 *
	 * @return Kadence_Blocks_Advanced_Form_Css
	 */
	private function builder( array $settings ): Kadence_Blocks_Advanced_Form_Css {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-advanced-form-css.php';

		$this->calls = [];

		return new Kadence_Blocks_Advanced_Form_Css(
			new Kadence_Blocks_Css_Block_Context(
				'advanced-form',
				function () use ( $settings ) {
					$this->calls[] = func_get_args();

					return $settings;
				}
			)
		);
	}
}
