<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Document_Path;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Alias_Cycle_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Dangling_Alias_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Layers;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Responsive;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;

/**
 * Flattens the effective DTCG document into two ready-to-emit maps. The single place
 * alias semantics are interpreted — projectors downstream never see an alias.
 *
 * @since TBD
 */
final class Token_Resolver {

	/**
	 * Object-cache group shared by all resolved-token entries.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CACHE_GROUP = 'kb_design_tokens';

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @var Effective_Document
	 */
	private Effective_Document $effective;

	/**
	 * @var Css_Renderer
	 */
	private Css_Renderer $renderer;

	/**
	 * Reads the set's effective color palettes, so the resolver can re-tint the color tokens with the set's
	 * `$current` palette before alias flattening.
	 *
	 * @since TBD
	 *
	 * @var Effective_Palettes
	 */
	private Effective_Palettes $palettes;

	/**
	 * The pure structural setter used to write the palette overlay onto a color leaf's `$value`.
	 *
	 * @since TBD
	 *
	 * @var Mutator
	 */
	private Mutator $mutator;

	/**
	 * Per-request memo of resolved results, keyed on the same cache key load() uses for the object cache:
	 * the cache prefix "resolved_tokens_{slug}" followed by the store version, e.g.
	 * "resolved_tokens_default_v3".
	 *
	 * @var array<string,Resolved_Tokens>
	 */
	private array $memo = [];

	/**
	 * Per-request memo of effective (baseline-merged) documents, keyed on the slug and store version, so the
	 * stored document is decoded and merged once per version no matter how many callers need the authored
	 * view — the resolve path itself, the responsive feed, and the REST resolved read all share one build.
	 *
	 * @since TBD
	 *
	 * @var array<string,array<string,mixed>>
	 */
	private array $effective_memo = [];

	/**
	 * Wire the token store, effective-document builder, and value renderer.
	 *
	 * @since TBD
	 *
	 * @param Token_Store        $store     The token library store.
	 * @param Effective_Document $effective Builds the baseline-merged effective document.
	 * @param Css_Renderer       $renderer  Renders a flattened value to a CSS-ready string.
	 * @param Effective_Palettes $palettes  Reads the set's effective color palettes for the `:root` overlay.
	 * @param Mutator            $mutator   The pure structural setter for the palette overlay.
	 */
	public function __construct(
		Token_Store $store,
		Effective_Document $effective,
		Css_Renderer $renderer,
		Effective_Palettes $palettes,
		Mutator $mutator
	) {
		$this->store     = $store;
		$this->effective = $effective;
		$this->renderer  = $renderer;
		$this->palettes  = $palettes;
		$this->mutator   = $mutator;
	}

	/**
	 * Resolve a stored token library into flat maps. Memoized per request on the store version,
	 * which is bumped on every write, so the memo invalidates automatically.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug to resolve.
	 *
	 * @return Resolved_Tokens
	 *
	 * @throws Alias_Cycle_Exception    When a stored alias forms an unresolvable cycle.
	 * @throws Dangling_Alias_Exception When a stored alias references a path with no token leaf.
	 *                                  Writes are gated by resolve_overrides(), so a clean store never hits this.
	 */
	public function resolve( string $slug = 'default' ): Resolved_Tokens {
		return $this->load( $slug, 'resolved_tokens_' . $slug );
	}

	/**
	 * Shared resolve path: per-request memo over a persistent object-cache entry, both keyed on the store
	 * version (bumped on every write, so they self-invalidate).
	 *
	 * @since TBD
	 *
	 * @param string $slug         The token library slug to resolve.
	 * @param string $cache_prefix Cache-key prefix for the resolved-tokens entry.
	 *
	 * @return Resolved_Tokens
	 *
	 * @throws Alias_Cycle_Exception    When a stored alias forms an unresolvable cycle.
	 * @throws Dangling_Alias_Exception When a stored alias references a path with no token leaf.
	 */
	private function load( string $slug, string $cache_prefix ): Resolved_Tokens {
		$version   = $this->store->get_version( $slug );
		$cache_key = $cache_prefix . '_' . $version;

		if ( isset( $this->memo[ $cache_key ] ) ) {
			return $this->memo[ $cache_key ];
		}

		// L2: persistent object cache (requires a drop-in such as Memcached or Redis) — survives across requests, keyed on the store version.
		$cached = wp_cache_get( $cache_key, self::CACHE_GROUP, false, $found );

		if ( $found && $cached instanceof Resolved_Tokens ) {
			$this->memo[ $cache_key ] = $cached;

			return $cached;
		}

		$document = $this->effective_document( $slug );

		$result = $this->resolve_document( $document );

		wp_cache_set( $cache_key, $result, self::CACHE_GROUP, DAY_IN_SECONDS );
		$this->memo[ $cache_key ] = $result;

		return $result;
	}

	/**
	 * Resolve an ad-hoc overrides array against the baseline without persisting — used by the REST
	 * write layer to reject aliasing cycles and dangling aliases before committing. A dry run by
	 * nature: it never touches the store or the memo.
	 *
	 * @since TBD
	 *
	 * @param array<string,mixed> $overrides Decoded candidate overrides.
	 *
	 * @throws Alias_Cycle_Exception    When the candidate introduces an unresolvable cycle.
	 * @throws Dangling_Alias_Exception When the candidate aliases a path with no token leaf.
	 */
	public function resolve_overrides( array $overrides ): Resolved_Tokens {
		return $this->resolve_document( $this->effective->build( $overrides ) );
	}

	/**
	 * The baseline-merged effective document for a stored library, with $extensions intact — the authored view
	 * the resolved maps flatten away. This is the source the responsive feed and the REST resolved read need
	 * to recover a token's authored responsive / clamp shape (aliases preserved, unrendered), which the flat
	 * by_id / by_var maps have already dropped. Memoised per request on the store version like resolve(), so
	 * the stored document is decoded and merged once rather than rebuilt by every caller.
	 *
	 * The set's `$current` color palette is overlaid onto the color token leaves here, before the resolved
	 * maps flatten aliases — so every semantic color that aliases a re-tinted primitive follows the palette
	 * for free, and switching the palette (writing `$current`) re-tints without touching the primitives.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return array<string,mixed> The effective document.
	 */
	public function effective_document( string $slug = 'default' ): array {
		$cache_key = $slug . '_' . $this->store->get_version( $slug );

		if ( isset( $this->effective_memo[ $cache_key ] ) ) {
			return $this->effective_memo[ $cache_key ];
		}

		$raw     = $this->store->get_document( $slug );
		$decoded = $raw === '' ? [] : json_decode( $raw, true );
		$over    = is_array( $decoded ) ? $decoded : [];

		$this->effective_memo[ $cache_key ] = $this->apply_palette_overlay( $this->effective->build( $over ), $over );

		return $this->effective_memo[ $cache_key ];
	}

	/**
	 * Overlay the set's `$current` palette onto the effective document's color leaves: for each swatch
	 * `token => $value`, replace only that color leaf's `$value` (keeping its `$type`) so the resolver
	 * flattens the palette's color, and every semantic that aliases the primitive re-tints with it. A swatch
	 * naming a token that is not a value leaf in the document is ignored — the palette controller's write
	 * guards reject those at write time, so this stays a fail-soft render step. The default palette carries
	 * the baseline color values, so overlaying it is a no-op.
	 *
	 * @since TBD
	 *
	 * @param array<string,mixed> $document  The baseline-merged effective document.
	 * @param array<string,mixed> $overrides The set's decoded stored overrides (the palette source, deep-merged
	 *                                        with the baseline palettes so the overlay reads the same document).
	 *
	 * @return array<string,mixed>
	 */
	private function apply_palette_overlay( array $document, array $overrides ): array {
		$overlay = $this->palettes->overlay_for_overrides( $overrides );

		foreach ( $overlay as $token => $value ) {
			$leaf = Document_Path::node_at( $document, $token );

			if ( ! is_array( $leaf ) || ! array_key_exists( Sentinels::get_value_key(), $leaf ) ) {
				continue;
			}

			$leaf[ Sentinels::get_value_key() ] = $value;
			$document                           = $this->mutator->set( $document, $token, $leaf );
		}

		return $document;
	}

	/**
	 * Walk an effective document into the flat maps.
	 *
	 * @since TBD
	 *
	 * @param array<string,mixed> $document
	 */
	private function resolve_document( array $document ): Resolved_Tokens {
		$by_id             = [];
		$by_var            = [];
		$by_var_projected  = [];
		$by_id_target      = [];
		$by_var_responsive = [];
		$by_id_responsive  = [];

		foreach ( Layers::token_layers() as $layer ) {
			if ( isset( $document[ $layer ] ) && is_array( $document[ $layer ] ) ) {
				$this->walk( $document[ $layer ], $layer, $document, $by_id, $by_var, $by_var_projected, $by_id_target, $by_var_responsive, $by_id_responsive );
			}
		}

		return new Resolved_Tokens( $by_id, $by_var, $by_var_projected, $by_id_target, $by_var_responsive, $by_id_responsive );
	}

	/**
	 * Depth-first walk, collecting every token leaf.
	 *
	 * @since TBD
	 *
	 * @param array<string,mixed>                $node             The current group node.
	 * @param string                             $prefix           The dot-path accumulated so far.
	 * @param array<string,mixed>                $document         Full effective doc, for alias lookups.
	 * @param array<string,string>               $by_id             By-reference id => literal CSS value map.
	 * @param array<string,string>               $by_var            By-reference css-var => literal CSS value map.
	 * @param array<string,string>               $by_var_projected  By-reference css-var => var()-preserving CSS value map.
	 * @param array<string,string>               $by_id_target      By-reference id => target id map (whole-$value aliases only).
	 * @param array<string,array<string,string>> $by_var_responsive By-reference css-var => [ breakpoint => projected value ].
	 * @param array<string,array<string,string>> $by_id_responsive  By-reference id => [ breakpoint => literal value ].
	 *
	 * @return void
	 */
	private function walk( array $node, string $prefix, array $document, array &$by_id, array &$by_var, array &$by_var_projected, array &$by_id_target, array &$by_var_responsive, array &$by_id_responsive ): void {
		foreach ( $node as $key => $child ) {
			if ( is_string( $key ) && strpos( $key, '$' ) === 0 ) {
				continue; // DTCG metadata key.
			}
			if ( ! is_array( $child ) ) {
				continue;
			}

			$path = $prefix . '.' . $key;

			if ( array_key_exists( '$value', $child ) ) {
				$raw  = $child['$value'];
				$type = (string) ( $child[ Token_Type::get_type_key() ] ?? '' );
				$var  = Css_Var::from_id( $path );

				// A structured clamp is authoritative: it renders to clamp(min, preferred, max) for both the
				// literal (host) and var()-preserving (projection) forms, overriding whatever the flat base
				// $value holds (a literal clamp there is treated as a stale cache of this).
				if ( Responsive::has_clamp( $child ) ) {
					$clamp = Responsive::clamp_of( $child );

					if ( is_array( $clamp ) ) {
						$literal                  = $this->render_clamp( $clamp, $type, $document, false );
						$by_id[ $path ]           = $literal;
						$by_var[ $var ]           = $literal;
						$by_var_projected[ $var ] = $this->render_clamp( $clamp, $type, $document, true );

						continue;
					}
				}

				$value = $this->resolve_value( $raw, $document, [] );
				$css   = $this->renderer->render( $type, $value );

				$by_id[ $path ] = $css;
				$by_var[ $var ] = $css;

				if ( is_string( $raw ) && Alias::is_alias( $raw ) ) {
					// Whole-$value alias: the token's variable points straight at its immediate
					// target's variable (bypassing the type renderer, which expects a literal), so the
					// indirection survives into CSS and dependents follow live. resolve_value() has
					// already validated the alias (no cycle, not dangling), so the target is a real leaf
					// this same walk emits a --kb-token--* var for. The literal above still feeds host
					// surfaces.
					$target_id                = Alias::path_of( $raw );
					$by_id_target[ $path ]    = $target_id;
					$by_var_projected[ $var ] = 'var(' . Css_Var::from_id( $target_id ) . ')';
				} else {
					// A composite (shadow/typography) may alias individual fields; project those to
					// var() references and render the shorthand around them. Scalars and lists carry no
					// alias and render identically to the literal.
					$by_var_projected[ $var ] = $this->renderer->render( $type, $this->project_value( $raw ) );
				}

				// A stepped responsive shape keeps the flat base above and adds a per-breakpoint override the
				// css-var projection redeclares inside the matching media query; each slot may itself alias.
				$this->collect_responsive_overrides( $child, $type, $path, $var, $document, $by_id_responsive, $by_var_responsive );

				continue;
			}

			$this->walk( $child, $path, $document, $by_id, $by_var, $by_var_projected, $by_id_target, $by_var_responsive, $by_id_responsive );
		}
	}

	/**
	 * Collect a leaf's per-breakpoint responsive overrides into the by-id (literal) and by-var (var()-preserving)
	 * maps. A no-op when the leaf has no responsive shape. Each slot may itself be an alias, flattened for the
	 * literal form and preserved as a var() reference for the projection form.
	 *
	 * @since TBD
	 *
	 * @param array<string,mixed>                $child             The leaf node.
	 * @param string                             $type              The leaf's $type.
	 * @param string                             $path              The token dot-path.
	 * @param string                             $css_var           The token's css-var name.
	 * @param array<string,mixed>                $document          Full effective doc, for alias lookups.
	 * @param array<string,array<string,string>> $by_id_responsive  By-reference id => [ breakpoint => literal value ].
	 * @param array<string,array<string,string>> $by_var_responsive By-reference css-var => [ breakpoint => projected value ].
	 *
	 * @return void
	 */
	private function collect_responsive_overrides( array $child, string $type, string $path, string $css_var, array $document, array &$by_id_responsive, array &$by_var_responsive ): void {
		if ( ! Responsive::has_responsive( $child ) ) {
			return;
		}

		$responsive = Responsive::responsive_of( $child );

		if ( ! is_array( $responsive ) ) {
			return;
		}

		foreach ( Responsive::get_breakpoint_keys() as $breakpoint ) {
			if ( ! array_key_exists( $breakpoint, $responsive ) ) {
				continue;
			}

			$slot = $responsive[ $breakpoint ];

			$by_id_responsive[ $path ][ $breakpoint ]     = $this->renderer->render( $type, $this->resolve_value( $slot, $document, [] ) );
			$by_var_responsive[ $css_var ][ $breakpoint ] = $this->renderer->render( $type, $this->project_value( $slot ) );
		}
	}

	/**
	 * Render a structured clamp map to a clamp(min, preferred, max) string. Every slot — min, preferred and
	 * max alike — is flattened against the leaf's $type: an alias slot resolves to its target, a literal
	 * passes through, and the calc-style fluid expression the preferred slot typically holds renders
	 * verbatim. When $projected is true, alias slots are preserved as var() references (for the css-var
	 * projection); otherwise they are flattened to literals (for host surfaces).
	 *
	 * @since TBD
	 *
	 * @param array<string,mixed> $clamp         The decoded clamp map.
	 * @param string              $type          The leaf's $type.
	 * @param array<string,mixed> $document      Full effective doc, for alias lookups.
	 * @param bool                $projected     Whether to preserve aliases as var() references.
	 *
	 * @return string
	 */
	private function render_clamp( array $clamp, string $type, array $document, bool $projected ): string {
		$slot = function ( $value ) use ( $type, $document, $projected ): string {
			$flattened = $projected
				? $this->project_value( $value )
				: $this->resolve_value( $value, $document, [] );

			return $this->renderer->render( $type, $flattened );
		};

		return $this->renderer->clamp(
			$slot( $clamp[ Responsive::get_clamp_min_key() ] ?? '' ),
			$slot( $clamp[ Responsive::get_clamp_preferred_key() ] ?? '' ),
			$slot( $clamp[ Responsive::get_clamp_max_key() ] ?? '' )
		);
	}

	/**
	 * Project a raw $value for the css-var output, preserving alias indirection as var() references
	 * instead of flattening to literals: a whole-string alias (e.g. a composite field that is one)
	 * becomes var(--<target>); a composite recurses field by field; scalars and lists pass through.
	 *
	 * Unlike resolve_value() this neither follows alias chains nor re-validates them — it stops at the
	 * immediate target (the chain is preserved across tokens by the cascade) and only ever runs after
	 * resolve_value() has already rejected cycles and dangling aliases for the same leaf.
	 *
	 * @since TBD
	 *
	 * @param mixed $value
	 *
	 * @return mixed The value with aliases replaced by var() references.
	 */
	private function project_value( $value ) {
		if ( is_string( $value ) && Alias::is_alias( $value ) ) {
			return 'var(' . Css_Var::from_id( Alias::path_of( $value ) ) . ')';
		}

		if ( is_array( $value ) && ! $this->is_list( $value ) ) {
			$projected = [];
			foreach ( $value as $field => $sub ) {
				$projected[ $field ] = $this->project_value( $sub );
			}

			return $projected;
		}

		return $value;
	}

	/**
	 * Resolve a raw $value to a literal: aliases follow their reference recursively;
	 * composite arrays resolve field by field; scalars and lists pass through.
	 *
	 * @since TBD
	 *
	 * @param mixed               $value
	 * @param array<string,mixed> $document
	 * @param array<string,true>  $visited  Dot-paths currently being resolved (cycle guard).
	 *
	 * @return mixed The literal (scalar, list, or composite array with literal fields).
	 *
	 * @throws Alias_Cycle_Exception    When resolution re-enters a dot-path already being resolved.
	 * @throws Dangling_Alias_Exception When an alias references a path with no token leaf.
	 */
	private function resolve_value( $value, array $document, array $visited ) {
		// Alias: jump to the referenced token's $value and resolve that.
		// Only strings can be aliases; the is_string() narrows $value for path_of()'s string parameter.
		if ( is_string( $value ) && Alias::is_alias( $value ) ) {
			$target = Alias::path_of( $value );

			// is_alias() guarantees a non-empty path; the guard keeps the type tight for what follows.
			if ( $target === '' ) {
				return $value;
			}

			if ( isset( $visited[ $target ] ) ) {
				throw new Alias_Cycle_Exception(
					sprintf( 'Alias cycle detected at "%s".', $target )
				);
			}

			$leaf = $this->lookup( $target, $document );

			// Dangling alias: the target is missing, or points at a group rather than a
			// token leaf. There is nothing to resolve to, and passing the "{…}" reference
			// through would emit invalid CSS, so reject it. resolve_overrides() surfaces this to the
			// REST write layer (HTTP 422) before the document is ever stored — symmetric
			// with cycle handling.
			if ( $leaf === null || ! array_key_exists( '$value', $leaf ) ) {
				throw new Dangling_Alias_Exception(
					sprintf( 'Alias references a missing token at "%s".', $target )
				);
			}

			$visited[ $target ] = true;

			return $this->resolve_value( $leaf['$value'], $document, $visited );
		}

		// Composite (shadow/typography): each field may itself be an alias.
		if ( is_array( $value ) && ! $this->is_list( $value ) ) {
			$resolved = [];
			foreach ( $value as $field => $sub ) {
				$resolved[ $field ] = $this->resolve_value( $sub, $document, $visited );
			}

			return $resolved;
		}

		// Scalar or list: literal already. Lists (e.g. a fontFamily stack, or a
		// multi-layer shadow — see Css_Renderer::shadow) pass through untouched; their
		// elements are not alias-resolved in v1.
		return $value;
	}

	/**
	 * Look up a leaf node by dot-path within the effective document.
	 *
	 * @since TBD
	 *
	 * @param string              $path     The dot-path to look up.
	 * @param array<string,mixed> $document The effective document to search.
	 *
	 * @return array<string,mixed>|null
	 */
	private function lookup( string $path, array $document ): ?array {
		return Document_Path::node_at( $document, $path );
	}

	/**
	 * Whether the array is a zero-indexed list (a fontFamily stack or stacked shadow) rather than an
	 * associative composite map.
	 *
	 * @since TBD
	 *
	 * @param array<mixed> $value
	 */
	private function is_list( array $value ): bool {
		return $value === [] || array_keys( $value ) === range( 0, count( $value ) - 1 );
	}
}
