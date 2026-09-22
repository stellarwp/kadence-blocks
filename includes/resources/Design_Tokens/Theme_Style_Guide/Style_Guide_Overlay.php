<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Palette_Slot;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Contracts\Style_Guide_Source;

/**
 * The theme-derived token values for this request, and a signature that changes when they do.
 *
 * Composes the source (WordPress I/O) and the mapper (pure) and memoizes the result, so the baseline
 * decorator and the cache-version service read the same values. The signature is what lets a
 * Customizer save — which bumps no store version — invalidate every resolved/projected cache.
 *
 * @since TBD
 */
final class Style_Guide_Overlay {

	/**
	 * Where the Style Guide is read from.
	 *
	 * @since TBD
	 *
	 * @var Style_Guide_Source
	 */
	private Style_Guide_Source $source;

	/**
	 * Snapshot => token values.
	 *
	 * @since TBD
	 *
	 * @var Style_Guide_Mapper
	 */
	private Style_Guide_Mapper $mapper;

	/**
	 * Supplies the slot => token map from the tokens declaring a kadence_slot.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * Per-request memo of token id => $value. Null until a complete result was computed.
	 *
	 * @since TBD
	 *
	 * @var array<string, string>|null
	 */
	private ?array $values = null;

	/**
	 * @since TBD
	 *
	 * @param Style_Guide_Source $source   The Style Guide source.
	 * @param Style_Guide_Mapper $mapper   The pure mapper.
	 * @param Token_Registry     $registry The token registry.
	 */
	public function __construct( Style_Guide_Source $source, Style_Guide_Mapper $mapper, Token_Registry $registry ) {
		$this->source   = $source;
		$this->mapper   = $mapper;
		$this->registry = $registry;
	}

	/**
	 * Token id => $value derived from the theme. Empty when the Kadence theme is not active.
	 *
	 * @since TBD
	 *
	 * @return array<string, string>
	 */
	public function values(): array {
		if ( $this->values !== null ) {
			return $this->values;
		}

		$snapshot = $this->source->snapshot();

		if ( $snapshot === null ) {
			// Not memoized: before after_setup_theme the theme is not loaded yet, and a caller that early
			// must not pin "no theme" for the rest of a request in which the theme does load.
			return [];
		}

		$slot_tokens = $this->slot_tokens();
		$values      = $this->mapper->map( $snapshot, $slot_tokens );

		if ( $slot_tokens === [] ) {
			// Declarations register on init:0. A caller before that would memoize a map with no palette
			// slots for the whole request, so hand the partial result back without keeping it.
			return $values;
		}

		$this->values = $values;

		return $this->values;
	}

	/**
	 * A short fingerprint of values(): empty when there is nothing to overlay, so a cache key that
	 * folds it in is unchanged on non-Kadence sites.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function signature(): string {
		$values = $this->values();

		if ( $values === [] ) {
			return '';
		}

		ksort( $values );

		return md5( (string) wp_json_encode( $values ) );
	}

	/**
	 * Drop the per-request memo. Used by tests and by any caller that changes the Style Guide and needs
	 * the new values within the same request.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function flush(): void {
		$this->values = null;
	}

	/**
	 * Slot slug => token id for every token declaring a palette kadence_slot.
	 *
	 * @since TBD
	 *
	 * @return array<string, string>
	 */
	private function slot_tokens(): array {
		$slots = [];

		foreach ( $this->registry->by_projection( Kadence_Palette_Slot::get_projection_key() ) as $id => $token ) {
			$slot = Kadence_Palette_Slot::from_token( $token );

			if ( $slot === null ) {
				continue;
			}

			$slots[ $slot->slug ] = $id;
		}

		return $slots;
	}
}
