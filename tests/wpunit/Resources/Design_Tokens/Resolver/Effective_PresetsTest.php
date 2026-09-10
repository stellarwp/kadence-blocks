<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Presets;
use Tests\Support\Classes\TestCase;

/**
 * Covers the effective presets reader: the shipped baseline's presets deep-merged with the stored
 * overrides, asserted against the real baseline so these also guard its preset definitions.
 */
final class Effective_PresetsTest extends TestCase {

	private const BUTTON = 'kadence/singlebtn';

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @var Effective_Presets
	 */
	private Effective_Presets $presets;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->store   = $this->container->get( Token_Store::class );
		$this->presets = $this->container->get( Effective_Presets::class );
	}

	/**
	 * @return void
	 */
	public function testItReturnsTheBaselinePresetsWhenNothingIsStored(): void {
		$node = $this->presets->block( self::BUTTON );

		$this->assertIsArray( $node );
		$this->assertSame( 'default', $node['$default'] );
		$this->assertArrayHasKey( 'default', $node );
	}

	/**
	 * @return void
	 */
	public function testAStoredOverrideAddsAPresetAlongsideTheBaselineOnes(): void {
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"presets":{"kadence/singlebtn":{'
			. '"outline":{"label":"Outline","tokens":{"button-bg":"transparent"}}}}}}}'
		);

		$node = $this->presets->block( self::BUTTON );

		$this->assertIsArray( $node );
		// The override-only preset appears next to the baseline ones.
		$this->assertArrayHasKey( 'outline', $node );
		$this->assertSame( 'Outline', $node['outline']['label'] );
		$this->assertArrayHasKey( 'default', $node );
	}

	/**
	 * @return void
	 */
	public function testAStoredOverrideMergesIntoAPresetsTokensPerProperty(): void {
		// Override just one property of the baseline "default" preset.
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"presets":{"kadence/singlebtn":{'
			. '"default":{"tokens":{"button-bg":"#000000"}}}}}}}'
		);

		$default = $this->presets->block( self::BUTTON )['default'];

		// The overridden property wins; the preset's other baseline tokens and its label survive.
		$this->assertSame( '#000000', $default['tokens']['button-bg'] );
		$this->assertSame( '{semantic.color.button-text}', $default['tokens']['button-text'] );
		$this->assertSame( 'Default', $default['label'] );
	}

	/**
	 * @return void
	 */
	public function testForOverridesMergesACandidateWithoutTouchingTheStore(): void {
		$candidate = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'presets' => [
						self::BUTTON => [
							'outline' => [ 'tokens' => [ 'button-bg' => 'transparent' ] ],
						],
					],
				],
			],
		];

		$section = $this->presets->for_overrides( $candidate );

		$this->assertArrayHasKey( 'outline', $section[ self::BUTTON ] );
		$this->assertArrayHasKey( 'default', $section[ self::BUTTON ] );
		// The store was never written.
		$this->assertSame( '', $this->store->get_document( Token_Store::default_slug() ) );
	}

	/**
	 * @return void
	 */
	public function testItReturnsNullForABlockWithNoPresets(): void {
		$this->assertNull( $this->presets->block( 'kadence/not-a-block' ) );
	}

	/**
	 * user_created() reports the override-only preset slugs: a baseline preset is excluded, an override-only
	 * one is included, and a slug that shadows a baseline preset is excluded (deleting it reverts to
	 * baseline rather than removing it).
	 *
	 * @return void
	 */
	public function testUserCreatedReportsOverrideOnlyPresets(): void {
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"presets":{"kadence/singlebtn":{'
			. '"outline":{"label":"Outline","tokens":{"button-bg":"transparent"}},'
			. '"default":{"tokens":{"button-bg":"#000000"}}}}}}}'
		);

		$user_created = $this->presets->user_created( self::BUTTON, 'default' );

		$this->assertContains( 'outline', $user_created );
		// "default" shadows the baseline preset, so it is not user-created.
		$this->assertNotContains( 'default', $user_created );
	}

	/**
	 * A baseline-only preset (nothing stored for it at all) has no OWN stored tokens, even though
	 * `block()`'s merged view resolves every one of its properties from the baseline.
	 *
	 * @return void
	 */
	public function testStoredTokensIsEmptyForABaselinePresetWithNoStoredOverridesRow(): void {
		$this->assertSame( [], $this->presets->stored_tokens( self::BUTTON, 'default' ) );
	}

	/**
	 * A stored override of just one property surfaces ONLY that property's key — not the other
	 * properties the merged view resolves from the baseline for the same preset slug.
	 *
	 * @return void
	 */
	public function testStoredTokensSurfacesOnlyTheOverriddenPropertyOfAPartiallyOverriddenPreset(): void {
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"presets":{"kadence/singlebtn":{'
			. '"default":{"tokens":{"button-bg":"#000000"}}}}}}}'
		);

		$stored = $this->presets->stored_tokens( self::BUTTON, 'default' );

		$this->assertSame( [ 'button-bg' => '#000000' ], $stored );
		$this->assertArrayNotHasKey( 'button-text', $stored );
	}

	/**
	 * An override-only preset's stored tokens are its full authored map, exactly as saved.
	 *
	 * @return void
	 */
	public function testStoredTokensReturnsTheFullMapForAnOverrideOnlyPreset(): void {
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"presets":{"kadence/singlebtn":{'
			. '"outline":{"label":"Outline","tokens":{"button-bg":"transparent","button-text":"#000000"}}'
			. '}}}}}'
		);

		$stored = $this->presets->stored_tokens( self::BUTTON, 'outline' );

		$this->assertSame(
			[
				'button-bg'   => 'transparent',
				'button-text' => '#000000',
			],
			$stored
		);
	}

	/**
	 * A preset slug that does not exist at all, in either the baseline or the overrides, has no stored
	 * tokens.
	 *
	 * @return void
	 */
	public function testStoredTokensIsEmptyForAnUnknownPresetSlug(): void {
		$this->assertSame( [], $this->presets->stored_tokens( self::BUTTON, 'not-a-preset' ) );
	}
}
