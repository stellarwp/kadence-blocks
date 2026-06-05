<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Css_Var;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Wp_Preset_Var;
use Tests\Support\Classes\TestCase;

final class Wp_Preset_VarTest extends TestCase {

	public function testItDerivesTheCanonicalPresetVarName(): void {
		$this->assertSame(
			'--wp--preset--color--button-bg',
			Wp_Preset_Var::from( 'color', 'button-bg' )
		);
	}

	public function testItPrefixesWithWpPreset(): void {
		$this->assertStringStartsWith( '--wp--preset--', Wp_Preset_Var::from( 'color', 'button-bg' ) );
	}

	public function testItHandlesDifferentCategories(): void {
		$this->assertSame( '--wp--preset--font-size--sm', Wp_Preset_Var::from( 'font-size', 'sm' ) );
		$this->assertSame( '--wp--preset--spacing--md', Wp_Preset_Var::from( 'spacing', 'md' ) );
	}
}
