<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Variants;
use Tests\Support\Classes\TestCase;

/**
 * Covers the effective variants reader: the shipped baseline's variants deep-merged with the stored
 * overrides, asserted against the real baseline so these also guard its variant definitions.
 */
final class Effective_VariantsTest extends TestCase {

	private const BUTTON = 'kadence/singlebtn';

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @var Effective_Variants
	 */
	private Effective_Variants $variants;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->store    = $this->container->get( Token_Store::class );
		$this->variants = $this->container->get( Effective_Variants::class );
	}

	/**
	 * @return void
	 */
	public function testItReturnsTheBaselineVariantsWhenNothingIsStored(): void {
		$node = $this->variants->block( self::BUTTON );

		$this->assertIsArray( $node );
		$this->assertSame( 'primary', $node['$default'] );
		$this->assertArrayHasKey( 'primary', $node );
		$this->assertArrayHasKey( 'secondary', $node );
	}

	/**
	 * @return void
	 */
	public function testAStoredOverrideAddsAVariantAlongsideTheBaselineOnes(): void {
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"variants":{"kadence/singlebtn":{'
			. '"outline":{"label":"Outline","tokens":{"button-bg":"transparent"}}}}}}}'
		);

		$node = $this->variants->block( self::BUTTON );

		$this->assertIsArray( $node );
		// The override-only variant appears next to the baseline ones.
		$this->assertArrayHasKey( 'outline', $node );
		$this->assertSame( 'Outline', $node['outline']['label'] );
		$this->assertArrayHasKey( 'primary', $node );
		$this->assertArrayHasKey( 'secondary', $node );
	}

	/**
	 * @return void
	 */
	public function testAStoredOverrideMergesIntoAVariantsTokensPerProperty(): void {
		// Override just one property of the baseline "secondary" variant.
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"variants":{"kadence/singlebtn":{'
			. '"secondary":{"tokens":{"button-bg":"#000000"}}}}}}}'
		);

		$secondary = $this->variants->block( self::BUTTON )['secondary'];

		// The overridden property wins; the variant's other baseline tokens and its label survive.
		$this->assertSame( '#000000', $secondary['tokens']['button-bg'] );
		$this->assertSame( '{semantic.color.button-secondary-text}', $secondary['tokens']['button-text'] );
		$this->assertSame( 'Secondary', $secondary['label'] );
	}

	/**
	 * @return void
	 */
	public function testForOverridesMergesACandidateWithoutTouchingTheStore(): void {
		$candidate = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'variants' => [
						self::BUTTON => [
							'outline' => [ 'tokens' => [ 'button-bg' => 'transparent' ] ],
						],
					],
				],
			],
		];

		$section = $this->variants->for_overrides( $candidate );

		$this->assertArrayHasKey( 'outline', $section[ self::BUTTON ] );
		$this->assertArrayHasKey( 'primary', $section[ self::BUTTON ] );
		// The store was never written.
		$this->assertSame( '', $this->store->get_document( Token_Store::default_slug() ) );
	}

	/**
	 * @return void
	 */
	public function testItReturnsNullForABlockWithNoVariants(): void {
		$this->assertNull( $this->variants->block( 'kadence/not-a-block' ) );
	}

	/**
	 * user_created() reports the override-only variant slugs: a baseline variant is excluded, an override-only
	 * one is included, and a slug that shadows a baseline variant is excluded (deleting it reverts to
	 * baseline rather than removing it).
	 *
	 * @return void
	 */
	public function testUserCreatedReportsOverrideOnlyVariants(): void {
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"variants":{"kadence/singlebtn":{'
			. '"outline":{"label":"Outline","tokens":{"button-bg":"transparent"}},'
			. '"secondary":{"tokens":{"button-bg":"#000000"}}}}}}}'
		);

		$user_created = $this->variants->user_created( self::BUTTON );

		$this->assertContains( 'outline', $user_created );
		$this->assertNotContains( 'primary', $user_created );
		// "secondary" shadows a baseline variant, so it is not user-created.
		$this->assertNotContains( 'secondary', $user_created );
	}
}
