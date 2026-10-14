<?php declare( strict_types=1 );
// cspell:ignore designTokens colorPalettes .

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Palettes;
use Tests\Support\Classes\TestCase;

/**
 * Covers the effective palettes reader: the shipped baseline's colorPalettes deep-merged with the stored
 * overrides, its `$current` / `$default` pointer resolution, and the resolve-time overlay diff. The baseline
 * ships only the `default` palette, so the non-default cases define their own local palette to switch to.
 */
final class Effective_PalettesTest extends TestCase {

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @var Effective_Palettes
	 */
	private Effective_Palettes $palettes;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->store    = $this->container->get( Token_Store::class );
		$this->palettes = $this->container->get( Effective_Palettes::class );
	}

	/**
	 * With nothing stored, the reader returns the sole shipped baseline palette (`default`) and its pointers.
	 *
	 * @return void
	 */
	public function testItReturnsTheBaselinePalettesWhenNothingIsStored(): void {
		$ids = $this->palettes->palette_ids();

		$this->assertContains( 'default', $ids );

		$this->assertSame( 'default', $this->palettes->default_palette() );
		$this->assertSame( 'default', $this->palettes->current() );
	}

	/**
	 * The default palette flattens to the baseline color values, keyed by the token each swatch sets.
	 *
	 * @return void
	 */
	public function testTheDefaultPaletteFlattensToTheBaselineColors(): void {
		$values = $this->palettes->swatch_values( 'default' );

		$this->assertSame( '#3182CE', $values['primitive.color.brand.primary'] );
		$this->assertSame( '#1A202C', $values['primitive.color.neutral.900'] );
	}

	/**
	 * The resolve-time overlay is empty when nothing palette-specific is stored: the default palette equals
	 * the baseline, so its diff contributes no re-tint (and so never clobbers a direct override).
	 *
	 * @return void
	 */
	public function testTheOverlayIsEmptyForTheShippedDefaultPalette(): void {
		$this->assertSame( [], $this->palettes->overlay_for_overrides( [] ) );
	}

	/**
	 * Pointing `$current` at a non-default palette makes the overlay carry that palette's swatches that
	 * differ from the baseline — the color re-tint the resolver applies at `:root`.
	 *
	 * @return void
	 */
	public function testPointingCurrentAtANonDefaultPaletteBuildsTheOverlay(): void {
		$overlay = $this->palettes->overlay_for_overrides( $this->custom_palette_overrides() );

		// The custom palette re-tints the brand accents (its swatches differ from the baseline default palette).
		$this->assertSame( '#DD6B20', $overlay['primitive.color.brand.primary'] );
		$this->assertSame( '#C05621', $overlay['primitive.color.brand.secondary'] );
		$this->assertSame( '#F6AD55', $overlay['primitive.color.brand.accent'] );

		// It does not touch the neutral ramp — the custom palette defines no swatch for it.
		$this->assertArrayNotHasKey( 'primitive.color.neutral.900', $overlay );
	}

	/**
	 * The effective colors for a partial palette are the default palette overlaid with its own deltas: the
	 * palette's own swatch (brand) wins, while a token it omits (a neutral) falls back to the default value. This
	 * is the complete color set the per-block switch layer emits.
	 *
	 * @return void
	 */
	public function testEffectiveSwatchValuesOverlayThePaletteOverTheDefault(): void {
		$this->store->save_document( (string) wp_json_encode( $this->custom_palette_overrides() ), 'default' );

		$effective = $this->palettes->effective_swatch_values( 'custom' );

		// The custom palette's own delta wins for the brand + button colors it defines.
		$this->assertSame( '#DD6B20', $effective['primitive.color.brand.primary'] );
		$this->assertSame( '#DD6B20', $effective['primitive.color.brand.button'] );

		// A token the custom palette omits falls back to the default palette's value (a complete set).
		$this->assertSame( '#1A202C', $effective['primitive.color.neutral.900'] );
		$this->assertSame( '#E2E8F0', $effective['primitive.color.neutral.200'] );
	}

	/**
	 * A stored override can add a new palette alongside the baseline ones, and `$current` selects it.
	 *
	 * @return void
	 */
	public function testAStoredOverrideAddsAPaletteAndCurrentSelectsIt(): void {
		$this->store->save_document(
			(string) wp_json_encode(
				[
					'$extensions' => [
						'com.kadence.designTokens' => [
							'colorPalettes' => [
								'$current' => 'midnight',
								'midnight' => [
									'label'  => 'Midnight',
									'groups' => [
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
									],
								],
							],
						],
					],
				]
			),
			'default'
		);

		$this->assertContains( 'midnight', $this->palettes->palette_ids() );
		$this->assertSame( 'midnight', $this->palettes->current() );
		$this->assertSame( '#0b1020', $this->palettes->current_swatch_values()['primitive.color.brand.primary'] );
	}

	/**
	 * A stored default palette whose groups list is SHORTER than the baseline's replaces it wholesale: the
	 * removed swatch is gone, and the baseline's tail swatch is not left behind as a duplicate of its
	 * successor.
	 *
	 * The merge descends a swatches list positionally, so without the structure replace, dropping the
	 * fourth of five swatches shifts the fifth onto index 3 and leaves the baseline's index 4 untouched —
	 * the removed swatch reappears, the survivor is listed twice, and the duplicate then trips the palette
	 * write's own no-repeated-token guard, wedging every later save.
	 *
	 * @return void
	 */
	public function testAStoredDefaultPaletteReplacesTheBaselineGroups(): void {
		$this->store->save_document(
			(string) wp_json_encode( $this->default_palette_overrides( [ $this->accent_group_without_the_button_swatch() ] ) ),
			'default'
		);

		$tokens = $this->swatch_tokens_of_group( 'default', 'accent' );

		$this->assertNotContains( 'primitive.color.brand.button', $tokens, 'A removed swatch must not survive the baseline merge.' );
		$this->assertSame( array_unique( $tokens ), $tokens, 'The baseline tail swatch must not be left behind as a duplicate.' );
		$this->assertSame(
			[
				'primitive.color.brand.primary',
				'primitive.color.brand.secondary',
				'primitive.color.brand.accent',
				'primitive.color.brand.button-hover',
			],
			$tokens
		);
	}

	/**
	 * The same structure replace applies to whole groups: a stored default palette carrying fewer groups than
	 * the baseline does not leak the baseline's trailing groups back into the effective section.
	 *
	 * @return void
	 */
	public function testAStoredDefaultPaletteDroppingGroupsDoesNotLeakTheBaselineTail(): void {
		$this->store->save_document(
			(string) wp_json_encode( $this->default_palette_overrides( [ $this->accent_group_without_the_button_swatch() ] ) ),
			'default'
		);

		$node   = $this->palettes->palette( 'default' ) ?? [];
		$groups = $node['groups'] ?? [];

		$this->assertIsArray( $groups );
		$this->assertCount( 1, $groups, 'Only the stored group may survive; the baseline groups after it are superseded.' );
		$this->assertSame( 'accent', $groups[0]['id'] );
	}

	/**
	 * An override that only relabels a baseline palette keeps that palette's baseline groups — the structure
	 * replace is scoped to a stored node that actually defines `groups`.
	 *
	 * @return void
	 */
	public function testRelabelingABaselinePaletteKeepsItsBaselineGroups(): void {
		$this->store->save_document(
			(string) wp_json_encode(
				[
					'$extensions' => [
						'com.kadence.designTokens' => [
							'colorPalettes' => [
								'default' => [ 'label' => 'Renamed' ],
							],
						],
					],
				]
			),
			'default'
		);

		$node = $this->palettes->palette( 'default' ) ?? [];

		$this->assertSame( 'Renamed', $node['label'] );
		$this->assertSame( '#3633e1', $this->palettes->swatch_values( 'default' )['primitive.color.brand.button'] );
	}

	/**
	 * The baseline swatch values expose the shipped colors regardless of what a library has stored over them —
	 * a palette edited away from the baseline, or one with the swatch removed outright, does not move them.
	 *
	 * @return void
	 */
	public function testBaselineSwatchValuesExposesTheShippedColors(): void {
		$this->store->save_document(
			(string) wp_json_encode( $this->default_palette_overrides( [ $this->accent_group_without_the_button_swatch() ] ) ),
			'default'
		);

		$baseline = $this->palettes->baseline_swatch_values();

		$this->assertSame( '#3633e1', $baseline['primitive.color.brand.button'] );
		$this->assertSame( '#3182CE', $baseline['primitive.color.brand.primary'] );
		$this->assertSame( '#ffffff', $baseline['primitive.color.neutral.0'] );
	}

	/**
	 * The key set is the shipped palette's SWATCHES, not the registered color tokens: a color the registry
	 * knows but the shipped palette lists no swatch for is absent, which is what keeps such a swatch
	 * deletable rather than permanent.
	 *
	 * @return void
	 */
	public function testBaselineSwatchValuesCoversOnlyTheShippedSwatches(): void {
		$baseline = $this->palettes->baseline_swatch_values();

		$this->assertArrayHasKey( 'primitive.color.brand.button', $baseline );
		$this->assertArrayHasKey( 'primitive.color.neutral.0', $baseline );

		// Registered and projected into a palette slot, but the shipped palette lists no swatch for it.
		$this->assertArrayNotHasKey( 'primitive.color.neutral.600', $baseline );
		$this->assertArrayNotHasKey( 'primitive.color.custom.abc123', $baseline );
	}

	/**
	 * A stored-overrides document that replaces the default palette's structure with the given groups.
	 *
	 * @param array<int, mixed> $groups The groups list to store on the default palette.
	 *
	 * @return array<string, mixed> The decoded overrides document.
	 */
	private function default_palette_overrides( array $groups ): array {
		return [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'colorPalettes' => [
						'default' => [
							'label'  => 'Default',
							'groups' => $groups,
						],
					],
				],
			],
		];
	}

	/**
	 * The baseline's Accent group with its fourth swatch (Button) removed — a group one shorter than the
	 * baseline's, which is what makes the positional merge observable.
	 *
	 * @return array<string, mixed> The group node.
	 */
	private function accent_group_without_the_button_swatch(): array {
		return [
			'id'       => 'accent',
			'label'    => 'Accent',
			'swatches' => [
				[
					'token'  => 'primitive.color.brand.primary',
					'label'  => 'Main 1',
					'$value' => '#3182CE',
				],
				[
					'token'  => 'primitive.color.brand.secondary',
					'label'  => 'Main 2',
					'$value' => '#2B6CB0',
				],
				[
					'token'  => 'primitive.color.brand.accent',
					'label'  => 'Main 3',
					'$value' => '#ED8936',
				],
				[
					'token'  => 'primitive.color.brand.button-hover',
					'label'  => 'Button Hover',
					'$value' => '#2f2ffc',
				],
			],
		];
	}

	/**
	 * The ordered swatch tokens of one group in a palette's effective node.
	 *
	 * @param string $palette_id The palette id.
	 * @param string $group_id   The group id.
	 *
	 * @return string[] The swatch token dot-paths, in order.
	 */
	private function swatch_tokens_of_group( string $palette_id, string $group_id ): array {
		$node   = $this->palettes->palette( $palette_id ) ?? [];
		$groups = $node['groups'] ?? [];
		$tokens = [];

		if ( ! is_array( $groups ) ) {
			return $tokens;
		}

		foreach ( $groups as $group ) {
			if ( ! is_array( $group ) || ( $group['id'] ?? null ) !== $group_id ) {
				continue;
			}

			foreach ( $group['swatches'] ?? [] as $swatch ) {
				$tokens[] = (string) $swatch['token'];
			}
		}

		return $tokens;
	}

	/**
	 * A stored-overrides document that defines a non-default "custom" palette — brand + button deltas only, no
	 * neutral ramp — pointing `$current` at it. The baseline ships only the `default` palette, so the non-default
	 * cases own the palette they switch to instead of leaning on a baseline placeholder.
	 *
	 * @return array<string, mixed> The decoded overrides document.
	 */
	private function custom_palette_overrides(): array {
		return [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'colorPalettes' => [
						'$current' => 'custom',
						'custom'   => [
							'label'  => 'Custom',
							'groups' => [
								[
									'id'       => 'accent',
									'label'    => 'Accent',
									'swatches' => [
										[
											'token'  => 'primitive.color.brand.primary',
											'label'  => 'Main 1',
											'$value' => '#DD6B20',
										],
										[
											'token'  => 'primitive.color.brand.secondary',
											'label'  => 'Main 2',
											'$value' => '#C05621',
										],
										[
											'token'  => 'primitive.color.brand.accent',
											'label'  => 'Main 3',
											'$value' => '#F6AD55',
										],
										[
											'token'  => 'primitive.color.brand.button',
											'label'  => 'Button',
											'$value' => '#DD6B20',
										],
										[
											'token'  => 'primitive.color.brand.button-hover',
											'label'  => 'Button Hover',
											'$value' => '#C05621',
										],
									],
								],
							],
						],
					],
				],
			],
		];
	}
}
