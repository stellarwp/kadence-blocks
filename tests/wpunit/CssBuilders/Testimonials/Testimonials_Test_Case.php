<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Testimonials;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Testimonials_Carousel_Layout;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * Shared helpers for tests of the Testimonials CSS sections.
 */
abstract class Testimonials_Test_Case extends Free_Section_Test_Case {

	/**
	 * The calls the block was asked to make, in order.
	 *
	 * @var array<int, array<int, mixed>>
	 */
	protected $calls = [];

	protected function setUp(): void {
		parent::setUp();

		$this->calls = [];

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/testimonials/loader.php';
	}

	/**
	 * Run a section the way the testimonials block runs it: with its style, its units and its carousel derived.
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $selector   The selector that is current when the section runs.
	 *
	 * @return string
	 */
	protected function write_testimonials( Kadence_Blocks_Css_Section $section, array $attributes = [], string $selector = '.x' ): string {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );
		$css->set_selector( $selector );

		$section->write( $this->testimonials_input( $attributes, $css ) );

		return $css->css_output();
	}

	/**
	 * Build the input of a testimonials section.
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param Kadence_Blocks_CSS   $css        The CSS builder.
	 *
	 * @return Kadence_Blocks_Css_Build_Input
	 */
	protected function testimonials_input( array $attributes, Kadence_Blocks_CSS $css ): Kadence_Blocks_Css_Build_Input {
		$context = new Kadence_Blocks_Css_Block_Context(
			'testimonials',
			function ( $member ) {
				$this->calls[] = func_get_args();

				return 'get_usable_value' === $member ? func_get_arg( 2 ) . func_get_arg( 3 ) : null;
			}
		);

		return new Kadence_Blocks_Css_Build_Input(
			$attributes,
			$css,
			'abc',
			'abc',
			$context,
			[
				'style'        => ! empty( $attributes['style'] ) ? $attributes['style'] : 'basic',
				'padding_unit' => 'px',
				'margin_unit'  => 'rem',
				'carousel'     => new Kadence_Blocks_Testimonials_Carousel_Layout( $attributes ),
			]
		);
	}
}
