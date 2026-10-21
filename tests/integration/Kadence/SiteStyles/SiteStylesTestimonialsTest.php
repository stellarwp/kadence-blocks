<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use Generator;
use Kadence_Blocks_CSS;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Site_Styles\Site_Rules;

/**
 * Covers Testimonials and Testimonial blocks with site-level styles: an untouched block takes the site container,
 * spacing and font values, an own value or an older border, radius or gap keeps its whole group, and the
 * settings the testimonials read through block context stay per block.
 */
final class SiteStylesTestimonialsTest extends WPTestCase {
	protected \IntegrationTester $tester;

	/**
	 * Empties the CSS a test built.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		Kadence_Blocks_CSS::$styles = [];
		parent::tearDown();
	}

	/**
	 * Without site values, a Testimonials block's CSS and markup in FSE mode are the same as in classic mode.
	 *
	 * @dataProvider ownAttributesProvider
	 *
	 * @param array<string, mixed> $attributes The block's own attributes.
	 *
	 * @return void
	 */
	public function testWithoutSiteValuesTheOutputMatchesClassicMode( array $attributes ): void {
		$classic = $this->render( $attributes );
		$this->tester->enable_fse_mode();

		$this->assertSame( $classic, $this->render( $attributes ) );
	}

	/**
	 * An untouched block takes the site container background, border, radius, padding, min heights, shadow,
	 * wrapper padding, gap and fonts.
	 *
	 * @return void
	 */
	public function testAnUntouchedBlockTakesTheSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		[ 'css' => $css ] = $this->render( [] );

		$this->assertStringContainsString( 'background:#fff3cd', $css );
		$this->assertStringContainsString( 'border-top:2px solid #ff00ff', $css );
		$this->assertStringContainsString( 'border-top-left-radius:8px', $css );
		$this->assertStringContainsString( 'padding-top:3rem', $css );
		$this->assertStringContainsString( 'min-height:200px', $css );
		$this->assertStringContainsString( 'min-height:40px', $css );
		$this->assertStringContainsString( 'min-height:60px', $css );
		$this->assertStringContainsString( 'box-shadow:', $css );
		$this->assertStringContainsString( 'padding-right:10px', $css );
		$this->assertStringContainsString( 'gap:40px', $css );
		$this->assertStringContainsString( 'color:#123456;font-size:18px', $css );
		$this->assertStringContainsString( 'color:#654321', $css );
		$this->assertStringContainsString( 'color:#abcdef', $css );
	}

	/**
	 * A block with its own padding keeps its own unit, and one with any content font value of its own keeps
	 * its whole font, while both still take the other site values.
	 *
	 * @return void
	 */
	public function testOwnValuesKeepTheirWholeGroup(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		[ 'css' => $padding ] = $this->render( [ 'containerPadding' => [ 5, 5, 5, 5 ] ] );
		[ 'css' => $font ]    = $this->render(
			[
				'contentFont' => [
					[
						'size'     => [ '14', '', '' ],
						'sizeType' => 'px',
					],
				],
			]
		);

		$this->assertStringContainsString( 'padding-top:5px', $padding );
		$this->assertStringNotContainsString( 'padding-top:5rem', $padding );
		$this->assertStringContainsString( 'background:#fff3cd', $padding );
		$this->assertStringContainsString( 'font-size:14px', $font );
		$this->assertStringNotContainsString( 'color:#123456', $font );
		$this->assertStringContainsString( 'color:#654321', $font );
	}

	/**
	 * Blocks saved before the responsive settings keep their older border, radius and gap, and take no site
	 * value for those groups.
	 *
	 * @return void
	 */
	public function testOlderAttributesKeepTheirGroups(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		[ 'css' => $border ] = $this->render(
			[
				'containerBorderWidth' => [ 2, 2, 2, 2 ],
				'containerBorder'      => '#ff0000',
			]
		);
		[ 'css' => $radius ] = $this->render( [ 'containerBorderRadius' => 5 ] );
		[ 'css' => $gap ]    = $this->render( [ 'columnGap' => 20 ] );

		$this->assertStringContainsString( 'border-color:#ff0000', $border );
		$this->assertStringNotContainsString( '#ff00ff', $border );
		$this->assertStringContainsString( 'border-radius:5px', $radius );
		$this->assertStringNotContainsString( 'radius:8px', $radius );
		$this->assertStringNotContainsString( 'gap:40px', $gap );
		$this->assertStringContainsString( 'background:#fff3cd', $gap );
	}

	/**
	 * Stored style, layout, display, title, media, rating and width settings are never applied: the
	 * testimonials read them through block context, so they belong to each block.
	 *
	 * @return void
	 */
	public function testStoredContextSettingsAreIgnored(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$expected = $this->render( [] );

		$this->store_site_values(
			[
				'style'             => 'bubble',
				'layout'            => 'carousel',
				'displayTitle'      => false,
				'displayRating'     => true,
				'titleFont'         => [ [ 'color' => '#00ff00' ] ],
				'ratingStyles'      => [ [ 'color' => '#00ff00' ] ],
				'containerMaxWidth' => 900,
				'columns'           => [ 3, 3, 3, 2, 1, 1 ],
			]
		);

		$this->assertSame( $expected, $this->render( [] ) );
	}

	/**
	 * In classic mode, stored site values change nothing.
	 *
	 * @return void
	 */
	public function testClassicModeIgnoresTheSiteValues(): void {
		$untouched = $this->render( [] );
		$this->store_site_values();

		$this->assertSame( $untouched, $this->render( [] ) );
	}

	/**
	 * The CSS built in the page head reads raw attributes, and an untouched block takes the site values there,
	 * while one with an older border keeps it.
	 *
	 * @return void
	 */
	public function testTheHeadPassTakesTheSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$untouched = apply_filters( 'kadence_blocks_testimonials_render_block_attributes', [ 'uniqueID' => 'ts_test' ] );
		$older     = apply_filters(
			'kadence_blocks_testimonials_render_block_attributes',
			[
				'uniqueID'             => 'ts_test',
				'containerBorderWidth' => [ 2, 2, 2, 2 ],
			]
		);

		$this->assertSame( '#fff3cd', $untouched['containerBackground'] );
		$this->assertSame( 'rem', $untouched['containerPaddingType'] );
		$this->assertArrayNotHasKey( 'borderStyle', $older );
		$this->assertSame( '#fff3cd', $older['containerBackground'] );
	}

	/**
	 * The site rules print nothing for either block, since every site value goes through the overlay.
	 *
	 * @return void
	 */
	public function testTheSiteRulesPrintNothing(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$this->store_testimonial_site_values();
		$this->render( [] );

		$rules = App::instance()->container()->get( Site_Rules::class );
		$this->assertSame( '', $rules->css( 'kadence/testimonials' ) );
		$this->assertSame( '', $rules->css( 'kadence/testimonial' ) );
	}

	/**
	 * An untouched icon testimonial takes the site icon size and color, one with its own size keeps it and
	 * still takes the site color, and a stored media type or rating never switches a testimonial.
	 *
	 * @return void
	 */
	public function testATestimonialTakesTheSiteIconSizeAndColor(): void {
		$this->tester->enable_fse_mode();
		$this->store_testimonial_site_values();

		[ 'html' => $untouched ] = $this->render( [], [ 'media' => 'icon' ] );
		[ 'html' => $own ]       = $this->render(
			[],
			[
				'media' => 'icon',
				'isize' => 30,
			]
		);
		[ 'html' => $image ]     = $this->render( [], [] );

		$this->assertStringContainsString( 'height="80" width="80" style="color: #ff0000"', $untouched );
		$this->assertStringContainsString( 'height="30" width="30" style="color: #ff0000"', $own );
		$this->assertStringNotContainsString( 'kt-svg-testimonial-icon', $image );
		$this->assertStringNotContainsString( 'kt-testimonial-rating-wrap', $image );
	}

	/**
	 * An untouched icon testimonial prints the site tablet and mobile icon sizes, and one with its own size
	 * keeps its whole size group.
	 *
	 * @return void
	 */
	public function testATestimonialTakesTheSiteTabletAndMobileIconSizes(): void {
		$this->tester->enable_fse_mode();
		$this->store(
			'testimonial',
			[
				'isize'       => 80,
				'tabletIsize' => 40,
				'mobileIsize' => 30,
			]
		);

		$this->render( [], [ 'media' => 'icon' ] );
		$untouched = $this->testimonial_css();
		$this->render(
			[],
			[
				'media' => 'icon',
				'isize' => 30,
			]
		);
		$own = $this->testimonial_css();

		$this->assertStringContainsString( '.kt-testimonial-item-ts_item .kt-svg-testimonial-icon svg{width:40px;height:40px;}', $untouched );
		$this->assertStringContainsString( '.kt-testimonial-item-ts_item .kt-svg-testimonial-icon svg{width:30px;height:30px;}', $untouched );
		$this->assertStringNotContainsString( 'kt-svg-testimonial-icon', $own );
	}

	/**
	 * In classic mode, stored testimonial site values change nothing.
	 *
	 * @return void
	 */
	public function testClassicModeIgnoresTheTestimonialSiteValues(): void {
		$untouched = $this->render( [], [ 'media' => 'icon' ] );
		$this->store_testimonial_site_values();

		$this->assertSame( $untouched, $this->render( [], [ 'media' => 'icon' ] ) );
	}

	/**
	 * @return Generator
	 */
	public function ownAttributesProvider(): Generator {
		yield 'untouched' => [ 'attributes' => [] ];
		yield 'own padding' => [ 'attributes' => [ 'containerPadding' => [ 5, 5, 5, 5 ] ] ];
		yield 'older border' => [
			'attributes' => [
				'containerBorderWidth' => [ 2, 2, 2, 2 ],
				'containerBorder'      => '#ff0000',
			],
		];
	}

	/**
	 * Stores Testimonials site values for the container, spacing, shadow, gap and fonts, plus any extra
	 * values.
	 *
	 * @param array<string, mixed> $extra Additional site values.
	 *
	 * @return void
	 */
	private function store_site_values( array $extra = [] ): void {
		$side = [ '#ff00ff', 'solid', 2 ];
		$this->store(
			'testimonials',
			array_merge(
				[
					'containerBackground'             => '#fff3cd',
					'borderStyle'                     => [
						[
							'top'    => $side,
							'right'  => $side,
							'bottom' => $side,
							'left'   => $side,
							'unit'   => 'px',
						],
					],
					'responsiveContainerBorderRadius' => [ 8, 8, 8, 8 ],
					'containerPadding'                => [ 3, 3, 3, 3 ],
					'containerPaddingType'            => 'rem',
					'containerMinHeight'              => [ 200, '', '' ],
					'titleMinHeight'                  => [ 40, '', '' ],
					'contentMinHeight'                => [ 60, '', '' ],
					'displayShadow'                   => true,
					'wrapperPadding'                  => [ 10, 10, 10, 10 ],
					'gap'                             => [ 40, '', '' ],
					'contentFont'                     => [
						[
							'color'    => '#123456',
							'size'     => [ '18', '', '' ],
							'sizeType' => 'px',
						],
					],
					'nameFont'                        => [ [ 'color' => '#654321' ] ],
					'occupationFont'                  => [ [ 'color' => '#abcdef' ] ],
				],
				$extra
			)
		);
	}

	/**
	 * Stores Testimonial site values for the icon size and color, plus a media type and rating that must be
	 * ignored.
	 *
	 * @return void
	 */
	private function store_testimonial_site_values(): void {
		$this->store(
			'testimonial',
			[
				'isize'  => 80,
				'color'  => '#ff0000',
				'media'  => 'icon',
				'rating' => 2,
			]
		);
	}

	/**
	 * Merges a block's site values into the user Global Styles.
	 *
	 * @param string               $slug   The block's slug.
	 * @param array<string, mixed> $values The site values.
	 *
	 * @return void
	 */
	private function store( string $slug, array $values ): void {
		$post    = \WP_Theme_JSON_Resolver::get_user_data_from_wp_global_styles( wp_get_theme(), false );
		$current = is_array( $post ) && ! empty( $post['post_content'] ) ? json_decode( $post['post_content'], true ) : [];
		$kadence = is_array( $current ) ? ( $current['settings']['custom']['kadence'] ?? [] ) : [];

		$kadence[ $slug ] = $values;
		$this->tester->store_user_global_styles( [ 'settings' => [ 'custom' => [ 'kadence' => $kadence ] ] ] );
	}

	/**
	 * Renders a Testimonials block with one testimonial and returns its instance CSS and its markup.
	 *
	 * @param array<string, mixed> $attributes      The Testimonials block's own attributes.
	 * @param array<string, mixed> $item_attributes The testimonial's own attributes.
	 *
	 * @return array{css: string, html: string} The CSS and the markup.
	 */
	private function render( array $attributes, array $item_attributes = [ 'media' => 'icon' ] ): array {
		Kadence_Blocks_CSS::$styles = [];
		$html                       = do_blocks(
			sprintf(
				'<!-- wp:kadence/testimonials %1$s --><!-- wp:kadence/testimonial %2$s /--><!-- /wp:kadence/testimonials -->',
				wp_json_encode(
					array_merge(
						[
							'uniqueID'  => 'ts_test',
							'kbVersion' => 2,
						],
						$attributes
					)
				),
				wp_json_encode(
					array_merge(
						[
							'uniqueID' => 'ts_item',
							'content'  => 'Great service',
							'name'     => 'Sam',
						],
						$item_attributes
					)
				)
			)
		);
		$css                        = '';
		foreach ( Kadence_Blocks_CSS::$styles as $style_id => $style ) {
			if ( str_starts_with( $style_id, 'kb-testimonials' ) ) {
				$css .= $style;
			}
		}

		return [
			'css'  => $css,
			'html' => (string) preg_replace( '/<style[^>]*>.*?<\/style>/s', '', $html ),
		];
	}

	/**
	 * Returns the CSS the last render built for the testimonial itself.
	 *
	 * @return string The testimonial's CSS.
	 */
	private function testimonial_css(): string {
		$css = '';
		foreach ( Kadence_Blocks_CSS::$styles as $style_id => $style ) {
			if ( str_starts_with( $style_id, 'kb-testimonial' ) && ! str_starts_with( $style_id, 'kb-testimonials' ) ) {
				$css .= $style;
			}
		}

		return $css;
	}
}
