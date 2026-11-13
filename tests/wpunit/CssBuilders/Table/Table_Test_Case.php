<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Table;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * What the tests of the table sections share: the loaders and an input with the escaped unique id of the table.
 */
abstract class Table_Test_Case extends Free_Section_Test_Case {

	/**
	 * Load the classes that build the table CSS.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/table/loader.php';
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
	}

	/**
	 * Write a section into a new CSS builder, with a selector set, and give back the CSS.
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $selector   The selector set before the section runs.
	 *
	 * @return string
	 */
	protected function write_table( Kadence_Blocks_Css_Section $section, array $attributes = [], string $selector = '.s' ): string {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );
		$css->set_selector( $selector );

		$section->write( $this->table_input( $attributes, $css ) );

		return $css->css_output();
	}

	/**
	 * The input of a section, with the escaped unique id the builder works out.
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param Kadence_Blocks_CSS   $css        The CSS builder.
	 *
	 * @return Kadence_Blocks_Css_Build_Input
	 */
	protected function table_input( array $attributes, Kadence_Blocks_CSS $css ): Kadence_Blocks_Css_Build_Input {
		$context = new Kadence_Blocks_Css_Block_Context(
			'table',
			static function () {
				return null;
			}
		);

		return new Kadence_Blocks_Css_Build_Input( $attributes, $css, 'raw', 'raw', $context, [ 'id' => 'abc' ] );
	}
}
