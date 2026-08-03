<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Preset_Bindings;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use WP_Block_Type_Registry;

/**
 * The nav-ready block-presets section of the admin feed: one ordered entry per block whose
 * preset bindings declare a picker control label ({@see Preset_Bindings::$label}), carrying a
 * DISPLAY label for the Style Library sidebar. Default-look-only binding sets (no picker label)
 * are excluded — they have no user-facing presets. Which sets are INCLUDED and how each entry is
 * LABELED are deliberately separate questions: inclusion is governed solely by
 * {@see Preset_Bindings::$label} (see {@see self::all()}); the label shown is resolved by
 * {@see self::label_for()} and never falls back to that same picker-control string, which names
 * the inspector control rather than the block.
 *
 * @since TBD
 */
final class Preset_Nav {

	/**
	 * The token registry, source of the registered preset bindings.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry $registry The token registry.
	 */
	public function __construct( Token_Registry $registry ) {
		$this->registry = $registry;
	}

	/**
	 * Build the ordered nav entries: labeled (picker-driven) binding sets only.
	 *
	 * Order: registration order (the registry preserves it), which puts first-party blocks
	 * before any third-party registrations. Membership is governed solely by
	 * {@see Preset_Bindings::$label} being non-null — the Style Library section below only
	 * changes how an included entry is labeled, never whether it is included.
	 *
	 * @since TBD
	 *
	 * @return array<int, array{block: string, label: string}> The entries.
	 */
	public function all(): array {
		$entries = [];

		foreach ( $this->registry->all_preset_bindings() as $block => $bindings ) {
			if ( $bindings->label === null ) {
				continue; // Default-look-only — no user-facing preset concept, so no nav entry.
			}

			$entries[] = [
				'block' => $block,
				'label' => $this->label_for( $block, $bindings ),
			];
		}

		return $entries;
	}

	/**
	 * Resolve the DISPLAY label for a nav entry, tried in order:
	 *
	 * 1. The declared Style Library section's label ({@see Preset_Bindings::style_library_label()}) —
	 *    the documented opt-in for a block-specific nav label.
	 * 2. The block's registered title, read from {@see WP_Block_Type_Registry} — the same name
	 *    shown for the block everywhere else in the editor.
	 * 3. A humanized form of the block name (e.g. "kadence/my-block" -> "My Block") when the block
	 *    is not registered at all — degrades gracefully rather than showing a raw block name or the
	 *    picker control's `$label`.
	 *
	 * @since TBD
	 *
	 * @param string          $block    The block name.
	 * @param Preset_Bindings $bindings The block's preset bindings.
	 *
	 * @return string The resolved display label.
	 */
	private function label_for( string $block, Preset_Bindings $bindings ): string {
		$declared = $bindings->style_library_label();

		if ( $declared !== null ) {
			return $declared;
		}

		$type = WP_Block_Type_Registry::get_instance()->get_registered( $block );

		if ( $type !== null && is_string( $type->title ) && $type->title !== '' ) {
			return $type->title;
		}

		return self::humanize( $block );
	}

	/**
	 * Humanize a block name into a readable label: the part after the last "/", with hyphens and
	 * underscores turned into spaces and each word capitalized (e.g. "kadence/my-block" ->
	 * "My Block").
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @return string The humanized label.
	 */
	private static function humanize( string $block ): string {
		$slug = strrchr( $block, '/' );
		$slug = $slug === false ? $block : substr( $slug, 1 );

		return ucwords( str_replace( [ '-', '_' ], ' ', $slug ) );
	}
}
