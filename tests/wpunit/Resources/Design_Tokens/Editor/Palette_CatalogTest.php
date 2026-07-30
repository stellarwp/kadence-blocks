<?php declare( strict_types=1 );
// cspell:ignore designTokens colorPalettes .

namespace Tests\wpunit\Resources\Design_Tokens\Editor;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Editor\Palette_Catalog;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the editor color-palette catalog the block editor reads (localized to
 * window.kadenceDesignTokensPalettes) to render the per-block palette selector: the `all()` output shape
 * against the shipped baseline, and the label fallback when a palette node carries no usable string label.
 */
final class Palette_CatalogTest extends TestCase {

	/**
	 * The palette id used by the label-fallback cases, so the expected fallback label is this same id.
	 *
	 * @var string
	 */
	private const PALETTE = 'ghost';

	/**
	 * @var Palette_Catalog
	 */
	private Palette_Catalog $catalog;

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->catalog = $this->container->get( Palette_Catalog::class );
		$this->store   = $this->container->get( Token_Store::class );
	}

	/**
	 * With nothing stored, the catalog reports the active library slug, its `$current` palette id, and the
	 * shipped baseline palettes each as a `{ id, label }` pair with a non-empty string label.
	 *
	 * @return void
	 */
	public function testItBuildsTheCatalogShapeForTheActiveLibrary(): void {
		$catalog = $this->catalog->all();

		$this->assertSame( Token_Store::default_slug(), $catalog['active'] );
		$this->assertSame( 'default', $catalog['current'] );

		$ids = array_column( $catalog['palettes'], 'id' );
		$this->assertContains( 'default', $ids );
		$this->assertContains( 'sunset', $ids );
		$this->assertContains( 'forest', $ids );

		// Every entry is a { id, label } pair with a non-empty string label.
		foreach ( $catalog['palettes'] as $palette ) {
			$this->assertSame( [ 'id', 'label' ], array_keys( $palette ) );
			$this->assertIsString( $palette['id'] );
			$this->assertIsString( $palette['label'] );
			$this->assertNotSame( '', $palette['label'] );
		}
	}

	/**
	 * A stored palette's string `label` is carried through to the catalog verbatim.
	 *
	 * @return void
	 */
	public function testItUsesTheStoredStringLabelForAPalette(): void {
		$this->seedPalette(
			[
				'label'  => 'Ghostly',
				'groups' => $this->groups(),
			]
		);

		$this->assertSame( 'Ghostly', $this->labelFor( self::PALETTE ) );
	}

	/**
	 * A palette node with no usable string label falls back to the palette id as its label, so the picker
	 * always has something to render.
	 *
	 * @dataProvider labelFallbackProvider
	 *
	 * @param array<string, mixed> $node The stored palette node under the palette id.
	 *
	 * @return void
	 */
	public function testItFallsBackToThePaletteIdWhenTheLabelIsNotAUsableString( array $node ): void {
		$this->seedPalette( $node );

		$this->assertSame( self::PALETTE, $this->labelFor( self::PALETTE ) );
	}

	/**
	 * Palette nodes whose label is unusable — absent, a non-string, or an empty string — so `all()` must
	 * fall back to the palette id.
	 *
	 * @return Generator
	 */
	public function labelFallbackProvider(): Generator {
		yield 'missing label' => [
			'node' => [ 'groups' => $this->groups() ],
		];

		yield 'non-string label' => [
			'node' => [
				'label'  => [ 'not', 'a', 'string' ],
				'groups' => $this->groups(),
			],
		];

		yield 'empty string label' => [
			'node' => [
				'label'  => '',
				'groups' => $this->groups(),
			],
		];
	}

	/**
	 * Store a single palette node under {@see self::PALETTE} in the default library's colorPalettes section.
	 *
	 * @param array<string, mixed> $node The palette node to store (label and/or groups).
	 *
	 * @return void
	 */
	private function seedPalette( array $node ): void {
		$this->store->save_document(
			(string) wp_json_encode(
				[
					'$extensions' => [
						'com.kadence.designTokens' => [
							'colorPalettes' => [
								self::PALETTE => $node,
							],
						],
					],
				]
			),
			Token_Store::default_slug()
		);
	}

	/**
	 * The catalog label reported for a palette id, or null when the id is absent from `all()`.
	 *
	 * @param string $id The palette id to look up.
	 *
	 * @return string|null
	 */
	private function labelFor( string $id ): ?string {
		foreach ( $this->catalog->all()['palettes'] as $palette ) {
			if ( $palette['id'] === $id ) {
				return $palette['label'];
			}
		}

		return null;
	}

	/**
	 * A minimal one-swatch group list, so a seeded palette resembles a real one.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	private function groups(): array {
		return [
			[
				'id'       => 'accent',
				'label'    => 'Accent',
				'swatches' => [
					[
						'token'  => 'primitive.color.brand.primary',
						'label'  => 'Main 1',
						'$value' => '#0b1020',
					],
				],
			],
		];
	}
}
