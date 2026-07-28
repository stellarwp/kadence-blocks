<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Preset_Bindings;
use Tests\Support\Classes\TestCase;

/**
 * Exercises preset-bindings registration and binding-projection resolution against a freshly constructed
 * registry, so the assertions are independent of whatever the module declares at boot.
 */
final class Token_Registry_PresetsTest extends TestCase {

	private function registry(): Token_Registry {
		$registry = new Token_Registry();

		$registry->register(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [
					'kadence_slot' => 'palette1',
				],
			]
		);

		$registry->register_preset_bindings(
			[
				'block'    => 'kadence/advancedbtn',
				'bindings' => [
					'button-bg'         => [ 'token' => 'semantic.color.button-bg' ],
					'button-border'     => [ 'kadence_slot' => 'palette3' ],
					'button-bg-attr'    => [
						'token'      => 'semantic.color.button-bg',
						'block_attr' => 'background',
					],
					'button-bg-control' => [
						'token'        => 'semantic.color.button-bg',
						'control_attr' => 'background',
					],
				],
			]
		);

		return $registry;
	}

	public function testForBlockReturnsTheRegisteredSet(): void {
		$set = $this->registry()->for_block( 'kadence/advancedbtn' );

		$this->assertInstanceOf( Preset_Bindings::class, $set );
		$this->assertSame( 'kadence/advancedbtn', $set->block );
		$this->assertNotNull( $set->binding( 'button-bg' ) );
	}

	public function testForBlockReturnsNullForAnUnregisteredBlock(): void {
		$this->assertNull( $this->registry()->for_block( 'kadence/nope' ) );
	}

	public function testEffectiveProjectionsReusesTheReferencedTokensProjections(): void {
		$registry = $this->registry();
		$binding  = $registry->for_block( 'kadence/advancedbtn' )->binding( 'button-bg' );

		$this->assertSame(
			[
				'kadence_slot' => 'palette1',
			],
			$registry->effective_projections( $binding )
		);
	}

	public function testEffectiveProjectionsReturnsInlineTargetsAsIs(): void {
		$registry = $this->registry();
		$binding  = $registry->for_block( 'kadence/advancedbtn' )->binding( 'button-border' );

		$this->assertSame( [ 'kadence_slot' => 'palette3' ], $registry->effective_projections( $binding ) );
	}

	public function testEffectiveProjectionsMergesInlineTargetsOverTheToken(): void {
		$registry = $this->registry();
		$binding  = $registry->for_block( 'kadence/advancedbtn' )->binding( 'button-bg-attr' );

		// The token contributes its projections; the inline block_attr (which the token never carries)
		// is added on top.
		$this->assertSame(
			[
				'kadence_slot' => 'palette1',
				'block_attr'   => 'background',
			],
			$registry->effective_projections( $binding )
		);
	}

	public function testEffectiveProjectionsAreEmptyForAReferenceToAnUnregisteredToken(): void {
		$registry = new Token_Registry();
		$registry->register_preset_bindings(
			[
				'block'    => 'kadence/advancedbtn',
				'bindings' => [ 'button-bg' => [ 'token' => 'semantic.color.not-registered' ] ],
			]
		);

		$binding = $registry->for_block( 'kadence/advancedbtn' )->binding( 'button-bg' );

		$this->assertSame( [], $registry->effective_projections( $binding ) );
	}

	/**
	 * A binding's control_attr never appears in its effective projections, so no projector (including the
	 * block-preset seeder) ever sees it and nothing is seeded from it — the guarantee the editor's
	 * "empty = bound" detection depends on.
	 *
	 * @return void
	 */
	public function testEffectiveProjectionsExcludeControlAttr(): void {
		$registry = $this->registry();
		$binding  = $registry->for_block( 'kadence/advancedbtn' )->binding( 'button-bg-control' );

		$this->assertSame( 'background', $binding->control_attr() );

		$projections = $registry->effective_projections( $binding );

		$this->assertSame( [ 'kadence_slot' => 'palette1' ], $projections );
		$this->assertArrayNotHasKey( 'control_attr', $projections );
	}
}
