<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Accordion;

use Generator;
use Kadence_Blocks_Accordion_Css;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The whole accordion CSS, with the exact rules for a few accordions.
 */
final class AccordionCssTest extends Free_Section_Test_Case {

	private const INNER = '.kt-accordion-idabc .kt-accordion-inner-wrap';

	private const HEADER = '.kt-accordion-idabc > .kt-accordion-inner-wrap > .wp-block-kadence-pane > .kt-accordion-header-wrap > .kt-blocks-accordion-header';

	/**
	 * The CSS built for the attributes is the CSS expected.
	 *
	 * @dataProvider accordionProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testBuild( array $attributes, string $expected ): void {
		$context = new Kadence_Blocks_Css_Block_Context(
			'accordion',
			static function () {
				return null;
			}
		);
		$css     = ( new Kadence_Blocks_Accordion_Css( $context ) )->build( $attributes, new Kadence_Blocks_CSS(), 'abc', 'abc-' . md5( $expected ) );

		$this->assertSameCss( $expected, (string) $css );
	}

	/**
	 * @return Generator
	 */
	public function accordionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-accordion-css.php';

		yield 'an accordion with nothing saved' => [
			'attributes' => [],
			'expected'   => '',
		];
		yield 'the columns on every device' => [
			'attributes' => [
				'columnGap'    => [ 10, 20, 30 ],
				'columnLayout' => [ 'two-column', 'row', 'three-column' ],
				'titleStyles'  => [ [ 'marginTop' => 8 ] ],
			],
			'expected'   => self::INNER . '{column-gap:10px;row-gap:8px;display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));}'
				. '@media all and (max-width: 1024px){' . self::INNER . '{column-gap:20px;display:block;}'
				. self::INNER . ' .kt-accordion-pane:not(:first-child){margin-top:8px;}}'
				. '@media all and (max-width: 767px){' . self::INNER . '{column-gap:30px;display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));}}',
		];
		yield 'the legacy borders of the panels and the titles' => [
			'attributes' => [
				'contentBorder'      => [ 1, 2, 3, 4 ],
				'contentBorderColor' => '#112233',
				'titleStyles'        => [
					[
						'borderWidth'  => [ 1, 1, 1, 1 ],
						'border'       => [ '#111111', '', '', '' ],
						'borderRadius' => [ 3, 3, 3, 3 ],
						'colorHover'   => '#445566',
						'borderHover'  => [ '#222222', '', '', '' ],
					],
				],
			],
			'expected'   => '.kt-accordion-idabc .kt-accordion-panel-inner{border-top-width:1px;border-right-width:2px;border-bottom-width:3px;border-left-width:4px;border-color:#112233;}'
				. self::HEADER . '{border-top-color:#111111;border-top-width:1px;border-right-width:1px;border-bottom-width:1px;border-left-width:1px;border-top-left-radius:3px;border-top-right-radius:3px;border-bottom-right-radius:3px;border-bottom-left-radius:3px;}'
				. self::HEADER . ':hover, body:not(.hide-focus-outline) .kt-accordion-idabc .kt-blocks-accordion-header:focus-visible{color:#445566;border-top-color:#222222;}'
				. $this->hover_icons( '#445566' ),
		];
		yield 'the colors of the text, the links and the icons' => [
			'attributes' => [
				'textColor'      => '#111111',
				'linkColor'      => '#222222',
				'linkHoverColor' => '#333333',
				'iconColor'      => [ 'standard' => '#aa0000' ],
				'titleStyles'    => [ [ 'color' => '#bb0000' ] ],
			],
			'expected'   => $this->text_and_icons(),
		];
	}

	/**
	 * The rules of the icons of a hover color, the way the original wrote them.
	 *
	 * @param string $color The hover color of the title.
	 *
	 * @return string
	 */
	private function hover_icons( string $color ): string {
		$circle = ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle )';
		$basic  = ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow )';
		$header = ' .kt-accordion-header-wrap .kt-blocks-accordion-header';

		return '.kt-accordion-idabc' . $circle . $header . ':hover .kt-blocks-accordion-icon-trigger:after, '
			. '.kt-accordion-idabc' . $circle . $header . ':hover .kt-blocks-accordion-icon-trigger:before, '
			. 'body:not(.hide-focus-outline) .kt-accordion-idabc' . $circle . ' .kt-blocks-accordion--visible .kt-blocks-accordion-icon-trigger:after, '
			. 'body:not(.hide-focus-outline) .kt-accordion-idabc' . $circle . ' .kt-blocks-accordion-header:focus-visible .kt-blocks-accordion-icon-trigger:before{background:' . $color . ';}'
			. '.kt-accordion-idabc' . $basic . $header . ':hover .kt-blocks-accordion-icon-trigger, '
			. 'body:not(.hide-focus-outline) .kt-accordion-idabc' . $basic . $header . ':focus-visible .kt-blocks-accordion-icon-trigger{background:' . $color . ';}';
	}

	/**
	 * The rules of the colors of the text, the links and the standard icons.
	 *
	 * @return string
	 */
	private function text_and_icons(): string {
		$circle  = ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle )';
		$basic   = ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow )';
		$wrapper = ' > .kt-accordion-inner-wrap > .wp-block-kadence-pane > .kt-accordion-header-wrap .kt-blocks-accordion-icon-trigger';
		$panel   = '.kt-accordion-idabc .kt-accordion-panel-inner';

		return self::HEADER . '{color:#bb0000;}'
			. '.kt-accordion-idabc' . $circle . ' ' . $wrapper . ':after, .kt-accordion-idabc' . $circle . ' ' . $wrapper . ':before{background:#aa0000;}'
			. $panel . ', ' . $panel . ' h1, ' . $panel . ' h2, ' . $panel . ' h3, ' . $panel . ' h4, ' . $panel . ' h5, ' . $panel . ' h6{color:#111111;}'
			. $panel . ' a{color:#222222;}' . $panel . ' a:hover{color:#333333;}'
			. '.kt-accordion-idabc' . $basic . ' .kt-blocks-accordion-icon-trigger{background:#aa0000;}';
	}
}
