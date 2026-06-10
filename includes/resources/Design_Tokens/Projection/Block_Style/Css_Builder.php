<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Style;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Wp_Preset_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Wp_Preset_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use RuntimeException;

/**
 * Builds the scoped CSS for native block-style variants — "Projector B" for non-Kadence blocks.
 *
 * A native block (core/button and the like) reaches its variants through WordPress's own block-style
 * system: each named variant is registered with register_block_style(), so the editor adds an
 * "is-style-kb-<name>" class when it is picked, and this builder emits, per (block, variant), a rule that
 * re-targets the --wp--preset--<category>--<slug> custom properties the block already consumes when its
 * baseline ($default) points at a token-backed preset. Picking a style therefore re-skins the block with
 * no change to its markup; an unstyled block keeps its $default.
 *
 * Two declaration blocks are emitted:
 *
 *   1. A global --kb-token--variant--<block>--<variant>--<property> definition for every bound value, so
 *      a variant's values surface as named token vars in the same graph as every other token.
 *   2. Per (block, variant) scoped rules — "<block-selector>.is-style-kb-<variant>" — pointing each
 *      --wp--preset--*--* at its variant var. The var is co-emitted in (1), so no literal fallback.
 *
 * Only non-Kadence blocks are emitted here; Kadence blocks reach their variants through the kbVariant
 * class path instead. Only a property whose binding resolves to a wp_preset target contributes — a
 * property with no preset bucket has no --wp--preset variable for a native block to re-target.
 *
 * Nothing here is !important and the scope carries ordinary class specificity, so a per-instance inline
 * style still wins over a variant. Values are sanitized defensively before they reach a declaration.
 *
 * @since TBD
 */
final class Css_Builder {

	/**
	 * Scope for the global variant-var definitions. Matches the token backbone's scope (see
	 * Css_Var\Css_Builder::SCOPE) so the variant vars live everywhere KB prints variables; :where() adds
	 * no specificity.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const ROOT_SCOPE = ':root,:root:where(.kb-tokens)';

	/**
	 * The variant var namespace, appended after the shared --kb-token-- prefix.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const VARIANT_SEGMENT = 'variant--';

	/**
	 * Object-cache group shared with the rest of the Design Tokens module.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CACHE_GROUP = 'kb_design_tokens';

	/**
	 * @var Token_Registry The registry the variant sets (and their bindings) are read from.
	 *
	 * @since TBD
	 */
	private Token_Registry $registry;

	/**
	 * @var Variant_Resolver Flattens each variant's bindings to resolved CSS values.
	 *
	 * @since TBD
	 */
	private Variant_Resolver $variants;

	/**
	 * Per-request memo keyed on slug + store version, so repeated builds within a request are free and a
	 * write (which bumps the version) invalidates it without an explicit purge.
	 *
	 * @since TBD
	 *
	 * @var array<string, string>
	 */
	private array $memo = [];

	/**
	 * @since TBD
	 *
	 * @param Token_Registry   $registry The token registry.
	 * @param Variant_Resolver $variants The variant resolver.
	 */
	public function __construct( Token_Registry $registry, Variant_Resolver $variants ) {
		$this->registry = $registry;
		$this->variants = $variants;
	}

	/**
	 * Build the native block-style CSS for a token set: the global variant-var block followed by the per
	 * (block, variant) scoped rules. Empty when no native block contributes a preset-targeted value.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set whose resolved values the variant aliases resolve against.
	 *
	 * @return string The CSS, or an empty string when there is nothing to project.
	 */
	public function css( string $slug = 'default' ): string {
		$globals = '';
		$scoped  = '';

		foreach ( $this->registry->variant_blocks() as $block ) {
			if ( ! Style::is_native( $block ) ) {
				continue; // Kadence blocks reach their variants through the kbVariant class path.
			}

			$set = $this->registry->for_block( $block );

			if ( $set === null ) {
				continue;
			}

			try {
				// A block may carry registered bindings before the document defines its variants; that is not
				// an error, it simply contributes nothing yet, so skip it rather than fail the whole build.
				$names = $this->variants->names( $block );
			} catch ( RuntimeException $e ) {
				continue;
			}

			$selector = $this->block_selector( $block );

			foreach ( $names as $variant ) {
				try {
					$values = $this->variants->resolve( $block, $variant, $slug );
				} catch ( RuntimeException $e ) {
					continue;
				}

				$declarations = '';

				foreach ( $values as $property => $value ) {
					$binding = $set->binding( $property );

					if ( $binding === null ) {
						continue;
					}

					$target = $this->preset_target( $binding );

					if ( $target === null ) {
						continue;
					}

					$var     = $this->variant_var( $block, $variant, $property );
					$literal = $this->sanitize_value( $value );

					$globals      .= $var . ':' . $literal . ';';
					$declarations .= Wp_Preset_Var::from( $target->category, $target->slug ) . ':var(' . $var . ');';
				}

				if ( $declarations !== '' ) {
					$scoped .= $selector . '.' . Style::selector_class( $variant ) . '{' . $declarations . '}';
				}
			}
		}

		$css = $globals === '' ? '' : self::ROOT_SCOPE . '{' . $globals . '}';

		return $css . $scoped;
	}

	/**
	 * Cached variant of css(): memoized per request and persisted in the object cache keyed on the store
	 * version, so a token write (which bumps the version) invalidates it automatically. The plugin version
	 * is folded in too, since the CSS also depends on shipped declarations and the baseline.
	 *
	 * @since TBD
	 *
	 * @param string $version The store version the resolved set was built from.
	 * @param string $slug    The token set slug.
	 *
	 * @return string
	 */
	public function css_for_version( string $version, string $slug = 'default' ): string {
		$memo_key = $slug . '|' . $version;

		if ( isset( $this->memo[ $memo_key ] ) ) {
			return $this->memo[ $memo_key ];
		}

		$cache_key = 'block_style_css_' . KADENCE_BLOCKS_VERSION . '_' . $slug . '_' . $version;
		$cached    = wp_cache_get( $cache_key, self::CACHE_GROUP, false, $found );

		if ( $found && is_string( $cached ) ) {
			return $this->memo[ $memo_key ] = $cached;
		}

		$css = $this->css( $slug );

		wp_cache_set( $cache_key, $css, self::CACHE_GROUP, DAY_IN_SECONDS );

		return $this->memo[ $memo_key ] = $css;
	}

	/**
	 * The wp_preset target (category + slug) a binding resolves to, or null when it has none.
	 *
	 * Reads the referenced token's wp_preset projection, so a native variant re-targets the exact
	 * --wp--preset variable the block's $default already points at. An inline binding with no token
	 * reference contributes no preset target here (the shipped native variants reference tokens).
	 *
	 * @since TBD
	 *
	 * @param Binding $binding The variant binding.
	 *
	 * @return Wp_Preset_Target|null
	 */
	private function preset_target( Binding $binding ): ?Wp_Preset_Target {
		if ( ! $binding->is_token_ref() ) {
			return null;
		}

		$token = $this->registry->get( (string) $binding->token );

		return $token === null ? null : Wp_Preset_Target::from_token( $token );
	}

	/**
	 * The CSS class selector for a block: "core/button" => ".wp-block-button"; a namespaced block =>
	 * ".wp-block-<namespace>-<name>", matching WordPress's own block class derivation.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @return string
	 */
	private function block_selector( string $block ): string {
		$parts     = explode( '/', $block, 2 );
		$namespace = $parts[0];
		$name      = $parts[1] ?? $namespace;

		if ( $namespace === 'core' ) {
			return '.wp-block-' . Style::ident( $name );
		}

		return '.wp-block-' . Style::ident( $namespace ) . '-' . Style::ident( $name );
	}

	/**
	 * The variant var name for a (block, variant, property): "--kb-token--variant--<block>--<variant>--
	 * <property>", e.g. --kb-token--variant--core-button--ghost--button-bg.
	 *
	 * @since TBD
	 *
	 * @param string $block    The block name.
	 * @param string $variant  The variant slug.
	 * @param string $property The block property.
	 *
	 * @return string
	 */
	private function variant_var( string $block, string $variant, string $property ): string {
		return Css_Var::PREFIX . self::VARIANT_SEGMENT
			. Style::ident( $block ) . '--'
			. Style::ident( $variant ) . '--'
			. Style::ident( $property );
	}

	/**
	 * Defense-in-depth sanitizer for a custom-property value: strips control characters and the characters
	 * that could close a declaration or inject a rule ("{", "}", ";", "<", ">"). Not esc_attr(), which
	 * would mangle legitimate CSS such as a font-family stack.
	 *
	 * @since TBD
	 *
	 * @param string $value The raw CSS value.
	 *
	 * @return string
	 */
	private function sanitize_value( string $value ): string {
		$value = preg_replace( '/[\x00-\x1F\x7F]/', '', $value ) ?? '';

		return str_replace( [ '{', '}', ';', '<', '>' ], '', $value );
	}
}
