<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Wp_Preset_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;
use Tests\Support\Classes\TestCase;

final class Wp_Preset_TargetTest extends TestCase {

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

	public function testBareStringConfigDerivesSlugFromId(): void {
		$target = Wp_Preset_Target::from_token( $this->token( [ 'wp_preset' => 'color' ] ) );

		$this->assertNotNull( $target );
		$this->assertSame( 'color', $target->category );
		$this->assertSame( 'button-bg', $target->slug );
	}

	public function testArrayConfigWithExplicitSlugIsHonored(): void {
		$token = $this->token(
			[
				'wp_preset' => [
					'category' => 'color',
					'slug'     => 'btn',
				],
			]
		);

		$target = Wp_Preset_Target::from_token( $token );

		$this->assertNotNull( $target );
		$this->assertSame( 'color', $target->category );
		$this->assertSame( 'btn', $target->slug );
	}

	public function testArrayConfigWithoutSlugFallsBackToIdSegment(): void {
		$target = Wp_Preset_Target::from_token(
			$this->token( [ 'wp_preset' => [ 'category' => 'color' ] ] )
		);

		$this->assertNotNull( $target );
		$this->assertSame( 'color', $target->category );
		$this->assertSame( 'button-bg', $target->slug );
	}

	public function testTokenWithoutWpPresetReturnsNull(): void {
		$this->assertNull( Wp_Preset_Target::from_token( $this->token( [ 'kadence_slot' => 'palette1' ] ) ) );
	}

	public function testEmptyStringCategoryReturnsNull(): void {
		$this->assertNull( Wp_Preset_Target::from_token( $this->token( [ 'wp_preset' => '' ] ) ) );
	}

	public function testArrayConfigMissingCategoryReturnsNull(): void {
		$this->assertNull(
			Wp_Preset_Target::from_token( $this->token( [ 'wp_preset' => [ 'slug' => 'btn' ] ] ) )
		);
	}

	public function testSlugFromIdReturnsLastDotSegment(): void {
		$this->assertSame( 'button-bg', Wp_Preset_Target::slug_from_id( 'semantic.color.button-bg' ) );
	}

	public function testSlugFromIdReturnsWholeStringWhenNoDot(): void {
		$this->assertSame( 'standalone', Wp_Preset_Target::slug_from_id( 'standalone' ) );
	}
}
