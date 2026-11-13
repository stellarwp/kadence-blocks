<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Sections;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Button_States_Section;
use Kadence_Blocks_Css_Empty_Condition;
use Kadence_Blocks_Css_Gap_Section;
use Kadence_Blocks_Css_Input_Condition;
use Kadence_Blocks_Css_Rule_Section;
use Kadence_Blocks_Css_Suffixed_Section;
use Kadence_Blocks_Css_Switched_Off_Condition;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The generic sections that write a rule of fixed values, a value with a suffix, a button with its states and a gap with arguments,
 * and the conditions on a switch that is empty or off.
 */
final class RuleSuffixAndConditionSectionsTest extends Free_Section_Test_Case {

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
	}

	/**
	 * A rule sets its selectors, with the unique id in place, and writes its values in order. A value that is empty is dropped by the CSS builder.
	 *
	 * @return void
	 */
	public function testRuleWritesItsDeclarationsUnderItsSelectors(): void {
		$rule = new Kadence_Blocks_Css_Rule_Section(
			[ '.a-{id}', '.b' ],
			[
				'color'   => 'red',
				'margin'  => '0',
				'padding' => '1px',
			] 
		);

		$this->assertSame( '.a-abc, .b{color:red;padding:1px;}', $this->write_section( $rule, [] ) );
	}

	/**
	 * A rule can have one selector as text.
	 *
	 * @return void
	 */
	public function testRuleTakesOneSelectorAsText(): void {
		$this->assertSame( '.a-abc{display:none;}', $this->write_section( new Kadence_Blocks_Css_Rule_Section( '.a-{id}', [ 'display' => 'none' ] ), [] ) );
	}

	/**
	 * The saved value is written with the suffix after it, whatever the value.
	 *
	 * @dataProvider suffixProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testSuffixedValue( array $attributes, string $expected ): void {
		$this->assertSame( $expected, $this->write_section( new Kadence_Blocks_Css_Suffixed_Section( 'height', 'size', 'px' ), $attributes, 'abc', '.x' ) );
	}

	/**
	 * @return Generator
	 */
	public function suffixProvider(): Generator {
		yield 'a number' => [
			'attributes' => [ 'size' => 12 ],
			'expected'   => '.x{height:12px;}',
		];
		yield 'text' => [
			'attributes' => [ 'size' => '1.5' ],
			'expected'   => '.x{height:1.5px;}',
		];
		yield 'no value' => [
			'attributes' => [],
			'expected'   => '.x{height:px;}',
		];
	}

	/**
	 * The gap section hands its arguments to the CSS builder, here to write variables instead of properties.
	 *
	 * @return void
	 */
	public function testGapWithArguments(): void {
		$gap        = new Kadence_Blocks_Css_Gap_Section(
			'gap',
			'gap',
			'gapUnit',
			[
				'renderAsVars' => true,
				'varBase'      => '--v-',
			] 
		);
		$attributes = [
			'gap'     => [ 4, 5, 6 ],
			'gapUnit' => 'em',
		];

		$this->assertSame(
			'.x{--v-gap:4em;}@media all and (max-width: 1024px){.x{--v-gap:5em;}}@media all and (max-width: 767px){.x{--v-gap:6em;}}',
			$this->write_section( $gap, $attributes, 'abc', '.x' )
		);
	}

	/**
	 * The gap section without arguments writes a property.
	 *
	 * @return void
	 */
	public function testGapWithoutArguments(): void {
		$gap = new Kadence_Blocks_Css_Gap_Section( 'gap', 'gap', 'gapUnit' );

		$this->assertSame(
			'.x{gap:4em;}',
			$this->write_section(
				$gap,
				[
					'gap'     => [ 4, '', '' ],
					'gapUnit' => 'em',
				],
				'abc',
				'.x' 
			) 
		);
	}

	/**
	 * The button states section writes the states the arguments name, here a color as a variable with its hover state.
	 *
	 * @return void
	 */
	public function testButtonStates(): void {
		$states     = new Kadence_Blocks_Css_Button_States_Section(
			[
				'colorBase'    => 'linkColor',
				'renderAsVars' => true,
				'varBase'      => '--k-',
			] 
		);
		$attributes = [
			'linkColor'      => '#111111',
			'linkColorHover' => '#222222',
		];

		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'states-test' );
		$css->set_selector( '.x' );

		set_error_handler(
			static function () {
				return true;
			}
		);
		$states->write( $this->input( $attributes, $css ) );
		restore_error_handler();

		$this->assertSame( '.x{--k-color:#111111;--k-color-hover:#222222;}', $css->css_output() );
	}

	/**
	 * The condition on an empty attribute is met by everything PHP calls empty, and by an attribute that was never saved.
	 *
	 * @dataProvider emptyProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $expected   Whether the condition is met.
	 *
	 * @return void
	 */
	public function testEmptyCondition( array $attributes, bool $expected ): void {
		$this->assertSame( $expected, $this->is_met( new Kadence_Blocks_Css_Empty_Condition( 'switch' ), $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function emptyProvider(): Generator {
		yield 'never saved' => [
			'attributes' => [],
			'expected'   => true,
		];
		yield 'null' => [
			'attributes' => [ 'switch' => null ],
			'expected'   => true,
		];
		yield 'false' => [
			'attributes' => [ 'switch' => false ],
			'expected'   => true,
		];
		yield 'zero in text' => [
			'attributes' => [ 'switch' => '0' ],
			'expected'   => true,
		];
		yield 'an empty list' => [
			'attributes' => [ 'switch' => [] ],
			'expected'   => true,
		];
		yield 'true' => [
			'attributes' => [ 'switch' => true ],
			'expected'   => false,
		];
		yield 'text' => [
			'attributes' => [ 'switch' => 'no' ],
			'expected'   => false,
		];
	}

	/**
	 * The condition on a switch that is off is met only by a value that was saved and is falsy; an attribute that was never saved does not count.
	 *
	 * @dataProvider switchedOffProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $expected   Whether the condition is met.
	 *
	 * @return void
	 */
	public function testSwitchedOffCondition( array $attributes, bool $expected ): void {
		$this->assertSame( $expected, $this->is_met( new Kadence_Blocks_Css_Switched_Off_Condition( 'switch' ), $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function switchedOffProvider(): Generator {
		yield 'never saved' => [
			'attributes' => [],
			'expected'   => false,
		];
		yield 'null' => [
			'attributes' => [ 'switch' => null ],
			'expected'   => false,
		];
		yield 'false' => [
			'attributes' => [ 'switch' => false ],
			'expected'   => true,
		];
		yield 'zero' => [
			'attributes' => [ 'switch' => 0 ],
			'expected'   => true,
		];
		yield 'an empty text' => [
			'attributes' => [ 'switch' => '' ],
			'expected'   => true,
		];
		yield 'true' => [
			'attributes' => [ 'switch' => true ],
			'expected'   => false,
		];
	}

	/**
	 * Whether a condition is met for the attributes.
	 *
	 * @param Kadence_Blocks_Css_Input_Condition $condition  The condition under test.
	 * @param array<string, mixed>               $attributes The block attributes.
	 *
	 * @return bool
	 */
	private function is_met( Kadence_Blocks_Css_Input_Condition $condition, array $attributes ): bool {
		return $condition->is_met( $this->input( $attributes, new Kadence_Blocks_CSS() ) );
	}
}
