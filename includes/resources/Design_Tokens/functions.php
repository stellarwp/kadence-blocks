<?php declare( strict_types=1 );

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
	 * @param array<string, mixed> $definition The token declaration.
	 *
	 * @return void
	 */
	function kadence_blocks_register_design_token( array $definition ): void {
		kadence_blocks()->get( Token_Registry::class )->register( $definition );
	}
}

if ( ! function_exists( 'kadence_blocks_register_design_variant_set' ) ) {
	/**
	 * Declare which block accepts variants (skeleton; data model in SOFT-3393).
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $set See Variant_Set::from_array().
	 *
	 * @return void
	 */
	function kadence_blocks_register_design_variant_set( array $set ): void {
		kadence_blocks()->get( Token_Registry::class )->register_variant_set( $set );
	}
}
