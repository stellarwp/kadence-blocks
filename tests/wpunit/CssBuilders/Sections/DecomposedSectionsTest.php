<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Sections;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Border_Color_Section;
use Kadence_Blocks_Css_Border_Radius_Section;
use Kadence_Blocks_Css_Color_Output_Section;
use Kadence_Blocks_Css_Derived_Scope_Section;
use Kadence_Blocks_Css_Gap_Section;
use Kadence_Blocks_Css_Legacy_Border_Condition;
use Kadence_Blocks_Css_Measure_Range_Section;
use Kadence_Blocks_Css_Rendered_Color_Section;
use Kadence_Blocks_Css_Section;
use Tests\wpunit\CssBuilders\Free_Recording_Section;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The generic sections the accordion and the spacer introduced: colors, legacy borders, gaps and derived scopes.
 */
final class DecomposedSectionsTest extends Free_Section_Test_Case {

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
	}

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
		$this->assertSameCss( $expected, $this->write_section( $section, $attributes, 'abc', '.t' ) );
	}

	/**
	 * The legacy border condition is met by a list that has a side, from the attributes or from derived settings.
	 *
	 * @dataProvider conditionProvider
	 *
	 * @param string|null          $derived    The name of the derived settings, if any.
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param array<string, mixed> $settings   The derived settings.
	 * @param bool                 $expected   Whether the condition is met.
	 *
	 * @return void
	 */
	public function testLegacyBorderCondition( ?string $derived, array $attributes, array $settings, bool $expected ): void {
		$input = $this->input( $attributes, new Kadence_Blocks_CSS() )->with( 'settings', $settings );

		$this->assertSame( $expected, ( new Kadence_Blocks_Css_Legacy_Border_Condition( 'widths', $derived ) )->is_met( $input ) );
	}

	/**
	 * The derived scope gives its sections the derived settings as their attributes, and keeps the derived settings it had.
	 *
	 * @return void
	 */
	public function testDerivedScope(): void {
		$css     = new Kadence_Blocks_CSS();
		$input   = $this->input( [ 'color' => 'red' ], $css )->with( 'settings', [ 'color' => 'blue' ] );
		$section = new Kadence_Blocks_Css_Derived_Scope_Section( 'settings', [ new Kadence_Blocks_Css_Color_Output_Section( 'color', 'color' ) ] );

		$css->set_style_id( 'section-test' );
		$css->set_selector( '.t' );
		$section->write( $input );

		$this->assertSameCss( '.t{color:blue;}', $css->css_output() );
	}

	/**
	 * The derived scope writes with no settings when nothing was derived.
	 *
	 * @return void
	 */
	public function testDerivedScopeWithoutSettings(): void {
		$section = new Kadence_Blocks_Css_Derived_Scope_Section( 'settings', [ new Free_Recording_Section() ] );

		$this->assertSame( '.ran{ran:1;}', $this->write_section( $section, [ 'color' => 'red' ] ) );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';

		yield 'color output' => [
			'section'    => new Kadence_Blocks_Css_Color_Output_Section( 'ink', 'background' ),
			'attributes' => [ 'ink' => '#112233' ],
			'expected'   => '.t{background:#112233;}',
		];
		yield 'no color output' => [
			'section'    => new Kadence_Blocks_Css_Color_Output_Section( 'ink', 'background' ),
			'attributes' => [ 'ink' => '' ],
			'expected'   => '',
		];
		yield 'measure range' => [
			'section'    => new Kadence_Blocks_Css_Measure_Range_Section( 'widths', 'border-width' ),
			'attributes' => [ 'widths' => [ 1, 2, 3, 4 ] ],
			'expected'   => '.t{border-top-width:1px;border-right-width:2px;border-bottom-width:3px;border-left-width:4px;}',
		];
		yield 'border colors' => [
			'section'    => new Kadence_Blocks_Css_Border_Color_Section( 'colors' ),
			'attributes' => [ 'colors' => [ '#111111', '', '#333333', '#444444' ] ],
			'expected'   => '.t{border-top-color:#111111;border-bottom-color:#333333;border-left-color:#444444;}',
		];
		yield 'border radius' => [
			'section'    => new Kadence_Blocks_Css_Border_Radius_Section( 'corners', 'em' ),
			'attributes' => [ 'corners' => [ 1, 2, 3, 4 ] ],
			'expected'   => '.t{border-top-left-radius:1em;border-top-right-radius:2em;border-bottom-right-radius:3em;border-bottom-left-radius:4em;}',
		];
		yield 'gap' => [
			'section'    => new Kadence_Blocks_Css_Gap_Section( 'gap', 'column-gap', 'gapUnit' ),
			'attributes' => [
				'gap'     => [ 10, 20, 30 ],
				'gapUnit' => 'em',
			],
			'expected'   => '.t{column-gap:10em;}@media all and (max-width: 1024px){.t{column-gap:20em;}}@media all and (max-width: 767px){.t{column-gap:30em;}}',
		];
		yield 'rendered color' => [
			'section'    => new Kadence_Blocks_Css_Rendered_Color_Section( 'color', 'ink' ),
			'attributes' => [ 'ink' => '#112233' ],
			'expected'   => '.t{color:#112233;}',
		];
		yield 'rendered color of a palette color' => [
			'section'    => new Kadence_Blocks_Css_Rendered_Color_Section( 'color', 'ink' ),
			'attributes' => [ 'ink' => 'palette3' ],
			'expected'   => '.t{color:var(--global-palette3, #1A202C);}',
		];
	}

	/**
	 * @return Generator
	 */
	public function conditionProvider(): Generator {
		yield 'sides of the attributes' => [
			'derived'    => null,
			'attributes' => [ 'widths' => [ 1, 2, 3, 4 ] ],
			'settings'   => [],
			'expected'   => true,
		];
		yield 'four empty sides' => [
			'derived'    => null,
			'attributes' => [ 'widths' => [ '', '', '', '' ] ],
			'settings'   => [],
			'expected'   => false,
		];
		yield 'no sides' => [
			'derived'    => null,
			'attributes' => [ 'widths' => [] ],
			'settings'   => [],
			'expected'   => false,
		];
		yield 'sides that are missing' => [
			'derived'    => null,
			'attributes' => [],
			'settings'   => [],
			'expected'   => false,
		];
		yield 'the sides of the derived settings' => [
			'derived'    => 'settings',
			'attributes' => [],
			'settings'   => [ 'widths' => [ 0, '', '', '' ] ],
			'expected'   => true,
		];
		yield 'four empty sides in the derived settings' => [
			'derived'    => 'settings',
			'attributes' => [ 'widths' => [ 1 ] ],
			'settings'   => [ 'widths' => [ '', '', '', '' ] ],
			'expected'   => false,
		];
	}
}
