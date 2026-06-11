<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;

/**
 * The single declaration point for design tokens. Holds structure only — never values.
 *
 * Every projector and the admin UI read this one registry, so declaring a token once here makes it
 * reach the custom UI, the theme.json presets, the Kadence palette and the Site Editor without a
 * second source of truth.
 *
 * Resolved as a singleton from KB's container; tokens are declared during the module's Provider boot
 * via kadence_blocks_register_design_token().
 *
 * @since TBD
 */
final class Token_Registry {

	/** @var array<string, Token_Definition> Keyed by token id, insertion-ordered. */
	private array $tokens = [];

	/** @var array<string, Variant_Set> Keyed by block name. */
	private array $variant_sets = [];

	/**
	 * Whether token projection is active. Flipped off by the fail-closed guard so projectors and the
	 * UI surface fall back to existing KB behavior rather than projecting a partial/broken set.
	 *
	 * @var bool
	 */
	private bool $active = true;

	/**
	 * Register a single token from its declaration array.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $definition See Token_Definition::from_array().
	 *
	 * @return void
	 */
	public function register( array $definition ): void {
		$token = Token_Definition::from_array( $definition );

		$this->tokens[ $token->id ] = $token;
	}

	/**
	 * Register a block's variant set — the variants it accepts, its default, and the per-property
	 * bindings.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $set See Variant_Set::from_array().
	 *
	 * @return void
	 */
	public function register_variant_set( array $set ): void {
		$variant_set = Variant_Set::from_array( $set );

		$this->variant_sets[ $variant_set->block ] = $variant_set;
	}

	// ---- Lookups consumed by projectors and the UI ------------------------------------------------

	/**
	 * All registered tokens, keyed by id in insertion order.
	 *
	 * @since TBD
	 *
	 * @return array<string, Token_Definition>
	 */
	public function all(): array {
		return $this->tokens;
	}

	/**
	 * A single token by id, or null when it is not registered.
	 *
	 * @since TBD
	 *
	 * @param string $id The token id.
	 *
	 * @return Token_Definition|null
	 */
	public function get( string $id ): ?Token_Definition {
		return $this->tokens[ $id ] ?? null;
	}

	/**
	 * Whether a token is registered for the given id.
	 *
	 * @since TBD
	 *
	 * @param string $id The token id.
	 *
	 * @return bool
	 */
	public function has( string $id ): bool {
		return isset( $this->tokens[ $id ] );
	}

	/**
	 * @since TBD
	 *
	 * @param string $type DTCG $type, e.g. "color".
	 *
	 * @return array<string, Token_Definition>
	 */
	public function by_type( string $type ): array {
		return array_filter(
			$this->tokens,
			static function ( Token_Definition $t ) use ( $type ): bool {
				return $t->type === $type;
			}
		);
	}

	/**
	 * Tokens that declare a given projection target, e.g. all tokens with a "wp_preset" projection.
	 *
	 * @since TBD
	 *
	 * @param string $projection Projection id.
	 *
	 * @return array<string, Token_Definition>
	 */
	public function by_projection( string $projection ): array {
		return array_filter(
			$this->tokens,
			static function ( Token_Definition $t ) use ( $projection ): bool {
				return $t->has_projection( $projection );
			}
		);
	}

	/**
	 * Variant set registered for a block, or null.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name, e.g. "kadence/advancedbtn".
	 *
	 * @return Variant_Set|null
	 */
	public function for_block( string $block ): ?Variant_Set {
		return $this->variant_sets[ $block ] ?? null;
	}

	/**
	 * All registered variant sets, keyed by block name in registration order. The admin UI feed
	 * iterates this to render per-block variant editors; mirrors all() for tokens.
	 *
	 * @since TBD
	 *
	 * @return array<string, Variant_Set>
	 */
	public function variant_sets(): array {
		return $this->variant_sets;
	}

	/**
	 * The effective projection targets for a binding: a token reference contributes the referenced
	 * token's projections (so a variant reuses the variable the base property already feeds), and the
	 * binding's inline targets are merged on top, supplementing or overriding them (e.g. adding a
	 * block_attr the token never carries). A reference to an unregistered token contributes nothing, so
	 * a stale reference fails soft (its projections are skipped) rather than fatal.
	 *
	 * @since TBD
	 *
	 * @param Binding $binding The binding to resolve.
	 *
	 * @return array<string, mixed> Projection target key => value.
	 */
	public function effective_projections( Binding $binding ): array {
		$base = [];

		if ( $binding->is_token_ref() ) {
			$token = $this->get( (string) $binding->token );
			$base  = $token !== null ? $token->projections : [];
		}

		return array_merge( $base, $binding->projections );
	}

	/**
	 * Convenience: the canonical css-var for an id, honouring any override.
	 *
	 * @since TBD
	 *
	 * @param string $id The token id.
	 *
	 * @return string
	 */
	public function css_var_for( string $id ): string {
		$token = $this->get( $id );

		return $token !== null ? $token->css_var : Css_Var::from_id( $id );
	}

	/**
	 * The schema the admin React app consumes. A token registered in PHP appears in the
	 * UI with no JS change. Values are NOT included here — the resolver supplies current values
	 * separately; this is structure only.
	 *
	 * @since TBD
	 *
	 * @return array{groups: array<string, array<int, array<string, mixed>>>}
	 */
	public function to_ui_schema(): array {
		$groups = [];

		foreach ( $this->tokens as $token ) {
			$groups[ $token->group ][] = [
				'id'          => $token->id,
				'type'        => $token->type,
				'label'       => $token->label,
				'cssVar'      => $token->css_var,
				'projections' => $token->projections,
			];
		}

		return [ 'groups' => $groups ];
	}

	// ---- Fail-closed activation guard -------------------------------------------------------------

	/**
	 * Whether token projection is currently active.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_active(): bool {
		return $this->active;
	}

	/**
	 * Validate that every declared token has a baseline entry. See the fail-closed policy.
	 *
	 * @since TBD
	 *
	 * @param Baseline_Document $baseline The baseline to validate declared tokens against.
	 *
	 * @return string[] The ids missing from the baseline (empty when valid).
	 */
	public function missing_from_baseline( Baseline_Document $baseline ): array {
		$missing = [];

		foreach ( $this->tokens as $id => $_token ) {
			if ( ! $baseline->has( $id ) ) {
				$missing[] = $id;
			}
		}

		return $missing;
	}

	/**
	 * Disable projection (fail-closed degraded mode).
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function deactivate(): void {
		$this->active = false;
	}

	/**
	 * Re-enable projection after a previous deactivate() call.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function activate(): void {
		$this->active = true;
	}
}
