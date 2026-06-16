<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Editor\Variant_Catalog;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the editor variant catalog against the real shipped baseline, so these assertions also
 * guard the Button variant set the picker offers.
 */
final class Variant_CatalogTest extends TestCase {

	private const BUTTON = 'kadence/singlebtn';

	private Variant_Resolver $resolver;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->resolver = $this->container->get( Variant_Resolver::class );
	}

	/**
	 * The shipped Button reports its default and its named variants as { slug, label } for the picker.
	 *
	 * @return void
	 */
	public function testItBuildsTheButtonCatalog(): void {
		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );

		$catalog = ( new Variant_Catalog( $registry, $this->resolver ) )->all();

		$this->assertArrayHasKey( self::BUTTON, $catalog );

		$button = $catalog[ self::BUTTON ];

		$this->assertSame( 'primary', $button['default'] );
		$this->assertSame(
			[
				[ 'slug' => 'primary', 'label' => 'Primary' ],
				[ 'slug' => 'secondary', 'label' => 'Secondary' ],
			],
			$button['variants']
		);
	}

	/**
	 * A block registered but absent from the document is skipped rather than emitted empty.
	 *
	 * @return void
	 */
	public function testItSkipsABlockAbsentFromTheDocument(): void {
		$registry = new Token_Registry();
		$registry->register_variant_set( [ 'block' => 'kadence/not-a-real-block' ] );

		$catalog = ( new Variant_Catalog( $registry, $this->resolver ) )->all();

		$this->assertSame( [], $catalog );
	}
}
