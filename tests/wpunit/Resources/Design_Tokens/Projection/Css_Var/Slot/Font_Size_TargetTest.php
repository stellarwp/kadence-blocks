<?php declare( strict_types=1 );
// cspell:ignore xxl xxxl .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Css_Var\Slot;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Font_Size_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;
use Tests\Support\Classes\TestCase;

/**
 * Covers the font-size-slot target: it normalizes a token's `kb_font_size_slot` projection to one of KB's
 * fixed font-size slugs and the custom property that slug is emitted under, rejecting absent or unknown
 * slugs so the Css_Var override never points at a slug no block reads.
 */
final class Font_Size_TargetTest extends TestCase {

	/**
	 * A known font-size slug resolves to a target carrying that slug and its --global-kb-font-size-* property.
	 *
	 * @return void
	 */
	public function testItResolvesAKnownFontSizeSlug(): void {
		$target = Font_Size_Target::from_token( $this->token( 'lg' ) );

		$this->assertNotNull( $target );
		$this->assertSame( 'lg', $target->slot );
		$this->assertSame( '--global-kb-font-size-lg', $target->css_property() );
	}

	/**
	 * The largest slug, xxxl, resolves to the --global-kb-font-size-xxxl property the button's 3xl preset reads.
	 *
	 * @return void
	 */
	public function testItResolvesTheLargestSlug(): void {
		$target = Font_Size_Target::from_token( $this->token( 'xxxl' ) );

		$this->assertNotNull( $target );
		$this->assertSame( '--global-kb-font-size-xxxl', $target->css_property() );
	}

	/**
	 * A slug KB does not ship, or non-string config, produces no target so no dead override is emitted.
	 *
	 * @dataProvider unusableSlotProvider
	 *
	 * @param mixed $slot The declared kb_font_size_slot value.
	 *
	 * @return void
	 */
	public function testItRejectsAnUnusableSlot( $slot ): void {
		$this->assertNull( Font_Size_Target::from_token( $this->token( $slot ) ) );
	}

	/**
	 * A token that declares no kb_font_size_slot projection is not a font-size target.
	 *
	 * @return void
	 */
	public function testItIsNullWhenTheTokenDeclaresNoFontSizeSlot(): void {
		$token = Token_Definition::from_array(
			[
				'id'    => 'primitive.dimension.font-size.lg',
				'type'  => 'dimension',
				'label' => 'LG',
			]
		);

		$this->assertNull( Font_Size_Target::from_token( $token ) );
	}

	/**
	 * The target exposes the projection key a token uses to claim a font-size slug.
	 *
	 * @return void
	 */
	public function testItExposesItsProjectionKey(): void {
		$this->assertSame( 'kb_font_size_slot', Font_Size_Target::get_projection_key() );
	}

	/**
	 * Slugs that must not produce a target: one KB does not ship, the spacing-only 3xl, and non-string config.
	 *
	 * @return Generator
	 */
	public function unusableSlotProvider(): Generator {
		yield 'unknown slug'      => [ 'slot' => 'enormous' ];
		yield 'spacing-only slug' => [ 'slot' => '3xl' ];
		yield 'empty string'      => [ 'slot' => '' ];
		yield 'non-string'        => [ 'slot' => 123 ];
		yield 'boolean true'      => [ 'slot' => true ];
	}

	/**
	 * A token declaring the given kb_font_size_slot projection value.
	 *
	 * @param mixed $slot The kb_font_size_slot projection value.
	 *
	 * @return Token_Definition
	 */
	private function token( $slot ): Token_Definition {
		return Token_Definition::from_array(
			[
				'id'          => 'semantic.font-size.lg',
				'type'        => 'dimension',
				'label'       => 'LG',
				'projections' => [ 'kb_font_size_slot' => $slot ],
			]
		);
	}
}
