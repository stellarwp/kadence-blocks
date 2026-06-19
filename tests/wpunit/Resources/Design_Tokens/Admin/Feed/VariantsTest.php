<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Variants;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use Tests\Support\Classes\TestCase;

/**
 * Exercises Variants against the real shipped baseline, so these assertions also guard the
 * baseline's Button variant definitions.
 */
final class VariantsTest extends TestCase {

	private const BUTTON = 'kadence/singlebtn';

	private Variant_Resolver $resolver;

	protected function setUp(): void {
		parent::setUp();

		$this->resolver = $this->container->get( Variant_Resolver::class );
	}

	/**
	 * @return void
	 */
	public function testItBuildsStructureAndResolvedValuesForTheShippedButton(): void {
		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );

		$variants = ( new Variants( $registry, $this->resolver ) )->all();

		$this->assertArrayHasKey( self::BUTTON, $variants );

		$button = $variants[ self::BUTTON ];

		// Bindings and the bound-property union are block-wide.
		$this->assertArrayHasKey( 'bindings', $button );
		$this->assertArrayHasKey( 'button-bg', $button['bindings'] );
		$this->assertContains( 'button-bg', $button['properties'] );

		// The shipped Button is flat: one implicit group carries the default, names and resolved values.
		$this->assertCount( 1, $button['groups'] );

		$group = $button['groups'][0];

		$this->assertTrue( $group['implicit'] );
		$this->assertSame( 'primary', $group['default'] );
		$this->assertSame( [ 'primary', 'secondary' ], $group['names'] );

		// Resolved preview values per variant — aliases flattened to their primitive color.
		$this->assertSame( '#3633e1', $group['values']['primary']['button-bg'] );
		$this->assertSame( '#1A202C', $group['values']['secondary']['button-bg'] );
	}

	/**
	 * @return void
	 */
	public function testABlockRegisteredButAbsentFromTheDocumentIsSkipped(): void {
		// A fresh registry whose only variant set has no matching variants in the shipped baseline.
		$registry = new Token_Registry();
		$registry->register_variant_set( [ 'block' => 'kadence/not-a-real-block' ] );

		$variants = ( new Variants( $registry, $this->resolver ) )->all();

		$this->assertSame( [], $variants );
	}
}
