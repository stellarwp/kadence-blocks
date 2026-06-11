<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;

/**
 * Pure assembler for the admin UI schema feed — the `window.kadenceDesignTokens` payload the dashboard
 * React app reads.
 *
 * Reads token STRUCTURE from the registry ({@see Token_Registry::to_ui_schema()}) and folds in the
 * resolved VALUES, VARIANTS, REST descriptor and store version handed in by the Localizer — which owns
 * every WordPress call. When the registry is inactive (the fail-closed guard) it returns an empty,
 * `active:false` payload so the React section hides and KB's existing UI is untouched; when values could
 * not be resolved (a corrupt store) the caller passes `$resolved = false` and an empty values map, so
 * structure still renders and the editor stays usable. No WordPress calls, no globals, no I/O.
 *
 * @since TBD
 */
final class Builder {

	/**
	 * The token registry, the single source of token + variant structure.
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
	 * Shape the localized payload from the pre-gathered values, variants, REST descriptor and version.
	 *
	 * @since TBD
	 *
	 * @param array<string, string>                                 $values   id => resolved value (by_id), or [] when unresolved.
	 * @param bool                                                  $resolved Whether resolution succeeded.
	 * @param array<string, mixed>                                  $variants Per-block variant structure + values.
	 * @param array{root: string, namespace: string, nonce: string} $rest     REST root, namespace and nonce.
	 * @param int                                                   $version  Store version.
	 *
	 * @return array<string, mixed> The localized payload.
	 */
	public function build( array $values, bool $resolved, array $variants, array $rest, int $version ): array {
		$active = $this->registry->is_active();

		return [
			'active'   => $active,
			'resolved' => $active && $resolved,
			'version'  => $version,
			'schema'   => $active ? $this->registry->to_ui_schema() : [ 'groups' => [] ],
			'values'   => $active ? $values : [],
			'variants' => $active ? $variants : [],
			'rest'     => $rest,
		];
	}
}
