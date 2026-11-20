<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Projection;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Palette_Slot;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;
use Tests\Support\Classes\TestCase;

final class Kadence_Palette_SlotTest extends TestCase {

	private function token( array $projections ): Token_Definition {
		return Token_Definition::from_array(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => $projections,
			]
		);
	}

	/**
	 * A slug is a palette slot only when it is palette1 to palette15 exactly.
	 *
	 * @dataProvider slotSlugProvider
	 *
	 * @param string $slug     The palette entry slug.
	 * @param bool   $expected Whether the slug is a palette slot.
	 *
	 * @return void
	 */
	public function testIsSlotMatchesOnlyThePaletteSlots( string $slug, bool $expected ): void {
		$this->assertSame( $expected, Kadence_Palette_Slot::is_slot( $slug ) );
	}

	/**
	 * Slugs paired with whether they are palette slots.
	 *
	 * @return Generator
	 */
	public function slotSlugProvider(): Generator {
		yield 'first slot' => [
			'slug'     => 'palette1',
			'expected' => true,
		];

		yield 'last slot' => [
			'slug'     => 'palette15',
			'expected' => true,
		];

		yield 'past the last slot' => [
			'slug'     => 'palette16',
			'expected' => false,
		];

		yield 'zero' => [
			'slug'     => 'palette0',
			'expected' => false,
		];

		yield 'legacy user slug' => [
			'slug'     => 'kb-palette-1',
			'expected' => false,
		];

		yield 'trailing characters' => [
			'slug'     => 'palette1-dark',
			'expected' => false,
		];
	}

	public function testGetProjectionKeyReturnsPaletteSlotKey(): void {
		$this->assertSame( 'kadence_slot', Kadence_Palette_Slot::get_projection_key() );
	}

	public function testFromTokenReturnsPaletteSlotForPalette1(): void {
		$slot = Kadence_Palette_Slot::from_token( $this->token( [ 'kadence_slot' => 'palette1' ] ) );

		$this->assertInstanceOf( Kadence_Palette_Slot::class, $slot );
		$this->assertSame( 'palette1', $slot->slug );
	}

	public function testFromTokenReturnsPaletteSlotForPalette9(): void {
		$slot = Kadence_Palette_Slot::from_token( $this->token( [ 'kadence_slot' => 'palette9' ] ) );

		$this->assertInstanceOf( Kadence_Palette_Slot::class, $slot );
		$this->assertSame( 'palette9', $slot->slug );
	}

	public function testFromTokenReturnsNullForPalette0(): void {
		$this->assertNull( Kadence_Palette_Slot::from_token( $this->token( [ 'kadence_slot' => 'palette0' ] ) ) );
	}

	/**
	 * The theme's extended slots palette10…15 are palette slots.
	 *
	 * @dataProvider extendedSlotProvider
	 *
	 * @param string $slug The extended slot slug.
	 *
	 * @return void
	 */
	public function testFromTokenReturnsPaletteSlotForExtendedSlots( string $slug ): void {
		$slot = Kadence_Palette_Slot::from_token( $this->token( [ 'kadence_slot' => $slug ] ) );

		$this->assertInstanceOf( Kadence_Palette_Slot::class, $slot );
		$this->assertSame( $slug, $slot->slug );
	}

	/**
	 * The first and last extended slots.
	 *
	 * @return Generator
	 */
	public function extendedSlotProvider(): Generator {
		yield 'palette10' => [ 'slug' => 'palette10' ];
		yield 'palette15' => [ 'slug' => 'palette15' ];
	}

	/**
	 * Slots past the theme's fifteen are not palette slots.
	 *
	 * @dataProvider outOfRangeSlotProvider
	 *
	 * @param string $slug The out-of-range slot slug.
	 *
	 * @return void
	 */
	public function testFromTokenReturnsNullPastPalette15( string $slug ): void {
		$this->assertNull( Kadence_Palette_Slot::from_token( $this->token( [ 'kadence_slot' => $slug ] ) ) );
	}

	/**
	 * Slugs just past the slot range.
	 *
	 * @return Generator
	 */
	public function outOfRangeSlotProvider(): Generator {
		yield 'palette16' => [ 'slug' => 'palette16' ];
		yield 'palette100' => [ 'slug' => 'palette100' ];
		yield 'palette01' => [ 'slug' => 'palette01' ];
	}

	public function testFromTokenReturnsNullForPaletteWithoutDigit(): void {
		$this->assertNull( Kadence_Palette_Slot::from_token( $this->token( [ 'kadence_slot' => 'palette' ] ) ) );
	}

	public function testFromTokenReturnsNullForEmptyString(): void {
		$this->assertNull( Kadence_Palette_Slot::from_token( $this->token( [ 'kadence_slot' => '' ] ) ) );
	}

	public function testFromTokenReturnsNullForUppercaseSlot(): void {
		// The slot pattern is case-sensitive: the stored slug must be lowercase palette1…palette15.
		$this->assertNull( Kadence_Palette_Slot::from_token( $this->token( [ 'kadence_slot' => 'Palette1' ] ) ) );
	}

	public function testFromTokenReturnsNullForFontSizeKey(): void {
		$this->assertNull( Kadence_Palette_Slot::from_token( $this->token( [ 'kadence_slot' => 'md' ] ) ) );
	}

	public function testFromTokenReturnsNullForNonStringValue(): void {
		$this->assertNull( Kadence_Palette_Slot::from_token( $this->token( [ 'kadence_slot' => 1 ] ) ) );
	}

	public function testFromTokenReturnsNullWhenNoKadenceSlotProjection(): void {
		$this->assertNull( Kadence_Palette_Slot::from_token( $this->token( [] ) ) );
	}
}
