<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Foundation_Presets;

use KadenceWP\KadenceBlocks\Design_Tokens\Foundation_Presets\Exception\Unknown_Preset_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Foundation_Presets\Foundation_Presets;
use Tests\Support\Classes\TestCase;

/**
 * Reads the catalogue from the real shipped baseline (baseline.json) bound in the container, so these
 * assertions double as a guard that the shipped foundation presets keep their expected shape.
 */
final class Foundation_PresetsTest extends TestCase {

	private Foundation_Presets $presets;

	protected function setUp(): void {
		parent::setUp();

		$this->presets = $this->container->get( Foundation_Presets::class );
	}

	public function testItListsTheShippedPresetGroups(): void {
		$groups = $this->presets->groups();

		$this->assertContains( 'typeScale', $groups );
		$this->assertContains( 'colorPalette', $groups );
	}

	public function testItReturnsTheSelectablePresetsAsSlugToLabelSkippingTheDefaultKey(): void {
		$options = $this->presets->options( 'typeScale' );

		$this->assertSame(
			[
				'minorThird'    => 'Minor Third',
				'majorThird'    => 'Major Third',
				'perfectFourth' => 'Perfect Fourth',
				'goldenRatio'   => 'Golden Ratio',
			],
			$options
		);

		// The structural "$default" key names a preset, it is not an option itself.
		$this->assertArrayNotHasKey( '$default', $options );
	}

	public function testItReturnsAGroupDefault(): void {
		$this->assertSame( 'majorThird', $this->presets->default_for( 'typeScale' ) );
		$this->assertSame( 'kadence', $this->presets->default_for( 'colorPalette' ) );
	}

	public function testItReturnsAPresetsFlatTokenMap(): void {
		$tokens = $this->presets->tokens_for( 'typeScale', 'goldenRatio' );

		$this->assertSame( '6.854rem', $tokens['primitive.fontSize.3xl'] );
		$this->assertSame( '1rem', $tokens['primitive.fontSize.md'] );
	}

	public function testTokensForThrowsOnAnUnknownGroup(): void {
		$this->expectException( Unknown_Preset_Exception::class );

		$this->presets->tokens_for( 'noSuchGroup', 'goldenRatio' );
	}

	public function testTokensForThrowsOnAnUnknownChoice(): void {
		$this->expectException( Unknown_Preset_Exception::class );

		$this->presets->tokens_for( 'typeScale', 'noSuchScale' );
	}

	public function testTokensForRejectsTheDefaultKeyAsAChoice(): void {
		$this->expectException( Unknown_Preset_Exception::class );

		// "$default" points at a preset, it is never selectable by that name.
		$this->presets->tokens_for( 'typeScale', '$default' );
	}

	public function testOptionsThrowsOnAnUnknownGroup(): void {
		$this->expectException( Unknown_Preset_Exception::class );

		$this->presets->options( 'noSuchGroup' );
	}
}
