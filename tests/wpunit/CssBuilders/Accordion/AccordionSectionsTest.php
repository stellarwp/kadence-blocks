<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Accordion;

use Generator;
use Kadence_Blocks_Accordion_Grid_Css;
use Kadence_Blocks_Accordion_Icon_Color_Css;
use Kadence_Blocks_Accordion_Icon_State_Condition;
use Kadence_Blocks_Accordion_Layout_Css;
use Kadence_Blocks_Accordion_Row_Css;
use Kadence_Blocks_Accordion_Selectors;
use Kadence_Blocks_Accordion_Title_Margin_Condition;
use Kadence_Blocks_Accordion_Title_Margin_Css;
use Kadence_Blocks_Accordion_Title_Styles_Css;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Device_Section;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Css_Static_Section;
use Tests\wpunit\CssBuilders\Free_Recording_Section;

/**
 * The sections of the accordion CSS, one by one.
 */
final class AccordionSectionsTest extends Accordion_Test_Case {

	private const PANE = '.kt-accordion-idabc .kt-accordion-inner-wrap .kt-accordion-pane:not(:first-child)';

	private const TABLET = '@media all and (max-width: 1024px)';

	/**
	 * A section writes the CSS expected for the attributes.
	 *
	 * @dataProvider sectionProvider
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testSection( Kadence_Blocks_Css_Section $section, array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_accordion( $section, $attributes ) );
	}

	/**
	 * A condition is met, or not, for the attributes.
	 *
	 * @dataProvider conditionProvider
	 *
	 * @param object               $condition  The condition.
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $expected   Whether the condition is met.
	 *
	 * @return void
	 */
	public function testCondition( $condition, array $attributes, bool $expected ): void {
		$this->assertSame( $expected, $condition->is_met( $this->accordion_input( $attributes, new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * The selectors are the ones the original builder wrote, with the unique id as a placeholder.
	 *
	 * @return void
	 */
	public function testSelectors(): void {
		$this->assertSame( [ '.kt-accordion-id{id} .kt-accordion-inner-wrap' ], Kadence_Blocks_Accordion_Selectors::named( 'inner' ) );
		$this->assertCount( 7, Kadence_Blocks_Accordion_Selectors::named( 'text' ) );
		$this->assertSame( '.kt-accordion-id{id} .kt-accordion-panel-inner h6', Kadence_Blocks_Accordion_Selectors::named( 'text' )[6] );
		$this->assertCount( 4, Kadence_Blocks_Accordion_Selectors::named( 'hover_circle' ) );
		$this->assertStringContainsString( ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle )  > .kt-accordion-inner-wrap', Kadence_Blocks_Accordion_Selectors::named( 'icon_circle' )[1] );
	}

	/**
	 * The title styles run their sections against the first title style, only when it is a list of settings.
	 *
	 * @dataProvider titleStylesProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $ran        Whether the sections ran.
	 *
	 * @return void
	 */
	public function testTitleStyles( array $attributes, bool $ran ): void {
		$section = new Kadence_Blocks_Accordion_Title_Styles_Css( [ new Free_Recording_Section() ] );

		$this->assertSame( $ran ? '.ran{ran:1;}' : '', $this->write_accordion( $section, $attributes ) );
	}

	/**
	 * The title styles give their sections the styles as a derived setting.
	 *
	 * @return void
	 */
	public function testTitleStylesAreDerived(): void {
		$css     = new Kadence_Blocks_CSS();
		$derived = [];
		$input   = $this->accordion_input( [ 'titleStyles' => [ [ 'color' => '#fff' ] ] ], $css );
		$spy     = new class( $derived ) implements Kadence_Blocks_Css_Section {
			/** @var array<int, mixed> */
			public $seen = [];

			public function __construct( array $seen ) {
				$this->seen = $seen;
			}

			public function write( \Kadence_Blocks_Css_Build_Input $input ): void {
				$this->seen[] = $input->derived( 'title_styles' );
			}
		};

		( new Kadence_Blocks_Accordion_Title_Styles_Css( [ $spy ] ) )->write( $input->with( 'title_styles', [] ) );

		$this->assertSame( [ [ 'color' => '#fff' ] ], $spy->seen );
	}

	/**
	 * The row layout of a device writes the margin of the panes under their own selector, and gives the selector of the accordion back.
	 *
	 * @return void
	 */
	public function testRowLayoutWritesMarginsOfPanesAndRestoresTheSelector(): void {
		$css   = new Kadence_Blocks_CSS();
		$input = $this->accordion_input(
			[
				'columnLayout' => [ 'two-column', 'row' ],
				'titleStyles'  => [ [ 'marginTop' => 12 ] ],
			],
			$css 
		);

		$css->set_style_id( 'section-test' );
		$css->set_selector( '.s' );
		( new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Accordion_Layout_Css( 1, true ) ] ) )->write( $input );
		( new Kadence_Blocks_Css_Static_Section( 'color', 'red' ) )->write( $input );

		$this->assertSameCss( self::TABLET . '{.s{display:block;}' . self::PANE . '{margin-top:12px;}}.kt-accordion-idabc .kt-accordion-inner-wrap{color:red;}', $css->css_output() );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		// Data providers run before the tests are set up.
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/accordion/loader.php';

		yield from $this->layoutProvider();
		yield from $this->titleProvider();
		yield from $this->iconProvider();
	}

	/**
	 * @return Generator
	 */
	private function layoutProvider(): Generator {
		yield 'two columns on desktop' => [
			'section'    => new Kadence_Blocks_Accordion_Layout_Css( 0, false ),
			'attributes' => [ 'columnLayout' => [ 'two-column' ] ],
			'expected'   => '.s{display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));}',
		];
		yield 'three columns on desktop' => [
			'section'    => new Kadence_Blocks_Accordion_Layout_Css( 0, false ),
			'attributes' => [ 'columnLayout' => [ 'three-column' ] ],
			'expected'   => '.s{display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));}',
		];
		yield 'one column on desktop is the default' => [
			'section'    => new Kadence_Blocks_Accordion_Layout_Css( 0, false ),
			'attributes' => [ 'columnLayout' => [ 'row' ] ],
			'expected'   => '',
		];
		yield 'a loosely typed layout on desktop is the first grid, as the original switch matched it' => [
			'section'    => new Kadence_Blocks_Accordion_Layout_Css( 0, false ),
			'attributes' => [ 'columnLayout' => [ true ] ],
			'expected'   => '.s{display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));}',
		];
		yield 'unknown layout' => [
			'section'    => new Kadence_Blocks_Accordion_Layout_Css( 0, false ),
			'attributes' => [ 'columnLayout' => [ 'bogus' ] ],
			'expected'   => '',
		];
		yield 'no layout' => [
			'section'    => new Kadence_Blocks_Accordion_Layout_Css( 0, false ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'one column on tablet removes the row gap' => [
			'section'    => new Kadence_Blocks_Accordion_Layout_Css( 1, true ),
			'attributes' => [ 'columnLayout' => [ 'two-column', 'row' ] ],
			'expected'   => '.s{display:block;}',
		];
		yield 'a loosely typed layout on tablet is one column, as the original switch matched it' => [
			'section'    => new Kadence_Blocks_Accordion_Layout_Css( 1, true ),
			'attributes' => [ 'columnLayout' => [ 'row', true ] ],
			'expected'   => '.s{display:block;}',
		];
		yield 'three columns on mobile' => [
			'section'    => new Kadence_Blocks_Accordion_Layout_Css( 2, true ),
			'attributes' => [ 'columnLayout' => [ '', '', 'three-column' ] ],
			'expected'   => '.s{display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));}',
		];
		yield 'grid' => [
			'section'    => new Kadence_Blocks_Accordion_Grid_Css( 4 ),
			'attributes' => [],
			'expected'   => '.s{display:grid;grid-template-columns:repeat(4, minmax(0, 1fr));}',
		];
		yield 'one column without margins of the titles' => [
			'section'    => new Kadence_Blocks_Accordion_Row_Css(),
			'attributes' => [],
			'expected'   => '.s{display:block;}',
		];
		yield 'one column with margins of the titles' => [
			'section'    => new Kadence_Blocks_Accordion_Row_Css(),
			'attributes' => [ 'titleStyles' => [ [ 'marginTop' => 8 ] ] ],
			'expected'   => '.s{display:block;}' . self::PANE . '{margin-top:8px;}',
		];
	}

	/**
	 * @return Generator
	 */
	private function titleProvider(): Generator {
		yield 'margin of the titles as a gap' => [
			'section'    => new Kadence_Blocks_Accordion_Title_Margin_Css( 'row-gap' ),
			'attributes' => [ 'titleStyles' => [ [ 'marginTop' => 0 ] ] ],
			'expected'   => '.s{row-gap:0px;}',
		];
		yield 'margin of the titles that is not a number' => [
			'section'    => new Kadence_Blocks_Accordion_Title_Margin_Css( 'row-gap' ),
			'attributes' => [ 'titleStyles' => [ [ 'marginTop' => 'wide' ] ] ],
			'expected'   => '',
		];
		yield 'no margin of the titles' => [
			'section'    => new Kadence_Blocks_Accordion_Title_Margin_Css( 'row-gap' ),
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function iconProvider(): Generator {
		yield 'the icon color of a state' => [
			'section'    => new Kadence_Blocks_Accordion_Icon_Color_Css( 'hover', 'colorHover' ),
			'attributes' => [
				'iconColor'   => [ 'hover' => '#112233' ],
				'titleStyles' => [ [ 'colorHover' => '#445566' ] ],
			],
			'expected'   => '.s{background:#112233;}',
		];
		yield 'the icon color falls back to the color of the title' => [
			'section'    => new Kadence_Blocks_Accordion_Icon_Color_Css( 'hover', 'colorHover' ),
			'attributes' => [
				'iconColor'   => [ 'standard' => '#112233' ],
				'titleStyles' => [ [ 'colorHover' => '#445566' ] ],
			],
			'expected'   => '.s{background:#445566;}',
		];
		yield 'an icon color that is not a list is no color' => [
			'section'    => new Kadence_Blocks_Accordion_Icon_Color_Css( 'standard', 'color' ),
			'attributes' => [
				'iconColor'   => 'red',
				'titleStyles' => [ [] ],
			],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function titleStylesProvider(): Generator {
		yield 'a list of styles' => [
			'attributes' => [ 'titleStyles' => [ [ 'color' => '#fff' ] ] ],
			'ran'        => true,
		];
		yield 'empty styles' => [
			'attributes' => [ 'titleStyles' => [ [] ] ],
			'ran'        => true,
		];
		yield 'no styles' => [
			'attributes' => [],
			'ran'        => false,
		];
		yield 'styles that are not a list' => [
			'attributes' => [ 'titleStyles' => 'x' ],
			'ran'        => false,
		];
		yield 'a first style that is not a list' => [
			'attributes' => [ 'titleStyles' => [ 'x' ] ],
			'ran'        => false,
		];
		yield 'no first style' => [
			'attributes' => [ 'titleStyles' => [ 1 => [ 'color' => '#fff' ] ] ],
			'ran'        => false,
		];
	}

	/**
	 * @return Generator
	 */
	public function conditionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/accordion/loader.php';

		yield 'a margin of the titles' => [
			'condition'  => new Kadence_Blocks_Accordion_Title_Margin_Condition(),
			'attributes' => [ 'titleStyles' => [ [ 'marginTop' => 0 ] ] ],
			'expected'   => true,
		];
		yield 'no margin of the titles' => [
			'condition'  => new Kadence_Blocks_Accordion_Title_Margin_Condition(),
			'attributes' => [ 'titleStyles' => [ [ 'color' => 'x' ] ] ],
			'expected'   => false,
		];
		yield 'a margin of titles that are not a list' => [
			'condition'  => new Kadence_Blocks_Accordion_Title_Margin_Condition(),
			'attributes' => [ 'titleStyles' => 'wide' ],
			'expected'   => false,
		];
		yield 'an icon color of the state' => [
			'condition'  => new Kadence_Blocks_Accordion_Icon_State_Condition( 'hover', 'colorHover' ),
			'attributes' => [ 'iconColor' => [ 'hover' => '#fff' ] ],
			'expected'   => true,
		];
		yield 'a title color of the state' => [
			'condition'  => new Kadence_Blocks_Accordion_Icon_State_Condition( 'hover', 'colorHover' ),
			'attributes' => [ 'titleStyles' => [ [ 'colorHover' => '#fff' ] ] ],
			'expected'   => true,
		];
		yield 'no color of the state' => [
			'condition'  => new Kadence_Blocks_Accordion_Icon_State_Condition( 'hover', 'colorHover' ),
			'attributes' => [
				'iconColor'   => [ 'active' => '#fff' ],
				'titleStyles' => [ [ 'colorActive' => '#fff' ] ],
			],
			'expected'   => false,
		];
	}
}
