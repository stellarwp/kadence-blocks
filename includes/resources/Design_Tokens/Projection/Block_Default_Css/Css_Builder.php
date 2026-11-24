<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Default_Css;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Composes_Selector_Suffix;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding;
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
 * A property is declared only when the library overrides it (see
 * {@see Preset_Resolver::overridden_default_properties()}). An untouched default restates the browser's own
 * initial value, and at class specificity printed after the theme it would still reset a theme rule or a
 * utility class the block never asked to change. A binding opts out with `always_emit` when the block has
 * nothing of its own to fall back on, which is the Single Icon's size.
 *
 * Only a binding that declares a `css_prop` and references a token contributes, and only the block's
 * `$default` preset is read. A binding that ALSO declares a `css_var` has its declaration wrapped in that
 * variable — `var(--<css_var>, var(<token-var>, <literal>))` — which is the seam through which a block's
 * *selected* preset reaches a property delivered this way; see {@see self::declaration_value()}. Pure: no
 * WordPress calls; the wiring lives in {@see Projector}.
 *
 * A `$default` property may be unset at desktop yet overridden at a breakpoint. It gets no resting rule
 * (desktop keeps the block's own default) but, given a breakpoint map, a media-scoped rule per overriding
 * breakpoint pointing the css_prop at the binding's `css_var` — the variable the preset projection
 * redeclares inside the same media query. Only a base-less property gets one: a property with a base
 * already consumes that variable at every width through its resting rule.
 *
 * @since 3.8.0
 * @since 3.9.2 Declares a `$default` property only when the library overrides it, or its binding is always emitted.
 */
final class Css_Builder {

	use Composes_Selector_Suffix;
	use Sanitizes_Css_Value;

	/**
	 * Object-cache group shared with the rest of the Design Tokens module.
	 *
	 * @since 3.8.0
	 *
	 * @var string
	 */
	private const CACHE_GROUP = 'kb_design_tokens';

	/**
	 * The css_props whose default rule is wrapped in `:where()` so it carries no specificity.
	 *
	 * A color can arrive as a utility class on the block (`has-<slug>-background-color`, which an external
	 * color framework generates), and that class is a single-class rule of its own. A default of the same
	 * specificity that loads later would repaint the block, so the default must lose to any class-based color.
	 * Properties outside this list keep their single-class selector, since lowering them would let the block's
	 * own stylesheet or a theme's element rule override the token default.
	 *
	 * @since 3.9.2
	 *
	 * @var list<string>
	 */
	private const ZERO_SPECIFICITY_PROPS = [ 'background-color' ];

	/**
	 * The registry the preset bindings are read from.
	 *
	 * @since 3.8.0
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * Resolves each block's `$default` preset to its `property => value` map.
	 *
	 * @since 3.8.0
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
	 * @since 3.8.0
	 *
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * Logger for the unresolved-token diagnostics; the bound instance writes to the PHP error log under
	 * WP_DEBUG and is a NullLogger otherwise (see {@see \KadenceWP\KadenceBlocks\Log\Log_Provider}).
	 *
	 * @since 3.8.0
	 *
	 * @var LoggerInterface
	 */
	private LoggerInterface $logger;

	/**
	 * Per-request memo keyed on context (front end / editor) + store version + slug + breakpoint map, so
	 * repeated builds within a request are free and a write (which bumps the version) invalidates it without
	 * an explicit purge. The context is part of the key because the editor build can differ from the
	 * front-end one; the breakpoint map because a filtered media query changes the media-scoped rules.
	 *
	 * @since 3.8.0
	 *
	 * @var array<string, string>
	 */
	private array $memo = [];

	/**
	 * @since 3.8.0
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
	 * @since 3.8.0
	 *
	 * @param string                $slug        The token library whose resolved values the `$default` aliases resolve against.
	 * @param array<string, string> $breakpoints Breakpoint => media-query string, for the media-scoped rules of a
	 *                                           property unset at desktop; empty emits none.
	 *
	 * @return string The CSS, or an empty string when there is nothing to project.
	 */
	public function css( string $slug = 'default', array $breakpoints = [] ): string {
		return $this->build( $slug, $breakpoints, false );
	}

	/**
	 * Build the EDITOR-scoped version of the block-default CSS for a token library. Identical to {@see self::css()}
	 * for every block whose editor markup matches its saved markup (e.g. Image, Single Icon, Row Layout) — the
	 * front-end selector is reused verbatim. Two independent declarations move it where they differ. A block
	 * declaring a set-level `editor_selector` (currently Advanced Heading) has its rule target
	 * `.editor-styles-wrapper <editor_selector>` instead, so the default lands on the element the editor
	 * actually renders the bindings against rather than the `useBlockProps()` wrapper. A binding declaring
	 * `editor_css_selector` (currently the Section's, whose editor renders `.kadence-inner-column-inner` where
	 * `save.js` renders `.kt-inside-inner-col`) swaps the DESCENDANT suffix for that property alone.
	 *
	 * @since 3.8.0
	 *
	 * @param string                $slug        The token library whose resolved values the `$default` aliases resolve against.
	 * @param array<string, string> $breakpoints Breakpoint => media-query string, for the media-scoped rules of a
	 *                                           property unset at desktop; empty emits none.
	 *
	 * @return string The CSS, or an empty string when there is nothing to project.
	 */
	public function editor_css( string $slug = 'default', array $breakpoints = [] ): string {
		return $this->build( $slug, $breakpoints, true );
	}

	/**
	 * Cached version of css(): memoized per request and persisted in the object cache keyed on the store
	 * version (and plugin version), so a token write (which bumps the store version) and a plugin upgrade
	 * both invalidate it automatically.
	 *
	 * @since 3.8.0
	 *
	 * @param string                $version     The store version the resolved library was built from.
	 * @param string                $slug        The token library slug.
	 * @param array<string, string> $breakpoints Breakpoint => media-query string; part of the cache key.
	 *
	 * @return string
	 */
	public function css_for_version( string $version, string $slug, array $breakpoints = [] ): string {
		return $this->for_version( $version, $slug, $breakpoints, false );
	}

	/**
	 * Cached version of editor_css(): same memo/object-cache mechanics as {@see self::css_for_version()}, but
	 * keyed under a distinct `editor:` context so the editor-scoped string (which differs from the front-end
	 * one for any block declaring an `editor_selector`, or any binding declaring an `editor_css_selector`)
	 * never collides with, or gets served in place of, the front-end cache entry.
	 *
	 * @since 3.8.0
	 *
	 * @param string                $version     The store version the resolved library was built from.
	 * @param string                $slug        The token library slug.
	 * @param array<string, string> $breakpoints Breakpoint => media-query string; part of the cache key.
	 *
	 * @return string
	 */
	public function editor_css_for_version( string $version, string $slug, array $breakpoints = [] ): string {
		return $this->for_version( $version, $slug, $breakpoints, true );
	}

	/**
	 * Shared build for both {@see self::css()} and {@see self::editor_css()}; only the selector differs, per
	 * block from a set-level `editor_selector` declaration and per property from a binding's
	 * `editor_css_selector`.
	 *
	 * @since 3.8.0
	 *
	 * @param string                $slug        The token library whose resolved values the `$default` aliases resolve against.
	 * @param array<string, string> $breakpoints Breakpoint => media-query string.
	 * @param bool                  $editor      Whether to build the editor-scoped preset.
	 *
	 * @return string The CSS, or an empty string when there is nothing to project.
	 */
	private function build( string $slug, array $breakpoints, bool $editor ): string {
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

			try {
				$default    = $this->presets->default_preset( $block, $slug );
				$responsive = $breakpoints === [] ? [] : $this->presets->resolve_responsive_literal( $block, $default, $slug );
			} catch ( RuntimeException $e ) {
				$responsive = [];
			}

			/*
			 * Only a property the library overrides is declared. An untouched default restates the browser's own
			 * initial value (`padding:0`, `background-color:transparent`), and at class specificity printed after
			 * the theme it would still reset a theme rule or utility class the block never asked to change.
			 */
			$overridden = $this->presets->overridden_default_properties( $block, $slug );

			// The canonical id map of the library — the exact set the Css_Var projector emits a
			// `--kb-token--<id>` variable for. resolve_default() above already warmed this memoized
			// resolution, so it is a free lookup here (and cannot throw when resolve_default() did not).
			$resolved = $this->resolver->resolve( $slug );

			$editor_selector = $editor ? $bindings->editor_selector : null;
			$prefix          = $editor_selector !== null ? '.editor-styles-wrapper ' : '';
			$root            = $editor_selector ?? '.wp-block-' . str_replace( '/', '-', $block );

			/*
			 * Group declarations by their full selector so a block with several dimension props on the same
			 * element emits one rule, props on a descendant (e.g. " img") get their own, and a zero-specificity
			 * property is kept out of the single-class rule its siblings share.
			 */
			$by_selector = [];

			foreach ( $values as $property => $value ) {
				$binding = $bindings->binding( $property );

				// Only a token-referencing binding that names a css_prop contributes; the variable it points
				// at is the referenced token's. An empty resolved value would produce a rule that resolves to
				// nothing in the browser, so skip it.
				if ( $binding === null || ! $binding->is_token_ref() ) {
					continue;
				}

				// A state binding (`:hover` and friends) belongs to the selected-preset projector alone. This
				// layer renders only the `$default` preset, so its rule carries no preset class and matches
				// every instance of the block — and a state rule outranks the block's own resting
				// per-instance rule, so emitting one here would repaint content that never opted into a state.
				// See Binding::CSS_STATE.
				if ( $binding->is_state() ) {
					continue;
				}

				if ( ! isset( $overridden[ $property ] ) && ! $binding->is_always_emitted() ) {
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

				$var    = $this->registry->css_var_for( $token );
				$suffix = $this->selector_suffix(
					$editor ? $binding->editor_css_selector() : $binding->css_selector()
				);

				$by_selector[ $this->rule_selector( $prefix, $root, $suffix, $prop ) ][] = $prop . ':' . $this->declaration_value( $binding, $var, $literal );
			}

			foreach ( $by_selector as $rule_selector => $declarations ) {
				$css .= $rule_selector . '{' . implode( ';', $declarations ) . ';}';
			}

			// A property the `$default` preset overrides at a breakpoint but leaves unset at desktop has no
			// resting declaration above, so nothing would consume the KB-owned variable the preset
			// projection redeclares inside its media block. Declare the css_prop there, and only there,
			// so desktop keeps the block's own default while the breakpoint takes the preset's value.
			foreach ( $responsive as $breakpoint => $overrides ) {
				$query = $breakpoints[ $breakpoint ] ?? '';

				if ( $query === '' ) {
					continue;
				}

				$media_by_selector = [];

				foreach ( array_keys( $overrides ) as $property ) {
					if ( array_key_exists( $property, $values ) ) {
						continue; // The resting declaration already consumes the variable at every width.
					}

					$binding = $bindings->binding( (string) $property );

					if ( $binding === null || ! $binding->is_token_ref() || $binding->is_state() ) {
						continue;
					}

					$prop    = $binding->css_prop();
					$css_var = $binding->css_var();

					if ( $prop === null || $css_var === null ) {
						continue;
					}

					$suffix = $this->selector_suffix( $editor ? $binding->editor_css_selector() : $binding->css_selector() );

					$media_by_selector[ $this->rule_selector( $prefix, $root, $suffix, $prop ) ][] = $prop . ':var(--' . $css_var . ')';
				}

				foreach ( $media_by_selector as $rule_selector => $declarations ) {
					$css .= '@media all and ' . $query . '{' . $rule_selector . '{' . implode( ';', $declarations ) . ';}}';
				}
			}
		}

		return $css;
	}

	/**
	 * The selector a bound property's rule is emitted under.
	 *
	 * A property in {@see self::ZERO_SPECIFICITY_PROPS} wraps the root and its descendant suffix in `:where()`
	 * so the default carries no specificity and any class-based color wins. The editor's
	 * `.editor-styles-wrapper` prefix stays outside the wrapper, which keeps the editor rule outranking the
	 * theme's per-tag element styles. Every other property keeps the single-class selector.
	 *
	 * @since 3.9.2
	 *
	 * @param string $prefix The editor wrapper prefix, or an empty string on the front end.
	 * @param string $root   The block root selector.
	 * @param string $suffix The composed descendant suffix, or an empty string.
	 * @param string $prop   The CSS property the rule declares.
	 *
	 * @return string The selector.
	 */
	private function rule_selector( string $prefix, string $root, string $suffix, string $prop ): string {
		if ( in_array( $prop, self::ZERO_SPECIFICITY_PROPS, true ) ) {
			return $prefix . ':where(' . $root . $suffix . ')';
		}

		return $prefix . $root . $suffix;
	}

	/**
	 * The declaration value for one bound property: the token variable with the block's own literal as its
	 * fallback, wrapped in the binding's `css_var` when it declares one.
	 *
	 * A binding that names no `css_var` yields `var(<token-var>, <literal>)` — the block's default follows the
	 * token and nothing else can vary it. A binding that names one yields
	 * `var(--<css_var>, var(<token-var>, <literal>))`, which is what lets a SELECTED preset reach a property
	 * delivered this way: {@see Preset_Css_Builder} emits `.wp-block-<block>.kb-preset--<preset>` rules setting
	 * `--<css_var>` on the block root, and custom properties inherit, so the value reaches this rule even when
	 * it targets a descendant (`img`, `> .kt-inside-inner-col`, `*.kb-svg-icon-wrap`). Without the wrapper the
	 * selectable-preset projector has no way in: a `css_prop` binding never reaches it, so picking a preset
	 * would change nothing on the page.
	 *
	 * The fallback ORDER is what keeps this upgrade-safe. With no preset selected `--<css_var>` is undefined,
	 * the browser falls through to the token variable, and the declaration resolves to exactly the value it
	 * resolved to before the wrapper existed.
	 *
	 * @since 3.8.0
	 *
	 * @param Binding $binding      The binding being rendered.
	 * @param string  $css_variable The referenced token's CSS variable, including its leading `--`.
	 * @param string  $literal      The resolved literal, used as the token variable's fallback.
	 *
	 * @return string The declaration value.
	 */
	private function declaration_value( Binding $binding, string $css_variable, string $literal ): string {
		$value   = 'var(' . $css_variable . ',' . $this->sanitize_value( $literal ) . ')';
		$css_var = $binding->css_var();

		if ( $css_var === null ) {
			return $value;
		}

		return 'var(--' . $css_var . ',' . $value . ')';
	}

	/**
	 * Shared cache/memo plumbing for {@see self::css_for_version()} and {@see self::editor_css_for_version()}.
	 * The context (front end vs editor) is folded into both the per-request memo key and the object-cache key
	 * so the two builds never share a cache slot.
	 *
	 * @since 3.8.0
	 *
	 * @param string                $version     The store version the resolved library was built from.
	 * @param string                $slug        The token library slug.
	 * @param array<string, string> $breakpoints Breakpoint => media-query string.
	 * @param bool                  $editor      Whether to build the editor-scoped preset.
	 *
	 * @return string
	 */
	private function for_version( string $version, string $slug, array $breakpoints, bool $editor ): string {
		$context  = $editor ? 'editor' : 'front';
		$suffix   = $version . ':' . $slug . ':' . $this->breakpoint_signature( $breakpoints );
		$memo_key = $context . ':' . $suffix;

		if ( isset( $this->memo[ $memo_key ] ) ) {
			return $this->memo[ $memo_key ];
		}

		$cache_key = 'block_default_css_' . $context . '_' . KADENCE_BLOCKS_VERSION . '_' . $suffix;
		$cached    = wp_cache_get( $cache_key, self::CACHE_GROUP, false, $found );

		if ( $found && is_string( $cached ) ) {
			$this->memo[ $memo_key ] = $cached;
			return $this->memo[ $memo_key ];
		}

		$css = $editor ? $this->editor_css( $slug, $breakpoints ) : $this->css( $slug, $breakpoints );

		wp_cache_set( $cache_key, $css, self::CACHE_GROUP, DAY_IN_SECONDS );

		$this->memo[ $memo_key ] = $css;
		return $this->memo[ $memo_key ];
	}

	/**
	 * A stable signature for a breakpoint map, so the cache key changes when the filtered media queries do.
	 * Mirrors {@see Preset_Css_Builder}'s so the two caches roll over together.
	 *
	 * @since 3.8.0
	 *
	 * @param array<string, string> $breakpoints Breakpoint => media-query string.
	 *
	 * @return string
	 */
	private function breakpoint_signature( array $breakpoints ): string {
		if ( $breakpoints === [] ) {
			return 'none';
		}

		ksort( $breakpoints );

		return md5( (string) wp_json_encode( $breakpoints ) );
	}
}
