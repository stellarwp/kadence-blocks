<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Rowlayout;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Rowlayout_Columns;
use Kadence_Blocks_Rowlayout_Environment;
use Kadence_Blocks_Rowlayout_Selectors;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * Shared helpers for tests of the Rowlayout CSS sections.
 */
abstract class Rowlayout_Test_Case extends Free_Section_Test_Case {

	/**
	 * The calls the block was asked to make, in order.
	 *
	 * @var array<int, array<int, mixed>>
	 */
	protected $calls = [];

	/**
	 * What the block answers when it is asked to do something, by name.
	 *
	 * @var array<string, mixed>
	 */
	protected $answers = [];

	protected function setUp(): void {
		parent::setUp();

		$this->calls   = [];
		$this->answers = [];

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/rowlayout/loader.php';
	}

	/**
	 * Run a section the way the row layout runs it: with its selectors and columns derived from the attributes.
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $selector   The selector that is current when the section runs.
	 *
	 * @return string
	 */
	protected function write_row( Kadence_Blocks_Css_Section $section, array $attributes = [], string $selector = '' ): string {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );
		$css->set_selector( $selector );

		$section->write( $this->row_input( $attributes, $css ) );

		return $css->css_output();
	}

	/**
	 * Build the input of a row layout section.
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param Kadence_Blocks_CSS   $css        The CSS builder.
	 *
	 * @return Kadence_Blocks_Css_Build_Input
	 */
	protected function row_input( array $attributes, Kadence_Blocks_CSS $css ): Kadence_Blocks_Css_Build_Input {
		$context = new Kadence_Blocks_Css_Block_Context(
			'rowlayout',
			function ( $member ) {
				$this->calls[] = func_get_args();

				return $this->answers[ $member ] ?? null;
			}
		);

		return new Kadence_Blocks_Css_Build_Input(
			$attributes,
			$css,
			'abc',
			'abc',
			$context,
			[
				'selectors' => new Kadence_Blocks_Rowlayout_Selectors( $attributes, 'abc' ),
				'columns'   => new Kadence_Blocks_Rowlayout_Columns( $attributes ),
			]
		);
	}

	/**
	 * A site that offers what the test says.
	 *
	 * @param bool  $generatepress Whether GeneratePress is active.
	 * @param bool  $theme         Whether the Kadence theme is active.
	 * @param mixed $width         The content width of the theme, or null.
	 * @param bool  $fse           Whether the site is in full site editing mode.
	 *
	 * @return Kadence_Blocks_Rowlayout_Environment
	 */
	protected function environment( bool $generatepress = false, bool $theme = false, $width = null, bool $fse = false ): Kadence_Blocks_Rowlayout_Environment {
		// Data providers build environments before the test is set up.
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/rowlayout/loader.php';

		return new class( $generatepress, $theme, $width, $fse ) implements Kadence_Blocks_Rowlayout_Environment {

			/**
			 * What the site offers.
			 *
			 * @var array<string, mixed>
			 */
			private $offers;

			/**
			 * Create the environment.
			 *
			 * @param bool  $generatepress Whether GeneratePress is active.
			 * @param bool  $theme         Whether the Kadence theme is active.
			 * @param mixed $width         The content width of the theme, or null.
			 * @param bool  $fse           Whether the site is in full site editing mode.
			 */
			public function __construct( bool $generatepress, bool $theme, $width, bool $fse ) {
				$this->offers = compact( 'generatepress', 'theme', 'width', 'fse' );
			}

			/**
			 * Whether GeneratePress is active.
			 *
			 * @return bool
			 */
			public function has_generatepress(): bool {
				return $this->offers['generatepress'];
			}

			/**
			 * Whether the Kadence theme is active.
			 *
			 * @return bool
			 */
			public function has_kadence_theme(): bool {
				return $this->offers['theme'];
			}

			/**
			 * The content width of the theme, or null.
			 *
			 * @return mixed
			 */
			public function content_width() {
				return $this->offers['width'];
			}

			/**
			 * Whether the site is in full site editing mode.
			 *
			 * @return bool
			 */
			public function is_fse_mode(): bool {
				return $this->offers['fse'];
			}
		};
	}
}
