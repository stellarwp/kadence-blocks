<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use Generator;
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
		$bindings = Preset_Bindings::from_array( $this->declaration() + [ 'label' => 'Style' ] );

		$this->assertSame( 'Style', $bindings->label );
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
		$bindings = Preset_Bindings::from_array(
			$this->declaration() + [ 'editor_selector' => '.wp-block-kadence-advancedheading .kadence-advancedheading-text' ]
		);

		$this->assertSame( '.wp-block-kadence-advancedheading .kadence-advancedheading-text', $bindings->editor_selector );
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
		$bindings = Preset_Bindings::from_array( $this->declaration() );

		$bg = $bindings->binding( 'button-bg' );
		$this->assertInstanceOf( Binding::class, $bg );
		$this->assertTrue( $bg->is_token_ref() );
		$this->assertSame( 'semantic.color.button-bg', $bg->token );

		$border = $bindings->binding( 'button-border' );
		$this->assertInstanceOf( Binding::class, $border );
		$this->assertFalse( $border->is_token_ref() );
		$this->assertSame( [ 'kadence_slot' => 'palette3' ], $border->projections );
	}

	public function testBindingReturnsNullForAnUndeclaredProperty(): void {
		$this->assertNull( Preset_Bindings::from_array( $this->declaration() )->binding( 'not-a-binding' ) );
	}

	public function testItAcceptsPresetBindingsWithNoBindings(): void {
		// A block can be preset-enabled before its bindings are wired.
		$bindings = Preset_Bindings::from_array( [ 'block' => 'kadence/advancedbtn' ] );

		$this->assertSame( [], $bindings->bindings );
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
		$bindings = Preset_Bindings::from_array( $this->declaration() ); // binds: button-bg, button-border.

		// Values set button-bg (bound) and button-text (unbound); button-border is bound but never set.
		$report = $bindings->consistency( [ 'button-bg', 'button-text' ] );

		$this->assertSame( [ 'button-text' ], $report['unbound'] );
		$this->assertSame( [ 'button-border' ], $report['unvalued'] );
	}

	public function testConsistencyIsCleanWhenBindingsAndValuesMatch(): void {
		$bindings = Preset_Bindings::from_array( $this->declaration() );

		$report = $bindings->consistency( [ 'button-bg', 'button-border' ] );

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

	/**
	 * A declaration's optional "style_library" section parses its "label" into the accessor, kept
	 * distinct from the picker control's own "label".
	 *
	 * @return void
	 */
	public function testStyleLibraryLabelIsReadFromTheDeclaredSection(): void {
		$bindings = Preset_Bindings::from_array(
			$this->declaration() + [
				'label'         => 'Style',
				'style_library' => [ 'label' => 'Button' ],
			]
		);

		$this->assertSame( 'Button', $bindings->style_library_label() );
		$this->assertSame( 'Style', $bindings->label );
	}

	/**
	 * A declaration that omits "style_library" entirely stays valid: the section is null and the
	 * label accessor reports null rather than throwing or defaulting to the picker control's label.
	 *
	 * @return void
	 */
	public function testStyleLibraryLabelIsNullWhenTheSectionIsOmitted(): void {
		$bindings = Preset_Bindings::from_array( $this->declaration() );

		$this->assertNull( $bindings->style_library );
		$this->assertNull( $bindings->style_library_label() );
	}

	/**
	 * A malformed "style_library" section (not an array) degrades to null rather than throwing —
	 * the section is optional and must not block registration of the block's preset bindings.
	 *
	 * @return void
	 */
	public function testStyleLibraryLabelIsNullWhenTheSectionIsMalformed(): void {
		$bindings = Preset_Bindings::from_array( $this->declaration() + [ 'style_library' => 'Button' ] );

		$this->assertNull( $bindings->style_library );
		$this->assertNull( $bindings->style_library_label() );
	}

	/**
	 * A "style_library" section present but with an empty or non-string "label" yields a null
	 * accessor rather than an empty-string label.
	 *
	 * @dataProvider invalidStyleLibraryLabelProvider
	 *
	 * @param mixed $label The invalid declared "style_library.label" value.
	 *
	 * @return void
	 */
	public function testStyleLibraryLabelIsNullWhenTheDeclaredLabelIsInvalid( $label ): void {
		$bindings = Preset_Bindings::from_array( $this->declaration() + [ 'style_library' => [ 'label' => $label ] ] );

		$this->assertNull( $bindings->style_library_label() );
	}

	/**
	 * Invalid "style_library.label" values: empty string and non-string types.
	 *
	 * @return Generator
	 */
	public function invalidStyleLibraryLabelProvider(): Generator {
		yield 'empty string' => [ 'label' => '' ];

		yield 'integer' => [ 'label' => 4 ];

		yield 'null' => [ 'label' => null ];
	}
}
