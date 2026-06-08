<?php declare( strict_types=1 );

use KadenceWP\KadenceBlocks\Design_Tokens\Foundation_Presets\Catalog;
use KadenceWP\KadenceBlocks\Design_Tokens\Foundation_Presets\Selector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;

if ( ! function_exists( 'kadence_blocks_register_design_token' ) ) {
	/**
	 * Declare a design token in the single Registry. Thin readability wrapper over
	 * Token_Registry::register() that mirrors KB's existing global helpers. The declaration accepts
	 * 'id' (DTCG dot-path), 'type' (DTCG $type), 'label', optional 'group', optional 'projections'
	 * and an optional 'css_var' override. See Token_Definition::from_array().
	 *
	 * Register before `init` priority 1: the baseline guard runs once there and does not re-validate
	 * tokens declared later, so a token registered on a later hook skips baseline validation entirely.
	 *
	 * @since TBD
	 *
	 * @param array{
	 *     id: string,
	 *     type: string,
	 *     label: string,
	 *     group?: string,
	 *     css_var?: string,
	 *     projections?: array<string, mixed>,
	 * } $definition The token declaration.
	 *
	 * @return void
	 */
	function kadence_blocks_register_design_token( array $definition ): void {
		/** @var Token_Registry $registry */
		$registry = kadence_blocks()->get( Token_Registry::class );
		$registry->register( $definition );
	}
}

if ( ! function_exists( 'kadence_blocks_register_design_variant_set' ) ) {
	/**
	 * Declare which block accepts variants (skeleton; data model in SOFT-3393).
	 *
	 * @since TBD
	 *
	 * @param array{
	 *     block: string,
	 *     variants?: string[],
	 * } $set See Variant_Set::from_array().
	 *
	 * @return void
	 */
	function kadence_blocks_register_design_variant_set( array $set ): void {
		/** @var Token_Registry $registry */
		$registry = kadence_blocks()->get( Token_Registry::class );
		$registry->register_variant_set( $set );
	}
}

if ( ! function_exists( 'kadence_blocks_design_foundation_presets' ) ) {
	/**
	 * The foundation-preset catalogue reader — the beginner on-ramp's "what can I pick?" surface. Thin
	 * accessor over the Catalog service that lists the shipped type scales and starter palettes (the
	 * admin UI and MCP surface read it to render the picker).
	 *
	 * @since TBD
	 *
	 * @return Catalog
	 */
	function kadence_blocks_design_foundation_presets(): Catalog {
		/** @var Catalog $presets */
		$presets = kadence_blocks()->get( Catalog::class );

		return $presets;
	}
}

if ( ! function_exists( 'kadence_blocks_apply_design_foundation_preset' ) ) {
	/**
	 * Apply a foundation-preset choice, seeding the primitive layer as store overrides. Thin readability
	 * wrapper over Selector::apply().
	 *
	 * @since TBD
	 *
	 * @param string $group  The preset group key, e.g. "typeScale" or "colorPalette".
	 * @param string $choice The preset slug within the group, e.g. "goldenRatio".
	 *
	 * @return void
	 */
	function kadence_blocks_apply_design_foundation_preset( string $group, string $choice ): void {
		/** @var Selector $selector */
		$selector = kadence_blocks()->get( Selector::class );
		$selector->apply( $group, $choice );
	}
}
