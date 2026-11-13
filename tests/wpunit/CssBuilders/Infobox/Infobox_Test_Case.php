<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Infobox;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Infobox_Media;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * Shared helpers for tests of the Infobox CSS sections.
 */
abstract class Infobox_Test_Case extends Free_Section_Test_Case {

	/**
	 * The calls the block was asked to make, in order.
	 *
	 * @var array<int, array<int, mixed>>
	 */
	protected $calls = [];

	protected function setUp(): void {
		parent::setUp();

		$this->calls = [];

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/infobox/loader.php';
	}

	/**
	 * Run a section the way the info box runs it: with its base selector, its title tag and its media derived.
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $selector   The selector that is current when the section runs.
	 *
	 * @return string
	 */
	protected function write_info( Kadence_Blocks_Css_Section $section, array $attributes = [], string $selector = '' ): string {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );
		$css->set_selector( $selector );

		$section->write( $this->info_input( $attributes, $css ) );

		return $css->css_output();
	}

	/**
	 * Build the input of an info box section.
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param Kadence_Blocks_CSS   $css        The CSS builder.
	 *
	 * @return Kadence_Blocks_Css_Build_Input
	 */
	protected function info_input( array $attributes, Kadence_Blocks_CSS $css ): Kadence_Blocks_Css_Build_Input {
		$context = new Kadence_Blocks_Css_Block_Context(
			'infobox',
			function ( $member ) {
				$this->calls[] = func_get_args();

				return 'get_html_tag' === $member ? 'h3' : [ 'h1', 'h2', 'h3' ];
			}
		);

		return new Kadence_Blocks_Css_Build_Input(
			$attributes,
			$css,
			'abc',
			'abc',
			$context,
			[
				'base'      => '.kt-info-boxabc',
				'title_tag' => 'h2',
				'media'     => new Kadence_Blocks_Infobox_Media( $attributes ),
			]
		);
	}
}
