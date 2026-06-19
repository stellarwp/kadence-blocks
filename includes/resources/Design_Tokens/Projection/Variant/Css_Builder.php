<?php declare( strict_types=1 );
// cspell:ignore advancedbtn palette .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Identifier;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Scope;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use RuntimeException;

/**
 * Builds the scoped CSS for selectable block variants — Kadence blocks and core/button alike.
 *
 * A selected variant reaches output purely through the cascade: the editor adds a "kb-variant--<name>"
 * class to the block, and this builder emits, per (block, variant), a rule that retargets the --global-*
 * custom properties (a numbered palette slot or a named button slot) the block consumes. Kadence blocks
 * consume these in their render path / SCSS; core/button consumes the same button slots through a small
 * companion stylesheet (Native\Styles\Button), so one retarget path re-skins both with zero changes to a
 * block's markup. The selector is block-aware: core/button resolves to ".wp-block-button".
 *
 * A block's variants may be organized into named GROUPS (independent single-select axes). The build
 * iterates each block's groups and emits, per (block, group, variant), the same three declaration blocks
 * below. A grouped selection carries the group in both the class and the var name; a flat block's single
 * implicit group omits the group segment, so its output is identical to an ungrouped block.
 *
 * Three declaration blocks are emitted (the "<group>--" segment is present only for an explicit group):
 *
 *   1. A global --kb-token--variant--<block>--<group>--<variant>--<property> definition for every bound
 *      value, so a variant's values surface as named token vars in the same graph as every other token.
 *   2. Per (block, group, variant) scoped rules — ".wp-block-<block>.kb-variant--<group>--<variant>" —
 *      pointing each --global-<slot> at its variant var. The var is always co-emitted in (1) in the same
 *      stylesheet, so the reference resolves without a literal fallback.
 *   3. A class-less ".wp-block-<block>" rule per group, pointing each --global-<slot> at that group's
 *      $default variant's var, so a block with no variant selected still shows each group's preset (the
 *      $default look) — the Kadence analogue of the block preset, for color slots with no attribute to seed.
 *
 * Scoping is per (block, group, variant): the same variant name on two blocks ("ghost" on a Button and a
 * Row), or on two groups, gets its own qualified rule, so values never collide. When two groups retarget
 * the same --global-<slot>, their selected-variant rules carry equal specificity, so source order decides:
 * groups are emitted in document order, so the later group wins for a shared slot.
 *
 * Nothing here is !important and the scope carries ordinary class specificity, so a per-instance inline
 * style still wins over a variant. Values are sanitized defensively before they reach a declaration.
 *
 * @since TBD
 */
final class Css_Builder {

	use Sanitizes_Css_Identifier;
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
	 * Kadence theme global custom-property slots a variant may retarget beyond the numbered palette
	 * (palette1..9). These are the button's own color slots — the exact --global-* properties the
	 * button render path already consumes — so a variant re-skins the button with no change to its
	 * render path.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const NAMED_GLOBAL_SLOTS = [
		'palette-btn-bg',
		'palette-btn',
		'palette-btn-bg-hover',
		'palette-btn-hover',
	];

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
	 * Build the full variant CSS for a token set: the global variant-var block, the per (block, group,
	 * variant) scoped rules, and a class-less $default rule per group. Empty when no registered block
	 * contributes a slot-targeted value.
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
				$groups = $this->variants->groups( $block );
			} catch ( RuntimeException $e ) {
				continue;
			}

			$selector = $this->block_selector( $block );

			// Groups are emitted in document order: when two groups share a --global-<slot>, equal specificity
			// means the later group's rule wins by source order.
			foreach ( $groups as $group ) {
				try {
					$names = $this->variants->names( $block, $group );
				} catch ( RuntimeException $e ) {
					continue;
				}

				// Keep each variant's slot declarations so the group's $default can be re-emitted, class-less, below.
				$variant_declarations = [];

				foreach ( $names as $variant ) {
					try {
						$values = $this->variants->resolve( $block, $variant, $slug, $group );
					} catch ( RuntimeException $e ) {
						continue;
					}

					$declarations = '';

					foreach ( $values as $property => $value ) {
						$binding = $set->binding( $property );

						if ( $binding === null ) {
							continue;
						}

						$slot = $this->global_slot( $binding );

						if ( $slot === null ) {
							continue;
						}

						$var     = $this->variant_var( $block, $group, $variant, $property );
						$literal = $this->sanitize_value( $value );

						$globals      .= $var . ':' . $literal . ';';
						$declarations .= '--global-' . $slot . ':var(' . $var . ');';
					}

					if ( $declarations !== '' ) {
						$variant_declarations[ $variant ] = $declarations;
						$scoped                          .= $selector . '.' . $this->variant_class( $group, $variant ) . '{' . $declarations . '}';
					}
				}

				/**
				 * The group's $default look: a block with no variant selected for this group still shows its
				 * preset. Point the same slots at the group's $default variant's var on the class-less block
				 * selector. Its lower specificity yields to the kb-variant-- rules above (a selected variant)
				 * and to a per-instance edit, so it only fills the gap.
				 */
				try {
					$default = $this->variants->default_variant( $block, $group );
				} catch ( RuntimeException $e ) {
					$default = '';
				}

				if ( $default !== '' && isset( $variant_declarations[ $default ] ) ) {
					$scoped .= $selector . '{' . $variant_declarations[ $default ] . '}';
				}
			}
		}

		$css = $globals === '' ? '' : Scope::root() . '{' . $globals . '}';

		return $css . $scoped;
	}

	/**
	 * The variant class for a (group, variant): the flat "kb-variant--<variant>" for a block's implicit
	 * single group, or the grouped "kb-variant--<group>--<variant>" for an explicit group. Delegates to
	 * {@see Style} so the class shape matches the editor's and never drifts.
	 *
	 * @since TBD
	 *
	 * @param string $group   The variant group (the implicit-group sentinel for a flat block).
	 * @param string $variant The variant slug.
	 *
	 * @return string
	 */
	private function variant_class( string $group, string $variant ): string {
		return $group === Variant_Resolver::IMPLICIT_GROUP
			? Style::variant_class( $variant )
			: Style::group_variant_class( $group, $variant );
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
	 * The Kadence global custom-property slot a binding targets, or null when it targets none.
	 *
	 * Recognizes the numbered palette slots (palette1..9 → --global-paletteN) and the named button
	 * slots in {@see NAMED_GLOBAL_SLOTS} (e.g. palette-btn-bg → --global-palette-btn-bg). Reads the
	 * binding's effective projections so a token-reference binding inherits the referenced token's
	 * slot and an inline binding declares its own; both reach the same --global-<slot>.
	 *
	 * @since TBD
	 *
	 * @param Binding $binding The variant binding.
	 *
	 * @return string|null The slot ("palette3", "palette-btn-bg"), or null.
	 */
	private function global_slot( Binding $binding ): ?string {
		$slot = $this->registry->effective_projections( $binding )[ Binding::get_kadence_slot_key() ] ?? null;

		if ( ! is_string( $slot ) ) {
			return null;
		}

		if ( preg_match( '/^palette[1-9]$/', $slot ) === 1 || in_array( $slot, self::NAMED_GLOBAL_SLOTS, true ) ) {
			return $slot;
		}

		return null;
	}

	/**
	 * The block's CSS class selector: a Kadence (or any namespaced) block => ".wp-block-<namespace>-<name>";
	 * a core block => ".wp-block-<name>" (WordPress drops the "core/" namespace), so core/button resolves to
	 * ".wp-block-button" rather than ".wp-block-core-button".
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
			return '.wp-block-' . self::sanitize_identifier( $name );
		}

		return '.wp-block-' . self::sanitize_identifier( $namespace ) . '-' . self::sanitize_identifier( $name );
	}

	/**
	 * The variant var name for a (block, group, variant, property): "--kb-token--variant--<block>--
	 * <group>--<variant>--<property>", e.g. --kb-token--variant--kadence-advancedbtn--emphasis--ghost--
	 * button-bg. A block's implicit single group omits the "<group>--" segment, so a flat block keeps the
	 * "--kb-token--variant--<block>--<variant>--<property>" shape unchanged.
	 *
	 * @since TBD
	 *
	 * @param string $block    The block name.
	 * @param string $group    The variant group (the implicit-group sentinel for a flat block).
	 * @param string $variant  The variant slug.
	 * @param string $property The block property.
	 *
	 * @return string
	 */
	private function variant_var( string $block, string $group, string $variant, string $property ): string {
		$var = Css_Var::get_prefix() . self::VARIANT_SEGMENT
			. self::sanitize_identifier( str_replace( '/', '-', $block ) ) . '--';

		if ( $group !== Variant_Resolver::IMPLICIT_GROUP ) {
			$var .= self::sanitize_identifier( $group ) . '--';
		}

		return $var
			. self::sanitize_identifier( $variant ) . '--'
			. self::sanitize_identifier( $property );
	}
}
