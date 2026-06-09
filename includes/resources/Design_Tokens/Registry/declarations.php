<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .
// The single declaration point. Adding an entry here automatically reaches every projector and the
// admin UI. Returned as data (rather than calling the global helper) so the Provider can register it
// directly against the container. This ships a small representative set; the full catalog is registered
// incrementally by the per-block wiring work and the variant-set work, each of which owns its tokens'
// projection targets. The shipped baseline must contain an entry for every token registered here, or
// the guard fails closed.
//
// Loaded on `init` (see Registry\Provider) so the __() label/group calls don't trigger the
// _load_textdomain_just_in_time notice — translations must not load before init.

return [
	'tokens'       => [
		[
			'id'          => 'semantic.color.button-bg',
			'type'        => 'color',
			'label'       => __( 'Button Background', 'kadence-blocks' ),
			'group'       => __( 'Brand', 'kadence-blocks' ),
			'projections' => [
				'wp_preset'    => 'color',     // → theme.json preset + --wp--preset--color--button-bg.
				'kadence_slot' => 'palette1',  // → --global-palette1 + kadence_blocks_colors slug.
				'site_editor'  => true,
			],
		],
		[
			'id'          => 'semantic.color.button-text',
			'type'        => 'color',
			'label'       => __( 'Button Text', 'kadence-blocks' ),
			'group'       => __( 'Brand', 'kadence-blocks' ),
			'projections' => [
				'wp_preset'    => 'color',
				'kadence_slot' => 'palette2',
				'site_editor'  => true,
			],
		],
	],
	// Variant set for the Button block: that it accepts variants, plus the per-property bindings (a
	// token reference where the property is already a registered token, an inline target otherwise).
	// The variant NAMES, the default ($default) and the values all live in the baseline document under
	// $extensions…variants.<block>; this declares only the structural wiring. Inline slot values here
	// (e.g. palette3) are placeholders until the per-block wiring tickets vet them against the block.
	'variant_sets' => [
		[
			'block'    => 'kadence/advancedbtn',
			'bindings' => [
				'button-bg'     => [ 'token' => 'semantic.color.button-bg' ],   // reuse the token's projections.
				'button-text'   => [ 'token' => 'semantic.color.button-text' ],
				'button-border' => [ 'kadence_slot' => 'palette3' ],            // not a token yet → inline target.
				'button-radius' => [ 'css_var' => true ],                       // token-var only (no preset bucket).
			],
		],
		[
			'block'    => 'core/button',
			'bindings' => [
				'button-bg'   => [ 'token' => 'semantic.color.button-bg' ],   // reuse the token's wp_preset → --wp--preset--color--button-bg.
				'button-text' => [ 'token' => 'semantic.color.button-text' ],
			],
		],
	],
];
