<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Default_Css;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use RuntimeException;

/**
 * Builds the low-specificity, block-scoped CSS that gives a block's dimension property a token-driven
 * default, e.g. `.wp-block-kadence-image img { border-radius: var(--kb-token--semantic--radius--media, 0) }`.
 *
 * WHY THIS EXISTS — the use case, in full:
 *
 * Most token families reach a block through a variable the block already consumes: colors via the
 * palette bridge, font sizes via the font-size bridge, spacing/gap by redefining the `--global-kb-*`
 * variable a stored preset slug already points at (see the Css_Var slot projectors). Radius and icon
 * size have none of that — Kadence Blocks renders them as raw literals (`border-radius: 12px`), exposes
 * no ownable `--global-kb-*` variable for them, and their editor controls are plain numeric sliders.
 *
 * Two tempting alternatives both fail:
 *   1. Store a token slug in the attribute and resolve it in the renderer. This hijacks the numeric
 *      control (the slider can't represent a slug) and has to be mirrored in every block's editor JS.
 *   2. Redefine a `--global-kb-radius-*` variable. There is none, and nothing references it, so it would
 *      be a throwaway indirection.
 *
 * So instead the token is delivered as a **CSS default, not an attribute value**: one low-specificity
 * rule per (block, css_prop) that points the property at the token variable. Because the rule's selector
 * is a single `.wp-block-*` class (plus an optional descendant suffix), the block's OWN CSS — which it
 * only emits when the attribute is set, and emits at higher specificity — always wins. The result is
 * exactly the desired behavior with zero block-editor changes and zero control changes:
 *
 *   - attribute unset            → the block emits nothing → this token default applies (the site-wide value);
 *   - attribute set to any value → the block's higher-specificity rule wins, including an explicit `0`.
 *
 * And because the Projector enqueues this onto KB's editor style handle as well as the front-end one,
 * the editor canvas gets the same default for free — the reason this CSS approach is preferred over an
 * attribute/slug/control approach for these families. Nothing here is `!important`.
 *
 * Only a binding that declares a `css_prop` and references a token contributes, and only the block's
 * `$default` variant is read (named variants are the selectable-variant projector's job). Pure: no
 * WordPress calls; the wiring lives in {@see Projector}.
 *
 * @since TBD
 */
final class Css_Builder {

	use Sanitizes_Css_Value;

	/**
	 * Object-cache group shared with the rest of the Design Tokens module.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CACHE_GROUP = 'kb_design_tokens';

	/**
	 * The registry the variant sets (and their bindings) are read from.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * Resolves each block's `$default` variant to its `property => value` map.
	 *
	 * @since TBD
	 *
	 * @var Variant_Resolver
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
	 * Build the block-default dimension CSS for a token set. Empty when no registered block binds a
	 * `css_prop`.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set whose resolved values the `$default` aliases resolve against.
	 *
	 * @return string The CSS, or an empty string when there is nothing to project.
	 */
	public function css( string $slug = 'default' ): string {
		$css = '';

		foreach ( $this->registry->variant_blocks() as $block ) {
			$set = $this->registry->for_block( $block );

			if ( $set === null ) {
				continue;
			}

			try {
				// A block may carry bindings before the document defines its `$default`; that is not an error,
				// it simply contributes nothing yet, so skip it rather than fail the whole build.
				$values = $this->variants->resolve_default( $block, $slug );
			} catch ( RuntimeException $e ) {
				continue;
			}

			$selector = '.wp-block-' . str_replace( '/', '-', $block );

			// Group declarations by selector suffix so a block with several dimension props on the same
			// element emits one rule, and props on a descendant (e.g. " img") get their own.
			$by_suffix = [];

			foreach ( $values as $property => $value ) {
				$binding = $set->binding( $property );

				// Only a token-referencing binding that names a css_prop contributes; the variable it points
				// at is the referenced token's. An empty resolved value would produce a rule that resolves to
				// nothing in the browser, so skip it.
				if ( $binding === null || ! $binding->is_token_ref() ) {
					continue;
				}

				$prop = $binding->css_prop();

				if ( $prop === null || $value === '' ) {
					continue;
				}

				$var      = $this->registry->css_var_for( (string) $binding->token );
				$suffix   = $this->selector_suffix( $binding->css_selector() );

				$by_suffix[ $suffix ][] = $prop . ':var(' . $var . ',' . $this->sanitize_value( $value ) . ')';
			}

			foreach ( $by_suffix as $suffix => $declarations ) {
				$css .= $selector . $suffix . '{' . implode( ';', $declarations ) . ';}';
			}
		}

		return $css;
	}

	/**
	 * Cached variant of css(): memoized per request and persisted in the object cache keyed on the store
	 * version (and plugin version), so a token write (which bumps the store version) and a plugin upgrade
	 * both invalidate it automatically.
	 *
	 * @since TBD
	 *
	 * @param string $version The store version the resolved set was built from.
	 * @param string $slug    The token set slug.
	 *
	 * @return string
	 */
	public function css_for_version( string $version, string $slug ): string {
		$memo_key = $version . ':' . $slug;

		if ( isset( $this->memo[ $memo_key ] ) ) {
			return $this->memo[ $memo_key ];
		}

		$cache_key = 'block_default_css_' . KADENCE_BLOCKS_VERSION . '_' . $memo_key;
		$cached    = wp_cache_get( $cache_key, self::CACHE_GROUP, false, $found );

		if ( $found && is_string( $cached ) ) {
			return $this->memo[ $memo_key ] = $cached;
		}

		$css = $this->css( $slug );

		wp_cache_set( $cache_key, $css, self::CACHE_GROUP, DAY_IN_SECONDS );

		return $this->memo[ $memo_key ] = $css;
	}

	/**
	 * Compose a binding's optional `css_selector` into the suffix appended after the block's `.wp-block-*`
	 * class. A bare selector (e.g. `img`) is treated as a descendant and gets the combinator space inserted
	 * for it, so the declaration never has to carry a load-bearing leading space. A suffix that already
	 * opens with a combinator or attachment character (`>`, `+`, `~`, `.`, `:`, `#`, `[`, `&`) is used
	 * verbatim, so child combinators (`> img`) and compound/stateful selectors (`.is-style-rounded`) stay
	 * expressible. Empty when the binding names no descendant — the rule targets the block root.
	 *
	 * @since TBD
	 *
	 * @param string|null $selector The binding's raw `css_selector`, or null when it names none.
	 *
	 * @return string The selector suffix, ready to concatenate after the block class.
	 */
	private function selector_suffix( ?string $selector ): string {
		$selector = trim( (string) $selector );

		if ( $selector === '' ) {
			return '';
		}

		return strpbrk( $selector[0], '>+~.:#[&' ) === false ? ' ' . $selector : $selector;
	}
}
