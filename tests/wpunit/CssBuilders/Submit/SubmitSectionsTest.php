<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Submit;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Submit_Align_Css;
use Kadence_Blocks_Submit_Css;
use Kadence_Blocks_Submit_Hover_Before_Css;
use Kadence_Blocks_Submit_Hover_Inset_Css;
use Kadence_Blocks_Submit_Inherit_Condition;
use Tests\wpunit\CssBuilders\Button_Test_Case;

/**
 * The sections that only the submit button has, and the builder that puts them together.
 */
final class SubmitSectionsTest extends Button_Test_Case {

	/**
	 * The inherit condition needs a fixed width and the styles set to inherit.
	 *
	 * @dataProvider inheritProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $expected   Whether the condition is met.
	 *
	 * @return void
	 */
	public function testInheritCondition( array $attributes, bool $expected ): void {
		$css   = new Kadence_Blocks_CSS();
		$input = $this->button_input( $attributes, $css );

		$this->assertSame( $expected, ( new Kadence_Blocks_Submit_Inherit_Condition() )->is_met( $input ) );
	}

	/**
	 * An inset hover shadow of a gradient button moves to the overlay, and what is written next goes there too.
	 *
	 * @dataProvider hoverInsetProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testHoverInset( array $attributes, string $expected ): void {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );
		$css->set_selector( '.btn' );

		( new Kadence_Blocks_Submit_Hover_Inset_Css() )->write( $this->button_input( $attributes, $css ) );
		$css->add_property( 'order', '1' );

		$this->assertSameCss( $expected, $css->css_output() );
	}

	/**
	 * The overlay is the hover color of a gradient button, or the hover gradient, and both get a transition.
	 *
	 * @dataProvider hoverBeforeProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testHoverBefore( array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_button( new Kadence_Blocks_Submit_Hover_Before_Css(), $attributes ) );
	}

	/**
	 * The alignment is the flex value of the saved alignment, and the first alignment that equals the saved value wins.
	 *
	 * @dataProvider alignProvider
	 *
	 * @param mixed  $alignment The saved alignment.
	 * @param string $device    The device of the section.
	 * @param string $expected  The CSS expected.
	 *
	 * @return void
	 */
	public function testAlign( $alignment, string $device, string $expected ): void {
		$section = new Kadence_Blocks_Submit_Align_Css( 'align', $device );

		$this->assertSameCss( $expected, $this->write_button( $section, [ 'align' => $alignment ], '.field' ) );
	}

	/**
	 * The builder styles the button with the class id the block gives, not with the unique id.
	 *
	 * @return void
	 */
	public function testBuilderUsesTheClassIdOfTheBlock(): void {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-submit-css.php';

		$context = new Kadence_Blocks_Css_Block_Context(
			'submit',
			static function ( $member ) {
				return 'class_id' === $member ? '_fixed' : null;
			}
		);
		$css     = new Kadence_Blocks_CSS();

		$output = ( new Kadence_Blocks_Submit_Css( $context ) )->build(
			[
				'color'  => '#ff0000',
				'hAlign' => 'right',
			],
			$css,
			'unique',
			'style-id-submit-unit' 
		);

		$this->assertSameCss(
			'ul.menu .kb-submit-field .kb-btn_fixed.kb-button{width:initial;}'
			. '.kb-submit-field .kb-btn_fixed.kb-button{color:#ff0000;}'
			. '.kb-submit-field.kb-field_fixed{justify-content:flex-end;}',
			$output
		);
	}

	/**
	 * @return Generator
	 */
	public function inheritProvider(): Generator {
		yield 'fixed and inherited' => [
			'attributes' => [
				'widthType'     => 'fixed',
				'inheritStyles' => 'inherit',
			],
			'expected'   => true,
		];
		yield 'not fixed' => [
			'attributes' => [ 'inheritStyles' => 'inherit' ],
			'expected'   => false,
		];
		yield 'not inherited' => [
			'attributes' => [
				'widthType'     => 'fixed',
				'inheritStyles' => 'fill',
			],
			'expected'   => false,
		];
		yield 'inheritance not saved' => [
			'attributes' => [ 'widthType' => 'fixed' ],
			'expected'   => false,
		];
	}

	/**
	 * @return Generator
	 */
	public function hoverInsetProvider(): Generator {
		yield 'gradient button' => [
			'attributes' => [
				'backgroundType' => 'gradient',
				'shadowHover'    => [ [ 'inset' => true ] ],
			],
			'expected'   => '.btn{box-shadow:none;}.kb-btnabc.kb-button:hover::before{order:1;}',
		];
		yield 'gradient hover' => [
			'attributes' => [
				'backgroundHoverType' => 'gradient',
				'shadowHover'         => [ [ 'inset' => true ] ],
			],
			'expected'   => '.btn{box-shadow:none;}.kb-btnabc.kb-button:hover::before{order:1;}',
		];
		yield 'solid button' => [
			'attributes' => [ 'shadowHover' => [ [ 'inset' => true ] ] ],
			'expected'   => '.btn{order:1;}',
		];
		yield 'not an inset shadow' => [
			'attributes' => [
				'backgroundType' => 'gradient',
				'shadowHover'    => [ [ 'inset' => 1 ] ],
			],
			'expected'   => '.btn{order:1;}',
		];
		yield 'no shadow' => [
			'attributes' => [ 'backgroundType' => 'gradient' ],
			'expected'   => '.btn{order:1;}',
		];
		yield 'shadow is not a list' => [
			'attributes' => [
				'backgroundType' => 'gradient',
				'shadowHover'    => 'abc',
			],
			'expected'   => '.btn{order:1;}',
		];
	}

	/**
	 * @return Generator
	 */
	public function hoverBeforeProvider(): Generator {
		yield 'hover color of a gradient button' => [
			'attributes' => [
				'backgroundType'  => 'gradient',
				'backgroundHover' => '#ff0000',
			],
			'expected'   => '.kb-btnabc.kb-button:hover::before{background:#ff0000;}'
				. '.kb-btnabc.kb-button::before{transition:opacity .3s ease-in-out;-webkit-transition:opacity .3s ease-in-out;-moz-transition:opacity .3s ease-in-out;}',
		];
		yield 'hover gradient' => [
			'attributes' => [
				'backgroundHoverType' => 'gradient',
				'gradientHover'       => 'linear-gradient(red, blue)',
			],
			'expected'   => '.kb-btnabc.kb-button:hover::before, .kb-btnabc.kb-button:focus::before{background:linear-gradient(red, blue);}'
				. '.kb-btnabc.kb-button::before{transition:opacity .3s ease-in-out;-webkit-transition:opacity .3s ease-in-out;-moz-transition:opacity .3s ease-in-out;}',
		];
		yield 'solid button' => [
			'attributes' => [ 'backgroundHover' => '#ff0000' ],
			'expected'   => '',
		];
		yield 'gradient hover without a gradient' => [
			'attributes' => [ 'backgroundHoverType' => 'gradient' ],
			'expected'   => '',
		];
		yield 'gradient button without a hover color' => [
			'attributes' => [ 'backgroundType' => 'gradient' ],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function alignProvider(): Generator {
		yield 'left' => [
			'alignment' => 'left',
			'device'    => 'desktop',
			'expected'  => '.field{justify-content:flex-start;}',
		];
		yield 'center on tablet' => [
			'alignment' => 'center',
			'device'    => 'tablet',
			'expected'  => '@media all and (max-width: 1024px){.field{justify-content:center;}}',
		];
		yield 'right on mobile' => [
			'alignment' => 'right',
			'device'    => 'mobile',
			'expected'  => '@media all and (max-width: 767px){.field{justify-content:flex-end;}}',
		];
		yield 'true equals the first alignment' => [
			'alignment' => true,
			'device'    => 'desktop',
			'expected'  => '.field{justify-content:flex-start;}',
		];
		yield 'unknown alignment' => [
			'alignment' => 'weird',
			'device'    => 'desktop',
			'expected'  => '',
		];
		yield 'empty alignment' => [
			'alignment' => '',
			'device'    => 'desktop',
			'expected'  => '',
		];
	}
}
