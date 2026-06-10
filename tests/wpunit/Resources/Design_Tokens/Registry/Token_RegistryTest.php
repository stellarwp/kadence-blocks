<?php declare( strict_types=1 );
// cspell:ignore advancedbtn advancedheading .

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use Tests\Support\Classes\TestCase;

final class Token_RegistryTest extends TestCase {

	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		$this->registry = new Token_Registry();
	}

	private function register_button_bg(): void {
		$this->registry->register(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'group'       => 'Brand',
				'projections' => [ 'wp_preset' => 'color' ],
			]
		);
	}

	private function register_spacing_md(): void {
		$this->registry->register(
			[
				'id'    => 'semantic.spacing.md',
				'type'  => 'dimension',
				'label' => 'Spacing Medium',
				'group' => 'Layout',
			]
		);
	}

	public function testAllGetHasRoundTrip(): void {
		$this->register_button_bg();

		$this->assertTrue( $this->registry->has( 'semantic.color.button-bg' ) );
		$this->assertFalse( $this->registry->has( 'nope' ) );
		$this->assertInstanceOf( Token_Definition::class, $this->registry->get( 'semantic.color.button-bg' ) );
		$this->assertNull( $this->registry->get( 'nope' ) );
		$this->assertCount( 1, $this->registry->all() );
	}

	public function testItPreservesInsertionOrder(): void {
		$this->register_button_bg();
		$this->register_spacing_md();

		$this->assertSame(
			[ 'semantic.color.button-bg', 'semantic.spacing.md' ],
			array_keys( $this->registry->all() )
		);
	}

	public function testByTypeFiltersAndKeepsIdKeys(): void {
		$this->register_button_bg();
		$this->register_spacing_md();

		$colors = $this->registry->by_type( 'color' );

		$this->assertSame( [ 'semantic.color.button-bg' ], array_keys( $colors ) );
	}

	public function testByProjectionFiltersAndKeepsIdKeys(): void {
		$this->register_button_bg();
		$this->register_spacing_md();

		$presets = $this->registry->by_projection( 'wp_preset' );

		$this->assertSame( [ 'semantic.color.button-bg' ], array_keys( $presets ) );
	}

	public function testCssVarForKnownToken(): void {
		$this->register_button_bg();

		$this->assertSame(
			'--kb-token--semantic--color--button-bg',
			$this->registry->css_var_for( 'semantic.color.button-bg' )
		);
	}

	public function testCssVarForUnknownTokenFallsBackToDerivation(): void {
		$this->assertSame(
			'--kb-token--unknown--token',
			$this->registry->css_var_for( 'unknown.token' )
		);
	}

	public function testCssVarForHonoursOverride(): void {
		$this->registry->register(
			[
				'id'      => 'semantic.color.button-bg',
				'type'    => 'color',
				'label'   => 'Button Background',
				'css_var' => '--global-palette1',
			]
		);

		$this->assertSame( '--global-palette1', $this->registry->css_var_for( 'semantic.color.button-bg' ) );
	}

	public function testToUiSchemaBucketsByGroupAndNeverLeaksAValue(): void {
		$this->register_button_bg();
		$this->register_spacing_md();

		$schema = $this->registry->to_ui_schema();

		$this->assertArrayHasKey( 'groups', $schema );
		$this->assertArrayHasKey( 'Brand', $schema['groups'] );
		$this->assertArrayHasKey( 'Layout', $schema['groups'] );

		$entry = $schema['groups']['Brand'][0];
		$this->assertSame(
			[ 'id', 'type', 'label', 'cssVar', 'projections' ],
			array_keys( $entry )
		);
		$this->assertArrayNotHasKey( 'value', $entry );
	}

	public function testForBlockReturnsNullUntilRegistered(): void {
		$this->assertNull( $this->registry->for_block( 'kadence/advancedbtn' ) );

		$this->registry->register_variant_set(
			[
				'block'    => 'kadence/advancedbtn',
				'variants' => [ 'primary' ],
			]
		);

		$set = $this->registry->for_block( 'kadence/advancedbtn' );
		$this->assertNotNull( $set );
		$this->assertSame( 'kadence/advancedbtn', $set->block );
	}

	public function testVariantSetsIsEmptyUntilRegistered(): void {
		$this->assertSame( [], $this->registry->variant_sets() );
	}

	public function testVariantSetsReturnsRegisteredSetsKeyedByBlockInOrder(): void {
		$this->registry->register_variant_set( [ 'block' => 'kadence/advancedbtn' ] );
		$this->registry->register_variant_set( [ 'block' => 'kadence/advancedheading' ] );

		$sets = $this->registry->variant_sets();

		$this->assertSame(
			[ 'kadence/advancedbtn', 'kadence/advancedheading' ],
			array_keys( $sets )
		);
		$this->assertSame( 'kadence/advancedbtn', $sets['kadence/advancedbtn']->block );
		$this->assertSame( 'kadence/advancedheading', $sets['kadence/advancedheading']->block );
	}

	public function testIsActiveByDefaultAndDeactivates(): void {
		$this->assertTrue( $this->registry->is_active() );

		$this->registry->deactivate();

		$this->assertFalse( $this->registry->is_active() );
	}

	public function testMissingFromBaselineReturnsUnmatchedIds(): void {
		$this->register_button_bg();
		$this->register_spacing_md();

		$baseline = new class() implements Baseline_Document {
			public function has( string $id ): bool {
				return $id === 'semantic.color.button-bg';
			}

			public function document(): array {
				return [];
			}
		};

		$this->assertSame( [ 'semantic.spacing.md' ], $this->registry->missing_from_baseline( $baseline ) );
	}
}
