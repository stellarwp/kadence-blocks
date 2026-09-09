<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Version;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Mapper;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Overlay;
use Tests\Support\Classes\Fake_Style_Guide_Source;
use Tests\Support\Classes\TestCase;

final class Effective_VersionTest extends TestCase {

	private Token_Store $store;
	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		$this->store    = $this->container->get( Token_Store::class );
		$this->registry = $this->container->get( Token_Registry::class );
	}

	protected function tearDown(): void {
		$this->store->delete( Token_Store::default_slug() );

		parent::tearDown();
	}

	/**
	 * With no overlay (a site not running the Kadence theme) the effective version is exactly the store
	 * version, so every cache key that folds it in is byte-identical to what it was before this layer.
	 *
	 * @return void
	 */
	public function testEqualsStoreVersionWhenOverlayIsEmpty(): void {
		$slug     = Token_Store::default_slug();
		$versions = $this->versions( new Fake_Style_Guide_Source( null ) );

		$this->assertSame( $this->store->get_version( $slug ), $versions->for_slug( $slug ) );
	}

	/**
	 * Two different Style Guides give two different effective versions for the same store version.
	 * That is what makes a Customizer save invalidate the resolved and projected caches.
	 *
	 * @return void
	 */
	public function testDiffersWhenTheStyleGuideDiffers(): void {
		$slug  = Token_Store::default_slug();
		$first = $this->versions( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] ) );
		$other = $this->versions( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#222222' ] ) );

		$this->assertNotSame( $first->for_slug( $slug ), $other->for_slug( $slug ) );
	}

	/**
	 * The same Style Guide gives the same effective version, so an unchanged theme does not churn the
	 * caches on every request.
	 *
	 * @return void
	 */
	public function testIsStableForAnUnchangedStyleGuide(): void {
		$slug  = Token_Store::default_slug();
		$first = $this->versions( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] ) );
		$same  = $this->versions( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] ) );

		$this->assertSame( $first->for_slug( $slug ), $same->for_slug( $slug ) );
	}

	/**
	 * The store version stays a prefix of the effective version, so a token write still changes it even
	 * while a Style Guide is overlaid.
	 *
	 * @return void
	 */
	public function testKeepsTheStoreVersionAsItsPrefix(): void {
		$slug = Token_Store::default_slug();

		// A library with nothing stored has an empty version, so write one to have a prefix to assert.
		$this->store->save_document( (string) wp_json_encode( [ 'primitive' => [] ] ) );

		$versions = $this->versions( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] ) );
		$version  = $this->store->get_version( $slug );

		$this->assertNotSame( '', $version );
		$this->assertStringStartsWith( $version, $versions->for_slug( $slug ) );
	}

	/**
	 * A token write changes the effective version even though the Style Guide did not change.
	 *
	 * @return void
	 */
	public function testChangesWhenTheStoredDocumentChanges(): void {
		$slug     = Token_Store::default_slug();
		$versions = $this->versions( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] ) );
		$before   = $versions->for_slug( $slug );

		$this->store->save_document(
			(string) wp_json_encode(
				[
					'primitive' => [
						'color' => [
							'brand' => [
								'primary' => [
									'$type'  => 'color',
									'$value' => '#abcdef',
								],
							],
						],
					],
				]
			)
		);

		$this->assertNotSame( $before, $versions->for_slug( $slug ) );
	}

	/**
	 * The container wires the service, so every projector resolves the same instance.
	 *
	 * @return void
	 */
	public function testTheContainerBindsIt(): void {
		$this->assertInstanceOf( Effective_Version::class, $this->container->get( Effective_Version::class ) );
	}

	/**
	 * An Effective_Version over the given Style Guide source, with the real store and registry.
	 *
	 * @param Fake_Style_Guide_Source $source The Style Guide source.
	 *
	 * @return Effective_Version
	 */
	private function versions( Fake_Style_Guide_Source $source ): Effective_Version {
		return new Effective_Version(
			$this->store,
			new Style_Guide_Overlay( $source, new Style_Guide_Mapper(), $this->registry )
		);
	}
}
