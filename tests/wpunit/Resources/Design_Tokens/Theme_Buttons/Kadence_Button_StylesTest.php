<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Theme_Buttons;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Kadence_Button_Styles;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Mapper;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Overlay;
use Tests\Support\Classes\Fake_Style_Guide_Source;
use Tests\Support\Classes\TestCase;

/**
 * Covers the Kadence adapter: which sections it offers, the classes each wears, and how the Customizer's
 * settings become display values, read through a closure that answers in the theme's real shapes.
 */
final class Kadence_Button_StylesTest extends TestCase {

	/**
	 * The theme's shipped button settings, in the shapes kadence()->option() returns them.
	 *
	 * @var array<string, mixed>
	 */
	private const THEME_DEFAULTS = [
		'buttons_color'                  => [
			'color' => 'palette9',
			'hover' => 'palette9',
		],
		'buttons_background'             => [
			'color' => 'palette1',
			'hover' => 'palette2',
		],
		'buttons_border_colors'          => [
			'color' => '',
			'hover' => '',
		],
		'buttons_border'                 => [],
		'buttons_border_radius'          => [
			'size' => [
				'mobile'  => '',
				'tablet'  => '',
				'desktop' => '',
			],
			'unit' => [
				'mobile'  => 'px',
				'tablet'  => 'px',
				'desktop' => 'px',
			],
		],
		'buttons_padding'                => [
			'size' => [ 'desktop' => [ '', '', '', '' ] ],
			'unit' => [ 'desktop' => 'px' ],
		],
		'buttons_shadow'                 => [
			'color'    => 'rgba(0,0,0,0)',
			'hOffset'  => 0,
			'vOffset'  => 0,
			'blur'     => 0,
			'spread'   => -7,
			'inset'    => false,
			'disabled' => false,
		],
		'buttons_shadow_hover'           => [
			'color'    => 'rgba(0,0,0,0.1)',
			'hOffset'  => 0,
			'vOffset'  => 15,
			'blur'     => 25,
			'spread'   => -7,
			'inset'    => false,
			'disabled' => false,
		],
		'buttons_secondary_color'        => [
			'color' => 'palette3',
			'hover' => 'palette9',
		],
		'buttons_secondary_background'   => [
			'color' => 'palette7',
			'hover' => 'palette2',
		],
		'buttons_secondary_shadow'       => [
			'color'    => 'rgba(0,0,0,0)',
			'hOffset'  => 0,
			'vOffset'  => 0,
			'blur'     => 0,
			'spread'   => -7,
			'inset'    => false,
			'disabled' => true,
		],
		'buttons_secondary_shadow_hover' => [
			'color'    => 'rgba(0,0,0,0.1)',
			'hOffset'  => 0,
			'vOffset'  => 15,
			'blur'     => 25,
			'spread'   => -7,
			'inset'    => false,
			'disabled' => true,
		],
	];

	/**
	 * The theme offers its base and secondary sections, each wearing the classes the theme's stylesheet
	 * paints, under the labels the Button's inherit modes have always used.
	 *
	 * @return void
	 */
	public function testOffersBaseAndSecondaryWithTheirClasses(): void {
		$styles = $this->adapter( self::THEME_DEFAULTS )->styles();

		$this->assertSame( [ 'base', 'secondary' ], array_keys( $styles ) );
		$this->assertSame( 'Theme Base', $styles['base']['label'] );
		$this->assertSame( 'wp-block-button__link button kb-btn-global-inherit', $styles['base']['class'] );
		$this->assertSame( 'Theme Secondary', $styles['secondary']['label'] );
		$this->assertSame( 'wp-block-button__link button button-style-secondary kb-btn-global-inherit', $styles['secondary']['class'] );
	}

	/**
	 * A section whose color setting the theme does not have (an older theme without a secondary button)
	 * is not offered.
	 *
	 * @return void
	 */
	public function testSkipsASectionTheThemeDoesNotHave(): void {
		$settings = self::THEME_DEFAULTS;
		unset( $settings['buttons_secondary_color'] );

		$this->assertSame( [ 'base' ], array_keys( $this->adapter( $settings )->styles() ) );
	}

	/**
	 * A color setting that names a claimed palette slot displays as the alias of the primitive that claims
	 * it, the same conversion the Style Guide overlay uses.
	 *
	 * @return void
	 */
	public function testAClaimedSlotDisplaysAsAnAlias(): void {
		$values = $this->adapter( self::THEME_DEFAULTS )->styles()['base']['values'];

		$this->assertSame( '{primitive.color.brand.primary}', $values['button-bg'] );
		$this->assertSame( '{primitive.color.brand.secondary}', $values['button-bg-hover'] );
		$this->assertSame( '{primitive.color.neutral.0}', $values['button-text'] );
	}

	/**
	 * A gradient background is displayed as it is stored, since that is what the theme renders.
	 *
	 * @return void
	 */
	public function testAGradientBackgroundDisplaysAsIs(): void {
		$settings                                = self::THEME_DEFAULTS;
		$settings['buttons_background']['color'] = 'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(20,39,109) 100%)';

		$values = $this->adapter( $settings )->styles()['base']['values'];

		$this->assertSame( 'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(20,39,109) 100%)', $values['button-bg'] );
	}

	/**
	 * An empty radius, padding, border and border color are omitted, so the theme's static stylesheet
	 * stays the source of those values; the shipped base shadow is displayed because the theme renders it.
	 *
	 * @return void
	 */
	public function testOmitsEverySettingTheThemeLeavesEmpty(): void {
		$values = $this->adapter( self::THEME_DEFAULTS )->styles()['base']['values'];

		$this->assertArrayNotHasKey( 'button-radius', $values );
		$this->assertArrayNotHasKey( 'button-padding', $values );
		$this->assertArrayNotHasKey( 'button-border-width', $values );
		$this->assertArrayNotHasKey( 'button-border-style', $values );
		$this->assertArrayNotHasKey( 'button-border-color', $values );
		$this->assertArrayNotHasKey( 'button-border-hover-color', $values );
		$this->assertSame(
			[
				'color'   => 'rgba(0,0,0,0)',
				'offsetX' => '0px',
				'offsetY' => '0px',
				'blur'    => '0px',
				'spread'  => '-7px',
				'inset'   => false,
			],
			$values['button-shadow']
		);
		$this->assertSame(
			[
				'color'   => 'rgba(0,0,0,0.1)',
				'offsetX' => '0px',
				'offsetY' => '15px',
				'blur'    => '25px',
				'spread'  => '-7px',
				'inset'   => false,
			],
			$values['button-shadow-hover']
		);
	}

	/**
	 * A disabled shadow is omitted: the theme renders none for it.
	 *
	 * @return void
	 */
	public function testOmitsADisabledShadow(): void {
		$values = $this->adapter( self::THEME_DEFAULTS )->styles()['secondary']['values'];

		$this->assertArrayNotHasKey( 'button-shadow', $values );
		$this->assertArrayNotHasKey( 'button-shadow-hover', $values );
	}

	/**
	 * A set radius displays as four equal corners in the setting's unit, the theme's control being one value.
	 *
	 * @return void
	 */
	public function testASetRadiusDisplaysAsFourEqualCorners(): void {
		$settings = self::THEME_DEFAULTS;
		$settings['buttons_border_radius']['size']['desktop'] = 8;

		$values = $this->adapter( $settings )->styles()['base']['values'];

		$this->assertSame( [ '8px', '8px', '8px', '8px' ], $values['button-radius'] );
	}

	/**
	 * A padding with all four sides set displays as four lengths in the setting's unit.
	 *
	 * @return void
	 */
	public function testASetPaddingDisplaysAsFourSides(): void {
		$settings                                       = self::THEME_DEFAULTS;
		$settings['buttons_padding']['size']['desktop'] = [ 10, 20, 10, 20 ];
		$settings['buttons_padding']['unit']['desktop'] = 'em';

		$values = $this->adapter( $settings )->styles()['base']['values'];

		$this->assertSame( [ '10em', '20em', '10em', '20em' ], $values['button-padding'] );
	}

	/**
	 * A padding with a side left empty is omitted whole, since the theme renders it only when a side is set
	 * and a preset value is all four sides.
	 *
	 * @return void
	 */
	public function testAPartialPaddingIsOmitted(): void {
		$settings                                       = self::THEME_DEFAULTS;
		$settings['buttons_padding']['size']['desktop'] = [ 10, '', 10, '' ];

		$this->assertArrayNotHasKey( 'button-padding', $this->adapter( $settings )->styles()['base']['values'] );
	}

	/**
	 * A border with a style set displays its width and style; the border color comes from the theme's
	 * separate border color setting.
	 *
	 * @return void
	 */
	public function testASetBorderDisplaysItsWidthStyleAndColor(): void {
		$settings                                   = self::THEME_DEFAULTS;
		$settings['buttons_border']                 = [
			'desktop' => [
				'width' => 2,
				'unit'  => 'px',
				'style' => 'solid',
				'color' => '',
			],
		];
		$settings['buttons_border_colors']['color'] = 'palette1';
		$settings['buttons_border_colors']['hover'] = '#ff0000';

		$values = $this->adapter( $settings )->styles()['base']['values'];

		$this->assertSame( '2px', $values['button-border-width'] );
		$this->assertSame( 'solid', $values['button-border-style'] );
		$this->assertSame( '{primitive.color.brand.primary}', $values['button-border-color'] );
		$this->assertSame( '#ff0000', $values['button-border-hover-color'] );
	}

	/**
	 * With no reader (the Kadence theme is not active) the adapter offers nothing, so the next adapter is asked.
	 *
	 * @return void
	 */
	public function testOffersNothingWithoutTheTheme(): void {
		$adapter = new Kadence_Button_Styles(
			new Fake_Style_Guide_Source( null ),
			new Style_Guide_Mapper(),
			$this->overlay( new Fake_Style_Guide_Source( null ) )
		);

		$this->assertSame( [], $adapter->styles() );
	}

	/**
	 * An adapter reading the given settings through a closure, over a palette whose slots carry a color.
	 *
	 * @param array<string, mixed> $settings Setting key => the value kadence()->option() returns.
	 *
	 * @return Kadence_Button_Styles
	 */
	private function adapter( array $settings ): Kadence_Button_Styles {
		$source = Fake_Style_Guide_Source::with_palette(
			[
				'palette1' => '#111111',
				'palette2' => '#222222',
				'palette3' => '#333333',
				'palette7' => '#777777',
				'palette9' => '#999999',
			]
		);

		return new Kadence_Button_Styles(
			$source,
			new Style_Guide_Mapper(),
			$this->overlay( $source ),
			static function ( string $key ) use ( $settings ) {
				return $settings[ $key ] ?? '';
			}
		);
	}

	/**
	 * An overlay over the given source, with the real mapper and registry, for its slot => token map.
	 *
	 * @param Fake_Style_Guide_Source $source The palette source.
	 *
	 * @return Style_Guide_Overlay
	 */
	private function overlay( Fake_Style_Guide_Source $source ): Style_Guide_Overlay {
		return new Style_Guide_Overlay( $source, new Style_Guide_Mapper(), $this->container->get( Token_Registry::class ) );
	}
}
