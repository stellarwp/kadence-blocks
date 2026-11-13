<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Column;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Column_Device;
use Kadence_Blocks_Column_Flex_Values;
use Kadence_Blocks_Column_Layout;
use Kadence_Blocks_Column_Selector_Css;

/**
 * The values the column sections share: the layout of every device, the flex values and the selectors.
 */
final class ColumnLayoutTest extends Column_Test_Case {

	/**
	 * Every device falls back to the device before it, and desktop to the defaults.
	 *
	 * @return void
	 */
	public function testDevicesFallBackToTheDeviceBefore(): void {
		$layout = new Kadence_Blocks_Column_Layout(
			[
				'verticalAlignment'       => 'top',
				'verticalAlignmentMobile' => 'bottom',
				'justifyContent'          => [ '', 'center', '' ],
				'wrapContent'             => [ 'wrap' ],
				'direction'               => [ '', '', 'horizontal' ],
				'textAlign'               => [ 'left' ],
				'maxWidthTabletUnit'      => '%',
			]
		);

		$this->assertSame( [ 'top', 'top', 'bottom' ], $this->collect( $layout, 'vertical_align' ) );
		$this->assertSame( [ '', 'center', 'center' ], $this->collect( $layout, 'horizontal_align' ) );
		$this->assertSame( [ 'wrap', 'wrap', 'wrap' ], $this->collect( $layout, 'flex_wrap' ) );
		$this->assertSame( [ 'vertical', 'vertical', 'horizontal' ], $this->collect( $layout, 'direction' ) );
		$this->assertSame( [ 'left', 'left', 'left' ], $this->collect( $layout, 'text_align' ) );
		$this->assertSame( [ 'px', '%', '%' ], $this->collect( $layout, 'max_width_unit' ) );
	}

	/**
	 * A column is version two when the block saved a version above one.
	 *
	 * @dataProvider versionProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $expected   Whether the column is version two.
	 *
	 * @return void
	 */
	public function testVersion( array $attributes, bool $expected ): void {
		$this->assertSame( $expected, ( new Kadence_Blocks_Column_Layout( $attributes ) )->is_version_two() );
	}

	/**
	 * A direction is vertical or horizontal, reversed or not.
	 *
	 * @dataProvider directionProvider
	 *
	 * @param string $direction  The direction.
	 * @param bool   $vertical   Whether it flows from top to bottom.
	 * @param bool   $horizontal Whether it flows from left to right.
	 *
	 * @return void
	 */
	public function testDirection( string $direction, bool $vertical, bool $horizontal ): void {
		$device = new Kadence_Blocks_Column_Device( [ 'direction' => $direction ] );

		$this->assertSame( $vertical, $device->is_vertical() );
		$this->assertSame( $horizontal, $device->is_horizontal() );
	}

	/**
	 * Alignments turn into flex values, and what is not known is centered.
	 *
	 * @dataProvider flexProvider
	 *
	 * @param mixed  $alignment The saved alignment.
	 * @param string $main      The value along the main axis.
	 * @param string $cross     The value along the cross axis.
	 * @param string $text      The value of a text alignment.
	 *
	 * @return void
	 */
	public function testFlexValues( $alignment, string $main, string $cross, string $text ): void {
		$values = new Kadence_Blocks_Column_Flex_Values();

		$this->assertSame( $main, $values->main( $alignment ) );
		$this->assertSame( $cross, $values->cross( $alignment ) );
		$this->assertSame( $text, $values->text( $alignment ) );
	}

	/**
	 * The selector section replaces the column class with the unique id, for a name and for a template.
	 *
	 * @dataProvider selectorProvider
	 *
	 * @param string $selector The name or template.
	 * @param string $expected The selector that was set.
	 *
	 * @return void
	 */
	public function testSelector( string $selector, string $expected ): void {
		$css = new Kadence_Blocks_CSS();

		( new Kadence_Blocks_Column_Selector_Css( $selector ) )->write( $this->column_input( [], $css ) );
		$css->add_property( 'color', 'red' );

		$this->assertSame( $expected . '{color:red;}', $css->css_output() );
	}

	/**
	 * @param Kadence_Blocks_Column_Layout $layout The layout.
	 * @param string                       $value  The value to collect.
	 *
	 * @return string[]
	 */
	private function collect( Kadence_Blocks_Column_Layout $layout, string $value ): array {
		$collected = [];

		foreach ( [ 0, 1, 2 ] as $index ) {
			$collected[] = $layout->device( $index )->$value();
		}

		return $collected;
	}

	/**
	 * @return Generator
	 */
	public function versionProvider(): Generator {
		yield 'nothing saved' => [
			'attributes' => [],
			'expected'   => false,
		];
		yield 'version one' => [
			'attributes' => [ 'kbVersion' => 1 ],
			'expected'   => false,
		];
		yield 'version two' => [
			'attributes' => [ 'kbVersion' => 2 ],
			'expected'   => true,
		];
	}

	/**
	 * @return Generator
	 */
	public function directionProvider(): Generator {
		yield 'vertical' => [
			'direction'  => 'vertical',
			'vertical'   => true,
			'horizontal' => false,
		];
		yield 'vertical reverse' => [
			'direction'  => 'vertical-reverse',
			'vertical'   => true,
			'horizontal' => false,
		];
		yield 'horizontal' => [
			'direction'  => 'horizontal',
			'vertical'   => false,
			'horizontal' => true,
		];
		yield 'horizontal reverse' => [
			'direction'  => 'horizontal-reverse',
			'vertical'   => false,
			'horizontal' => true,
		];
		yield 'something else' => [
			'direction'  => 'diagonal',
			'vertical'   => false,
			'horizontal' => false,
		];
	}

	/**
	 * @return Generator
	 */
	public function flexProvider(): Generator {
		yield 'top' => [
			'alignment' => 'top',
			'main'      => 'flex-start',
			'cross'     => 'flex-start',
			'text'      => 'center',
		];
		yield 'bottom' => [
			'alignment' => 'bottom',
			'main'      => 'flex-end',
			'cross'     => 'flex-end',
			'text'      => 'center',
		];
		yield 'space between' => [
			'alignment' => 'space-between',
			'main'      => 'space-between',
			'cross'     => 'center',
			'text'      => 'center',
		];
		yield 'stretch' => [
			'alignment' => 'stretch',
			'main'      => 'stretch',
			'cross'     => 'stretch',
			'text'      => 'center',
		];
		yield 'left' => [
			'alignment' => 'left',
			'main'      => 'center',
			'cross'     => 'center',
			'text'      => 'flex-start',
		];
		yield 'right' => [
			'alignment' => 'right',
			'main'      => 'center',
			'cross'     => 'center',
			'text'      => 'flex-end',
		];
		yield 'not a string' => [
			'alignment' => [ 'top' ],
			'main'      => 'center',
			'cross'     => 'center',
			'text'      => 'center',
		];
	}

	/**
	 * @return Generator
	 */
	public function selectorProvider(): Generator {
		yield 'a name' => [
			'selector' => 'hover_inner',
			'expected' => '.kadence-columnabc:hover > .kt-inside-inner-col',
		];
		yield 'a template' => [
			'selector' => '{col}, {col} a',
			'expected' => '.kadence-columnabc, .kadence-columnabc a',
		];
	}
}
