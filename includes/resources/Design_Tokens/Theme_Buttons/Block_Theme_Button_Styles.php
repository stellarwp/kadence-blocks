<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons;

use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Contracts\Button_Style_Source;
use KadenceWP\KadenceBlocks\Utils\Cast;
use WP_Theme_JSON_Resolver;

/**
 * A block theme's button styles, read from its theme.json. Asked after the Kadence adapter and before the
 * classic fallback, and it answers only when the theme's own data styles the button element or block, so
 * core's defaults never read as a theme's values.
 *
 * Theme Base is class-painted: the theme's global styles keep painting the button, and the values are read
 * from the merged data (core, theme and the user's Global Styles) for display only. A variation the theme
 * defines for core/button becomes a value preset instead, because a variation's CSS needs a core button
 * wrapper the Button block does not have. Its tokens are the theme base values with the variation's own on
 * top, so a property the variation leaves unset follows the theme's button rather than the plugin's Default.
 *
 * @since TBD
 */
final class Block_Theme_Button_Styles implements Button_Style_Source {

	/**
	 * The classes the theme's global styles paint a button with.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const THEME_CLASS = 'wp-block-button__link button kb-btn-global-inherit';

	/**
	 * The preset properties in the order they are listed, whichever order theme.json declares them in.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const PROPERTY_ORDER = [
		'button-bg',
		'button-text',
		'button-bg-hover',
		'button-text-hover',
		'button-radius',
		'button-border-width',
		'button-border-style',
		'button-border-color',
		'button-padding',
	];

	/**
	 * The sides of a padding object, in slot order.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const SIDES = [ 'top', 'right', 'bottom', 'left' ];

	/**
	 * The corners of a radius object, in slot order.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const CORNERS = [ 'topLeft', 'topRight', 'bottomRight', 'bottomLeft' ];

	/**
	 * Returns the theme's own `styles` array. Null resolves to the theme.json resolver at read time.
	 *
	 * @since TBD
	 *
	 * @var callable|null
	 */
	private $theme_data;

	/**
	 * Returns the merged `styles` array the page renders. Null resolves to the theme.json resolver at read time.
	 *
	 * @since TBD
	 *
	 * @var callable|null
	 */
	private $merged_data;

	/**
	 * @since TBD
	 *
	 * @param callable|null $theme_data  Returns the theme's own `styles` array; tests hand in a fixture.
	 * @param callable|null $merged_data Returns the merged `styles` array; tests hand in a fixture.
	 */
	public function __construct( ?callable $theme_data = null, ?callable $merged_data = null ) {
		$this->theme_data  = $theme_data;
		$this->merged_data = $merged_data;
	}

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function styles(): array {
		$theme    = $this->theme_styles();
		$elements = $this->sub( $theme, 'elements' );
		$blocks   = $this->sub( $theme, 'blocks' );

		if ( ! isset( $elements['button'] ) && ! isset( $blocks['core/button'] ) ) {
			return [];
		}

		$merged  = $this->merged_styles();
		$element = $this->sub( $this->sub( $merged, 'elements' ), 'button' );
		$block   = $this->sub( $this->sub( $merged, 'blocks' ), 'core/button' );
		$base    = $this->values( array_replace_recursive( $element, $block ) );
		$styles  = [
			'base' => [
				'label'  => __( 'Theme Base', 'kadence-blocks' ),
				'class'  => self::THEME_CLASS,
				'values' => $base,
			],
		];

		// Only the theme's own variations: core ships an outline variation, and the merged data carries it on
		// every theme, but a preset named after it would promise a look the theme never defined.
		$own        = $this->sub( $this->sub( $blocks, 'core/button' ), 'variations' );
		$variations = $this->sub( $block, 'variations' );

		foreach ( $own as $name => $data ) {
			$name      = Cast::to_string( $name );
			$variation = $this->sub( $variations, $name );

			if ( ! is_array( $data ) || $data === [] || $variation === [] ) {
				continue;
			}

			$styles[ $name ] = [
				'label'  => sprintf(
					/* translators: %s: the theme's button style variation name, e.g. "Outline". */
					__( 'Theme %s', 'kadence-blocks' ),
					ucwords( str_replace( '-', ' ', $name ) )
				),
				'class'  => '',
				'values' => [],
				'tokens' => $this->ordered( array_replace( $base, $this->variation_values( $variation ) ) ),
			];
		}

		return $styles;
	}

	/**
	 * A variation's tokens: the same reading as the element, plus the two things a variation means that
	 * theme.json leaves implicit. A variation with no background of its own (an outline: core writes it as a
	 * "transparent none" gradient) clears the background in both states, and a text color with no hover
	 * twin keeps that color on hover instead of falling back to the base's hover text.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $variation The merged variation data.
	 *
	 * @return array<string, mixed>
	 */
	private function variation_values( array $variation ): array {
		$values = $this->values( $variation );

		if ( ! isset( $values['button-bg'] ) ) {
			$values['button-bg']       = 'transparent';
			$values['button-bg-hover'] = 'transparent';
		}

		if ( isset( $values['button-text'] ) && ! isset( $values['button-text-hover'] ) ) {
			$values['button-text-hover'] = $values['button-text'];
		}

		return $values;
	}

	/**
	 * The values a theme.json style node renders, keyed by the Button's preset properties. Typography has no
	 * preset field, a gradient and custom css have no binding, and the focus, active and visited states have
	 * no counterpart, so they are not read.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The style node: the button element, the button block or a variation.
	 *
	 * @return array<string, mixed>
	 */
	private function values( array $node ): array {
		$values = [];
		$color  = $this->sub( $node, 'color' );
		$hover  = $this->sub( $this->sub( $node, ':hover' ), 'color' );
		$border = $this->sub( $node, 'border' );

		foreach (
			[
				'button-bg'           => $color['background'] ?? null,
				'button-text'         => $color['text'] ?? null,
				'button-bg-hover'     => $hover['background'] ?? null,
				'button-text-hover'   => $hover['text'] ?? null,
				'button-border-style' => $border['style'] ?? null,
				'button-border-color' => $border['color'] ?? null,
			] as $property => $value
		) {
			$css = $this->css( $value );

			if ( $css !== null ) {
				$values[ $property ] = $css;
			}
		}

		$radius = $this->slots( $border['radius'] ?? null, self::CORNERS );

		if ( $radius !== null ) {
			$values['button-radius'] = $radius;
		}

		$width = $this->css( $border['width'] ?? null );

		if ( $width !== null ) {
			$values['button-border-width'] = [ $width, $width, $width, $width ];
		}

		$padding = $this->slots( $this->sub( $node, 'spacing' )['padding'] ?? null, self::SIDES );

		if ( $padding !== null ) {
			$values['button-padding'] = $padding;
		}

		return $this->ordered( $values );
	}

	/**
	 * A one-value-or-per-slot setting as four slots: a string fills every slot, an object needs every slot
	 * set. Null when the setting is absent or partial.
	 *
	 * @since TBD
	 *
	 * @param mixed    $setting The theme.json value.
	 * @param string[] $keys    The object keys, in slot order.
	 *
	 * @return string[]|null
	 */
	private function slots( $setting, array $keys ): ?array {
		$single = $this->css( $setting );

		if ( $single !== null ) {
			return [ $single, $single, $single, $single ];
		}

		if ( ! is_array( $setting ) ) {
			return null;
		}

		$slots = [];

		foreach ( $keys as $key ) {
			$slot = $this->css( $setting[ $key ] ?? null );

			if ( $slot === null ) {
				return null;
			}

			$slots[] = $slot;
		}

		return $slots;
	}

	/**
	 * A theme.json scalar as CSS, or null when it is not a usable string (unset, empty, or a `false` blanker).
	 * The v3 `var:preset|<group>|<slug>` shorthand becomes the variable core writes for it at CSS time, so a
	 * value stored from here is always valid CSS.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The theme.json value.
	 *
	 * @return string|null
	 */
	private function css( $value ): ?string {
		if ( ! is_string( $value ) && ! is_numeric( $value ) ) {
			return null;
		}

		$value = trim( Cast::to_string( $value ) );

		if ( $value === '' ) {
			return null;
		}

		return (string) preg_replace( '/^var:preset\|([\w-]+)\|([\w-]+)$/', 'var(--wp--preset--$1--$2)', $value );
	}

	/**
	 * A value map in the listing order.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $values The values, in reading order.
	 *
	 * @return array<string, mixed>
	 */
	private function ordered( array $values ): array {
		return array_replace( array_intersect_key( array_fill_keys( self::PROPERTY_ORDER, null ), $values ), $values );
	}

	/**
	 * The theme's own `styles`, empty on a theme without theme.json so a classic theme is never read.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function theme_styles(): array {
		if ( $this->theme_data !== null ) {
			return $this->section( ( $this->theme_data )() );
		}

		if ( ! wp_theme_has_theme_json() ) {
			return [];
		}

		return $this->section( WP_Theme_JSON_Resolver::get_theme_data()->get_raw_data()['styles'] ?? null );
	}

	/**
	 * The merged `styles` the page renders: core, the theme and the user's Global Styles.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function merged_styles(): array {
		if ( $this->merged_data !== null ) {
			return $this->section( ( $this->merged_data )() );
		}

		return $this->section( WP_Theme_JSON_Resolver::get_merged_data()->get_raw_data()['styles'] ?? null );
	}

	/**
	 * A raw `styles` section narrowed to an array.
	 *
	 * @since TBD
	 *
	 * @param mixed $styles The section.
	 *
	 * @return array<string, mixed>
	 */
	private function section( $styles ): array {
		return is_array( $styles ) ? $styles : [];
	}

	/**
	 * The array under a key, empty when the key is missing or holds a scalar.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The parent.
	 * @param string               $key  The key.
	 *
	 * @return array<string, mixed>
	 */
	private function sub( array $node, string $key ): array {
		return is_array( $node[ $key ] ?? null ) ? $node[ $key ] : [];
	}
}
