<?php declare( strict_types=1 );

namespace Tests\wpunit\CssWriters;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Writer;
use Tests\Support\Classes\TestCase;

/**
 * The writer facade picks the right condition and format for each entry point.
 */
final class WriterTest extends TestCase {

	/**
	 * The CSS builder the writer writes to.
	 *
	 * @var Kadence_Blocks_CSS
	 */
	private $css;

	/**
	 * The writer under test.
	 *
	 * @var Kadence_Blocks_Css_Writer
	 */
	private $writer;

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
		$this->css = new Kadence_Blocks_CSS();
		$this->css->set_style_id( 'writer-test' );
		$this->css->set_selector( '.a' );
		$this->writer = new Kadence_Blocks_Css_Writer( $this->css );
	}

	/**
	 * The writer accepts any builder with the same methods, such as the Pro builder that does not extend the free one.
	 *
	 * @return void
	 */
	public function testWorksWithABuilderThatIsNotTheFreeBuilder(): void {
		$builder = new class() {
			/**
			 * Properties recorded by the fake builder.
			 *
			 * @var string[]
			 */
			public $written = [];

			/**
			 * Record a property.
			 *
			 * @param string $property The property.
			 * @param mixed  $value    The value.
			 *
			 * @return void
			 */
			public function add_property( $property, $value ): void {
				$this->written[] = $property . ':' . $value;
			}

			/**
			 * Render a color like the real builders do for plain colors.
			 *
			 * @param mixed $color   The color.
			 * @param mixed $opacity The opacity.
			 *
			 * @return string
			 */
			public function render_color( $color, $opacity = null ): string {
				return $color . '@' . $opacity;
			}
		};

		$writer = new Kadence_Blocks_Css_Writer( $builder );
		$writer->not_empty( 'text-transform', 'uppercase' );
		$writer->not_empty_color( 'color', '#fff' );
		$writer->numeric_sides( 'margin', [ 1 ], 'px' );
		$writer->color_with_opacity( 'background', '#000', 0.5 );

		$this->assertSame( [ 'text-transform:uppercase', 'color:#fff@', 'margin-top:1px', 'background:#000@0.5' ], $builder->written );
	}

	/**
	 * Raw values are written as stored and skipped when empty.
	 *
	 * @return void
	 */
	public function testNotEmptyWritesRawValues(): void {
		$this->writer->not_empty( 'text-transform', 'uppercase' );
		$this->writer->not_empty( 'font-style', '' );

		$this->assertSame( '.a{text-transform:uppercase;}', $this->css->css_output() );
	}

	/**
	 * A unit is appended to non-empty values only.
	 *
	 * @return void
	 */
	public function testNotEmptyWithUnitAppendsTheUnit(): void {
		$this->writer->not_empty_with_unit( 'letter-spacing', 2, 'px' );
		$this->writer->not_empty_with_unit( 'word-spacing', 0, 'px' );

		$this->assertSame( '.a{letter-spacing:2px;}', $this->css->css_output() );
	}

	/**
	 * Colors, strings and weights go through the builder renderers.
	 *
	 * @return void
	 */
	public function testRenderedValuesGoThroughTheBuilder(): void {
		$this->writer->not_empty_color( 'color', '#ff0000' );
		$this->writer->not_empty_string( 'font-variant', 'small-caps' );
		$this->writer->not_empty_font_weight( 'font-weight', '700' );
		$this->writer->not_empty_color( 'background', '' );

		$this->assertSame( '.a{color:#ff0000;font-variant:small-caps;font-weight:700;}', $this->css->css_output() );
	}

	/**
	 * Sanitized colors are skipped when empty and written when set.
	 *
	 * @return void
	 */
	public function testNotEmptySanitizedColor(): void {
		$this->writer->not_empty_sanitized_color( 'color', '#00ff00' );
		$this->writer->not_empty_sanitized_color( 'border-color', '' );

		$this->assertSame( '.a{color:#00ff00;}', $this->css->css_output() );
	}

	/**
	 * Color with opacity delegates to its declaration.
	 *
	 * @return void
	 */
	public function testColorWithOpacity(): void {
		$this->writer->color_with_opacity( 'background', '#ff0000', 0.5 );

		$this->assertSame( '.a{background:rgba(255, 0, 0, 0.5);}', $this->css->css_output() );
	}

	/**
	 * A suffix names the side properties, such as border widths.
	 *
	 * @return void
	 */
	public function testNumericSidesAcceptsASuffix(): void {
		$this->writer->numeric_sides( 'border', [ 1, 2, 3, 4 ], 'px', '-width' );

		$this->assertSame( '.a{border-top-width:1px;border-right-width:2px;border-bottom-width:3px;border-left-width:4px;}', $this->css->css_output() );
	}

	/**
	 * Numeric values with a unit keep zero, unlike the not-empty entry points.
	 *
	 * @return void
	 */
	public function testNumericWithUnitKeepsZero(): void {
		$this->writer->numeric_with_unit( 'margin-top', 0, 'px' );
		$this->writer->numeric_with_unit( 'margin-left', 'auto', 'px' );

		$this->assertSame( '.a{margin-top:0px;}', $this->css->css_output() );
	}

	/**
	 * Four-value lists become one declaration per numeric side.
	 *
	 * @return void
	 */
	public function testNumericSidesWritesEachSide(): void {
		$this->writer->numeric_sides( 'margin', [ 1, '', 3, 4 ], 'rem' );

		$this->assertSame( '.a{margin-top:1rem;margin-bottom:3rem;margin-left:4rem;}', $this->css->css_output() );
	}
}
