<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Variant_Set;
use Tests\Support\Classes\TestCase;

final class Variant_SetTest extends TestCase {

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
		$this->assertSame( 'kadence/advancedbtn', Variant_Set::from_array( $this->declaration() )->block );
	}

	public function testItParsesTokenReferenceAndInlineBindings(): void {
		$set = Variant_Set::from_array( $this->declaration() );

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
		$this->assertNull( Variant_Set::from_array( $this->declaration() )->binding( 'not-a-binding' ) );
	}

	public function testItAcceptsAVariantSetWithNoBindings(): void {
		// A block can be variant-enabled before its bindings are wired.
		$set = Variant_Set::from_array( [ 'block' => 'kadence/advancedbtn' ] );

		$this->assertSame( [], $set->bindings );
	}

	public function testItThrowsWhenBlockIsMissing(): void {
		$this->expectException( InvalidArgumentException::class );

		Variant_Set::from_array( [ 'bindings' => [] ] );
	}

	public function testItThrowsOnAnEmptyBinding(): void {
		$this->expectException( InvalidArgumentException::class );

		Variant_Set::from_array(
			[
				'block'    => 'kadence/advancedbtn',
				'bindings' => [ 'button-bg' => [] ], // neither a token nor an inline target.
			]
		);
	}

	public function testConsistencyReportsUnboundAndUnvaluedProperties(): void {
		$set = Variant_Set::from_array( $this->declaration() ); // binds: button-bg, button-border.

		// Values set button-bg (bound) and button-text (unbound); button-border is bound but never set.
		$report = $set->consistency( [ 'button-bg', 'button-text' ] );

		$this->assertSame( [ 'button-text' ], $report['unbound'] );
		$this->assertSame( [ 'button-border' ], $report['unvalued'] );
	}

	public function testConsistencyIsCleanWhenBindingsAndValuesMatch(): void {
		$set = Variant_Set::from_array( $this->declaration() );

		$report = $set->consistency( [ 'button-bg', 'button-border' ] );

		$this->assertSame( [], $report['unbound'] );
		$this->assertSame( [], $report['unvalued'] );
	}

	public function testToUiArrayEmitsTokenReferenceAndInlineTargetsPerProperty(): void {
		$ui = Variant_Set::from_array( $this->declaration() )->to_ui_array();

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

	public function testToUiArrayIsEmptyWhenTheSetHasNoBindings(): void {
		$ui = Variant_Set::from_array( [ 'block' => 'kadence/advancedbtn' ] )->to_ui_array();

		$this->assertSame( [ 'bindings' => [] ], $ui );
	}
}
