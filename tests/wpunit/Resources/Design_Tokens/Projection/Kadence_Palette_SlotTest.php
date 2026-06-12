<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Projection;

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

	public function testFromTokenReturnsNullForPalette10(): void {
		$this->assertNull( Kadence_Palette_Slot::from_token( $this->token( [ 'kadence_slot' => 'palette10' ] ) ) );
	}

	public function testFromTokenReturnsNullForPaletteWithoutDigit(): void {
		$this->assertNull( Kadence_Palette_Slot::from_token( $this->token( [ 'kadence_slot' => 'palette' ] ) ) );
	}

	public function testFromTokenReturnsNullForEmptyString(): void {
		$this->assertNull( Kadence_Palette_Slot::from_token( $this->token( [ 'kadence_slot' => '' ] ) ) );
	}

	public function testFromTokenReturnsNullForUppercaseSlot(): void {
		// The slot pattern is case-sensitive: the stored slug must be lowercase palette1…palette9.
		$this->assertNull( Kadence_Palette_Slot::from_token( $this->token( [ 'kadence_slot' => 'Palette1' ] ) ) );
	}

	public function testFromTokenReturnsNullForFontSizeKey(): void {
		$this->assertNull( Kadence_Palette_Slot::from_token( $this->token( [ 'kadence_slot' => 'md' ] ) ) );
	}

	public function testFromTokenReturnsNullForNonStringValue(): void {
		$this->assertNull( Kadence_Palette_Slot::from_token( $this->token( [ 'kadence_slot' => 1 ] ) ) );
	}

	public function testFromTokenReturnsNullWhenNoKadenceSlotProjection(): void {
		$this->assertNull( Kadence_Palette_Slot::from_token( $this->token( [ 'wp_preset' => 'color' ] ) ) );
	}
}
