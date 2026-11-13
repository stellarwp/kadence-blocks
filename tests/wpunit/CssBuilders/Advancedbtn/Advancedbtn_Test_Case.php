<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Advancedbtn;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * Shared helpers for tests of the Advanced Buttons CSS sections.
 */
abstract class Advancedbtn_Test_Case extends Free_Section_Test_Case {

	/**
	 * The calls the block was asked to make, in order.
	 *
	 * @var array<int, array<int, mixed>>
	 */
	protected $calls = [];

	protected function setUp(): void {
		parent::setUp();

		$this->calls = [];

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/advancedbtn/loader.php';
	}

	/**
	 * Run a section the way the group runs it for one saved button.
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The saved button.
	 * @param array<string, mixed>       $derived    The values the group derives for the button.
	 *
	 * @return string
	 */
	protected function write_button( Kadence_Blocks_Css_Section $section, array $attributes, array $derived = [
		'key'        => 0,
		'width_type' => 'fixed',
	] ): string {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );

		$section->write( new Kadence_Blocks_Css_Build_Input( $attributes, $css, 'abc', 'abc', $this->context(), $derived ) );

		return $css->css_output();
	}

	/**
	 * Run a section with the group selector current, the way the group sections run.
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 *
	 * @return string
	 */
	protected function write_group( Kadence_Blocks_Css_Section $section, array $attributes ): string {
		return $this->write_section( $section, $attributes, 'abc', '.grp' );
	}

	/**
	 * A block context that records the calls it is asked to make.
	 *
	 * @return Kadence_Blocks_Css_Block_Context
	 */
	protected function context(): Kadence_Blocks_Css_Block_Context {
		return new Kadence_Blocks_Css_Block_Context(
			'advancedbtn',
			function () {
				$this->calls[] = func_get_args();
			}
		);
	}

	/**
	 * Run a section against a context that records its calls.
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 *
	 * @return void
	 */
	protected function run_recording( Kadence_Blocks_Css_Section $section, array $attributes ): void {
		$section->write( new Kadence_Blocks_Css_Build_Input( $attributes, new Kadence_Blocks_CSS(), 'abc', 'abc', $this->context() ) );
	}
}
