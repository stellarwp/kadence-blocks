<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles;

use Kadence_Blocks_Abstract_Block;
use Kadence_Blocks_CSS;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Scopes_Site_Styles;
use WP_Block_Type_Registry;

/**
 * Prints a block's Kadence-only site values with the block's own CSS builder.
 *
 * `build_css()` runs under a placeholder ID twice, with the block's defaults
 * and with the defaults plus the site values. The rules only the second run
 * produces are kept, and the instance class becomes the style's class in
 * `:where()`, so each site rule is one class weaker than the instance rule for
 * the same property.
 *
 * @since TBD
 */
final class Site_Rules {

	/**
	 * The handle of the inline stylesheet.
	 *
	 * @var string
	 */
	public const HANDLE = 'kadence-blocks-site-rules';

	/**
	 * The unique ID the builder runs under.
	 *
	 * @var string
	 */
	private const PLACEHOLDER = 'site-rules';

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
	 * Adds the site rules of the supported blocks the page rendered, after the
	 * instance rules: an instance rule still wins by specificity, and a site rule
	 * wins a tie with a parent block's rule, such as the Advanced Button's font
	 * weight.
	 *
	 * @since TBD
	 */
	public function enqueue(): void {
		$css = '';

		foreach ( $this->blocks->all() as $block_name => $block ) {
			if ( did_filter( 'kadence_blocks_' . str_replace( '-', '_', $block->get_slug() ) . '_render_block_attributes' ) ) {
				$css .= $this->css( $block_name );
			}
		}

		if ( '' === $css ) {
			return;
		}

		wp_register_style( self::HANDLE, false, [], KADENCE_BLOCKS_VERSION );
		wp_enqueue_style( self::HANDLE );
		wp_add_inline_style( self::HANDLE, wp_strip_all_tags( $css ) );
	}

	/**
	 * Builds a block's site rules, one set per style that takes site values.
	 *
	 * @since TBD
	 *
	 * @param string $block_name Block name, e.g. `kadence/singlebtn`.
	 *
	 * @return string The CSS, empty without Kadence-only site values.
	 */
	public function css( string $block_name ): string {
		$block = $this->blocks->get( $block_name );

		if ( ! $block instanceof Scopes_Site_Styles || ! $block instanceof Kadence_Blocks_Abstract_Block ) {
			return '';
		}

		$site = array_diff_key( $this->store->attributes( $block_name ), array_flip( $block->site_styles_overlay_attributes() ) );

		if ( ! $site ) {
			return '';
		}

		$block_type = WP_Block_Type_Registry::get_instance()->get_registered( $block_name );
		$defaults   = [];

		foreach ( ( $block_type ? $block_type->attributes : null ) ?? [] as $name => $definition ) {
			if ( array_key_exists( 'default', $definition ) ) {
				$defaults[ $name ] = $definition['default'];
			}
		}

		$scope_attribute = $block->site_styles_scope_attribute();
		$scope           = [
			'attribute'  => $scope_attribute,
			'attributes' => $block->site_styles_scoped_attributes(),
		];
		$styles          = array_unique( array_merge( [ $defaults[ $scope_attribute ] ?? '' ], array_keys( $scope['attributes'] ) ) );
		$css             = '';

		foreach ( $styles as $style ) {
			$base   = array_merge( $defaults, [ $scope_attribute => $style ] );
			$values = Overlay::scope( $site, $base, $scope, $style );

			if ( $values ) {
				$css .= $this->scoped_rules( $block, $base, $values, $block->site_styles_scope_class( $style ) );
			}
		}

		return $css;
	}

	/**
	 * @param Kadence_Blocks_Abstract_Block $block       The block.
	 * @param array<string, mixed>          $base        The block's defaults, with the style.
	 * @param array<string, mixed>          $values      The site values the style takes.
	 * @param string                        $scope_class The style's class.
	 *
	 * @return string The rules the site values add, scoped by the style's class.
	 */
	private function scoped_rules( Kadence_Blocks_Abstract_Block $block, array $base, array $values, string $scope_class ): string {
		$rules = array_diff( self::rules( $this->build( $block, array_merge( $base, $values ) ) ), self::rules( $this->build( $block, $base ) ) );

		return preg_replace( '/\.[\w-]*' . self::PLACEHOLDER . '(?![\w-])/', ':where(.' . $scope_class . ')', implode( '', $rules ) ) ?? '';
	}

	/**
	 * Runs the block's builder without leaving its output in the page's
	 * instance CSS. Google fonts it registers stay, so a site font loads.
	 *
	 * @param Kadence_Blocks_Abstract_Block $block      The block.
	 * @param array<string, mixed>          $attributes The attributes to build.
	 *
	 * @return string The CSS.
	 */
	private function build( Kadence_Blocks_Abstract_Block $block, array $attributes ): string {
		$style_id = 'kb-' . $block->get_slug() . self::PLACEHOLDER;
		$css      = $block->build_css( array_merge( $attributes, [ 'uniqueID' => self::PLACEHOLDER ] ), Kadence_Blocks_CSS::get_instance(), self::PLACEHOLDER, self::PLACEHOLDER );

		unset( Kadence_Blocks_CSS::$styles[ $style_id ], Kadence_Blocks_CSS::$custom_styles[ $style_id ] );

		return is_string( $css ) ? $css : '';
	}

	/**
	 * Splits CSS into rules, each rule inside a media query wrapped in its own.
	 *
	 * @param string $css Minified CSS, as the builders output it.
	 *
	 * @return list<string> The rules.
	 */
	private static function rules( string $css ): array {
		$rules = [];

		preg_match_all( '/(@media[^{]+)\{((?:[^{}]+\{[^}]*\})*)\}|([^{}@]+\{[^}]*\})/', $css, $matches, PREG_SET_ORDER );

		foreach ( $matches as $match ) {
			if ( ! empty( $match[3] ) ) {
				$rules[] = trim( $match[3] );
				continue;
			}

			preg_match_all( '/[^{}]+\{[^}]*\}/', $match[2] ?? '', $inner );

			foreach ( $inner[0] as $rule ) {
				$rules[] = trim( $match[1] ?? '' ) . '{' . trim( $rule ) . '}';
			}
		}

		return $rules;
	}
}
