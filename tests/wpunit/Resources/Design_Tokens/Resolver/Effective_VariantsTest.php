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

	private const BUTTON = 'kadence/advancedbtn';

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
		$this->assertArrayHasKey( 'ghost', $node );
	}

	/**
	 * @return void
	 */
	public function testAStoredOverrideAddsAVariantAlongsideTheBaselineOnes(): void {
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"variants":{"kadence/advancedbtn":{'
			. '"outline":{"label":"Outline","tokens":{"button-bg":"transparent"}}}}}}}'
		);

		$node = $this->variants->block( self::BUTTON );

		$this->assertIsArray( $node );
		// The override-only variant appears next to the baseline ones.
		$this->assertArrayHasKey( 'outline', $node );
		$this->assertSame( 'Outline', $node['outline']['label'] );
		$this->assertArrayHasKey( 'primary', $node );
		$this->assertArrayHasKey( 'ghost', $node );
	}

	/**
	 * @return void
	 */
	public function testAStoredOverrideMergesIntoAVariantsTokensPerProperty(): void {
		// Override just one property of the baseline "ghost" variant.
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"variants":{"kadence/advancedbtn":{'
			. '"ghost":{"tokens":{"button-bg":"#000000"}}}}}}}'
		);

		$ghost = $this->variants->block( self::BUTTON )['ghost'];

		// The overridden property wins; the variant's other baseline tokens and its label survive.
		$this->assertSame( '#000000', $ghost['tokens']['button-bg'] );
		$this->assertSame( '{primitive.color.brand.primary}', $ghost['tokens']['button-text'] );
		$this->assertSame( 'Ghost', $ghost['label'] );
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
}
