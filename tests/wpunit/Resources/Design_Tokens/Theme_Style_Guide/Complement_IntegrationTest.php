<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Theme_Style_Guide;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option\Palette_Filter;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Palettes;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Palettes_Controller;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Contracts\Style_Guide_Source;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Overlay;
use ReflectionProperty;
use Tests\Support\Classes\Fake_Style_Guide_Source;
use Tests\Support\Classes\TestCase;
use WP_REST_Request;
use WP_REST_Server;

/**
 * The theme's complement color (palette10) follows the primary color the site actually uses, through the
 * Style Library, the resolver and the theme's palette reads.
 */
final class Complement_IntegrationTest extends TestCase {

	/**
	 * The complement swatch token.
	 */
	private const COMPLEMENT = 'primitive.color.extended.complement';

	/**
	 * The primary swatch token.
	 */
	private const PRIMARY = 'primitive.color.brand.primary';

	/**
	 * The formula the theme renders for a complement-marked palette10.
	 */
	private const FORMULA = 'oklch(from var(--global-palette1) calc(l + 0.10 * (1 - l)) calc(c * 1.00) calc(h + 180) / 100%)';

	/**
	 * @var Effective_Palettes
	 */
	private Effective_Palettes $palettes;

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * Starts each test from an empty store and a theme whose palette10 is the complement marker.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->palettes = $this->container->get( Effective_Palettes::class );
		$this->store    = $this->container->get( Token_Store::class );
		$this->store->delete( Token_Store::default_slug() );

		$this->use_theme_palette(
			[
				'palette1'  => '#2B6CB0',
				'palette10' => '#FfFfFf',
			]
		);

		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'administrator' ] ) );
	}

	/**
	 * Puts the real Style Guide source back and clears the store.
	 *
	 * @return void
	 */
	protected function tearDown(): void {
		wp_set_current_user( 0 );
		$this->swap_style_guide_source( $this->container->get( Style_Guide_Source::class ) );
		$this->store->delete( Token_Store::default_slug() );
		$this->reset_caches();

		parent::tearDown();
	}

	/**
	 * With no Style Library edits the complement is the theme's palette1 complement.
	 *
	 * @return void
	 */
	public function testComplementStartsAsTheThemeComplement(): void {
		$this->assertSame( '#a46900', $this->palettes->complete_swatch_values( 'default' )[ self::COMPLEMENT ] );
		$this->assertSame( '#a46900', $this->resolved( self::COMPLEMENT ) );
	}

	/**
	 * Changing the primary in the Style Library moves the complement with it everywhere: the palette values,
	 * the Style Library view and the resolved token.
	 *
	 * @return void
	 */
	public function testComplementFollowsAPrimaryChangedInTheStyleLibrary(): void {
		$this->set_swatch( self::PRIMARY, '#0000ff' );

		$this->assertSame( '#b33700', $this->palettes->complete_swatch_values( 'default' )[ self::COMPLEMENT ] );
		$this->assertSame( '#b33700', $this->view_value( self::COMPLEMENT ) );
		$this->assertSame( '#b33700', $this->resolved( self::COMPLEMENT ) );
	}

	/**
	 * Saving the whole palette with the worked-out complement doesn't store it, so it keeps following the
	 * primary after a later change.
	 *
	 * @return void
	 */
	public function testSavingThePaletteDoesNotFreezeTheComplement(): void {
		$this->set_swatch( self::PRIMARY, '#0000ff' );
		$this->save_palette_as_shown();

		$this->assertArrayNotHasKey( self::COMPLEMENT, $this->palettes->stored_swatch_values( 'default' ) );

		$this->set_swatch( self::PRIMARY, '#ff0000' );

		$this->assertSame( '#00b6e7', $this->resolved( self::COMPLEMENT ) );
	}

	/**
	 * A complement the site set itself wins over the worked-out one.
	 *
	 * @return void
	 */
	public function testAComplementSetInTheStyleLibraryWins(): void {
		$this->set_swatch( self::PRIMARY, '#0000ff' );
		$this->set_swatch( self::COMPLEMENT, '#123456' );

		$this->assertSame( '#123456', $this->view_value( self::COMPLEMENT ) );
		$this->assertSame( '#123456', $this->resolved( self::COMPLEMENT ) );
	}

	/**
	 * A theme palette10 with its own color is a color, not a complement, so a primary change leaves it alone.
	 *
	 * @return void
	 */
	public function testAThemePalette10ColorDoesNotFollowThePrimary(): void {
		$this->use_theme_palette(
			[
				'palette1'  => '#2B6CB0',
				'palette10' => '#ff0000',
			]
		);

		$this->set_swatch( self::PRIMARY, '#0000ff' );

		$this->assertSame( '#ff0000', $this->resolved( self::COMPLEMENT ) );
	}

	/**
	 * The theme's palette10 read for the active set gets the token color, so a complement set in the Style
	 * Library reaches the theme's own palette10 too.
	 *
	 * @return void
	 */
	public function testTheThemesPalette10ReadGetsTheTokenColor(): void {
		$this->set_swatch( self::COMPLEMENT, '#123456' );

		$filter = $this->container->get( Palette_Filter::class );
		$filter->on_tokens_changed();

		$this->assertSame( '#123456', $filter->filter( self::FORMULA, 'palette10' ) );
	}

	/**
	 * Use a theme Style Guide with the given active palette colors.
	 *
	 * @param array<string, string> $colors Slot slug => color.
	 *
	 * @return void
	 */
	private function use_theme_palette( array $colors ): void {
		$this->swap_style_guide_source( Fake_Style_Guide_Source::with_palette( $colors ) );
	}

	/**
	 * Set one default palette swatch through the Style Library's swatch route.
	 *
	 * @param string $token The swatch token dot-path.
	 * @param string $value The color.
	 *
	 * @return void
	 */
	private function set_swatch( string $token, string $value ): void {
		$request = new WP_REST_Request( 'PUT' );
		$request->set_param( 'id', 'default' );
		$request->set_param( 'token', $token );
		$request->set_param( '$value', $value );

		$this->assertNotWPError( $this->container->get( Palettes_Controller::class )->update_swatch( $request ) );
		$this->reset_caches();
	}

	/**
	 * Save the default palette exactly as the Style Library shows it, the way a group reorder does.
	 *
	 * @return void
	 */
	private function save_palette_as_shown(): void {
		$controller = $this->container->get( Palettes_Controller::class );

		$read = new WP_REST_Request( WP_REST_Server::READABLE );
		$read->set_param( 'id', 'default' );
		$view = $controller->get_item( $read )->get_data();

		$save = new WP_REST_Request( 'PUT' );
		$save->set_param( 'id', 'default' );
		$save->set_param( 'label', $view['label'] );
		$save->set_param( 'groups', $view['groups'] );

		$this->assertNotWPError( $controller->update_item( $save ) );
		$this->reset_caches();
	}

	/**
	 * The value the Style Library view shows for a default palette swatch.
	 *
	 * @param string $token The swatch token dot-path.
	 *
	 * @return string|null
	 */
	private function view_value( string $token ): ?string {
		$read = new WP_REST_Request( WP_REST_Server::READABLE );
		$read->set_param( 'id', 'default' );

		foreach ( $this->container->get( Palettes_Controller::class )->get_item( $read )->get_data()['groups'] as $group ) {
			foreach ( $group['swatches'] as $swatch ) {
				if ( $swatch['token'] === $token ) {
					return $swatch['$value'];
				}
			}
		}

		return null;
	}

	/**
	 * The resolved value of a token.
	 *
	 * @param string $token The token dot-path.
	 *
	 * @return string|null
	 */
	private function resolved( string $token ): ?string {
		return $this->container->get( Token_Resolver::class )->resolve()->value( $token );
	}

	/**
	 * Point the container's overlay at a Style Guide source.
	 *
	 * @param Style_Guide_Source $source The source.
	 *
	 * @return void
	 */
	private function swap_style_guide_source( Style_Guide_Source $source ): void {
		$overlay  = $this->container->get( Style_Guide_Overlay::class );
		$property = new ReflectionProperty( Style_Guide_Overlay::class, 'source' );
		$property->setAccessible( true );
		$property->setValue( $overlay, $source );
		$overlay->flush();
		$this->reset_caches();
	}

	/**
	 * Clear the resolver's per-request memo and the object cache, so each read sees the latest state.
	 *
	 * @return void
	 */
	private function reset_caches(): void {
		$memo = new ReflectionProperty( Token_Resolver::class, 'memo' );
		$memo->setAccessible( true );
		$memo->setValue( $this->container->get( Token_Resolver::class ), [] );
		wp_cache_flush();
	}
}
