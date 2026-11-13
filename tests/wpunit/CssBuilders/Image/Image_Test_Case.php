<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Image;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * Shared helpers for tests of the Image CSS sections.
 */
abstract class Image_Test_Case extends Free_Section_Test_Case {

	/**
	 * The calls the block was asked to make, in order.
	 *
	 * @var array<int, array<int, mixed>>
	 */
	protected $calls = [];

	protected function setUp(): void {
		parent::setUp();

		$this->calls = [];

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/image/loader.php';
	}

	/**
	 * Run a section the way the image runs it.
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $selector   The selector that is current when the section runs.
	 *
	 * @return string
	 */
	protected function write_image( Kadence_Blocks_Css_Section $section, array $attributes = [], string $selector = '.current' ): string {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );
		$css->set_selector( $selector );

		$section->write( $this->image_input( $attributes, $css ) );

		return $css->css_output();
	}

	/**
	 * Build the input of an image section: the block says every shadow is visible.
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param Kadence_Blocks_CSS   $css        The CSS builder.
	 *
	 * @return Kadence_Blocks_Css_Build_Input
	 */
	protected function image_input( array $attributes, Kadence_Blocks_CSS $css ): Kadence_Blocks_Css_Build_Input {
		$context = new Kadence_Blocks_Css_Block_Context(
			'image',
			function ( $member, ...$arguments ) {
				$this->calls[] = [ $member, $arguments ];

				return empty( $arguments[0]['opacity'] ) ? false : true;
			}
		);

		return new Kadence_Blocks_Css_Build_Input( $attributes, $css, 'abc', 'abc', $context );
	}
}
