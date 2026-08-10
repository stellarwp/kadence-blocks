<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed;

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
	 * @since TBD
	 *
	 * @param Token_Registry $registry   The token registry.
	 * @param Preset_Nav     $preset_nav The nav-ready block-presets section builder.
	 */
	public function __construct( Token_Registry $registry, Preset_Nav $preset_nav ) {
		$this->registry   = $registry;
		$this->preset_nav = $preset_nav;
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
	 * @param string                                                $title      The active library's display title, already defaulted for an untitled default library.
	 * @param array<string, array<string, mixed>>                   $responsive id => raw authored responsive / clamp shape, for
	 *                                                                          tokens that carry one (for editor hydration).
	 *
	 * @return array<string, mixed> The localized payload.
	 */
	public function build( array $values, bool $resolved, array $presets, array $rest, string $version, string $slug, string $title = '', array $responsive = [] ): array {
		$active = $this->registry->is_active();

		return [
			'active'     => $active,
			'resolved'   => $active && $resolved,
			'version'    => $version,
			'slug'       => $slug,
			// Carried alongside the slug so the library selector can name the active library on first
			// paint, before its REST list has loaded and any row is available to look the title up in.
			'title'      => $title,
			'schema'     => $active ? $this->registry->to_ui_schema() : [ 'groups' => [] ],
			'values'     => $active ? $values : [],
			'presets'    => $active ? $presets : [],
			'presetNav'  => $active ? $this->preset_nav->all() : [],
			'responsive' => $active ? $responsive : [],
			'rest'       => $rest,
		];
	}
}
