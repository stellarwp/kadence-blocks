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
				// Block-specific radius defaults, mirroring semantic.radius.media for the image. Each aliases
				// radius.none (resolves to 0), so a fresh Row Layout / Column stays square — KB's own default —
				// while a site owner can round one block type by overriding its token.
				'id'    => 'semantic.radius.rowlayout',
				'type'  => 'dimension',
				'label' => __( 'Row Layout Radius', 'kadence-blocks' ),
				'group' => __( 'Layout', 'kadence-blocks' ),
			],
			[
				'id'    => 'semantic.radius.column',
				'type'  => 'dimension',
				'label' => __( 'Column Radius', 'kadence-blocks' ),
				'group' => __( 'Layout', 'kadence-blocks' ),
			],
			[
				// Block-specific background defaults for the block-default CSS projector. Each aliases the
				// transparent primitive (see baseline), so a fresh Row Layout / Column stays transparent — KB's
				// own default — while a site owner can brand one block type's background by overriding its token,
				// without touching the shared surface colors or the transparent primitive. Registered here only
				// so Css_Var emits each --kb-token--* variable the low-specificity rule points at.
				'id'    => 'semantic.color.rowlayout-bg',
				'type'  => 'color',
				'label' => __( 'Row Layout Background', 'kadence-blocks' ),
				'group' => __( 'Layout', 'kadence-blocks' ),
			],
			[
				'id'    => 'semantic.color.column-bg',
				'type'  => 'color',
				'label' => __( 'Column Background', 'kadence-blocks' ),
				'group' => __( 'Layout', 'kadence-blocks' ),
			],
			[
				'id'    => 'semantic.color.border',
				'type'  => 'color',
				'label' => __( 'Border', 'kadence-blocks' ),
				'group' => __( 'Brand', 'kadence-blocks' ),
			],
		],
		$spacing_tokens,
		$gap_tokens
	),
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
		[
			// Row Layout: low-specificity block-default rules on the block root (where KB renders both).
			// Background follows the block's own rowlayout-bg token, which aliases the transparent
			// primitive — so an uncustomized row stays transparent (KB's own default) unless a site owner brands
			// that token. Border color follows the brand border token (invisible until a border is added). A
			// value the user sets is a per-instance rule of equal specificity but later source order, so it still
			// wins. Padding follows the spacing tokens through the slug bridge, not a binding here.
			'block'    => 'kadence/rowlayout',
			'bindings' => [
				'background'   => [
					'token'    => 'semantic.color.rowlayout-bg',
					'css_prop' => 'background-color',
				],
				'border'       => [
					'token'    => 'semantic.color.border',
					'css_prop' => 'border-color',
				],
				'borderRadius' => [
					'token'    => 'semantic.radius.rowlayout',
					'css_prop' => 'border-radius',
				],
			],
		],
		[
			// Column (Section): same as Row Layout, but KB renders the background and border on the inner
			// `.kt-inside-inner-col` child, so the rules target that descendant. column-bg is the
			// column's own transparent-by-default override seam, distinct from the row's.
			'block'    => 'kadence/column',
			'bindings' => [
				'background'   => [
					'token'        => 'semantic.color.column-bg',
					'css_prop'     => 'background-color',
					'css_selector' => '> .kt-inside-inner-col',
				],
				'border'       => [
					'token'        => 'semantic.color.border',
					'css_prop'     => 'border-color',
					'css_selector' => '> .kt-inside-inner-col',
				],
				'borderRadius' => [
					'token'        => 'semantic.radius.column',
					'css_prop'     => 'border-radius',
					'css_selector' => '> .kt-inside-inner-col',
				],
			],
		],
	],
];
