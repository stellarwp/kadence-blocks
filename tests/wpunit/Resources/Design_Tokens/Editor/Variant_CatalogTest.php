<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Set_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Editor\Variant_Catalog;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Variants;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the editor variant catalog against the real shipped baseline, so these assertions also
 * guard the Button variant set the picker offers.
 */
final class Variant_CatalogTest extends TestCase {

	private const BUTTON = 'kadence/singlebtn';

	/**
	 * @var Variant_Catalog
	 */
	private Variant_Catalog $catalog;

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->catalog = $this->container->get( Variant_Catalog::class );
		$this->store   = $this->container->get( Token_Store::class );
	}

	/**
	 * The catalog reports the active set and, per set, the shipped Button's default and its named variants as
	 * { slug, label, userCreated }, plus the picker control label and the controllable surface.
	 *
	 * @return void
	 */
	public function testItBuildsTheButtonCatalogForTheDefaultSet(): void {
		$catalog = $this->catalog->all();

		$this->assertSame( Token_Store::default_slug(), $catalog['active'] );
		$this->assertArrayHasKey( self::BUTTON, $catalog['sets'][ Token_Store::default_slug() ] );

		$button = $catalog['sets'][ Token_Store::default_slug() ][ self::BUTTON ];

		$this->assertSame( 'primary', $button['default'] );
		// The picker's control label, declared on the variant set in declarations.php.
		$this->assertSame( 'Style', $button['label'] );
		$this->assertSame(
			[
				[
					'slug'        => 'primary',
					'label'       => 'Primary',
					'userCreated' => false,
				],
				[
					'slug'        => 'secondary',
					'label'       => 'Secondary',
					'userCreated' => false,
				],
			],
			$button['variants']
		);
	}

	/**
	 * The per-block surface lists every bound property with its coarse input kind, so a color property reads
	 * as "color" and the radius property as "dimension".
	 *
	 * @return void
	 */
	public function testItExposesTheControllableSurface(): void {
		$properties = $this->catalog->all()['sets'][ Token_Store::default_slug() ][ self::BUTTON ]['properties'];

		$kinds = wp_list_pluck( $properties, 'kind', 'key' );

		$this->assertSame( 'color', $kinds['button-bg'] );
		$this->assertSame( 'dimension', $kinds['button-radius'] );
	}

	/**
	 * A variant authored into a set is flagged userCreated, while the baseline variants are not.
	 *
	 * @return void
	 */
	public function testItFlagsUserCreatedVariants(): void {
		$this->store->save_document(
			'{"$extensions":{"com.kadence.designTokens":{"variants":{"kadence/singlebtn":{'
			. '"accent":{"label":"Accent","tokens":{"button-bg":"#ff0000"}}}}}}}'
		);

		$variants = $this->catalog->all()['sets'][ Token_Store::default_slug() ][ self::BUTTON ]['variants'];
		$flags    = wp_list_pluck( $variants, 'userCreated', 'slug' );

		$this->assertTrue( $flags['accent'] );
		$this->assertFalse( $flags['primary'] );
	}

	/**
	 * A block registered but absent from a set is skipped rather than emitted empty.
	 *
	 * @return void
	 */
	public function testItSkipsABlockAbsentFromTheDocument(): void {
		// A picker set (it declares a label) whose block has no variants in the baseline — the names() lookup
		// throws Unknown_Variant_Exception and the block is skipped rather than emitted empty.
		$registry = new Token_Registry();
		$registry->register_variant_set( [ 'block' => 'kadence/not-a-real-block', 'label' => 'Style' ] );

		$catalog = ( new Variant_Catalog(
			$registry,
			$this->container->get( Variant_Resolver::class ),
			$this->store,
			$this->container->get( Active_Set_Store::class ),
			$this->container->get( Effective_Variants::class )
		) )->all();

		$this->assertSame( [], $catalog['sets'][ Token_Store::default_slug() ] );
	}
}
