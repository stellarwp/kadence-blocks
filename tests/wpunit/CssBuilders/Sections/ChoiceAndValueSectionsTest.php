<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Sections;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Choice_Section;
use Kadence_Blocks_Css_Custom_Section;
use Kadence_Blocks_Css_Alpha_Color_Section;
use Kadence_Blocks_Css_Input_Condition;
use Kadence_Blocks_Css_Scoped_Section;
use Kadence_Blocks_Css_Static_Section;
use Kadence_Blocks_Css_Strict_Condition;
use Kadence_Blocks_Css_Value_Section;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The generic sections that choose between sections, write one value and write custom CSS, and the list entries of the input.
 */
final class ChoiceAndValueSectionsTest extends Free_Section_Test_Case {

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
	}

	/**
	 * The choice runs the sections of the side the condition picks, and only those.
	 *
	 * @dataProvider choiceProvider
	 *
	 * @param bool   $met      Whether the condition is met.
	 * @param string $expected The CSS expected.
	 *
	 * @return void
	 */
	public function testChoice( bool $met, string $expected ): void {
		$condition = new class( $met ) implements Kadence_Blocks_Css_Input_Condition {

			/**
			 * Whether the condition is met.
			 *
			 * @var bool
			 */
			private $met;

			/**
			 * Create the condition.
			 *
			 * @param bool $met Whether the condition is met.
			 */
			public function __construct( bool $met ) {
				$this->met = $met;
			}

			/**
			 * Whether the condition is met.
			 *
			 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
			 *
			 * @return bool
			 */
			public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
				return $this->met;
			}
		};

		$section = new Kadence_Blocks_Css_Choice_Section(
			$condition,
			[ new Kadence_Blocks_Css_Value_Section( 'color', 'one' ) ],
			[ new Kadence_Blocks_Css_Value_Section( 'color', 'two' ), new Kadence_Blocks_Css_Value_Section( 'width', 'two' ) ]
		);

		$this->assertSameCss(
			$expected,
			$this->write_section(
				$section,
				[
					'one' => 'red',
					'two' => 'blue',
				] 
			) 
		);
	}

	/**
	 * The value section writes its property only when the attribute has a value.
	 *
	 * @dataProvider valueProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testValue( array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_section( new Kadence_Blocks_Css_Value_Section( 'color', 'color' ), $attributes ) );
	}

	/**
	 * The custom section adds the saved CSS, with the word `selector` standing for the block.
	 *
	 * @dataProvider customProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testCustom( array $attributes, string $expected ): void {
		$section = new Kadence_Blocks_Css_Custom_Section( '.block{id}', 'custom' );
		$css     = new Kadence_Blocks_CSS();

		// The CSS builder keeps custom CSS for the whole request by style id, so every case gets its own.
		$css->set_style_id( 'custom-section-' . md5( serialize( $attributes ) ) );
		$section->write( $this->input( $attributes, $css ) );

		$this->assertSame( $expected, $css->css_output() );
	}

	/**
	 * The strict condition is met only when the attribute is exactly the value.
	 *
	 * @return void
	 */
	public function testStrictCondition(): void {
		$condition = new Kadence_Blocks_Css_Strict_Condition( 'on', true );

		$this->assertTrue( $condition->is_met( $this->input( [ 'on' => true ], new Kadence_Blocks_CSS() ) ) );
		$this->assertFalse( $condition->is_met( $this->input( [ 'on' => 'yes' ], new Kadence_Blocks_CSS() ) ) );
		$this->assertFalse( $condition->is_met( $this->input( [], new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * The alpha color section writes the color with its own opacity, and nothing without a color.
	 *
	 * @dataProvider alphaProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testAlphaColor( array $attributes, string $expected ): void {
		$section = new Kadence_Blocks_Css_Alpha_Color_Section( 'background', 'color', 'opacity' );

		$this->assertSameCss( $expected, $this->write_section( $section, $attributes ) );
	}

	/**
	 * The static section writes its property whatever the attributes are.
	 *
	 * @return void
	 */
	public function testStatic(): void {
		$this->assertSame( '{max-width:100%;}', $this->write_section( new Kadence_Blocks_Css_Static_Section( 'max-width', '100%' ), [] ) );
	}

	/**
	 * The scoped section runs its sections on the settings nested in the attribute, and only when there are some.
	 *
	 * @return void
	 */
	public function testScoped(): void {
		$section = new Kadence_Blocks_Css_Scoped_Section( 'nested', [ new Kadence_Blocks_Css_Value_Section( 'color', 'color' ) ] );

		$this->assertSame(
			'{color:red;}',
			$this->write_section(
				$section,
				[
					'nested' => [ [ 'color' => 'red' ] ],
					'color'  => 'blue',
				] 
			) 
		);
		$this->assertSame(
			'',
			$this->write_section(
				$section,
				[
					'nested' => 'red',
					'color'  => 'blue',
				] 
			) 
		);
		$this->assertSame( '', $this->write_section( $section, [ 'color' => 'blue' ] ) );
	}

	/**
	 * The input can work on other attributes and keeps everything else.
	 *
	 * @return void
	 */
	public function testInputWithAttributes(): void {
		$input  = $this->input( [ 'a' => 1 ], new Kadence_Blocks_CSS() )->with( 'derived', 'yes' );
		$nested = $input->with_attributes( [ 'b' => 2 ] );

		$this->assertSame( [ 'b' => 2 ], $nested->attributes() );
		$this->assertSame( 'yes', $nested->derived( 'derived' ) );
		$this->assertSame( 'abc', $nested->unique_id() );
		$this->assertSame( $input->css(), $nested->css() );
		$this->assertSame( [ 'a' => 1 ], $input->attributes() );
	}

	/**
	 * The input hands out one entry of a list attribute, or the fallback when it is not there.
	 *
	 * @return void
	 */
	public function testInputItem(): void {
		$input = $this->input(
			[
				'list' => [ 'a', null, 'c' ],
				'text' => 'abc',
			],
			new Kadence_Blocks_CSS() 
		);

		$this->assertSame( 'a', $input->item( 'list', 0 ) );
		$this->assertNull( $input->item( 'list', 1 ) );
		$this->assertSame( 'none', $input->item( 'list', 1, 'none' ) );
		$this->assertNull( $input->item( 'list', 5 ) );
		$this->assertNull( $input->item( 'missing', 0 ) );
		$this->assertSame( 'none', $input->item( 'missing', 0, 'none' ) );
	}

	/**
	 * @return Generator
	 */
	public function alphaProvider(): Generator {
		yield 'with its opacity' => [
			'attributes' => [
				'color'   => '#ff0000',
				'opacity' => 0.5,
			],
			'expected'   => '{background:rgba(255, 0, 0, 0.5);}',
		];
		yield 'without an opacity' => [
			'attributes' => [
				'color'   => '#ff0000',
				'opacity' => 'x',
			],
			'expected'   => '{background:#ff0000;}',
		];
		yield 'without a color' => [
			'attributes' => [ 'opacity' => 0.5 ],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function choiceProvider(): Generator {
		yield 'condition met' => [
			'met'      => true,
			'expected' => '{color:red;}',
		];
		yield 'condition not met' => [
			'met'      => false,
			'expected' => '{color:blue;width:blue;}',
		];
	}

	/**
	 * @return Generator
	 */
	public function valueProvider(): Generator {
		yield 'value' => [
			'attributes' => [ 'color' => 'red' ],
			'expected'   => '{color:red;}',
		];
		yield 'empty' => [
			'attributes' => [ 'color' => '' ],
			'expected'   => '',
		];
		yield 'nothing saved' => [
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function customProvider(): Generator {
		yield 'custom css' => [
			'attributes' => [ 'custom' => 'selector a{color:red;} selector{top:0;}' ],
			'expected'   => '.blockabc a{color:red;} .blockabc{top:0;}',
		];
		yield 'no custom css' => [
			'attributes' => [ 'custom' => '' ],
			'expected'   => '',
		];
	}
}
