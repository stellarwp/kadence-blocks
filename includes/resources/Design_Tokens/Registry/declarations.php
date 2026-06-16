<?php declare( strict_types=1 );
// cspell:ignore advancedbtn xxs xxl .
// The single declaration point. Adding an entry here automatically reaches every projector and the
// admin UI. Returned as data (rather than calling the global helper) so the Provider can register it
// directly against the container. The shipped baseline must contain an entry for every token registered
// here, or the guard fails closed.
//
// Loaded on `init` (see Registry\Provider) so the __() label/group calls don't trigger the
// _load_textdomain_just_in_time notice — translations must not load before init.

// The spacing/gap scale steps are primitives (the slug IS a scale step), each claiming the Kadence Blocks
// slug it backs (class-kadence-blocks-css.php): the Css_Var builder redefines --global-kb-spacing-<slug> /
// --global-kb-gap-<slug> as the primitive token, so a block already storing that slug follows it and a site
// owner can retune each step. Usage-specific intent (semantic.spacing.section/.block/.inline) aliases the
// scale and is where intent-based delivery points — mirroring how semantic.radius.media aliases the radius
// scale. Defaults match KB's own values, so registering them changes nothing until overridden. ss-auto is
// omitted: it resolves to "auto", not a length.
$spacing_slugs = [ 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', '3xl', '4xl', '5xl' ];
$gap_slugs     = [ 'none', 'xs', 'sm', 'md', 'lg' ];

$spacing_tokens = array_map(
	static function ( string $slug ): array {
		return [
			'id'          => 'primitive.dimension.spacing.' . $slug,
			'type'        => 'dimension',
			'label'       => strtoupper( $slug ),
			'group'       => __( 'Spacing', 'kadence-blocks' ),
			'projections' => [ 'kb_spacing_slot' => $slug ],
		];
	},
	$spacing_slugs
);

$gap_tokens = array_map(
	static function ( string $slug ): array {
		return [
			'id'          => 'primitive.dimension.gap.' . $slug,
			'type'        => 'dimension',
			'label'       => 'none' === $slug ? __( 'None', 'kadence-blocks' ) : strtoupper( $slug ),
			'group'       => __( 'Gap', 'kadence-blocks' ),
			'projections' => [ 'kb_gap_slot' => $slug ],
		];
	},
	$gap_slugs
);

return [
	'tokens'       => array_merge(
		[
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
			[
				// Registered so Css_Var emits its --kb-token--semantic--radius--media variable; the block-default
				// CSS projector points kadence/image's border-radius at that variable as a low-specificity default.
				'id'    => 'semantic.radius.media',
				'type'  => 'dimension',
				'label' => __( 'Media Radius', 'kadence-blocks' ),
				'group' => __( 'Brand', 'kadence-blocks' ),
			],
			[
				/**
				 * Control radius (buttons, inputs). Registered so Css_Var emits
				 * --kb-token--semantic--radius--control; the button's own default border-radius rule references
				 * that variable directly (the button is never empty, so the low-specificity block-default CSS
				 * mechanism can't reach it). Resolves to the radius scale's "md" step, the design system's
				 * control radius. A user's explicit radius still wins by specificity.
				 */
				'id'    => 'semantic.radius.control',
				'type'  => 'dimension',
				'label' => __( 'Control Radius', 'kadence-blocks' ),
				'group' => __( 'Brand', 'kadence-blocks' ),
			],
			[
				/**
				 * Default icon size. Registered so Css_Var emits --kb-token--semantic--icon-size--default; the
				 * button's --kb-button-icon-size default references it, so a button icon follows the token while
				 * an explicit per-button icon size still wins.
				 */
				'id'    => 'semantic.icon-size.default',
				'type'  => 'dimension',
				'label' => __( 'Icon Size', 'kadence-blocks' ),
				'group' => __( 'Brand', 'kadence-blocks' ),
			],
		],
		$spacing_tokens,
		$gap_tokens
	),
	/**
	 * Variant set for the Button block: that it accepts variants, plus the per-property bindings (a
	 * token reference where the property is already a registered token, an inline target otherwise).
	 * The variant NAMES, the default ($default) and the values all live in the baseline document under
	 * $extensions…variants.<block>; this declares only the structural wiring.
	 */
	'variant_sets' => [
		[
			/**
			 * The variant lives on the child Single Button (each button in a group is skinned individually),
			 * not the advancedbtn container. Variants are a pure COLOR axis: they retarget the Kadence theme's
			 * button-specific palette vars (the exact custom properties the button's render path already
			 * consumes), so a variant composes with the block's existing "Button Inherit Styles" shape (Fill /
			 * Outline / Theme Base) instead of fighting it — Fill reads --global-palette-btn-bg for its
			 * background, Outline reads it for border+text, so one color variant skins both shapes. Picking a
			 * variant re-skins a button with zero changes to its render path; a fresh button follows the
			 * $default. The inline kadence_slot overrides the referenced token's numbered slot for this binding
			 * only (Token_Registry::effective_projections merges inline over the token).
			 */
			'block'    => 'kadence/singlebtn',
			'bindings' => [
				'button-bg'     => [ 'token' => 'semantic.color.button-bg', 'kadence_slot' => 'palette-btn-bg' ],
				'button-text'   => [ 'token' => 'semantic.color.button-text', 'kadence_slot' => 'palette-btn' ],
				'button-radius' => [ 'css_var' => true ], // token-var only (no preset bucket).
			],
		],
		[
			'block'    => 'core/button',
			'bindings' => [
				'button-bg'   => [ 'token' => 'semantic.color.button-bg' ],   // reuse the token's wp_preset → --wp--preset--color--button-bg.
				'button-text' => [ 'token' => 'semantic.color.button-text' ],
			],
		],
		[
			// Image radius: the $default binds borderRadius to the media-radius token. The block-default-CSS
			// projector emits a low-specificity `.wp-block-kadence-image img { border-radius: var(...) }` rule,
			// so a fresh image follows the token while any radius the user sets (including 0) still wins.
			'block'    => 'kadence/image',
			'bindings' => [
				'borderRadius' => [
					'token'        => 'semantic.radius.media',
					'css_prop'     => 'border-radius',
					'css_selector' => 'img',
				],
			],
		],
	],
];
