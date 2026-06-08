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
	 * Declare that a block accepts variants, plus its per-property bindings. Variant names, default and
	 * values are document data, not declared here.
	 *
	 * @since TBD
	 *
	 * @param array{block: string, bindings?: array<string, array<string, mixed>>} $set See Variant_Set::from_array().
	 *
	 * @return void
	 */
	function kadence_blocks_register_design_variant_set( array $set ): void {
		/** @var Token_Registry $registry */
		$registry = kadence_blocks()->get( Token_Registry::class );
		$registry->register_variant_set( $set );
	}
}
