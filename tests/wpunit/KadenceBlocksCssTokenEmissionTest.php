<?php declare( strict_types=1 );

namespace Tests\wpunit;

use Generator;
use Kadence_Blocks_CSS;
use Tests\Support\Classes\TestCase;

/**
 * Render-site contract for the alias recognizer's positive and negative halves.
 *
 * For every relaxed `render_*` method in {@see Kadence_Blocks_CSS}, a strict `{dot.alias}`
 * value must come out as a bare `var(--kb-token--<id>)` in the built CSS (emission), a
 * malformed brace string must never mint a `var()` or reach numeric handling as if it were
 * an alias (fail-open), a 4-side/4-corner value with exactly one alias side must mix the
 * `var()` with the sibling numeric sides correctly (per-side mixing), and an alias placed in
 * any single box-shadow part must land in the right position of the shadow shorthand
 * (inline box-shadow).
 */
final class KadenceBlocksCssTokenEmissionTest extends TestCase {

	protected $css;

	protected function setUp(): void {
		parent::setUp();

		$this->css = new Kadence_Blocks_CSS();
	}

	protected function tearDown(): void {
		parent::tearDown();
	}

	/**
	 * render_number returns the bare var() reference for a strict alias, ignoring the unit.
	 *
	 * @return void
	 */
	public function testRenderNumberEmitsBareVarForAlias(): void {
		$this->assertSame( 'var(--kb-token--semantic--radius--media)',
			$this->css->render_number( '{semantic.radius.media}', 'px' ),
			'render_number must emit the bare var() for a strict alias' );
	}

	/**
	 * render_color returns the bare var() reference for a strict alias.
	 *
	 * @return void
	 */
	public function testRenderColorEmitsBareVarForAlias(): void {
		$this->assertSame( 'var(--kb-token--semantic--radius--media)',
			$this->css->render_color( '{semantic.radius.media}' ),
			'render_color must emit the bare var() for a strict alias' );
	}

	/**
	 * sanitize_color returns the bare var() reference for a strict alias.
	 *
	 * @return void
	 */
	public function testSanitizeColorEmitsBareVarForAlias(): void {
		$this->assertSame( 'var(--kb-token--semantic--radius--media)',
			$this->css->sanitize_color( '{semantic.radius.media}' ),
			'sanitize_color must emit the bare var() for a strict alias' );
	}

	/**
	 * render_range emits the bare var() reference as the declaration value for a strict alias.
	 *
	 * @return void
	 */
	public function testRenderRangeEmitsBareVarForAlias(): void {
		$this->css->render_range( [ 'width' => '{semantic.radius.media}' ], 'width', 'width', 'px' );

		$this->assertStringContainsString( 'width:var(--kb-token--semantic--radius--media)', $this->css->css_output(),
			'render_range must emit the bare var() as the declaration value for a strict alias' );
	}

	/**
	 * render_measure_range emits the bare var() reference on the first side for a strict alias.
	 *
	 * @return void
	 */
	public function testRenderMeasureRangeEmitsBareVarForAlias(): void {
		$this->css->render_measure_range(
			[ 'borderWidth' => [ '{semantic.radius.media}', 10, 20, 30 ] ],
			'borderWidth',
			'border-width'
		);

		$this->assertStringContainsString( 'border-top-width:var(--kb-token--semantic--radius--media)', $this->css->css_output(),
			'render_measure_range must emit the bare var() on the aliased side' );
	}

	/**
	 * render_measure returns the bare var() reference in place for the aliased side.
	 *
	 * @return void
	 */
	public function testRenderMeasureEmitsBareVarForAlias(): void {
		$this->assertSame( 'var(--kb-token--semantic--radius--media) 20px 30px 40px',
			$this->css->render_measure( [ '{semantic.radius.media}', 20, 30, 40 ] ),
			'render_measure must emit the bare var() on the aliased side' );
	}

	/**
	 * render_border_radius emits the bare var() reference on the first corner for a strict alias.
	 *
	 * @return void
	 */
	public function testRenderBorderRadiusEmitsBareVarForAlias(): void {
		$this->css->render_border_radius( [ 'borderRadius' => [ '{semantic.radius.media}', 10, 20, 30 ] ] );

		$this->assertStringContainsString( 'border-top-left-radius:var(--kb-token--semantic--radius--media)', $this->css->css_output(),
			'render_border_radius must emit the bare var() on the aliased corner' );
	}

	/**
	 * render_responsive_range emits the bare var() reference for the desktop breakpoint.
	 *
	 * @return void
	 */
	public function testRenderResponsiveRangeEmitsBareVarForAlias(): void {
		$this->css->render_responsive_range(
			[ 'spacing' => [ '{semantic.radius.media}', 20, 30 ] ],
			'spacing',
			'margin'
		);

		$this->assertStringContainsString( 'margin:var(--kb-token--semantic--radius--media)', $this->css->css_output(),
			'render_responsive_range must emit the bare var() for the aliased desktop breakpoint' );
	}

	/**
	 * render_shadow emits the bare var() reference in the hOffset position for a strict alias.
	 *
	 * @return void
	 */
	public function testRenderShadowEmitsBareVarForAlias(): void {
		$this->assertSame( 'var(--kb-token--semantic--radius--media) 1px 4px 2px #000000',
			$this->css->render_shadow( [
				'color'   => '#000000',
				'opacity' => 1,
				'spread'  => 2,
				'blur'    => 4,
				'hOffset' => '{semantic.radius.media}',
				'vOffset' => 1,
				'inset'   => false,
			] ),
			'render_shadow must emit the bare var() in the hOffset position for a strict alias' );
	}

	/**
	 * render_typography emits the bare var() reference for an aliased desktop line-height and
	 * letter-spacing.
	 *
	 * @return void
	 */
	public function testRenderTypographyEmitsBareVarForAliasedLineHeightAndLetterSpacing(): void {
		$this->css->render_typography( [
			'typography' => [
				'lineType'      => 'px',
				'lineHeight'    => [ '{semantic.radius.media}', '', '' ],
				'letterSpacing' => [ '{primitive.spacing.md}', '', '' ],
			],
		] );
		$output = $this->css->css_output();

		$this->assertStringContainsString( 'line-height:var(--kb-token--semantic--radius--media)', $output,
			'render_typography must emit the bare var() for an aliased desktop line-height' );
		$this->assertStringContainsString( 'letter-spacing:var(--kb-token--primitive--spacing--md)', $output,
			'render_typography must emit the bare var() for an aliased desktop letter-spacing' );
	}

	/**
	 * get_border_value (width) returns the bare var() reference for a strict alias width.
	 *
	 * @return void
	 */
	public function testGetBorderValueEmitsBareVarForAliasedWidth(): void {
		$attributes = [
			'borderStyle' => [
				[
					'top'    => [ '#000000', 'solid', '{semantic.radius.media}' ],
					'right'  => [ '#000000', 'solid', '{semantic.radius.media}' ],
					'bottom' => [ '#000000', 'solid', '{semantic.radius.media}' ],
					'left'   => [ '#000000', 'solid', '{semantic.radius.media}' ],
					'unit'   => 'px',
				],
			],
		];
		$args = [
			'desktop_key' => 'borderStyle',
			'tablet_key'  => 'tabletBorderStyle',
			'mobile_key'  => 'mobileBorderStyle',
			'unit_key'    => 'unit',
		];

		$this->assertSame( 'var(--kb-token--semantic--radius--media)',
			$this->css->get_border_value( $attributes, $args, 'top', 'desktop', 'width', false ),
			'get_border_value must emit the bare var() for a strict alias width' );
	}
}
