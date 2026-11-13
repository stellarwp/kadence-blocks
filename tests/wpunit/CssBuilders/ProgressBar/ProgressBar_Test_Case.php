<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\ProgressBar;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Progress_Bar_Block;
use ReflectionMethod;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * What the tests of the progress bar sections share: the loaders, and a block context that reaches the methods of the block.
 */
abstract class ProgressBar_Test_Case extends Free_Section_Test_Case {

	/**
	 * Load the classes that build the progress bar CSS.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/progress-bar/loader.php';
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
	}

	/**
	 * Write a section into a new CSS builder, with a selector set, and give back the CSS.
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param array<string, mixed>       $derived    What the builder works out before the sections run.
	 *
	 * @return string
	 */
	protected function write_bar( Kadence_Blocks_Css_Section $section, array $attributes = [], array $derived = [] ): string {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );
		$css->set_selector( '.s' );

		$section->write( $this->bar_input( $attributes, $css, $derived ) );

		return $css->css_output();
	}

	/**
	 * The input of a section, with a context that reaches the private methods of the progress bar block.
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param Kadence_Blocks_CSS   $css        The CSS builder.
	 * @param array<string, mixed> $derived    What the builder works out before the sections run.
	 *
	 * @return Kadence_Blocks_Css_Build_Input
	 */
	protected function bar_input( array $attributes, Kadence_Blocks_CSS $css, array $derived = [] ): Kadence_Blocks_Css_Build_Input {
		$block  = Kadence_Blocks_Progress_Bar_Block::get_instance();
		$bridge = static function ( $member, ...$args ) use ( $block ) {
			$method = new ReflectionMethod( $block, $member );
			$method->setAccessible( true );

			return $method->invoke( $block, ...$args );
		};

		return new Kadence_Blocks_Css_Build_Input( $attributes, $css, 'abc', 'abc', new Kadence_Blocks_Css_Block_Context( 'progress-bar', $bridge ), $derived );
	}
}
