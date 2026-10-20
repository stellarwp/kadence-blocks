<?php
// cspell:ignore advancedheading .

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use IntegrationTester;
use Kadence_Blocks_Advancedheading_Block;
use Kadence_Blocks_CSS;
use KadenceWP\KadenceBlocks\Site_Styles\Supported_Blocks;
use Tests\integration\Kadence\SiteStyles\Support\SiteValuesTrait;
use WP_Block_Type_Registry;

/**
 * Covers the site-level styles of Advanced Heading. Its editor paints styles inline,
 * so the Kadence-only site values reach the instance attributes through the overlay;
 * the text and background colors are core's.
 */
final class SiteStylesAdvancedHeadingTest extends WPTestCase {
	use SiteValuesTrait;

	protected IntegrationTester $tester;

	/**
	 * Restores the block type a test re-registered and empties the CSS a test built.
	 *
	 * @return void
	 */
	protected function tearDown(): void {
		Kadence_Blocks_CSS::$styles = [];

		$this->restore_reregistered_block();

		parent::tearDown();
	}

	/**
	 * A heading takes the site size on the devices it leaves alone, and its own Tablet size wins.
	 *
	 * @return void
	 */
	public function testTheSiteValuesFillWhatTheHeadingLeavesAtItsDefaults(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values(
			'advancedheading',
			[
				'fontSize'      => [ 48, 36, 24 ],
				'textTransform' => 'uppercase',
			]
		);

		$heading = $this->render_attributes(
			'advancedheading',
			[
				'uniqueID' => 'a',
				'fontSize' => [ '', 30, '' ],
			]
		);

		$this->assertSame( [ 48, 30, 24 ], $heading['fontSize'] );
		$this->assertSame( 'uppercase', $heading['textTransform'] );
	}

	/**
	 * The tag, the link, the icon and its tooltip, the palette classes and the attributes older headings migrate from never reach a heading.
	 *
	 * @return void
	 */
	public function testStoredContentAndLegacyValuesNeverReachAHeading(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values(
			'advancedheading',
			[
				'fontSize'    => [ 48, 36, 24 ],
				'htmlTag'     => 'p',
				'level'       => 4,
				'link'        => 'https://example.com',
				'icon'        => 'fe_heart',
				'iconTooltip' => 'Site tooltip',
				'colorClass'  => 'theme-palette1',
				'size'        => 20,
				'markBorder'  => '#ff0000',
				'color'       => '#ff0000',
			]
		);

		$this->assertSame(
			[
				'uniqueID' => 'a',
				'fontSize' => [ 48, 36, 24 ],
			],
			$this->render_attributes( 'advancedheading', [ 'uniqueID' => 'a' ] )
		);

		$excluded = Supported_Blocks::excluded_attributes( Kadence_Blocks_Advancedheading_Block::get_instance() );

		foreach ( [ 'content', 'htmlTag', 'level', 'link', 'linkTarget', 'linkNoFollow', 'linkSponsored', 'altTitle', 'icon', 'iconTitle', 'iconTooltip', 'iconTooltipPlacement', 'iconTooltipDash', 'colorClass', 'backgroundColorClass' ] as $name ) {
			$this->assertContains( $name, $excluded, $name );
		}
	}

	/**
	 * A heading that still carries every registered default, as a rendered block does, shows a site value for each attribute the overlay lists.
	 *
	 * @return void
	 */
	public function testNoRegisteredDefaultHidesASiteValue(): void {
		$this->tester->enable_fse_mode();
		$defaults = Supported_Blocks::registered_defaults( 'kadence/advancedheading' );
		$site     = [];

		foreach ( Kadence_Blocks_Advancedheading_Block::get_instance()->site_styles_overlay_attributes() as $name ) {
			$site[ $name ] = $this->differing_value( $defaults[ $name ] ?? null );
		}

		$this->store_site_values( 'advancedheading', $site );

		$rendered = $this->render_attributes( 'advancedheading', $defaults );

		foreach ( $site as $name => $value ) {
			$this->assertSame( $value, $rendered[ $name ], $name );
		}
	}

	/**
	 * The CSS a rendered heading prints takes the site values, Tablet and Mobile in Kadence's media queries.
	 *
	 * @return void
	 */
	public function testTheRenderedCssTakesTheSiteValuesPerDevice(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values(
			'advancedheading',
			[
				'fontSize'      => [ 48, 36, 24 ],
				'textTransform' => 'uppercase',
				'padding'       => [ 8, 8, 8, 8 ],
				'background'    => '#fff2cc',
			]
		);

		$css = $this->tester->rendered_block_css( $this->heading_markup( 'hd_body', '{"uniqueID":"hd_body"}' ), 'advancedheading' );

		$this->assertStringContainsString( 'font-size:48px', $css );
		$this->assertStringContainsString( 'text-transform:uppercase', $css );
		$this->assertStringContainsString( 'padding-top:8px', $css );
		$this->assertStringContainsString( 'background-color:#fff2cc', $css );
		$this->assertMatchesRegularExpression( '/@media all and \(max-width: 1024px\)\{[^}]*font-size:36px/', $css );
		$this->assertMatchesRegularExpression( '/@media all and \(max-width: 767px\)\{[^}]*font-size:24px/', $css );
	}

	/**
	 * Every attribute of the heading is a site value, core's, or explained here: the ones older headings migrate from when they are edited, and the ones the heading's CSS never prints or reads.
	 *
	 * @return void
	 */
	public function testEveryAttributeIsEitherASiteValueOrExplained(): void {
		$this->assertSame(
			[ 'bottomMargin', 'iconHover', 'leftMargin', 'lineHeight', 'lineType', 'markBorder', 'markBorderOpacity', 'markBorderStyle', 'markBorderWidth', 'markPaddingControl', 'maxHeight', 'maxHeightType', 'mobileLineHeight', 'mobileMarginType', 'mobileMarkLetterSpacing', 'mobileSize', 'rightMargin', 'size', 'tabLineHeight', 'tabSize', 'tabletMarginType', 'tabletMarkLetterSpacing', 'topMargin' ],
			$this->unaccounted_attributes( Kadence_Blocks_Advancedheading_Block::get_instance() )
		);
	}

	/**
	 * Without stored site values FSE mode builds the same CSS as classic mode.
	 *
	 * @return void
	 */
	public function testWithoutSiteValuesBothModesBuildTheSameCss(): void {
		$markup  = $this->heading_markup( 'hd_same', '{"uniqueID":"hd_same","textTransform":"uppercase"}' );
		$classic = $this->tester->rendered_block_css( $markup, 'advancedheading' );

		$this->tester->enable_fse_mode();

		$this->assertNotSame( '', $classic );
		$this->assertSame( $classic, $this->tester->rendered_block_css( $markup, 'advancedheading' ) );
	}

	/**
	 * Classic mode ignores the stored values.
	 *
	 * @return void
	 */
	public function testClassicModeIgnoresTheSiteValues(): void {
		$this->store_site_values( 'advancedheading', [ 'fontSize' => [ 48, 36, 24 ] ] );

		$this->assertSame( [ 'uniqueID' => 'a' ], $this->render_attributes( 'advancedheading', [ 'uniqueID' => 'a' ] ) );
	}

	/**
	 * FSE mode gives the heading core's text color only, without serialization.
	 *
	 * @return void
	 */
	public function testFseModeAddsTheColorSupports(): void {
		$this->tester->enable_fse_mode();

		$metadata = apply_filters( 'block_type_metadata', [ 'name' => 'kadence/advancedheading' ] );

		$this->assertTrue( $metadata['supports']['color']['text'] );
		$this->assertFalse( $metadata['supports']['color']['background'] );
		$this->assertFalse( $metadata['supports']['color']['gradients'] );
		$this->assertTrue( $metadata['supports']['color']['__experimentalSkipSerialization'] );
		$this->assertSame( [], $metadata['selectors'] );
	}

	/**
	 * Core prints the site text color on the heading, Tablet and Mobile included.
	 *
	 * @return void
	 */
	public function testCorePrintsTheSiteTextColorOnTheHeadingPerDevice(): void {
		$this->tester->enable_fse_mode();
		$this->reregister_block( Kadence_Blocks_Advancedheading_Block::get_instance() );
		$this->tester->store_user_global_styles(
			[
				'styles' => [
					'blocks' => [
						'kadence/advancedheading' => [
							'color'   => [ 'text' => '#ff0000' ],
							'@mobile' => [ 'color' => [ 'text' => '#0000ff' ] ],
						],
					],
				],
			]
		);

		$css = wp_get_global_stylesheet();

		$this->assertMatchesRegularExpression( '/:root :where\(\.wp-block-kadence-advancedheading\)\{[^}]*color: ?#ff0000;/', $css );
		$this->assertMatchesRegularExpression( '/@media[^{]*767px[^{]*\{:root :where\(\.wp-block-kadence-advancedheading\)\{color: ?#0000ff;/', $css );
	}

	/**
	 * A site color leaves the markup of a heading unchanged, whatever its own colors and tag.
	 *
	 * @return void
	 */
	public function testHeadingsRenderUnchangedWithASiteColor(): void {
		$markup = $this->heading_markup( 'hd_plain', '{"uniqueID":"hd_plain"}' )
			. $this->heading_markup( 'hd_own', '{"uniqueID":"hd_own","color":"#00aa00","colorClass":"theme-palette1","htmlTag":"p"}' );
		$before = do_blocks( $markup );

		$this->tester->enable_fse_mode();
		$this->reregister_block( Kadence_Blocks_Advancedheading_Block::get_instance() );
		$this->tester->store_user_global_styles(
			[ 'styles' => [ 'blocks' => [ 'kadence/advancedheading' => [ 'color' => [ 'text' => '#ff0000' ] ] ] ] ]
		);

		$this->assertTrue( WP_Block_Type_Registry::get_instance()->get_registered( 'kadence/advancedheading' )->supports['color']['text'] );
		$this->assertSame( $before, do_blocks( $markup ) );
	}

	/**
	 * Builds a heading.
	 *
	 * @param string $unique_id  The heading's unique ID.
	 * @param string $attributes The block comment's JSON attributes.
	 *
	 * @return string The block markup.
	 */
	private function heading_markup( string $unique_id, string $attributes ): string {
		return '<!-- wp:kadence/advancedheading ' . $attributes . ' --><h2 class="kt-adv-heading' . $unique_id . ' wp-block-kadence-advancedheading" data-kb-block="kb-adv-heading' . $unique_id . '">Heading</h2><!-- /wp:kadence/advancedheading -->';
	}
}
