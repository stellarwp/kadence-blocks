<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Sorter;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;

/**
 * Pure assembler for the admin UI schema feed — the `window.kadenceDesignTokens` payload the dashboard
 * React app reads.
 *
 * Reads token STRUCTURE from the registry ({@see Token_Registry::to_ui_schema()}) and folds in the
 * resolved VALUES, PRESETS, nav-ready block-presets section (from {@see Preset_Nav}), REST descriptor
 * and store version handed in by the Localizer — which owns every WordPress call. When the registry is
 * inactive (the fail-closed guard) it returns an empty, `active:false` payload so the React section
 * hides and KB's existing UI is untouched; when values could not be resolved (a corrupt store) the
 * caller passes `$resolved = false` and an empty values map, so structure still renders and the editor
 * stays usable. No WordPress calls, no globals, no I/O.
 *
 * @since TBD
 */
final class Builder {

	/**
	 * The token registry, the single source of token + preset structure.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * The nav-ready block-presets section builder.
	 *
	 * @since TBD
	 *
	 * @var Preset_Nav
	 */
	private Preset_Nav $preset_nav;

	/**
	 * The shared stored-order permutation, applied one schema group at a time.
	 *
	 * @since TBD
	 *
	 * @var Token_Sorter
	 */
	private Token_Sorter $sorter;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry $registry   The token registry.
	 * @param Preset_Nav     $preset_nav The nav-ready block-presets section builder.
	 * @param Token_Sorter   $sorter     The shared stored-order permutation.
	 */
	public function __construct( Token_Registry $registry, Preset_Nav $preset_nav, Token_Sorter $sorter ) {
		$this->registry   = $registry;
		$this->preset_nav = $preset_nav;
		$this->sorter     = $sorter;
	}

	/**
	 * Shape the localized payload from the pre-gathered values, presets, REST descriptor and version.
	 *
	 * @since TBD
	 *
	 * @param array<string, string>                                 $values     id => resolved value (by_id), or [] when unresolved.
	 * @param bool                                                  $resolved   Whether resolution succeeded.
	 * @param array<string, mixed>                                  $presets   Per-block preset structure + values.
	 * @param array{root: string, namespace: string, nonce: string} $rest       REST root, namespace and nonce.
	 * @param string                                                $version    Store version hash ('' from baseline).
	 * @param string                                                $slug       The token library slug the values/version/schema were resolved against.
	 * @param string                                                $title      The library's display title, already defaulted for an untitled
	 *                                                                          default library. Carried here so the admin page can name the
	 *                                                                          library on first paint, without waiting on the separate libraries
	 *                                                                          request and visibly correcting itself once that arrives.
	 * @param array<string, array<string, mixed>>                   $responsive id => raw authored responsive / clamp shape, for
	 *                                                                          tokens that carry one (for editor hydration).
	 * @param array<string, string>                                 $labels     id => display-label override for this library.
	 * @param array<int, string>                                    $order      The flat ordered token id list for this library.
	 *
	 * @return array<string, mixed> The localized payload.
	 */
	public function build( array $values, bool $resolved, array $presets, array $rest, string $version, string $slug, string $title = '', array $responsive = [], array $labels = [], array $order = [] ): array {
		$active = $this->registry->is_active();

		return [
			'active'     => $active,
			'resolved'   => $active && $resolved,
			'version'    => $version,
			'slug'       => $slug,
			// Carried alongside the slug so the library selector can name the active library on first
			// paint, before its REST list has loaded and any row is available to look the title up in.
			'title'      => $title,
			'schema'     => $active
				? $this->apply_group_order( $this->apply_label_overrides( $this->registry->to_ui_schema(), $labels ), $order )
				: [ 'groups' => [] ],
			'values'     => $active ? $values : [],
			'presets'    => $active ? $presets : [],
			'presetNav'  => $active ? $this->preset_nav->all() : [],
			'responsive' => $active ? $responsive : [],
			'rest'       => $rest,
		];
	}

	/**
	 * Overlay per-library display-label overrides onto the registry's UI schema. Every token row
	 * gains a `labelOverridden` flag (stable shape whether or not any override exists) so the
	 * admin UI can offer a reset affordance and distinguish a custom name from a declared one; an
	 * override for an id the schema does not contain is ignored (stale data, pruned by the write
	 * surface on its next save of that id).
	 *
	 * @since TBD
	 *
	 * @param array{groups: array<string, array<int, array<string, mixed>>>} $schema The registry UI schema.
	 * @param array<string, string>                                          $labels id => override label.
	 *
	 * @return array{groups: array<string, array<int, array<string, mixed>>>} The schema with effective labels applied.
	 */
	private function apply_label_overrides( array $schema, array $labels ): array {
		foreach ( $schema['groups'] as $group => $rows ) {
			foreach ( $rows as $i => $row ) {
				$override = $labels[ $row['id'] ] ?? null;

				$schema['groups'][ $group ][ $i ]['label']           = $override ?? $row['label'];
				$schema['groups'][ $group ][ $i ]['labelOverridden'] = $override !== null;
			}
		}

		return $schema;
	}

	/**
	 * Permute every schema group by the stored flat order, one group at a time through the shared
	 * {@see Token_Sorter} — the same permutation the editor's pickable-token pool applies, so the
	 * picker and this screen can never disagree about where a token sits. Per its contract: listed
	 * ids first by position, unmentioned ids appended in declaration order (never hidden), an empty
	 * stored order returning the schema untouched.
	 *
	 * @since TBD
	 *
	 * @param array{groups: array<string, array<int, array<string, mixed>>>} $schema The (label-overlaid) UI schema.
	 * @param array<int, string>                                             $order  The flat ordered token id list.
	 *
	 * @return array{groups: array<string, array<int, array<string, mixed>>>} The schema with groups permuted.
	 */
	private function apply_group_order( array $schema, array $order ): array {
		if ( $order === [] ) {
			return $schema;
		}

		foreach ( $schema['groups'] as $group => $rows ) {
			$schema['groups'][ $group ] = $this->sorter->sort( $rows, $order );
		}

		return $schema;
	}
}
