<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Admin\Feed;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Font_Catalog;
use Tests\Support\Classes\Fake_Kadence_Custom_Fonts;
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

		Fake_Kadence_Custom_Fonts::install();

		$this->catalog = $this->container->get( Font_Catalog::class );
	}

	/**
	 * @return void
	 */
	protected function tearDown(): void {
		remove_all_filters( 'kadence_blocks_custom_fonts' );

		foreach ( get_posts(
			[
				'post_type'   => 'kt_font',
				'numberposts' => -1,
				'post_status' => 'any',
			] 
		) as $font ) {
			wp_delete_post( $font->ID, true );
		}

		Fake_Kadence_Custom_Fonts::reset();

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
	 * The weight map is read from the generated detail file, keyed by family. "Abril Fatface" ships only
	 * a regular face and pins both halves of the point: the file is genuinely being read, and a family's
	 * real weight list can be a single entry -- which is exactly why a flat 100-900 control would promise
	 * eight faces it does not have.
	 *
	 * @return void
	 */
	public function testAllReturnsThePerFamilyWeightsFromTheGeneratedFile(): void {
		$result = $this->catalog->all();

		$this->assertArrayHasKey( 'weights', $result );
		$this->assertNotEmpty( $result['weights'] );
		$this->assertSame( [ '400' ], $result['weights']['Abril Fatface'] ?? null );
	}

	/**
	 * The generated file spells the default weight "regular", which is 400 everywhere a CSS font-weight
	 * is written. Both spellings surviving would make a consumer match two things for one weight.
	 *
	 * @return void
	 */
	public function testWeightsNormalizeRegularToItsNumericSpelling(): void {
		$weights = $this->catalog->all()['weights'];

		foreach ( $weights as $family => $family_weights ) {
			$this->assertNotContains( 'regular', $family_weights, sprintf( '%s carries an unnormalized weight.', $family ) );
		}
	}

	/**
	 * A family shipping several weights lists them in weight order, so a picker reads low-to-high rather
	 * than in the generated file's own order.
	 *
	 * @return void
	 */
	public function testWeightsAreSortedNumerically(): void {
		$weights = $this->catalog->all()['weights']['Inter'] ?? [];

		$this->assertNotEmpty( $weights, 'Inter should be present in the generated file.' );

		$sorted = $weights;
		sort( $sorted, SORT_NUMERIC );

		$this->assertSame( $sorted, $weights );
		$this->assertGreaterThan( 1, count( $weights ), 'Inter ships several weights.' );
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
	 * A font registered with a fallback — whose filter key is the whole stack expression
	 * `"My Font", sans-serif`, the shape kadence_blocks_convert_custom_fonts() builds — is
	 * catalogued under the family name alone, so what is stored (and later rendered as
	 * `font-family`) is never a quoted stack nested inside another set of quotes.
	 *
	 * @return void
	 */
	public function testCustomNamesDropTheFallbackStackFromAKeyThatCarriesOne(): void {
		add_filter(
			'kadence_blocks_custom_fonts',
			static function ( array $fonts ): array {
				$fonts['"My Font", sans-serif'] = [
					'name'    => '"My Font", sans-serif',
					'weights' => [],
					'styles'  => [],
				];

				return $fonts;
			}
		);

		$result = $this->catalog->all();

		$this->assertContains( 'My Font', $result['custom'] );
		$this->assertNotContains( '"My Font", sans-serif', $result['custom'] );
	}

	/**
	 * A Google family registered as a custom font WITH a fallback still deduplicates against the
	 * Google list: the stack is reduced to the family name before the two lists are compared, so
	 * the family is not offered twice.
	 *
	 * @return void
	 */
	public function testAFallbackStackDeduplicatesAgainstTheGoogleList(): void {
		add_filter(
			'kadence_blocks_custom_fonts',
			static function ( array $fonts ): array {
				$fonts['"Abel", sans-serif'] = [
					'name'    => '"Abel", sans-serif',
					'weights' => [],
					'styles'  => [],
				];

				return $fonts;
			}
		);

		$result = $this->catalog->all();

		$this->assertNotContains( 'Abel', $result['custom'] );
		$this->assertContains( 'Abel', $result['google'] );
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

	/**
	 * Custom names include the Kadence Custom Fonts plugin's fonts.
	 *
	 * @return void
	 */
	public function testCustomNamesIncludeFontsFromTheKadenceCustomFontsPlugin(): void {
		$this->make_kt_font( 'Brand Sans' );
		$this->make_kt_font( 'Zeta Display' );

		$result = $this->catalog->all();

		$this->assertSame( [ 'Brand Sans', 'Zeta Display' ], $result['custom'] );
	}

	/**
	 * Custom names include the families of a Kadence Custom Fonts Adobe Fonts entry.
	 *
	 * @return void
	 */
	public function testCustomNamesIncludeAdobeFamiliesFromTheKadenceCustomFontsPlugin(): void {
		$id = $this->make_kt_font( 'Ignored' );
		update_post_meta( $id, '_kad_font_type', 'adobe' );
		update_post_meta(
			$id,
			'_kad_typekit',
			[
				'families' => [
					'proxima-nova' => [ 'name' => 'Proxima Nova' ],
					'bad'          => 'x',
				],
			] 
		);

		$this->assertSame( [ 'Proxima Nova' ], $this->catalog->all()['custom'] );
	}

	/**
	 * A font reported by both the filter and the plugin is listed once, and one in the Google list is
	 * dropped from the custom names.
	 *
	 * @return void
	 */
	public function testPluginFontsAreDeduplicatedAgainstTheFilterAndGoogle(): void {
		add_filter( 'kadence_blocks_custom_fonts', static fn() => [ 'Brand Sans' => [ 'name' => 'Brand Sans' ] ] );
		$this->make_kt_font( 'Brand Sans' );
		$this->make_kt_font( 'Abel' );

		$this->assertSame( [ 'Brand Sans' ], $this->catalog->all()['custom'] );
	}

	/**
	 * Names added through the catalog filter are normalized, de-duplicated against the list and Google, and
	 * non-strings are ignored.
	 *
	 * @return void
	 */
	public function testCatalogFilterAddsNormalizedNamesToTheCustomList(): void {
		$callback = static fn( $names ) => array_merge( $names, [ '"Brand Sans"', 'Zeta Display', 'zeta display', 42, '', 'Abel' ] );
		add_filter( 'kadence_blocks_font_catalog_custom_names', $callback );

		try {
			$result = $this->catalog->all();
		} finally {
			remove_filter( 'kadence_blocks_font_catalog_custom_names', $callback );
		}

		$this->assertSame( [ 'Brand Sans', 'Zeta Display', 'zeta display' ], $result['custom'] );
	}

	/**
	 * The catalog filter receives the names from `kadence_blocks_custom_fonts`.
	 *
	 * @return void
	 */
	public function testCatalogFilterReceivesTheNamesFromTheOlderFilter(): void {
		add_filter( 'kadence_blocks_custom_fonts', static fn() => [ 'Old Font' => [ 'name' => 'Old Font' ] ] );
		$callback = static fn( $names ) => array_reverse( array_merge( $names, [ 'New Font' ] ) );
		add_filter( 'kadence_blocks_font_catalog_custom_names', $callback );

		try {
			$result = $this->catalog->all();
		} finally {
			remove_filter( 'kadence_blocks_font_catalog_custom_names', $callback );
		}

		$this->assertSame( [ 'New Font', 'Old Font' ], $result['custom'] );
	}

	/**
	 * A catalog filter callback returning a non-array leaves an empty custom list.
	 *
	 * @return void
	 */
	public function testCatalogFilterReturningNonArrayFailsSoftToAnEmptyCustomList(): void {
		$callback = static fn() => 'nope';
		add_filter( 'kadence_blocks_font_catalog_custom_names', $callback );

		try {
			$result = $this->catalog->all();
		} finally {
			remove_filter( 'kadence_blocks_font_catalog_custom_names', $callback );
		}

		$this->assertSame( [], $result['custom'] );
	}

	/**
	 * A malformed `kadence_blocks_custom_fonts` return does not hide the catalog filter's names.
	 *
	 * @return void
	 */
	public function testMalformedOlderFilterDoesNotHidePluginFonts(): void {
		add_filter( 'kadence_blocks_custom_fonts', static fn() => 'not-an-array' );
		$this->make_kt_font( 'Brand Sans' );

		$this->assertSame( [ 'Brand Sans' ], $this->catalog->all()['custom'] );
	}

	/**
	 * An unexpected result or exception from the Custom Fonts query adds no names and raises no error.
	 *
	 * @dataProvider unexpectedQueryResults
	 *
	 * @param callable $behavior What the plugin's font query does instead.
	 *
	 * @return void
	 */
	public function testAnUnexpectedCustomFontsQueryFailsSoft( callable $behavior ): void {
		add_filter( 'kadence_blocks_custom_fonts', static fn() => [ 'Old Font' => [ 'name' => 'Old Font' ] ] );
		Fake_Kadence_Custom_Fonts::$behavior = $behavior;

		$this->assertSame( [ 'Old Font' ], $this->catalog->all()['custom'] );
	}

	/**
	 * Commas inside a quoted family name stay part of the name, from either filter.
	 *
	 * @return void
	 */
	public function testACommaInsideAQuotedFamilyNameIsKept(): void {
		add_filter( 'kadence_blocks_custom_fonts', static fn() => [ '"Brand, Display", sans-serif' => [ 'name' => 'Brand, Display' ] ] );
		$callback = static fn( $names ) => array_merge( $names, [ "'Other, Name'" ] );
		add_filter( 'kadence_blocks_font_catalog_custom_names', $callback );

		try {
			$result = $this->catalog->all();
		} finally {
			remove_filter( 'kadence_blocks_font_catalog_custom_names', $callback );
		}

		$this->assertSame( [ 'Brand, Display', 'Other, Name' ], $result['custom'] );
	}

	/**
	 * A plugin font whose name contains a comma is listed whole when no legacy filter registers it.
	 *
	 * @return void
	 */
	public function testAPluginFontNameWithACommaIsKeptWhole(): void {
		$this->make_kt_font( 'Brand, Display' );

		$this->assertSame( [ 'Brand, Display' ], $this->catalog->all()['custom'] );
	}

	/**
	 * What the Custom Fonts query returns or throws instead of its usual list.
	 *
	 * @return Generator
	 */
	public function unexpectedQueryResults(): Generator {
		yield 'null' => [
			'behavior' => static fn() => null,
		];

		yield 'a string' => [
			'behavior' => static fn() => 'nope',
		];

		yield 'false' => [
			'behavior' => static fn() => false,
		];

		yield 'not WP_Post entries' => [
			'behavior' => static fn() => [ 'a', 42, null, new \stdClass() ],
		];

		yield 'throws an exception' => [
			'behavior' => static function () {
				throw new \RuntimeException( 'changed' );
			},
		];

		yield 'throws a type error' => [
			'behavior' => static function () {
				throw new \TypeError( 'changed' );
			},
		];
	}

	/**
	 * Create a published `kt_font` post naming a family, as the Custom Fonts plugin stores it.
	 *
	 * @param string $name The family name.
	 *
	 * @return int The post ID.
	 */
	private function make_kt_font( string $name ): int {
		$id = self::factory()->post->create(
			[
				'post_type'   => 'kt_font',
				'post_status' => 'publish',
				'post_title'  => $name,
				'menu_order'  => 0,
			]
		);
		update_post_meta( $id, '_kad_font_name', $name );
		update_post_meta( $id, '_kad_font_type', 'upload' );
		Fake_Kadence_Custom_Fonts::reset();

		return $id;
	}
}
