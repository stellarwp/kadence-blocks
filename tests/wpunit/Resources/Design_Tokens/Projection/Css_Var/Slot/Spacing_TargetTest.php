<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Css_Var\Slot;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Spacing_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;
use Tests\Support\Classes\TestCase;

/**
 * Covers the spacing-slot target: it normalizes a token's `kb_spacing_slot` projection to one of KB's
 * fixed spacing slugs and the custom property that slug is emitted under, rejecting absent or unknown
 * slugs so the Css_Var override never points at a slug no block reads.
 */
final class Spacing_TargetTest extends TestCase {

	/**
	 * @return void
	 */
	public function testItResolvesAKnownSpacingSlug(): void {
		$target = Spacing_Target::from_token( $this->token( 'lg' ) );

		$this->assertNotNull( $target );
		$this->assertSame( 'lg', $target->slot );
		$this->assertSame( '--global-kb-spacing-lg', $target->css_property() );
	}

	/**
	 * @dataProvider unusableSlotProvider
	 *
	 * @param mixed $slot The declared kb_spacing_slot value.
	 *
	 * @return void
	 */
	public function testItRejectsAnUnusableSlot( $slot ): void {
		$this->assertNull( Spacing_Target::from_token( $this->token( $slot ) ) );
	}

	/**
	 * @return void
	 */
	public function testItIsNullWhenTheTokenDeclaresNoSpacingSlot(): void {
		$token = Token_Definition::from_array(
			[
				'id'    => 'semantic.spacing.block',
				'type'  => 'dimension',
				'label' => 'Block spacing',
			]
		);

		$this->assertNull( Spacing_Target::from_token( $token ) );
	}

	/**
	 * @return void
	 */
	public function testItExposesItsProjectionKey(): void {
		$this->assertSame( 'kb_spacing_slot', Spacing_Target::get_projection_key() );
	}

	/**
	 * Slugs that must not produce a target: one KB does not ship, and non-string config.
	 *
	 * @return Generator
	 */
	public function unusableSlotProvider(): Generator {
		yield 'unknown slug'  => [ 'slot' => 'enormous' ];
		yield 'empty string'  => [ 'slot' => '' ];
		yield 'non-string'    => [ 'slot' => 123 ];
		yield 'boolean true'  => [ 'slot' => true ];
	}

	/**
	 * A token declaring the given kb_spacing_slot projection value.
	 *
	 * @param mixed $slot The kb_spacing_slot projection value.
	 *
	 * @return Token_Definition
	 */
	private function token( $slot ): Token_Definition {
		return Token_Definition::from_array(
			[
				'id'          => 'semantic.spacing.block',
				'type'        => 'dimension',
				'label'       => 'Block spacing',
				'projections' => [ 'kb_spacing_slot' => $slot ],
			]
		);
	}
}
