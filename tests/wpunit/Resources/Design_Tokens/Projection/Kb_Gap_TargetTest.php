<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kb_Gap_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;
use Tests\Support\Classes\TestCase;

/**
 * Covers the gap-slot target: it normalizes a token's `kb_gap_slot` projection to one of KB's gap
 * variable slugs and the custom property that slug is emitted under, rejecting absent or unknown slugs —
 * including the alias and literal-only gutter presets that have no variable to redirect.
 */
final class Kb_Gap_TargetTest extends TestCase {

	/**
	 * @return void
	 */
	public function testItResolvesAKnownGapSlug(): void {
		$target = Kb_Gap_Target::from_token( $this->token( 'md' ) );

		$this->assertNotNull( $target );
		$this->assertSame( 'md', $target->slot );
		$this->assertSame( '--global-kb-gap-md', $target->css_property() );
	}

	/**
	 * @dataProvider unusableSlotProvider
	 *
	 * @param mixed $slot The declared kb_gap_slot value.
	 *
	 * @return void
	 */
	public function testItRejectsAnUnusableSlot( $slot ): void {
		$this->assertNull( Kb_Gap_Target::from_token( $this->token( $slot ) ) );
	}

	/**
	 * @return void
	 */
	public function testItIsNullWhenTheTokenDeclaresNoGapSlot(): void {
		$token = Token_Definition::from_array(
			[
				'id'    => 'semantic.gap.layout',
				'type'  => 'dimension',
				'label' => 'Layout gap',
			]
		);

		$this->assertNull( Kb_Gap_Target::from_token( $token ) );
	}

	/**
	 * @return void
	 */
	public function testItExposesItsProjectionKey(): void {
		$this->assertSame( 'kb_gap_slot', Kb_Gap_Target::get_projection_key() );
	}

	/**
	 * Slugs that must not produce a target: an alias preset that resolves to another variable, a
	 * literal-only gutter preset with no variable, one KB does not ship, and non-string config.
	 *
	 * @return Generator
	 */
	public function unusableSlotProvider(): Generator {
		yield 'alias preset'   => [ 'slot' => 'default' ]; // an alias for --global-kb-gap-md, not its own var.
		yield 'literal preset' => [ 'slot' => 'narrow' ];  // a fixed 20px gutter with no variable.
		yield 'unknown slug'   => [ 'slot' => 'enormous' ];
		yield 'empty string'   => [ 'slot' => '' ];
		yield 'non-string'     => [ 'slot' => 123 ];
	}

	/**
	 * A token declaring the given kb_gap_slot projection value.
	 *
	 * @param mixed $slot The kb_gap_slot projection value.
	 *
	 * @return Token_Definition
	 */
	private function token( $slot ): Token_Definition {
		return Token_Definition::from_array(
			[
				'id'          => 'semantic.gap.layout',
				'type'        => 'dimension',
				'label'       => 'Layout gap',
				'projections' => [ 'kb_gap_slot' => $slot ],
			]
		);
	}
}
