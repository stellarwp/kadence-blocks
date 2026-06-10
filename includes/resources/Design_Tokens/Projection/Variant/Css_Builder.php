<?php declare( strict_types=1 );
// cspell:ignore advancedbtn palette .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Sanitizes_Css_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Scope;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use RuntimeException;

/**
 * Builds the scoped CSS for selectable Kadence block variants.
 *
 * A Kadence block has no native style-variation system, so a selected variant reaches output purely
 * through the cascade: the editor adds a "kb-variant--<name>" class to the block, and this builder emits,
 * per (block, variant), a rule that retargets the --global-paletteN custom properties the block's
 * render_color() already consumes. Picking the variant therefore re-skins the block with zero changes to
 * its render path; an unselected block keeps its $default (the block preset).
 *
 * Two declaration blocks are emitted:
 *
 *   1. A global --kb-token--variant--<block>--<variant>--<property> definition for every bound value, so
 *      a variant's values surface as named token vars in the same graph as every other token.
 *   2. Per (block, variant) scoped rules — ".wp-block-<block>.kb-variant--<variant>" — pointing each
 *      --global-paletteN at its variant var. The var is always co-emitted in (1) in the same stylesheet,
 *      so the reference resolves without a literal fallback.
 *
 * Scoping is per (block, variant): the same variant name on two blocks ("ghost" on a Button and a Row)
 * gets its own block-qualified rule, so values never collide. Only named variants are emitted; the
 * "$default" is the preset, applied through KB's attribute defaults rather than a class.
 *
 * Nothing here is !important and the scope carries ordinary class specificity, so a per-instance inline
 * style still wins over a variant. Values are sanitized defensively before they reach a declaration.
 *
 * @since TBD
 */
final class Css_Builder {

	use Sanitizes_Css_Value;

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
	 * Build the full variant CSS for a token set: the global variant-var block followed by the per
	 * (block, variant) scoped rules. Empty when no registered block contributes a palette-targeted value.
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

			$selector = '.wp-block-' . $this->sanitize_identifier( str_replace( '/', '-', $block ) );

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

					$slot = $this->palette_slot( $binding );

					if ( $slot === null ) {
						continue;
					}

					$var     = $this->variant_var( $block, $variant, $property );
					$literal = $this->sanitize_value( $value );

					$globals      .= $var . ':' . $literal . ';';
					$declarations .= '--global-' . $slot . ':var(' . $var . ');';
				}

				if ( $declarations !== '' ) {
					$scoped .= $selector . '.kb-variant--' . $this->sanitize_identifier( $variant ) . '{' . $declarations . '}';
				}
			}
		}

		$css = $globals === '' ? '' : Scope::root() . '{' . $globals . '}';

		return $css . $scoped;
	}

	/**
	 * Cached variant of css(): memoized per request and persisted in the object cache keyed on the store
	 * version, so a token write (which bumps the version) invalidates it automatically. The plugin version
	 * is folded in too, since variant CSS also depends on shipped declarations and the baseline.
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

		$cache_key = 'variant_css_' . KADENCE_BLOCKS_VERSION . '_' . $slug . '_' . $version;
		$cached    = wp_cache_get( $cache_key, self::CACHE_GROUP, false, $found );

		if ( $found && is_string( $cached ) ) {
			return $this->memo[ $memo_key ] = $cached;
		}

		$css = $this->css( $slug );

		wp_cache_set( $cache_key, $css, self::CACHE_GROUP, DAY_IN_SECONDS );

		return $this->memo[ $memo_key ] = $css;
	}

	/**
	 * The Kadence palette slot a binding targets (palette1..9), or null when it targets no palette slot.
	 *
	 * Reads the binding's effective projections so a token-reference binding inherits the referenced
	 * token's slot and an inline binding declares its own; both reach the same --global-paletteN.
	 *
	 * @since TBD
	 *
	 * @param Binding $binding The variant binding.
	 *
	 * @return string|null The slot ("palette3"), or null.
	 */
	private function palette_slot( Binding $binding ): ?string {
		$slot = $this->registry->effective_projections( $binding )[ Binding::get_kadence_slot_key() ] ?? null;

		if ( is_string( $slot ) && preg_match( '/^palette[1-9]$/', $slot ) === 1 ) {
			return $slot;
		}

		return null;
	}

	/**
	 * The variant var name for a (block, variant, property): "--kb-token--variant--<block>--<variant>--
	 * <property>", e.g. --kb-token--variant--kadence-advancedbtn--ghost--button-bg.
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
		return Css_Var::get_prefix() . self::VARIANT_SEGMENT
			. $this->sanitize_identifier( str_replace( '/', '-', $block ) ) . '--'
			. $this->sanitize_identifier( $variant ) . '--'
			. $this->sanitize_identifier( $property );
	}

	/**
	 * Reduce a segment to a CSS-identifier-safe form, so a variant slug or block name can never break out
	 * of a selector or a custom-property name. Keeps word characters and hyphens; collapses anything else
	 * to a single hyphen.
	 *
	 * @since TBD
	 *
	 * @param string $segment The raw segment.
	 *
	 * @return string
	 */
	private function sanitize_identifier( string $segment ): string {
		return (string) preg_replace( '/[^A-Za-z0-9_-]+/', '-', $segment );
	}
}
