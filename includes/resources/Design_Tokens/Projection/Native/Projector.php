<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Native;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Native\Styles\Contracts\Styles;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Utils\Location;
use KadenceWP\KadenceBlocks\Utils\Cast;

/**
 * Enqueues the companion stylesheets that let native (non-Kadence) blocks consume the design-token variant
 * slots {@see Styles}.
 *
 * The per-variant retarget itself rides the shared Variant\Css_Builder (a native block uses the same
 * --global-* slots as its Kadence counterpart); this projector only adds the small, per-block companion CSS
 * that makes each native block's markup read those slots. It is block-agnostic: it concatenates every
 * registered {@see Styles} implementation and appends the result to KB's front-end and editor style handles,
 * gated on Token_Registry::is_active() so a deactivated registry leaves native blocks untouched.
 *
 * Whether the design system owns a block's default (no-variant) state follows the palette setting: when
 * Kadence has replaced the active theme's palette (kadence_blocks_colors "override"), the theme's native
 * styling is gone, so the design system owns every such block's default; otherwise only a block that opts in
 * with a selected variant is styled. The same flag is passed to every companion.
 *
 * @since TBD
 */
final class Projector {

	/**
	 * @var Token_Registry
	 *
	 * @since TBD
	 */
	private Token_Registry $registry;

	/**
	 * @var Styles[] The native-block companion stylesheets to enqueue.
	 *
	 * @since TBD
	 */
	private array $stylesheets;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry $registry    The token registry, for the active gate.
	 * @param Styles[]       $stylesheets The native-block companion stylesheets.
	 */
	public function __construct( Token_Registry $registry, array $stylesheets ) {
		$this->registry    = $registry;
		$this->stylesheets = $stylesheets;
	}

	/**
	 * Append the companion CSS to the front-end global-variables handle.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function enqueue_front_end(): void {
		if ( ! $this->registry->is_active() ) {
			return;
		}

		$css = $this->css();

		if ( $css !== '' ) {
			wp_add_inline_style( 'kadence-blocks-global-variables', $css );
		}
	}

	/**
	 * Append the companion CSS to the editor global-styles handle, so a picked variant previews live.
	 * Shares the Css_Var projector's editor gate so it loads with the token vars or not at all.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function enqueue_editor(): void {
		if ( ! $this->registry->is_active() ) {
			return;
		}

		/** This filter is documented in includes/resources/Design_Tokens/Projection/Css_Var/Projector.php */
		if ( ! apply_filters( 'kadence_blocks_load_editor_token_vars', Location::is_block_editor() ) ) {
			return;
		}

		$css = $this->css();

		if ( $css !== '' ) {
			wp_add_inline_style( 'kadence-blocks-global-editor-styles', $css );
		}
	}

	/**
	 * The combined companion CSS for every registered native block.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	private function css(): string {
		$owns_default = $this->design_system_owns_defaults();
		$css          = '';

		foreach ( $this->stylesheets as $stylesheet ) {
			$css .= $stylesheet->css( $owns_default );
		}

		return $css;
	}

	/**
	 * Whether the design system owns native blocks' default state: true when Kadence has replaced the active
	 * theme's palette (the kadence_blocks_colors "override" setting), which strips the theme colors its
	 * native blocks depend on — so the design system must supply the default look. False (the setting's own
	 * default) leaves an untouched native block to the theme.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	private function design_system_owns_defaults(): bool {
		$palette = json_decode( Cast::to_string( get_option( 'kadence_blocks_colors' ) ), true );

		return is_array( $palette ) && isset( $palette['override'] ) && true === $palette['override'];
	}
}
