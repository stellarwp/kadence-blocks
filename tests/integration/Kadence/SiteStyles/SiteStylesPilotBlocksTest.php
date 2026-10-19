<?php
// cspell:ignore alignnone .

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use IntegrationTester;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Single_Icon_Block;
use WP_Block_Type;
use WP_Block_Type_Registry;

/**
 * Covers the site-level styles of Single Icon, Icon and Advanced Button. Their
 * editors paint styles inline, so their Kadence-only site values reach the
 * instance attributes through the overlay.
 */
final class SiteStylesPilotBlocksTest extends WPTestCase {
	protected IntegrationTester $tester;

	/**
	 * The Single Icon block type registered before a test re-registered it.
	 *
	 * @since TBD
	 *
	 * @var WP_Block_Type|null
	 */
	private ?WP_Block_Type $registered_single_icon = null;

	/**
	 * Restores the Single Icon block type a test re-registered and empties the CSS a test built.
	 *
	 * @return void
	 */
	protected function tearDown(): void {
		Kadence_Blocks_CSS::$styles = [];

		if ( null !== $this->registered_single_icon ) {
			WP_Block_Type_Registry::get_instance()->unregister( 'kadence/single-icon' );
			WP_Block_Type_Registry::get_instance()->register( $this->registered_single_icon );
			$this->registered_single_icon = null;
		}

		parent::tearDown();
	}

	/**
	 * A Single Icon's own Tablet size wins, and the devices it leaves alone take the site size.
	 *
	 * @return void
	 */
	public function testTheInstanceSizeWinsPerDevice(): void {
		$this->tester->enable_fse_mode();
		$this->store_kadence_values(
			'single-icon',
			[
				'size'       => 80,
				'tabletSize' => 60,
			]
		);

		$icon = $this->render_attributes(
			'single_icon',
			[
				'uniqueID'   => 'a',
				'tabletSize' => 40,
			]
		);

		$this->assertSame( 80, $icon['size'] );
		$this->assertSame( 40, $icon['tabletSize'] );
	}

	/**
	 * The site box values reach Stacked icons only, the instance's own padding side winning; both styles take the site size.
	 *
	 * @return void
	 */
	public function testOnlyStackedIconsTakeTheSiteBox(): void {
		$this->tester->enable_fse_mode();
		$this->store_kadence_values(
			'single-icon',
			[
				'size'        => 80,
				'background'  => '#ff0000',
				'hBackground' => '#00ff00',
				'padding'     => [ 10, 10, 10, 10 ],
			]
		);

		$default = $this->render_attributes( 'single_icon', [ 'uniqueID' => 'a' ] );
		$stacked = $this->render_attributes(
			'single_icon',
			[
				'uniqueID' => 'b',
				'style'    => 'stacked',
				'padding'  => [ '', 4, '', '' ],
			]
		);

		$this->assertSame( 80, $default['size'] );
		$this->assertArrayNotHasKey( 'background', $default );
		$this->assertArrayNotHasKey( 'hBackground', $default );
		$this->assertArrayNotHasKey( 'padding', $default );
		$this->assertSame( '#ff0000', $stacked['background'] );
		$this->assertSame( '#00ff00', $stacked['hBackground'] );
		$this->assertSame( [ 10, 4, 10, 10 ], $stacked['padding'] );
	}

	/**
	 * Stored content, the icon's style and its stroke width, which the saved markup holds, never reach an instance.
	 *
	 * @return void
	 */
	public function testStoredSingleIconContentIsIgnored(): void {
		$this->tester->enable_fse_mode();
		$this->store_kadence_values(
			'single-icon',
			[
				'size'    => 80,
				'icon'    => 'fe_heart',
				'link'    => 'https://example.com',
				'tooltip' => 'Site tooltip',
				'style'   => 'stacked',
				'width'   => 4,
			]
		);

		$icon = $this->render_attributes( 'single_icon', [ 'uniqueID' => 'a' ] );

		$this->assertSame(
			[
				'uniqueID' => 'a',
				'size'     => 80,
			],
			$icon
		);
	}

	/**
	 * The CSS built in the page head, whose filter name keeps the slug's hyphen, takes the site values.
	 *
	 * @return void
	 */
	public function testTheHeadCssTakesTheSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_sizes();
		Kadence_Blocks_CSS::$styles = [];
		$this->assertSame( '', apply_filters( 'kadence_blocks_block_default_attributes', [ 'size' => 50 ], 'kadence/single-icon' )['size'], 'The design tokens no longer blank the size default this test relies on.' );

		Kadence_Blocks_Single_Icon_Block::get_instance()->output_head_data( parse_blocks( $this->single_icon_markup( 'default', 'ic_head' ) )[0] );

		$this->assert_site_sizes( $this->single_icon_css() );
	}

	/**
	 * The CSS a rendered icon prints takes the site size on every device, although the design
	 * tokens blank the icon's registered size default.
	 *
	 * @return void
	 */
	public function testTheRenderedCssTakesTheSiteSizePerDevice(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_sizes();

		$this->assert_site_sizes( $this->tester->rendered_block_css( $this->icon_markup( 'default', 'ic_body' ), 'single-icon' ) );
	}

	/**
	 * An Icon block's CSS takes the site gap and alignment on every device.
	 *
	 * @return void
	 */
	public function testIconTakesTheSiteGapAndAlignmentPerDevice(): void {
		$this->tester->enable_fse_mode();
		$this->store_kadence_values(
			'icon',
			[
				'gap'                 => [ 40, 25, 12 ],
				'textAlignment'       => 'left',
				'mobileTextAlignment' => 'right',
			]
		);

		$css = $this->tester->rendered_block_css( $this->icon_markup( 'default', 'ic_gap' ), 'icon' );

		$this->assertStringContainsString( 'gap:40px', $css );
		$this->assertStringContainsString( 'justify-content:flex-start', $css );
		$this->assertMatchesRegularExpression( '/@media all and \(max-width: 1024px\)\{[^}]*gap:25px/', $css );
		$this->assertMatchesRegularExpression( '/@media all and \(max-width: 767px\)\{[^}]*gap:12px/', $css );
		$this->assertMatchesRegularExpression( '/@media all and \(max-width: 767px\)\{[^}]*justify-content:flex-end/', $css );
	}

	/**
	 * An Advanced Button's CSS takes the site padding on every device.
	 *
	 * @return void
	 */
	public function testAdvancedButtonTakesTheSitePaddingPerDevice(): void {
		$this->tester->enable_fse_mode();
		$this->store_kadence_values(
			'advancedbtn',
			[
				'padding'       => [ 10, 10, 10, 10 ],
				'tabletPadding' => [ 20, 20, 20, 20 ],
				'mobilePadding' => [ 30, 30, 30, 30 ],
			]
		);

		$css = $this->tester->rendered_block_css( $this->advanced_button_markup( 'ab_pad' ), 'advancedbtn' );

		$this->assertStringContainsString( 'padding-top:10px', $css );
		$this->assertMatchesRegularExpression( '/@media all and \(max-width: 1024px\)\{[^}]*padding-top:20px/', $css );
		$this->assertMatchesRegularExpression( '/@media all and \(max-width: 767px\)\{[^}]*padding-top:30px/', $css );
	}

	/**
	 * Classic mode ignores the stored values of all three blocks.
	 *
	 * @return void
	 */
	public function testClassicModeIgnoresTheSiteValues(): void {
		$this->store_kadence_values( 'single-icon', [ 'size' => 80 ] );
		$this->store_kadence_values( 'icon', [ 'gap' => [ 40, 25, 12 ] ] );
		$this->store_kadence_values( 'advancedbtn', [ 'padding' => [ 10, 10, 10, 10 ] ] );

		foreach ( [ 'single_icon', 'icon', 'advancedbtn' ] as $filter_slug ) {
			$this->assertSame( [ 'uniqueID' => 'a' ], $this->render_attributes( $filter_slug, [ 'uniqueID' => 'a' ] ), $filter_slug );
		}
	}

	/**
	 * FSE mode adds no core support to the Icon and Advanced Button wrappers, which have no colors.
	 *
	 * @return void
	 */
	public function testFseModeAddsNoCoreSupportToTheWrappers(): void {
		$this->tester->enable_fse_mode();

		foreach ( [ 'kadence/icon', 'kadence/advancedbtn' ] as $name ) {
			$metadata = [
				'name'     => $name,
				'supports' => [ 'anchor' => true ],
			];

			$this->assertSame( $metadata['supports'], apply_filters( 'block_type_metadata', $metadata )['supports'], $name );
		}
	}

	/**
	 * FSE mode gives Single Icon core's text color only, without serialization.
	 *
	 * @return void
	 */
	public function testFseModeAddsTheTextColorSupportToSingleIcon(): void {
		$this->tester->enable_fse_mode();

		$metadata = apply_filters( 'block_type_metadata', [ 'name' => 'kadence/single-icon' ] );

		$this->assertTrue( $metadata['supports']['color']['text'] );
		$this->assertFalse( $metadata['supports']['color']['background'] );
		$this->assertTrue( $metadata['supports']['color']['__experimentalSkipSerialization'] );
	}

	/**
	 * A site text color leaves the markup of Default and Stacked icons unchanged, although
	 * their `style` attribute is a string where core's color support expects an object.
	 *
	 * @return void
	 */
	public function testSingleIconsRenderUnchangedWithASiteColor(): void {
		$markup = $this->icon_markup( 'default', 'ic_default' ) . $this->icon_markup( 'stacked', 'ic_stacked' );
		$before = do_blocks( $markup );

		$this->tester->enable_fse_mode();
		$this->reregister_single_icon();
		$this->tester->store_user_global_styles(
			[ 'styles' => [ 'blocks' => [ 'kadence/single-icon' => [ 'color' => [ 'text' => '#ff0000' ] ] ] ] ]
		);

		$this->assertTrue( WP_Block_Type_Registry::get_instance()->get_registered( 'kadence/single-icon' )->supports['color']['text'] );
		$this->assertSame( $before, do_blocks( $markup ) );
	}

	/**
	 * Stores Kadence-only site values for one block.
	 *
	 * @param string                                     $slug   The block's key under `settings.custom.kadence`.
	 * @param array<string, int|string|list<int|string>> $values The site values.
	 *
	 * @return void
	 */
	private function store_kadence_values( string $slug, array $values ): void {
		$this->tester->store_user_global_styles( [ 'settings' => [ 'custom' => [ 'kadence' => [ $slug => $values ] ] ] ] );
	}

	/**
	 * Stores a Single Icon size per device: 80px Desktop, 60px Tablet, 30px Mobile.
	 *
	 * @return void
	 */
	private function store_site_sizes(): void {
		$this->store_kadence_values(
			'single-icon',
			[
				'size'       => 80,
				'tabletSize' => 60,
				'mobileSize' => 30,
			]
		);
	}

	/**
	 * Asserts the CSS sizes the icon with the stored site sizes, Tablet and Mobile in Kadence's media queries.
	 *
	 * @param string $css The icon's instance CSS.
	 *
	 * @return void
	 */
	private function assert_site_sizes( string $css ): void {
		$this->assertStringContainsString( 'font-size:80px', $css );
		$this->assertMatchesRegularExpression( '/@media all and \(max-width: 1024px\)\{[^}]*font-size:60px/', $css );
		$this->assertMatchesRegularExpression( '/@media all and \(max-width: 767px\)\{[^}]*font-size:30px/', $css );
	}

	/**
	 * Collects the Single Icon CSS Kadence has built so far.
	 *
	 * @return string The CSS.
	 */
	private function single_icon_css(): string {
		$css = '';

		foreach ( Kadence_Blocks_CSS::$styles as $style_id => $style ) {
			if ( str_starts_with( $style_id, 'kb-single-icon' ) ) {
				$css .= $style;
			}
		}

		return $css;
	}

	/**
	 * Runs a block's render-attributes filter.
	 *
	 * @param string                                     $filter_slug The block slug in the filter name, e.g. `single_icon`.
	 * @param array<string, int|string|list<int|string>> $attributes  The instance's attributes.
	 *
	 * @return array<string, int|string|list<int|string>> The attributes the block renders with.
	 */
	private function render_attributes( string $filter_slug, array $attributes ): array {
		return apply_filters( 'kadence_blocks_' . $filter_slug . '_render_block_attributes', $attributes );
	}

	/**
	 * Registers Single Icon again, so it gets the supports of the current mode.
	 *
	 * @return void
	 */
	private function reregister_single_icon(): void {
		$unregistered                 = WP_Block_Type_Registry::get_instance()->unregister( 'kadence/single-icon' );
		$this->registered_single_icon = $unregistered instanceof WP_Block_Type ? $unregistered : null;

		Kadence_Blocks_Single_Icon_Block::get_instance()->on_init();
	}

	/**
	 * Builds a Single Icon inside an Icon block.
	 *
	 * @param string $style     The icon's style: `default` or `stacked`.
	 * @param string $unique_id The icon's unique ID.
	 *
	 * @return string The block markup.
	 */
	private function icon_markup( string $style, string $unique_id ): string {
		$icons_id = $unique_id . '_icons';

		return '<!-- wp:kadence/icon {"uniqueID":"' . $icons_id . '"} --><div class="wp-block-kadence-icon kt-svg-icons kt-svg-icons' . $icons_id . ' alignnone">'
			. $this->single_icon_markup( $style, $unique_id )
			. '</div><!-- /wp:kadence/icon -->';
	}

	/**
	 * Builds an Advanced Button with one Single Button.
	 *
	 * @param string $unique_id The Advanced Button's unique ID.
	 *
	 * @return string The block markup.
	 */
	private function advanced_button_markup( string $unique_id ): string {
		return '<!-- wp:kadence/advancedbtn {"uniqueID":"' . $unique_id . '"} --><div class="wp-block-kadence-advancedbtn kb-buttons-wrap kb-btns' . $unique_id . '">'
			. '<!-- wp:kadence/singlebtn {"uniqueID":"' . $unique_id . '_b","text":"Button"} /-->'
			. '</div><!-- /wp:kadence/advancedbtn -->';
	}

	/**
	 * Builds a Single Icon.
	 *
	 * @param string $style     The icon's style: `default` or `stacked`.
	 * @param string $unique_id The icon's unique ID.
	 *
	 * @return string The block markup.
	 */
	private function single_icon_markup( string $style, string $unique_id ): string {
		return '<!-- wp:kadence/single-icon {"uniqueID":"' . $unique_id . '","style":"' . $style . '"} -->'
			. '<div class="wp-block-kadence-single-icon kt-svg-style-' . $style . ' kt-svg-icon-wrap kt-svg-item-' . $unique_id . '"><span data-name="fe_aperture" data-stroke="2" class="kadence-dynamic-icon"></span></div>'
			. '<!-- /wp:kadence/single-icon -->';
	}
}
