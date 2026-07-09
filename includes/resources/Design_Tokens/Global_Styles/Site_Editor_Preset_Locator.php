<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Theme_Json\Preset_Bucket;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Wp_Preset_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;

/**
 * Finds every token that opts into two-way Site Editor sync: it must be both theme.json-visible
 * (a "wp_preset" projection — the same one Theme_Json\Json_Builder reads) AND explicitly opted
 * into sync ("site_editor" => true, an existing-but-previously-unconsumed projection already
 * shipped on several tokens in declarations.php).
 *
 * A token with only "wp_preset" (theme.json-visible, not opted into sync) is deliberately treated
 * like an ad-hoc preset by the rest of this module — this locator simply never returns it.
 *
 * Pure: no WordPress calls, no globals, no side effects.
 *
 * @since TBD
 */
final class Site_Editor_Preset_Locator {

	/**
	 * The projection key a token declares to opt into Site Editor two-way sync.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SITE_EDITOR = 'site_editor';

	/**
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * @param Token_Registry $registry
	 */
	public function __construct( Token_Registry $registry ) {
		$this->registry = $registry;
	}

	/**
	 * Every syncable token, resolved to its preset address.
	 *
	 * @since TBD
	 *
	 * @return array<int, Preset_Target>
	 */
	public function locate(): array {
		$targets = [];

		foreach ( $this->registry->by_projection( self::SITE_EDITOR ) as $id => $token ) {
			if ( $token->projections[ self::SITE_EDITOR ] !== true ) {
				continue; // Declared but not truthy — treat as opted out.
			}

			$wp_preset = Wp_Preset_Target::from_token( $token );
			if ( $wp_preset === null ) {
				continue; // site_editor without wp_preset: not theme.json-visible, nothing to sync.
			}

			$path = Preset_Bucket::path_for( $wp_preset->category );
			$key  = Preset_Bucket::value_key_for( $wp_preset->category );
			if ( $path === null || $key === null ) {
				continue; // Unmapped category (e.g. radius) — no native bucket, never in theme.json.
			}

			$targets[] = new Preset_Target( $path, $key, $wp_preset->slug, $wp_preset->category, $token );
		}

		return $targets;
	}
}
