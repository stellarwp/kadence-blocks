<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles;

use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Cascades_Site_Styles;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Groups_Site_Styles;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Scopes_Site_Styles;

/**
 * Merges a block's site-level values into each instance's attributes before
 * Kadence builds its markup and CSS, so the existing builders render them.
 *
 * Precedence is decided per leaf: an instance leaf that differs from the
 * block's default wins, every other leaf takes the site value. Stored values
 * of attributes the block excludes are ignored. A block that scopes its site
 * styles gives each instance only the site values its style takes, a block
 * that groups them gives a group the instance sets itself none of the group's
 * site values, and a block that cascades them drops the site values an own
 * value of the instance covers.
 *
 * @since TBD Merges only the values the block lists for the overlay (classes and editor inline styles). Core's global stylesheet renders the core keys, and `Site_Rules` the rest.
 */
final class Overlay {

	/**
	 * The site-level values.
	 *
	 * @var Store
	 */
	private Store $store;

	/**
	 * The supported blocks.
	 *
	 * @var Supported_Blocks
	 */
	private Supported_Blocks $blocks;

	/**
	 * @since TBD
	 *
	 * @param Store            $store  The site-level values.
	 * @param Supported_Blocks $blocks The supported blocks.
	 */
	public function __construct( Store $store, Supported_Blocks $blocks ) {
		$this->store  = $store;
		$this->blocks = $blocks;
	}

	/**
	 * The render-attributes filters of each supported block, e.g.
	 * `kadence_blocks_singlebtn_render_block_attributes`. A slug with a hyphen has
	 * two: the CSS built in the page head keeps the hyphen, the block render
	 * replaces it with an underscore.
	 *
	 * @since TBD
	 *
	 * @return array<string, string> Filter name => block name.
	 */
	public function hooks(): array {
		$hooks = [];

		foreach ( $this->blocks->all() as $block_name => $block ) {
			foreach ( array_unique( [ $block->get_slug(), str_replace( '-', '_', $block->get_slug() ) ] ) as $slug ) {
				$hooks[ 'kadence_blocks_' . $slug . '_render_block_attributes' ] = $block_name;
			}
		}

		return $hooks;
	}

	/**
	 * Filters a block's attributes before rendering. The block is identified by
	 * the filter being run.
	 *
	 * @since TBD
	 *
	 * @param mixed $attributes The block's attributes.
	 *
	 * @return mixed The attributes with the site-level values merged in.
	 */
	public function filter_render_attributes( $attributes ) {
		$block_name = $this->hooks()[ current_filter() ] ?? null;

		if ( null === $block_name || ! is_array( $attributes ) ) {
			return $attributes;
		}

		return $this->apply( $block_name, $attributes );
	}

	/**
	 * An untouched instance carries the registered defaults, filled in by the block
	 * render, or the defaults the design tokens supply, merged in for the page
	 * head's CSS. A value equal to either is not the instance's own.
	 *
	 * @since TBD
	 *
	 * @param string               $block_name Block name, e.g. `kadence/singlebtn`.
	 * @param array<string, mixed> $attributes The instance's attributes.
	 *
	 * @return array<string, mixed> The attributes with the site-level values merged in.
	 */
	public function apply( string $block_name, array $attributes ): array {
		$block = $this->blocks->get( $block_name );

		if ( null === $block ) {
			return $attributes;
		}

		$site = array_intersect_key( $this->store->attributes( $block_name ), array_flip( $block->site_styles_overlay_attributes() ) );

		if ( ! $site ) {
			return $attributes;
		}

		$registered = Supported_Blocks::registered_defaults( $block_name );

		if ( $block instanceof Scopes_Site_Styles ) {
			$scope_attribute = $block->site_styles_scope_attribute();
			$site            = self::scope(
				$site,
				[ $scope_attribute => $block->site_styles_scope_style( $attributes ) ],
				[
					'attribute'  => $scope_attribute,
					'attributes' => $block->site_styles_scoped_attributes(),
				],
				$registered[ $scope_attribute ] ?? null
			);
		}

		if ( ! $site ) {
			return $attributes;
		}

		/** This filter is documented in includes/blocks/class-kadence-blocks-abstract-block.php */
		$filtered = apply_filters( 'kadence_blocks_block_default_attributes', $registered, $block_name );
		$filtered = is_array( $filtered ) ? $filtered : $registered;

		if ( $block instanceof Groups_Site_Styles ) {
			$groups   = $block->site_styles_attribute_groups();
			$defaults = [];

			foreach ( array_merge( ...$groups ) as $name ) {
				$defaults[ $name ] = self::default_value( $name, $attributes[ $name ] ?? null, $registered, $filtered );
			}

			$site = self::group( $site, $attributes, $groups, $defaults );
		}

		if ( $block instanceof Cascades_Site_Styles ) {
			$cascades = $block->site_styles_cascades();
			$defaults = [];

			foreach ( $cascades as $cascade ) {
				foreach ( array_merge( $cascade['values'], isset( $cascade['unit'] ) ? [ $cascade['unit'] ] : [] ) as $name ) {
					$defaults[ $name ] = self::default_value( $name, $attributes[ $name ] ?? null, $registered, $filtered );
				}
			}

			$site = self::without_overridden( $site, $attributes, $defaults, $cascades );
		}

		foreach ( $site as $name => $value ) {
			$instance            = $attributes[ $name ] ?? null;
			$attributes[ $name ] = self::merge( $instance, $value, self::default_value( $name, $instance, $registered, $filtered ) );
		}

		return $attributes;
	}

	/**
	 * Drops the site values an own value of the instance covers. An own value
	 * holds for the narrower devices after it, as in CSS, so the site's value for
	 * one of them must not replace it. Values are in one unit: when the instance
	 * has an own value or an own unit in a cascade and its unit is not the site's,
	 * no site value of the cascade is shown.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed>                                   $site       Attribute name => site value.
	 * @param array<string, mixed>                                   $attributes The instance's attributes.
	 * @param array<string, mixed>                                   $defaults   Attribute name => the default the instance's value is compared with.
	 * @param array<int, array{unit?: string, values: list<string>}> $cascades   The attribute cascades.
	 *
	 * @return array<string, mixed> The site values the instance takes.
	 */
	public static function without_overridden( array $site, array $attributes, array $defaults, array $cascades ): array {
		$is_own = static fn( string $name ): bool => null !== ( $attributes[ $name ] ?? null ) && $attributes[ $name ] !== ( $defaults[ $name ] ?? null );

		foreach ( $cascades as $cascade ) {
			$unit  = $cascade['unit'] ?? null;
			$names = null === $unit ? $cascade['values'] : array_merge( $cascade['values'], [ $unit ] );

			if ( null !== $unit && array_filter( $names, $is_own ) !== [] && ( $attributes[ $unit ] ?? $defaults[ $unit ] ?? null ) !== ( $site[ $unit ] ?? $defaults[ $unit ] ?? null ) ) {
				$site = array_diff_key( $site, array_flip( $names ) );
				continue;
			}

			$overridden = false;

			foreach ( $cascade['values'] as $name ) {
				if ( $overridden ) {
					unset( $site[ $name ] );
				}

				$overridden = $overridden || $is_own( $name );
			}
		}

		return $site;
	}

	/**
	 * Keeps the site values the instance's style takes. The style is the
	 * instance's own value of the scope attribute, or the block's default. A
	 * style that isn't listed takes every site value.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed>                                              $site          Attribute name => site value.
	 * @param array<string, mixed>                                              $attributes    The instance's attributes.
	 * @param array{attribute: string, attributes: array<string, list<string>>} $scope         The scope attribute, and style => the site attributes it takes.
	 * @param mixed                                                             $default_style The scope attribute's default.
	 *
	 * @return array<string, mixed> The site values the instance takes.
	 */
	public static function scope( array $site, array $attributes, array $scope, $default_style ): array {
		$style = $attributes[ $scope['attribute'] ] ?? $default_style;

		if ( ! is_string( $style ) || ! isset( $scope['attributes'][ $style ] ) ) {
			return $site;
		}

		return array_intersect_key( $site, array_flip( $scope['attributes'][ $style ] ) );
	}

	/**
	 * Drops the site values of every group the instance sets itself. The
	 * instance sets a group when it has a value other than the block's
	 * default for any of the group's attributes, the same test `merge()` uses.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed>     $site       Attribute name => site value.
	 * @param array<string, mixed>     $attributes The instance's attributes.
	 * @param array<int, list<string>> $groups     Groups of attribute names.
	 * @param array<string, mixed>     $defaults   Attribute name => the block's default value.
	 *
	 * @return array<string, mixed> The site values the instance takes.
	 */
	public static function group( array $site, array $attributes, array $groups, array $defaults ): array {
		foreach ( $groups as $group ) {
			foreach ( $group as $name ) {
				if ( isset( $attributes[ $name ] ) && $attributes[ $name ] !== ( $defaults[ $name ] ?? null ) ) {
					$site = array_diff_key( $site, array_flip( $group ) );
					break;
				}
			}
		}

		return $site;
	}

	/**
	 * Merges one attribute's site value into the instance value, leaf by leaf.
	 *
	 * @since TBD
	 *
	 * @param mixed $instance The instance value, null when the instance doesn't have the attribute.
	 * @param mixed $site     The site value.
	 * @param mixed $default  The block's default value.
	 *
	 * @return mixed The merged value.
	 */
	public static function merge( $instance, $site, $default ) {
		if ( null === $instance || $instance === $default ) {
			return $site;
		}

		if ( is_array( $instance ) && is_array( $site ) && is_array( $default ) ) {
			foreach ( $site as $key => $value ) {
				$instance[ $key ] = self::merge( $instance[ $key ] ?? null, $value, $default[ $key ] ?? null );
			}
		}

		return $instance;
	}

	/**
	 * The default an instance value is measured against. A value that matches
	 * the filtered default came from Block Defaults when the block was
	 * inserted, so it counts as the default too.
	 *
	 * @since TBD
	 *
	 * @param string               $name       Attribute name.
	 * @param mixed                $instance   The instance value, null when the instance doesn't have it.
	 * @param array<string, mixed> $registered Attribute name => the default the block registers.
	 * @param array<string, mixed> $filtered   Attribute name => the default after Block Defaults.
	 *
	 * @return mixed The default.
	 */
	private static function default_value( string $name, $instance, array $registered, array $filtered ) {
		return ( array_key_exists( $name, $filtered ) && $instance === $filtered[ $name ] ) ? $instance : ( $registered[ $name ] ?? null );
	}
}
