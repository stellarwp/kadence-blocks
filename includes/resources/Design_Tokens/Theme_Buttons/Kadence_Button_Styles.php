<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons;

use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Contracts\Button_Style_Source;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Contracts\Style_Guide_Source;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Mapper;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Overlay;
use KadenceWP\KadenceBlocks\Utils\Cast;

/**
 * The Kadence theme's button styles: the Customizer's base and secondary button sections, each offered as
 * a class-painted preset wearing the classes the theme's own stylesheet and dynamic CSS already target.
 * The section's settings are read only for display; nothing here paints the button, so a button on one of
 * these presets renders exactly as a theme-styled button does today and follows every Customizer change.
 *
 * The theme is not part of the plugin's static-analysis scan, so it is reached through a validated
 * callable and every setting is narrowed here rather than typed against theme classes.
 *
 * @since TBD
 */
final class Kadence_Button_Styles implements Button_Style_Source {

	/**
	 * Candidate sections, probed at runtime: unprefixed slug => the setting prefix the section stores under
	 * and the classes the theme paints it with. A section that does not answer is not offered.
	 *
	 * @since TBD
	 *
	 * @var array<string, array{prefix: string, class: string}>
	 */
	private const SECTIONS = [
		'base'      => [
			'prefix' => 'buttons_',
			'class'  => 'wp-block-button__link button kb-btn-global-inherit',
		],
		'secondary' => [
			'prefix' => 'buttons_secondary_',
			'class'  => 'wp-block-button__link button button-style-secondary kb-btn-global-inherit',
		],
	];

	/**
	 * The device whose values are displayed. The theme's controls are per device; a preset value is one.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const DEVICE = 'desktop';

	/**
	 * The theme's accessor function; returns its Template_Tags proxy.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const THEME_ACCESSOR = 'Kadence\kadence';

	/**
	 * The theme class whose presence means the theme is active.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const THEME_CLASS = 'Kadence\Theme';

	/**
	 * The theme's palette, so a setting that names a palette slot converts the same way the Style Guide does.
	 *
	 * @since TBD
	 *
	 * @var Style_Guide_Source
	 */
	private Style_Guide_Source $palette;

	/**
	 * Converts a theme color setting to a token value.
	 *
	 * @since TBD
	 *
	 * @var Style_Guide_Mapper
	 */
	private Style_Guide_Mapper $mapper;

	/**
	 * Supplies the slot => token map the color conversion aliases through.
	 *
	 * @since TBD
	 *
	 * @var Style_Guide_Overlay
	 */
	private Style_Guide_Overlay $overlay;

	/**
	 * Returns kadence()->option( $key ). Null resolves to the theme's own reader at read time, so the theme
	 * can load after this object is built.
	 *
	 * @since TBD
	 *
	 * @var callable|null
	 */
	private $option_reader;

	/**
	 * @since TBD
	 *
	 * @param Style_Guide_Source  $palette       The theme's palette source.
	 * @param Style_Guide_Mapper  $mapper        The color conversion.
	 * @param Style_Guide_Overlay $overlay       The slot => token map.
	 * @param callable|null       $option_reader Returns kadence()->option( $key ); tests hand in a closure.
	 */
	public function __construct(
		Style_Guide_Source $palette,
		Style_Guide_Mapper $mapper,
		Style_Guide_Overlay $overlay,
		?callable $option_reader = null
	) {
		$this->palette       = $palette;
		$this->mapper        = $mapper;
		$this->overlay       = $overlay;
		$this->option_reader = $option_reader;
	}

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function styles(): array {
		$read = $this->option_reader ?? $this->theme_option_reader();

		if ( $read === null ) {
			return [];
		}

		$snapshot = $this->palette->snapshot();
		$set      = $snapshot === null ? [] : $this->mapper->active_set( $snapshot['palette'] );
		$slots    = $this->overlay->slot_tokens();
		$styles   = [];

		foreach ( self::SECTIONS as $slug => $section ) {
			// A section the theme does not have (an older theme without the secondary button) answers with
			// the empty default instead of the color array, and is not offered.
			if ( ! is_array( $read( $section['prefix'] . 'color' ) ) ) {
				continue;
			}

			$styles[ $slug ] = [
				'label'  => $this->label( $slug ),
				'class'  => $section['class'],
				'values' => $this->values( $read, $section['prefix'], $set, $slots ),
			];
		}

		return $styles;
	}

	/**
	 * The preset label of a section.
	 *
	 * @since TBD
	 *
	 * @param string $slug The unprefixed section slug.
	 *
	 * @return string
	 */
	private function label( string $slug ): string {
		return $slug === 'secondary' ? __( 'Theme Secondary', 'kadence-blocks' ) : __( 'Theme Base', 'kadence-blocks' );
	}

	/**
	 * The values the theme renders for a section, keyed by the Button's preset properties. A setting the
	 * theme leaves empty is omitted, so the theme's static stylesheet stays the source of that value.
	 *
	 * @since TBD
	 *
	 * @param callable              $read   Returns kadence()->option( $key ).
	 * @param string                $prefix The section's setting prefix.
	 * @param array<string, string> $set    Slot slug => color of the active palette set.
	 * @param array<string, string> $slots  Slot slug => token id.
	 *
	 * @return array<string, mixed>
	 */
	private function values( callable $read, string $prefix, array $set, array $slots ): array {
		$values = [];
		$colors = [
			'button-text'               => [ 'color', 'color' ],
			'button-text-hover'         => [ 'color', 'hover' ],
			'button-bg'                 => [ 'background', 'color' ],
			'button-bg-hover'           => [ 'background', 'hover' ],
			'button-border-color'       => [ 'border_colors', 'color' ],
			'button-border-hover-color' => [ 'border_colors', 'hover' ],
		];

		foreach ( $colors as $property => [ $setting, $key ] ) {
			$option = $read( $prefix . $setting );
			$color  = Style_Guide_Mapper::theme_color_value( is_array( $option ) ? $option[ $key ] ?? null : null, $set, $slots );

			if ( $color !== null ) {
				$values[ $property ] = $color;
			}
		}

		$radius = $this->range( $read( $prefix . 'border_radius' ) );

		if ( $radius !== null ) {
			$values['button-radius'] = [ $radius, $radius, $radius, $radius ];
		}

		$padding = $this->measure( $read( $prefix . 'padding' ) );

		if ( $padding !== null ) {
			$values['button-padding'] = $padding;
		}

		$border = $this->border( $read( $prefix . 'border' ) );

		if ( $border !== null ) {
			$values['button-border-width'] = $border['width'];
			$values['button-border-style'] = $border['style'];
		}

		$shadow = $this->shadow( $read( $prefix . 'shadow' ), $set, $slots );

		if ( $shadow !== null ) {
			$values['button-shadow'] = $shadow;
		}

		$shadow_hover = $this->shadow( $read( $prefix . 'shadow_hover' ), $set, $slots );

		if ( $shadow_hover !== null ) {
			$values['button-shadow-hover'] = $shadow_hover;
		}

		return $values;
	}

	/**
	 * A range setting ({ size: { desktop… }, unit: { desktop… } }) as one length, or null when unset.
	 *
	 * @since TBD
	 *
	 * @param mixed $option The setting value.
	 *
	 * @return string|null
	 */
	private function range( $option ): ?string {
		if ( ! is_array( $option ) || ! is_array( $option['size'] ?? null ) ) {
			return null;
		}

		$size = $option['size'][ self::DEVICE ] ?? null;

		if ( ! is_numeric( $size ) ) {
			return null;
		}

		return Cast::to_string( $size ) . $this->unit( $option );
	}

	/**
	 * A measure setting ({ size: { desktop: [ top, right, bottom, left ] }, unit: { desktop… } }) as four
	 * lengths, or null unless every side is set.
	 *
	 * @since TBD
	 *
	 * @param mixed $option The setting value.
	 *
	 * @return string[]|null
	 */
	private function measure( $option ): ?array {
		if ( ! is_array( $option ) || ! is_array( $option['size'] ?? null ) ) {
			return null;
		}

		$sides = $option['size'][ self::DEVICE ] ?? null;

		if ( ! is_array( $sides ) || count( $sides ) !== 4 ) {
			return null;
		}

		$unit    = $this->unit( $option );
		$lengths = [];

		foreach ( $sides as $side ) {
			if ( ! is_numeric( $side ) ) {
				return null;
			}

			$lengths[] = Cast::to_string( $side ) . $unit;
		}

		return $lengths;
	}

	/**
	 * A border setting ({ desktop: { width, unit, style } }) as its width and style, or null when the theme
	 * emits no border (no style set).
	 *
	 * @since TBD
	 *
	 * @param mixed $option The setting value.
	 *
	 * @return array{width: string, style: string}|null
	 */
	private function border( $option ): ?array {
		if ( ! is_array( $option ) || ! is_array( $option[ self::DEVICE ] ?? null ) ) {
			return null;
		}

		$border = $option[ self::DEVICE ];
		$style  = Cast::to_string( $border['style'] ?? '' );

		if ( $style === '' ) {
			return null;
		}

		$width = Cast::to_string( $border['width'] ?? '' );
		$unit  = Cast::to_string( $border['unit'] ?? '' );

		return [
			'width' => ( $width === '' ? '0' : $width ) . ( $unit === '' ? 'px' : $unit ),
			'style' => $style,
		];
	}

	/**
	 * A shadow setting ({ color, hOffset, vOffset, blur, spread, inset, disabled }) as a shadow composite,
	 * or null when the theme renders none.
	 *
	 * @since TBD
	 *
	 * @param mixed                 $option The setting value.
	 * @param array<string, string> $set    Slot slug => color of the active palette set.
	 * @param array<string, string> $slots  Slot slug => token id.
	 *
	 * @return array<string, mixed>|null
	 */
	private function shadow( $option, array $set, array $slots ): ?array {
		if ( ! is_array( $option ) || ( $option['disabled'] ?? false ) === true ) {
			return null;
		}

		foreach ( [ 'color', 'hOffset', 'vOffset', 'blur', 'spread' ] as $field ) {
			if ( ! isset( $option[ $field ] ) ) {
				return null;
			}
		}

		$color = Style_Guide_Mapper::theme_color_value( $option['color'], $set, $slots );

		return [
			'color'   => $color ?? 'rgba(0,0,0,0)',
			'offsetX' => $this->px( $option['hOffset'] ),
			'offsetY' => $this->px( $option['vOffset'] ),
			'blur'    => $this->px( $option['blur'] ),
			'spread'  => $this->px( $option['spread'] ),
			'inset'   => ( $option['inset'] ?? false ) === true,
		];
	}

	/**
	 * A shadow offset as a pixel length; the theme renders every non-numeric or empty offset as 0.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The offset.
	 *
	 * @return string
	 */
	private function px( $value ): string {
		return ( is_numeric( $value ) ? Cast::to_string( $value ) : '0' ) . 'px';
	}

	/**
	 * The desktop unit of a range or measure setting, px when unset.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $option The setting value.
	 *
	 * @return string
	 */
	private function unit( array $option ): string {
		$unit = is_array( $option['unit'] ?? null ) ? Cast::to_string( $option['unit'][ self::DEVICE ] ?? '' ) : '';

		return $unit === '' ? 'px' : $unit;
	}

	/**
	 * A reader over the theme's option(), or null when the Kadence theme is not active or not yet loaded.
	 *
	 * @since TBD
	 *
	 * @return callable|null
	 */
	private function theme_option_reader(): ?callable {
		/** @var callable-string $accessor The theme's accessor; guarded by function_exists() below. */
		$accessor = self::THEME_ACCESSOR;

		// The theme is not in the plugin's static-analysis scope, so its class and function are unknown
		// symbols here. Both checks are real at runtime; the indirection keeps the analyzer from folding
		// them to a constant false and reporting the rest of this method as dead.
		if ( ! class_exists( self::THEME_CLASS ) || ! function_exists( $accessor ) ) {
			return null;
		}

		$theme  = call_user_func( $accessor );
		$option = [ $theme, 'option' ];

		return is_object( $theme ) && is_callable( $option ) ? $option : null;
	}
}
