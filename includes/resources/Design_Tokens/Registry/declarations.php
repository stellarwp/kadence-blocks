<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .
// The single declaration point. Adding an entry here automatically reaches every projector and the
// admin UI. Returned as data (rather than calling the global helper) so the Provider can register it
// directly against the container. v1 ships a small representative set; the full catalog lands with
// SOFT-3377.
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
	// Variant-set skeleton: declares that the Button block accepts variants. The variant payload shape
	// and $default handling are SOFT-3393.
	'variant_sets' => [
		[
			'block'    => 'kadence/advancedbtn',
			'variants' => [ 'primary', 'secondary', 'ghost' ],
		],
	],
];
