<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use Generator;
use Kadence_Blocks_CSS;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Site_Styles\Site_Rules;

/**
 * Covers Posts blocks with site-level styles: an untouched block takes the site look in its CSS and its
 * markup, a block's own columns or title font keep their whole group, and which parts show stays per block.
 */
final class SiteStylesPostsTest extends WPTestCase {
	protected \IntegrationTester $tester;

	/**
	 * Creates the posts the block lists.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		self::factory()->post->create_many( 2 );
	}

	/**
	 * Without site values, a Posts block's CSS and markup in FSE mode are the same as in classic mode.
	 *
	 * @dataProvider postsProvider
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
	 * An untouched block takes the site look: the card style, columns and image position classes, the
	 * category style class and the title font.
	 *
	 * @return void
	 */
	public function testAnUntouchedBlockTakesTheSiteLook(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		[ 'css' => $css, 'html' => $html ] = $this->render( [] );

		$this->assertStringContainsString( 'kb-posts-style-unboxed', $html );
		$this->assertStringContainsString( 'grid-lg-col-2', $html );
		$this->assertStringContainsString( 'category-style-pill', $html );
		$this->assertStringContainsString( '.entry-title{font-size:30px;}', $css );
	}

	/**
	 * A one-column block of its own keeps its own image position too, so the site's doesn't reach it, while it
	 * still takes the site card style and title font.
	 *
	 * @return void
	 */
	public function testOwnColumnsKeepTheirWholeGroup(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values( [ 'alignImage' => 'above' ] );

		[ 'css' => $css, 'html' => $html ] = $this->render( [ 'columns' => 1 ] );

		$this->assertStringContainsString( 'grid-lg-col-1', $html );
		$this->assertStringContainsString( 'item-image-style-beside', $html );
		$this->assertStringContainsString( 'kb-posts-style-unboxed', $html );
		$this->assertStringContainsString( 'font-size:30px', $css );
	}

	/**
	 * A block with any title font value of its own keeps its whole font, so the site line height doesn't reach
	 * it, while it still takes the site card style.
	 *
	 * @return void
	 */
	public function testAnOwnTitleFontKeepsTheWholeFont(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values(
			[
				'titleFont' => [
					[
						'size'       => [ '30', '', '' ],
						'sizeType'   => 'px',
						'lineHeight' => [ '1.5', '', '' ],
						'lineType'   => 'em',
					],
				],
			]
		);

		[ 'css' => $css, 'html' => $html ] = $this->render( [ 'titleFont' => [ [ 'size' => [ '18', '', '' ] ] ] ] );

		$this->assertStringContainsString( 'font-size:18px', $css );
		$this->assertStringNotContainsString( 'line-height:1.5em', $css );
		$this->assertStringContainsString( 'kb-posts-style-unboxed', $html );
	}

	/**
	 * Stored part toggles, labels and query settings are never applied: which parts show and what is listed
	 * belong to each block.
	 *
	 * @return void
	 */
	public function testStoredPartsAndQuerySettingsAreIgnored(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$expected = $this->render( [] );

		$this->store_site_values(
			[
				'image'         => false,
				'meta'          => false,
				'readmore'      => true,
				'readmoreLabel' => 'Site label',
				'postsToShow'   => 1,
				'postType'      => 'page',
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
	 * The site rules print nothing for Posts, since every site value goes through the overlay.
	 *
	 * @return void
	 */
	public function testTheSiteRulesPrintNothing(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$this->render( [] );

		$this->assertSame( '', App::instance()->container()->get( Site_Rules::class )->css( 'kadence/posts' ) );
	}

	/**
	 * @return Generator
	 */
	public function postsProvider(): Generator {
		yield 'untouched' => [ 'attributes' => [] ];
		yield 'own columns' => [ 'attributes' => [ 'columns' => 4 ] ];
		yield 'own card style' => [ 'attributes' => [ 'loopStyle' => 'unboxed' ] ];
	}

	/**
	 * Stores site values for the card style, columns, title font, image ratio and category style, plus any
	 * extra values.
	 *
	 * @param array<string, mixed> $extra Additional site values.
	 *
	 * @return void
	 */
	private function store_site_values( array $extra = [] ): void {
		$this->tester->store_user_global_styles(
			[
				'settings' => [
					'custom' => [
						'kadence' => [
							'posts' => array_merge(
								[
									'loopStyle'       => 'unboxed',
									'columns'         => 2,
									'titleFont'       => [
										[
											'level'      => 2,
											'size'       => [ '30', '', '' ],
											'sizeType'   => 'px',
											'lineHeight' => [ '', '', '' ],
											'lineType'   => 'px',
											'letterSpacing' => '',
											'textTransform' => '',
											'family'     => '',
											'google'     => false,
											'style'      => '',
											'weight'     => '',
											'variant'    => '',
											'subset'     => '',
											'loadGoogle' => true,
										],
									],
									'imageRatio'      => '1-1',
									'categoriesStyle' => 'pill',
								],
								$extra
							),
						],
					],
				],
			]
		);
	}

	/**
	 * Renders a Posts block and returns its instance CSS and its markup without style tags.
	 *
	 * @param array<string, mixed> $attributes The block's own attributes.
	 *
	 * @return array{css: string, html: string} The CSS and the markup.
	 */
	private function render( array $attributes ): array {
		Kadence_Blocks_CSS::$styles = [];
		$html                       = do_blocks( sprintf( '<!-- wp:kadence/posts %s /-->', wp_json_encode( array_merge( [ 'uniqueID' => 'po_test' ], $attributes ) ) ) );
		$css                        = '';
		foreach ( Kadence_Blocks_CSS::$styles as $style_id => $style ) {
			if ( str_starts_with( $style_id, 'kb-posts' ) ) {
				$css .= $style;
			}
		}

		return [
			'css'  => $css,
			'html' => (string) preg_replace( '/<style[^>]*>.*?<\/style>/s', '', $html ),
		];
	}
}
