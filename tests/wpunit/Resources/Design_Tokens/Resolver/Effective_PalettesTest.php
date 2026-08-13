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
