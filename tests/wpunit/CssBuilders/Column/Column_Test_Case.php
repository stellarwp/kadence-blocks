<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Column;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Column_Layout;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * Shared helpers for tests of the Column CSS sections.
 */
abstract class Column_Test_Case extends Free_Section_Test_Case {

	/**
	 * The calls the block was asked to make, in order.
	 *
	 * @var array<int, array<int, mixed>>
	 */
	protected $calls = [];

	protected function setUp(): void {
		parent::setUp();

		$this->calls = [];

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/column/loader.php';
	}

	/**
	 * Run a section the way the column runs it: with its layout derived from the attributes.
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 *
	 * @return string
	 */
	protected function write_column( Kadence_Blocks_Css_Section $section, array $attributes = [] ): string {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );

		$section->write( $this->column_input( $attributes, $css ) );

		return $css->css_output();
	}

	/**
	 * Build the input of a column section.
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param Kadence_Blocks_CSS   $css        The CSS builder.
	 *
	 * @return Kadence_Blocks_Css_Build_Input
	 */
	protected function column_input( array $attributes, Kadence_Blocks_CSS $css ): Kadence_Blocks_Css_Build_Input {
		$context = new Kadence_Blocks_Css_Block_Context(
			'column',
			function () {
				$this->calls[] = func_get_args();
			}
		);

		return new Kadence_Blocks_Css_Build_Input( $attributes, $css, 'abc', 'abc', $context, [ 'layout' => new Kadence_Blocks_Column_Layout( $attributes ) ] );
	}
}
