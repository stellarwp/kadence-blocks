<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\NavigationLink;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Input_Condition;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Navigation_Link_Media_Ratio;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * Shared helpers for tests of the Navigation Link CSS sections.
 */
abstract class NavigationLink_Test_Case extends Free_Section_Test_Case {

	/**
	 * The calls the builder made to the block, in order.
	 *
	 * @var array<int, array<int, mixed>>
	 */
	protected $calls = [];

	protected function setUp(): void {
		parent::setUp();

		$this->calls = [];

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/navigation-link/loader.php';
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-navigation-link-css.php';
	}

	/**
	 * A context whose block records every call and answers with null, like a block that has no styles of its own.
	 *
	 * @param callable|null $on_call Something to run on every call, with the arguments of the call.
	 *
	 * @return Kadence_Blocks_Css_Block_Context
	 */
	protected function recording_context( ?callable $on_call = null ): Kadence_Blocks_Css_Block_Context {
		return new Kadence_Blocks_Css_Block_Context(
			'navigation-link',
			function ( ...$arguments ) use ( $on_call ) {
				$this->calls[] = $arguments;

				if ( null !== $on_call ) {
					$on_call( ...$arguments );
				}

				return null;
			}
		);
	}

	/**
	 * Run a section the way the navigation link runs it: with the ratio of its image derived.
	 *
	 * Missing array keys are tolerated, as they are in production, where they are only warnings.
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $selector   The selector that is current when the section runs.
	 *
	 * @return string
	 */
	protected function write_link( Kadence_Blocks_Css_Section $section, array $attributes = [], string $selector = '.x' ): string {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );
		$css->set_selector( $selector );

		$this->without_warnings(
			function () use ( $section, $attributes, $css ) {
				$derived = [
					'ratio' => new Kadence_Blocks_Navigation_Link_Media_Ratio(
						$attributes + [
							'mediaImage' => [ [] ],
							'imageRatio' => '',
						] 
					),
				];
				$section->write( new Kadence_Blocks_Css_Build_Input( $attributes, $css, 'abc', 'abc', $this->recording_context(), $derived ) );
			}
		);

		return $css->css_output();
	}

	/**
	 * Whether a condition is met for the attributes.
	 *
	 * @param Kadence_Blocks_Css_Input_Condition $condition  The condition under test.
	 * @param array<string, mixed>               $attributes The block attributes.
	 *
	 * @return bool
	 */
	protected function is_met( Kadence_Blocks_Css_Input_Condition $condition, array $attributes ): bool {
		$met = false;

		$this->without_warnings(
			function () use ( $condition, $attributes, &$met ) {
				$met = $condition->is_met( new Kadence_Blocks_Css_Build_Input( $attributes, new Kadence_Blocks_CSS(), 'abc', 'abc', $this->recording_context() ) );
			}
		);

		return $met;
	}

	/**
	 * Run code while warnings, such as an undefined array key, do nothing instead of becoming errors.
	 *
	 * @param callable $code The code to run.
	 *
	 * @return void
	 */
	protected function without_warnings( callable $code ): void {
		// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_set_error_handler -- A test swallows warnings on purpose.
		set_error_handler(
			static function () {
				return true;
			}
		);

		try {
			$code();
		} finally {
			restore_error_handler();
		}
	}
}
