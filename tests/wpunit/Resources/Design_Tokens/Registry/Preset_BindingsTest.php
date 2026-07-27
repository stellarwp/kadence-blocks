<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Preset_Bindings;
use Tests\Support\Classes\TestCase;

final class Preset_BindingsTest extends TestCase {

	/**
	 * @return array<string, mixed>
	 */
	private function declaration(): array {
		return [
			'block'    => 'kadence/advancedbtn',
			'bindings' => [
				'button-bg'     => [ 'token' => 'semantic.color.button-bg' ],
				'button-border' => [ 'kadence_slot' => 'palette3' ],
			],
		];
	}

	public function testItRetainsTheBlock(): void {
		$this->assertSame( 'kadence/advancedbtn', Preset_Bindings::from_array( $this->declaration() )->block );
	}

	/**
	 * @return void
	 */
	public function testItRetainsTheControlLabelWhenDeclared(): void {
		$set = Preset_Bindings::from_array( $this->declaration() + [ 'label' => 'Style' ] );

		$this->assertSame( 'Style', $set->label );
	}

	/**
	 * @return void
	 */
	public function testTheControlLabelIsNullWhenOmitted(): void {
		$this->assertNull( Preset_Bindings::from_array( $this->declaration() )->label );
	}

	/**
	 * A block whose editor markup puts the `.wp-block-*` class on a wrapper rather than the element the
	 * bindings style (e.g. Advanced Heading) declares an `editor_selector` so the editor build of the
	 * block-default CSS can retarget the rule at the real element.
	 *
	 * @return void
	 */
	public function testItRetainsTheEditorSelectorWhenDeclared(): void {
		$set = Preset_Bindings::from_array(
			$this->declaration() + [ 'editor_selector' => '.wp-block-kadence-advancedheading .kadence-advancedheading-text' ]
		);

		$this->assertSame( '.wp-block-kadence-advancedheading .kadence-advancedheading-text', $set->editor_selector );
	}

	/**
	 * A block that renders identically in the editor and on the front end (the common case) omits
	 * `editor_selector`, and the parser must leave it null rather than defaulting to some other selector.
	 *
	 * @return void
	 */
	public function testTheEditorSelectorIsNullWhenOmitted(): void {
		$this->assertNull( Preset_Bindings::from_array( $this->declaration() )->editor_selector );
	}

	public function testItParsesTokenReferenceAndInlineBindings(): void {
		$set = Preset_Bindings::from_array( $this->declaration() );

		$bg = $set->binding( 'button-bg' );
		$this->assertInstanceOf( Binding::class, $bg );
		$this->assertTrue( $bg->is_token_ref() );
		$this->assertSame( 'semantic.color.button-bg', $bg->token );

		$border = $set->binding( 'button-border' );
		$this->assertInstanceOf( Binding::class, $border );
		$this->assertFalse( $border->is_token_ref() );
		$this->assertSame( [ 'kadence_slot' => 'palette3' ], $border->projections );
	}

	public function testBindingReturnsNullForAnUndeclaredProperty(): void {
		$this->assertNull( Preset_Bindings::from_array( $this->declaration() )->binding( 'not-a-binding' ) );
	}

	public function testItAcceptsAPresetSetWithNoBindings(): void {
		// A block can be preset-enabled before its bindings are wired.
		$set = Preset_Bindings::from_array( [ 'block' => 'kadence/advancedbtn' ] );

		$this->assertSame( [], $set->bindings );
	}

	public function testItThrowsWhenBlockIsMissing(): void {
		$this->expectException( InvalidArgumentException::class );

		Preset_Bindings::from_array( [ 'bindings' => [] ] );
	}

	public function testItThrowsOnAnEmptyBinding(): void {
		$this->expectException( InvalidArgumentException::class );

		Preset_Bindings::from_array(
			[
				'block'    => 'kadence/advancedbtn',
				'bindings' => [ 'button-bg' => [] ], // neither a token nor an inline target.
			]
		);
	}

	public function testConsistencyReportsUnboundAndUnvaluedProperties(): void {
		$set = Preset_Bindings::from_array( $this->declaration() ); // binds: button-bg, button-border.

		// Values set button-bg (bound) and button-text (unbound); button-border is bound but never set.
		$report = $set->consistency( [ 'button-bg', 'button-text' ] );

		$this->assertSame( [ 'button-text' ], $report['unbound'] );
		$this->assertSame( [ 'button-border' ], $report['unvalued'] );
	}

	public function testConsistencyIsCleanWhenBindingsAndValuesMatch(): void {
		$set = Preset_Bindings::from_array( $this->declaration() );

		$report = $set->consistency( [ 'button-bg', 'button-border' ] );

		$this->assertSame( [], $report['unbound'] );
		$this->assertSame( [], $report['unvalued'] );
	}

	public function testToUiSchemaEmitsTokenReferenceAndInlineTargetsPerProperty(): void {
		$ui = Preset_Bindings::from_array( $this->declaration() )->to_ui_schema();

		$this->assertSame( [ 'bindings' ], array_keys( $ui ) );

		// A token-reference binding: token id present, no inline projections.
		$this->assertSame(
			[
				'token'       => 'semantic.color.button-bg',
				'projections' => [],
			],
			$ui['bindings']['button-bg']
		);

		// An inline binding: null token, its projection targets carried.
		$this->assertSame(
			[
				'token'       => null,
				'projections' => [ 'kadence_slot' => 'palette3' ],
			],
			$ui['bindings']['button-border']
		);
	}

	public function testToUiSchemaIsEmptyWhenTheSetHasNoBindings(): void {
		$ui = Preset_Bindings::from_array( [ 'block' => 'kadence/advancedbtn' ] )->to_ui_schema();

		$this->assertSame( [ 'bindings' => [] ], $ui );
	}
}
