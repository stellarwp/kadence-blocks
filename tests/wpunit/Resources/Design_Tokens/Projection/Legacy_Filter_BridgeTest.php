<?php declare( strict_types=1 );
// cspell:ignore palette Squiz .

namespace Tests\wpunit\Resources\Design_Tokens\Projection;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Legacy_Filter_Bridge;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Css_Renderer;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

final class Legacy_Filter_BridgeTest extends TestCase {

	private Token_Registry $registry;

	/**
	 * The default palette included in `includes/init.php` — keys and values must stay in lockstep.
	 *
	 * @var array<string,string>
	 */
	private array $default_colors = [
		'--global-palette1' => '#3182CE',
		'--global-palette2' => '#2B6CB0',
		'--global-palette3' => '#1A202C',
		'--global-palette4' => '#2D3748',
		'--global-palette5' => '#4A5568',
		'--global-palette6' => '#718096',
		'--global-palette7' => '#EDF2F7',
		'--global-palette8' => '#F7FAFC',
		'--global-palette9' => '#ffffff',
	];

	/**
	 * The default font-size map included in `includes/init.php` — keys and values must stay in lockstep.
	 *
	 * @var array<string,string>
	 */
	private array $default_font_sizes = [
		'sm'   => 'clamp(0.8rem, 0.73rem + 0.217vw, 0.9rem)',
		'md'   => 'clamp(1.1rem, 0.995rem + 0.326vw, 1.25rem)',
		'lg'   => 'clamp(1.75rem, 1.576rem + 0.543vw, 2rem)',
		'xl'   => 'clamp(2.25rem, 1.728rem + 1.63vw, 3rem)',
		'xxl'  => 'clamp(2.5rem, 1.456rem + 3.26vw, 4rem)',
		'xxxl' => 'clamp(2.75rem, 0.489rem + 7.065vw, 6rem)',
	];

	protected function setUp(): void {
		parent::setUp();

		$this->registry = new Token_Registry();
	}

	/**
	 * Build a bridge backed by a resolver resolved from a controlled baseline.
	 *
	 * @param array<string,mixed> $baseline DTCG structure — token paths that should resolve.
	 */
	private function bridge_for( array $baseline ): Legacy_Filter_Bridge {
		$resolver = new Token_Resolver(
			$this->container->get( Token_Store::class ),
			new Effective_Document( new Fake_Baseline_Document( $baseline ) ),
			new Css_Renderer()
		);

		return new Legacy_Filter_Bridge( $this->registry, $resolver );
	}

	/**
	 * Baseline entry for a single color token.
	 *
	 * @param string $id    Dot-path id.
	 * @param string $value CSS color value.
	 *
	 * @return array<string,mixed>
	 */
	private function color_baseline( string $id, string $value ): array {
		$parts = explode( '.', $id );
		$node  = [
			'$type'  => 'color',
			'$value' => $value,
		];

		for ( $i = count( $parts ) - 1; $i >= 0; $i-- ) {
			$node = [ $parts[ $i ] => $node ];
		}

		return $node;
	}

	// ---- global_colors() -------------------------------------------------------------------------------

	public function testPaletteTokenOverridesItsSlotAndLeavesOthersIntact(): void {
		$id  = 'semantic.color.button-bg';
		$var = Css_Var::from_id( $id );

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'kadence_slot' => 'palette3' ],
			]
		);

		$bridge = $this->bridge_for( $this->color_baseline( $id, '#3182CE' ) );
		$result = $bridge->global_colors( $this->default_colors );

		$this->assertSame( 'var(' . $var . ', #3182CE)', $result['--global-palette3'] );

		// The other eight entries must be untouched.
		foreach ( $this->default_colors as $key => $original ) {
			if ( $key === '--global-palette3' ) {
				continue;
			}
			$this->assertSame( $original, $result[ $key ], "Key {$key} should be unchanged." );
		}
	}

	public function testPaletteSlotValueIncludesBothVarAndLiteralFallback(): void {
		$id  = 'semantic.color.button-bg';
		$var = Css_Var::from_id( $id );

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'kadence_slot' => 'palette1' ],
			]
		);

		$bridge = $this->bridge_for( $this->color_baseline( $id, '#3182CE' ) );
		$result = $bridge->global_colors( $this->default_colors );
		$value  = $result['--global-palette1'];

		$this->assertStringContainsString( $var, $value );
		$this->assertStringContainsString( '#3182CE', $value );
	}

	public function testFontSizeSlotIsIgnoredByGlobalColors(): void {
		$id = 'semantic.dimension.font-sm';

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'dimension',
				'label'       => 'Font Small',
				'projections' => [ 'kadence_slot' => 'sm' ],
			]
		);

		$bridge = $this->bridge_for( [] );
		$result = $bridge->global_colors( $this->default_colors );

		$this->assertSame( $this->default_colors, $result );
	}

	public function testTokenWithNoResolvedValueLeavesColorMapUnchanged(): void {
		$this->registry->register(
			[
				'id'          => 'semantic.color.missing',
				'type'        => 'color',
				'label'       => 'Missing Token',
				'projections' => [ 'kadence_slot' => 'palette2' ],
			]
		);

		// Empty baseline — token resolves to nothing.
		$bridge = $this->bridge_for( [] );
		$result = $bridge->global_colors( $this->default_colors );

		$this->assertSame( $this->default_colors['--global-palette2'], $result['--global-palette2'] );
	}

	// ---- font_sizes() -------------------------------------------------------------------------------

	public function testFontSizeTokenOverridesItsKeyAndLeavesOthersIntact(): void {
		$id  = 'semantic.dimension.font-sm';
		$var = Css_Var::from_id( $id );

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'dimension',
				'label'       => 'Font Small',
				'projections' => [ 'kadence_slot' => 'sm' ],
			]
		);

		$baseline = [
			'semantic' => [
				'dimension' => [
					'font-sm' => [
						'$type'  => 'dimension',
						'$value' => '0.875rem',
					],
				],
			],
		];
		$bridge   = $this->bridge_for( $baseline );
		$result   = $bridge->font_sizes( $this->default_font_sizes );

		$this->assertSame( 'var(' . $var . ', 0.875rem)', $result['sm'] );

		foreach ( $this->default_font_sizes as $key => $original ) {
			if ( $key === 'sm' ) {
				continue;
			}
			$this->assertSame( $original, $result[ $key ], "Key {$key} should be unchanged." );
		}
	}

	public function testFontSizeValueIncludesBothVarAndLiteralFallback(): void {
		$id  = 'semantic.dimension.font-md';
		$var = Css_Var::from_id( $id );

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'dimension',
				'label'       => 'Font Medium',
				'projections' => [ 'kadence_slot' => 'md' ],
			]
		);

		$baseline = [
			'semantic' => [
				'dimension' => [
					'font-md' => [
						'$type'  => 'dimension',
						'$value' => '1rem',
					],
				],
			],
		];
		$bridge   = $this->bridge_for( $baseline );
		$result   = $bridge->font_sizes( $this->default_font_sizes );
		$value    = $result['md'];

		$this->assertStringContainsString( $var, $value );
		$this->assertStringContainsString( '1rem', $value );
	}

	public function testPaletteSlotIsIgnoredByFontSizes(): void {
		$id = 'semantic.color.button-bg';

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'kadence_slot' => 'palette1' ],
			]
		);

		$bridge = $this->bridge_for( $this->color_baseline( $id, '#3182CE' ) );
		$result = $bridge->font_sizes( $this->default_font_sizes );

		$this->assertSame( $this->default_font_sizes, $result );
	}

	public function testFontSizeTokenWithNoResolvedValueLeavesMapUnchanged(): void {
		$this->registry->register(
			[
				'id'          => 'semantic.dimension.font-lg',
				'type'        => 'dimension',
				'label'       => 'Font Large',
				'projections' => [ 'kadence_slot' => 'lg' ],
			]
		);

		$bridge = $this->bridge_for( [] );
		$result = $bridge->font_sizes( $this->default_font_sizes );

		$this->assertSame( $this->default_font_sizes['lg'], $result['lg'] );
	}

	// ---- Theme guard (must run last — defines Kadence\Theme stub) ----------------------------------------

	public function testGlobalColorsIsNoOpWhenKadenceThemeIsActive(): void {
		$id = 'semantic.color.button-bg';

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'kadence_slot' => 'palette1' ],
			]
		);

		$bridge = $this->bridge_for( $this->color_baseline( $id, '#3182CE' ) );

		// Define a stub so class_exists('Kadence\Theme') returns true.
		if ( ! class_exists( 'Kadence\Theme' ) ) {
			// phpcs:ignore Squiz.PHP.Eval.Discouraged
			eval( 'namespace Kadence; class Theme {}' );
		}

		$result = $bridge->global_colors( $this->default_colors );

		$this->assertSame( $this->default_colors, $result );
	}

	public function testFontSizesIsUnaffectedByKadenceTheme(): void {
		$id = 'semantic.dimension.font-sm';

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'dimension',
				'label'       => 'Font Small',
				'projections' => [ 'kadence_slot' => 'sm' ],
			]
		);

		$baseline = [
			'semantic' => [
				'dimension' => [
					'font-sm' => [
						'$type'  => 'dimension',
						'$value' => '0.875rem',
					],
				],
			],
		];
		$bridge   = $this->bridge_for( $baseline );

		// Kadence\Theme may or may not be defined — font_sizes() never checks for it.
		$result = $bridge->font_sizes( $this->default_font_sizes );

		$this->assertStringContainsString( '0.875rem', $result['sm'] );
	}
}
