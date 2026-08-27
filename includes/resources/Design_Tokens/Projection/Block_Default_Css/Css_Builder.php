<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Default_Css;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Preset_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
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
 * the editor canvas gets the same token default — for most blocks the identical rule, and for a block
 * whose editor markup renders the binding on a different element (one declaring an `editor_selector`,
 * currently Advanced Heading) a rule re-scoped to that element so the default still lands. This
 * editor-canvas parity is the reason this CSS approach is preferred over an attribute/slug/control
 * approach for these families. Nothing here is `!important`.
 *
 * Only a binding that declares a `css_prop` and references a token contributes, and only the block's
 * `$default` preset is read (named presets are the selectable-preset projector's job). Pure: no
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
	 * The registry the preset bindings are read from.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * Resolves each block's `$default` preset to its `property => value` map.
	 *
	 * @since TBD
	 *
	 * @var Preset_Resolver
	 */
	private Preset_Resolver $presets;

	/**
	 * Resolves a library to its canonical id map — the authoritative set of tokens the Css_Var projector
	 * emits a `--kb-token--<id>` variable for. A binding whose token id is absent from it points at a
	 * variable no projector defines, so this is what "backed" is tested against (not the registry's declared
	 * subset, which omits baseline-only semantic tokens such as `semantic.color.text`).
	 *
	 * @since TBD
	 *
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * Logger for the unresolved-token diagnostics; the bound instance writes to the PHP error log under
	 * WP_DEBUG and is a NullLogger otherwise (see {@see \KadenceWP\KadenceBlocks\Log\Log_Provider}).
	 *
	 * @since TBD
	 *
	 * @var LoggerInterface
	 */
	private LoggerInterface $logger;

	/**
	 * Per-request memo keyed on context (front end / editor) + store version + slug, so repeated builds
	 * within a request are free and a write (which bumps the version) invalidates it without an explicit
	 * purge. The context is part of the key because the editor build can differ from the front-end one.
	 *
	 * @since TBD
	 *
	 * @var array<string, string>
	 */
	private array $memo = [];

	/**
	 * @since TBD
	 *
	 * @param Token_Registry  $registry The token registry.
	 * @param Preset_Resolver $presets  The preset resolver.
	 * @param Token_Resolver  $resolver Resolves a library to its canonical id map, for the backed-token check.
	 * @param LoggerInterface $logger   Logger for the unresolved-token diagnostics.
	 */
	public function __construct( Token_Registry $registry, Preset_Resolver $presets, Token_Resolver $resolver, LoggerInterface $logger ) {
		$this->registry = $registry;
		$this->presets  = $presets;
		$this->resolver = $resolver;
		$this->logger   = $logger;
	}

	/**
	 * Build the block-default dimension CSS for a token library. Empty when no registered block binds a
	 * `css_prop`.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library whose resolved values the `$default` aliases resolve against.
	 *
	 * @return string The CSS, or an empty string when there is nothing to project.
	 */
	public function css( string $slug = 'default' ): string {
		return $this->build( $slug, false );
	}

	/**
	 * Build the EDITOR-scoped version of the block-default CSS for a token library. Identical to {@see self::css()}
	 * for every block that declares no `editor_selector` (e.g. Image, Single Icon, Row Layout, Column) — the
	 * front-end `.wp-block-*` selector is reused verbatim. For a block that declares one (currently Advanced
	 * Heading), the rule targets `.editor-styles-wrapper <editor_selector>` instead, so the default lands on
	 * the element the editor actually renders the bindings against rather than the `useBlockProps()` wrapper.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library whose resolved values the `$default` aliases resolve against.
	 *
	 * @return string The CSS, or an empty string when there is nothing to project.
	 */
	public function editor_css( string $slug = 'default' ): string {
		return $this->build( $slug, true );
	}

	/**
	 * Cached version of css(): memoized per request and persisted in the object cache keyed on the store
	 * version (and plugin version), so a token write (which bumps the store version) and a plugin upgrade
	 * both invalidate it automatically.
	 *
	 * @since TBD
	 *
	 * @param string $version The store version the resolved library was built from.
	 * @param string $slug    The token library slug.
	 *
	 * @return string
	 */
	public function css_for_version( string $version, string $slug ): string {
		return $this->for_version( $version, $slug, false );
	}

	/**
	 * Cached version of editor_css(): same memo/object-cache mechanics as {@see self::css_for_version()}, but
	 * keyed under a distinct `editor:` context so the editor-scoped string (which differs from the front-end
	 * one for any block declaring an `editor_selector`) never collides with, or gets served in place of, the
	 * front-end cache entry.
	 *
	 * @since TBD
	 *
	 * @param string $version The store version the resolved library was built from.
	 * @param string $slug    The token library slug.
	 *
	 * @return string
	 */
	public function editor_css_for_version( string $version, string $slug ): string {
		return $this->for_version( $version, $slug, true );
	}

	/**
	 * Shared build for both {@see self::css()} and {@see self::editor_css()}; only the selector base differs
	 * per block, per the presence of an `editor_selector` declaration.
	 *
	 * @since TBD
	 *
	 * @param string $slug   The token library whose resolved values the `$default` aliases resolve against.
	 * @param bool   $editor Whether to build the editor-scoped preset.
	 *
	 * @return string The CSS, or an empty string when there is nothing to project.
	 */
	private function build( string $slug, bool $editor ): string {
		$css = '';

		foreach ( $this->registry->preset_binding_blocks() as $block ) {
			$bindings = $this->registry->for_block( $block );

			if ( $bindings === null ) {
				continue;
			}

			try {
				// A block may carry bindings before the document defines its `$default`; that is not an error,
				// it simply contributes nothing yet, so skip it rather than fail the whole build.
				$values = $this->presets->resolve_default( $block, $slug );
			} catch ( RuntimeException $e ) {
				continue;
			}

			// The canonical id map of the library — the exact set the Css_Var projector emits a
			// `--kb-token--<id>` variable for. resolve_default() above already warmed this memoized
			// resolution, so it is a free lookup here (and cannot throw when resolve_default() did not).
			$resolved = $this->resolver->resolve( $slug );

			$selector = $editor && $bindings->editor_selector !== null
				? '.editor-styles-wrapper ' . $bindings->editor_selector
				: '.wp-block-' . str_replace( '/', '-', $block );

			// Group declarations by selector suffix so a block with several dimension props on the same
			// element emits one rule, and props on a descendant (e.g. " img") get their own.
			$by_suffix = [];

			foreach ( $values as $property => $value ) {
				$binding = $bindings->binding( $property );

				// Only a token-referencing binding that names a css_prop contributes; the variable it points
				// at is the referenced token's. An empty resolved value would produce a rule that resolves to
				// nothing in the browser, so skip it.
				if ( $binding === null || ! $binding->is_token_ref() ) {
					continue;
				}

				$prop = $binding->css_prop();

				// A per-corner slot list is a CSS shorthand here — this is a css-emitting surface, so the
				// corners join into one declaration value (the resolver keeps them apart for the editor).
				$literal = is_array( $value ) ? implode( ' ', $value ) : $value;

				if ( $prop === null || $literal === '' ) {
					continue;
				}

				$token = (string) $binding->token;

				// A binding may reference a token id the resolved library does not back (e.g. a stale alias
				// left after a token was removed). css_var_for() would compute a `--kb-token--…` custom
				// property nothing defines, and the declaration's literal fallback would keep rendering the
				// default — a silent, invisible dead indirection. Skip the declaration entirely so the block
				// falls back to its own native default CSS, and log the mismatch (under WP_DEBUG, via the
				// injected logger).
				if ( $resolved->value( $token ) === null ) {
					$this->logger->error(
						sprintf(
							'Block-default CSS: block "%s" binds unresolved token id "%s"; skipping declaration.',
							$block,
							$token
						)
					);

					continue;
				}

				$var      = $this->registry->css_var_for( $token );
				$suffix   = $this->selector_suffix( $binding->css_selector() );

				$by_suffix[ $suffix ][] = $prop . ':var(' . $var . ',' . $this->sanitize_value( $literal ) . ')';
			}

			foreach ( $by_suffix as $suffix => $declarations ) {
				$css .= $selector . $suffix . '{' . implode( ';', $declarations ) . ';}';
			}
		}

		return $css;
	}

	/**
	 * Shared cache/memo plumbing for {@see self::css_for_version()} and {@see self::editor_css_for_version()}.
	 * The context (front end vs editor) is folded into both the per-request memo key and the object-cache key
	 * so the two builds never share a cache slot.
	 *
	 * @since TBD
	 *
	 * @param string $version The store version the resolved library was built from.
	 * @param string $slug    The token library slug.
	 * @param bool   $editor  Whether to build the editor-scoped preset.
	 *
	 * @return string
	 */
	private function for_version( string $version, string $slug, bool $editor ): string {
		$context  = $editor ? 'editor' : 'front';
		$suffix   = $version . ':' . $slug;
		$memo_key = $context . ':' . $suffix;

		if ( isset( $this->memo[ $memo_key ] ) ) {
			return $this->memo[ $memo_key ];
		}

		$cache_key = 'block_default_css_' . $context . '_' . KADENCE_BLOCKS_VERSION . '_' . $suffix;
		$cached    = wp_cache_get( $cache_key, self::CACHE_GROUP, false, $found );

		if ( $found && is_string( $cached ) ) {
			return $this->memo[ $memo_key ] = $cached;
		}

		$css = $editor ? $this->editor_css( $slug ) : $this->css( $slug );

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
