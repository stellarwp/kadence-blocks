<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Font_Catalog;
use Tests\Support\Classes\TestCase;

/**
 * Covers the font catalog reader/normalizer the Typography screen's searchable dropdown reads.
 */
final class Font_CatalogTest extends TestCase {

	/**
	 * @var Font_Catalog
	 */
	private Font_Catalog $catalog;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->catalog = $this->container->get( Font_Catalog::class );
	}

	/**
	 * @return void
	 */
	protected function tearDown(): void {
		remove_all_filters( 'kadence_blocks_custom_fonts' );

		parent::tearDown();
	}

	/**
	 * The shipped Google names file is read into a non-empty list, and "Abel" — a stable, early
	 * entry in the generated file — is among it, pinning that the file is actually being read
	 * rather than silently falling back to an empty list.
	 *
	 * @return void
	 */
	public function testAllReturnsTheGoogleNamesFromTheGeneratedFile(): void {
		$result = $this->catalog->all();

		$this->assertArrayHasKey( 'google', $result );
		$this->assertNotEmpty( $result['google'] );
		$this->assertContains( 'Abel', $result['google'] );
	}

	/**
	 * A custom-fonts filter returning the shape kadence_blocks_convert_custom_fonts() (init.php)
	 * produces — string-keyed by the font-stack expression, each value an array with its own
	 * "name" — normalizes to that string key as the catalog name.
	 *
	 * @return void
	 */
	public function testCustomNamesAreReadFromTheStringKeyedFilterShape(): void {
		add_filter(
			'kadence_blocks_custom_fonts',
			static function ( array $fonts ): array {
				$fonts['My Custom Font'] = [
					'name'    => 'My Custom Font',
					'weights' => [],
					'styles'  => [],
				];

				return $fonts;
			}
		);

		$result = $this->catalog->all();

		$this->assertContains( 'My Custom Font', $result['custom'] );
	}

	/**
	 * A custom-fonts filter returning a plain, integer-keyed list of names passes each name
	 * through as-is.
	 *
	 * @return void
	 */
	public function testCustomNamesAreReadFromAnIntegerKeyedListShape(): void {
		add_filter(
			'kadence_blocks_custom_fonts',
			static function ( array $fonts ): array {
				$fonts[] = 'Another Custom Font';

				return $fonts;
			}
		);

		$result = $this->catalog->all();

		$this->assertContains( 'Another Custom Font', $result['custom'] );
	}

	/**
	 * A custom name that duplicates a Google name is deduplicated out of the "custom" list — the
	 * dropdown must never list the same family twice.
	 *
	 * @return void
	 */
	public function testCustomNamesAreDeduplicatedAgainstTheGoogleList(): void {
		add_filter(
			'kadence_blocks_custom_fonts',
			static function ( array $fonts ): array {
				$fonts['Abel'] = [ 'name' => 'Abel' ];

				return $fonts;
			}
		);

		$result = $this->catalog->all();

		$this->assertContains( 'Abel', $result['google'] );
		$this->assertNotContains( 'Abel', $result['custom'] );
	}

	/**
	 * A custom-fonts filter that returns something other than an array fails soft to an empty
	 * custom list rather than throwing or emitting a warning.
	 *
	 * @return void
	 */
	public function testMalformedFilterReturnFailsSoftToAnEmptyCustomList(): void {
		add_filter( 'kadence_blocks_custom_fonts', static fn() => 'not-an-array' );

		$result = $this->catalog->all();

		$this->assertSame( [], $result['custom'] );
	}
}
