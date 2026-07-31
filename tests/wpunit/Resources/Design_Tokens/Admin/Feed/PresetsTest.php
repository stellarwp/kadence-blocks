<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Presets;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Preset_Resolver;
use Tests\Support\Classes\TestCase;

/**
 * Exercises Presets against the real shipped baseline, so these assertions also guard the
 * baseline's Button preset definitions.
 */
final class PresetsTest extends TestCase {

	private const BUTTON = 'kadence/singlebtn';

	private Preset_Resolver $resolver;

	protected function setUp(): void {
		parent::setUp();

		$this->resolver = $this->container->get( Preset_Resolver::class );
	}

	public function testItBuildsStructureAndResolvedValuesForTheShippedButton(): void {
		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );

		$presets = ( new Presets( $registry, $this->resolver ) )->all();

		$this->assertArrayHasKey( self::BUTTON, $presets );

		// The button's presets live directly under the block (one flat preset collection per block).
		$button = $presets[ self::BUTTON ];

		$this->assertSame( 'Style', $button['label'] );
		$this->assertSame( 'primary', $button['default'] );
		$this->assertSame( [ 'primary', 'secondary' ], $button['names'] );
		$this->assertContains( 'button-bg', $button['properties'] );

		// Structure: bindings carry the token reference / inline targets.
		$this->assertArrayHasKey( 'bindings', $button );
		$this->assertArrayHasKey( 'button-bg', $button['bindings'] );

		// Resolved preview values per preset — aliases flattened to their primitive color.
		$this->assertSame( '#3633e1', $button['values']['primary']['button-bg'] );
		$this->assertSame( '#1A202C', $button['values']['secondary']['button-bg'] );
	}

	public function testABlockRegisteredButAbsentFromTheDocumentIsSkipped(): void {
		// A fresh registry whose only preset bindings have no matching presets in the shipped baseline.
		$registry = new Token_Registry();
		$registry->register_preset_bindings( [ 'block' => 'kadence/not-a-real-block' ] );

		$presets = ( new Presets( $registry, $this->resolver ) )->all();

		$this->assertSame( [], $presets );
	}
}
