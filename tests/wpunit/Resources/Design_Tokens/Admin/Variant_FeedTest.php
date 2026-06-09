<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Admin;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Variant_Feed;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use Tests\Support\Classes\TestCase;

/**
 * Exercises Variant_Feed against the real shipped baseline, so these assertions also guard the
 * baseline's Button variant definitions.
 */
final class Variant_FeedTest extends TestCase {

	private const BUTTON = 'kadence/advancedbtn';

	private Variant_Resolver $resolver;

	protected function setUp(): void {
		parent::setUp();

		$this->resolver = $this->container->get( Variant_Resolver::class );
	}

	public function testItBuildsStructureAndResolvedValuesForTheShippedButton(): void {
		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );

		$variants = ( new Variant_Feed( $registry, $this->resolver ) )->all();

		$this->assertArrayHasKey( self::BUTTON, $variants );

		$button = $variants[ self::BUTTON ];

		$this->assertSame( 'primary', $button['default'] );
		$this->assertSame( [ 'primary', 'secondary', 'ghost' ], $button['names'] );
		$this->assertContains( 'button-bg', $button['properties'] );

		// Structure: bindings carry the token reference / inline targets.
		$this->assertArrayHasKey( 'bindings', $button );
		$this->assertArrayHasKey( 'button-bg', $button['bindings'] );

		// Resolved preview values per variant — aliases flattened, literals passed through.
		$this->assertSame( '#3182CE', $button['values']['primary']['button-bg'] );
		$this->assertSame( 'transparent', $button['values']['ghost']['button-bg'] );
	}

	public function testABlockRegisteredButAbsentFromTheDocumentIsSkipped(): void {
		// A fresh registry whose only variant set has no matching variants in the shipped baseline.
		$registry = new Token_Registry();
		$registry->register_variant_set( [ 'block' => 'kadence/not-a-real-block' ] );

		$variants = ( new Variant_Feed( $registry, $this->resolver ) )->all();

		$this->assertSame( [], $variants );
	}
}
