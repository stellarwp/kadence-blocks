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

/**
 * The brand + neutral primitives ARE the site's global color palette: each claims a Kadence palette slot
 * (palette1..9), so --global-paletteN follows the primitive and the legacy kadence_blocks_colors palette
 * stays in sync. Values mirror Kadence's default palette (brand at 1-2, a dark→light neutral ramp at 3-9,
 * white at 9), so activation changes nothing until a primitive is overridden. Semantic colors deliberately
 * do NOT claim a slot — they deliver at the block level — so writing a semantic never re-skins the palette.
 */
$palette_slots = [
	'primitive.color.brand.primary'   => [ 'palette1', __( 'Brand Primary', 'kadence-blocks' ) ],
	'primitive.color.brand.secondary' => [ 'palette2', __( 'Brand Secondary', 'kadence-blocks' ) ],
	'primitive.color.neutral.900'     => [ 'palette3', __( 'Neutral 900', 'kadence-blocks' ) ],
	'primitive.color.neutral.700'     => [ 'palette4', __( 'Neutral 700', 'kadence-blocks' ) ],
	'primitive.color.neutral.600'     => [ 'palette5', __( 'Neutral 600', 'kadence-blocks' ) ],
	'primitive.color.neutral.500'     => [ 'palette6', __( 'Neutral 500', 'kadence-blocks' ) ],
	'primitive.color.neutral.100'     => [ 'palette7', __( 'Neutral 100', 'kadence-blocks' ) ],
	'primitive.color.neutral.50'      => [ 'palette8', __( 'Neutral 50', 'kadence-blocks' ) ],
	'primitive.color.neutral.0'       => [ 'palette9', __( 'Neutral 0', 'kadence-blocks' ) ],
];

$palette_tokens = [];
foreach ( $palette_slots as $token_id => $slot_label ) {
	$palette_tokens[] = [
		'id'          => $token_id,
		'type'        => 'color',
		'label'       => $slot_label[1],
		'group'       => __( 'Palette', 'kadence-blocks' ),
		'projections' => [
			'kadence_slot' => $slot_label[0],
			'site_editor'  => true,
		],
	];
}

/**
 * Per-variant button color semantics (primary/secondary, resting + hover). The Button variant maps
 * reference these, and each is site_editor-surfaced so a site owner recolors one variant through the
 * standard token path without touching the global palette. They carry no kadence_slot or wp_preset of
 * their own: the Kadence button reads them via the variant's retarget bindings below, and the shared
 * semantic.color.button-bg / button-text bucket (which keeps the wp_preset for core/button and aliases
 * the primary pair) means overriding a primary semantic cascades to the native button too.
 */
$button_color_labels = [
	'button-primary-bg'           => __( 'Button Primary Background', 'kadence-blocks' ),
	'button-primary-text'         => __( 'Button Primary Text', 'kadence-blocks' ),
	'button-primary-bg-hover'     => __( 'Button Primary Background (Hover)', 'kadence-blocks' ),
	'button-primary-text-hover'   => __( 'Button Primary Text (Hover)', 'kadence-blocks' ),
	'button-secondary-bg'         => __( 'Button Secondary Background', 'kadence-blocks' ),
	'button-secondary-text'       => __( 'Button Secondary Text', 'kadence-blocks' ),
	'button-secondary-bg-hover'   => __( 'Button Secondary Background (Hover)', 'kadence-blocks' ),
	'button-secondary-text-hover' => __( 'Button Secondary Text (Hover)', 'kadence-blocks' ),
];

$button_color_tokens = [];
foreach ( $button_color_labels as $suffix => $label ) {
	$button_color_tokens[] = [
		'id'          => 'semantic.color.' . $suffix,
		'type'        => 'color',
		'label'       => $label,
		'group'       => __( 'Brand', 'kadence-blocks' ),
		'projections' => [ 'site_editor' => true ],
	];
}

return [
	'tokens'       => array_merge(
		[
			[
				/**
				 * Semantic colors are a block-level intent, not a global-palette slot: they project to a
				 * theme.json color preset (--wp--preset--color--button-bg, consumed by the button render path
				 * and the variant system) but deliberately claim NO kadence_slot, so writing button-bg never
				 * re-skins --global-paletteN. Mapping the brand primitives onto the global palette is separate.
				 */
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => __( 'Button Background', 'kadence-blocks' ),
				'group'       => __( 'Brand', 'kadence-blocks' ),
				'projections' => [
					'wp_preset'   => 'color', // → theme.json preset + --wp--preset--color--button-bg.
					'site_editor' => true,
				],
			],
			[
				'id'          => 'semantic.color.button-text',
				'type'        => 'color',
				'label'       => __( 'Button Text', 'kadence-blocks' ),
				'group'       => __( 'Brand', 'kadence-blocks' ),
				'projections' => [
					'wp_preset'   => 'color',
					'site_editor' => true,
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
			[
				// Image background default for the block-default CSS projector, mirroring rowlayout-bg/column-bg.
				// Aliases the transparent primitive, so a fresh image stays transparent (KB's own default) until a
				// site owner brands it. Registered so Css_Var emits --kb-token--semantic--color--image-bg.
				'id'    => 'semantic.color.image-bg',
				'type'  => 'color',
				'label' => __( 'Image Background', 'kadence-blocks' ),
				'group' => __( 'Media', 'kadence-blocks' ),
			],
			[
				// Border width, shared with the brand border color. Registered so Css_Var emits
				// --kb-token--semantic--border-width--default; the block-default CSS projector points the image's
				// border-width at it. Resolves to 1px but stays invisible until a border style is set, so a fresh
				// image is unchanged while a site owner can retune image border thickness by overriding the token.
				'id'    => 'semantic.border-width.default',
				'type'  => 'dimension',
				'label' => __( 'Border Width', 'kadence-blocks' ),
				'group' => __( 'Brand', 'kadence-blocks' ),
			],
			[
				// Image shadow default. Registered so Css_Var emits --kb-token--semantic--shadow--media; the
				// block-default CSS projector points kadence/image's box-shadow at it. Resolves to an invisible
				// (transparent, zero) shadow, matching KB's default (box shadow is off by default), while a site
				// owner can give every image a shadow by overriding the token.
				'id'    => 'semantic.shadow.media',
				'type'  => 'shadow',
				'label' => __( 'Media Shadow', 'kadence-blocks' ),
				'group' => __( 'Brand', 'kadence-blocks' ),
			],
			[
				// Image padding default. Registered so Css_Var emits --kb-token--semantic--spacing--media-padding;
				// the block-default CSS projector points the image wrapper's padding at it. Resolves to 0 (KB's
				// default) so a fresh image is unchanged; a site owner can add image padding by overriding it.
				'id'    => 'semantic.spacing.media-padding',
				'type'  => 'dimension',
				'label' => __( 'Media Padding', 'kadence-blocks' ),
				'group' => __( 'Media', 'kadence-blocks' ),
			],
		],
		$button_color_tokens,
		$palette_tokens,
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
			 * Outline / Theme Base) instead of fighting it — Fill reads --global-palette-btn-bg / -btn for its
			 * background + text, Outline reads --global-palette-btn-bg for border + text, and both read the
			 * matching -hover slots on :hover/:focus, so one color variant skins every shape and state. Each
			 * binding names only the slot it retargets; the per-variant VALUE comes from the variant's token
			 * map (which references the per-variant button-color semantics), so primary and secondary are
			 * symmetric and each is overridable on its own semantic. Picking a variant re-skins a button with
			 * zero changes to its render path; a fresh button follows the $default.
			 */
			'block'    => 'kadence/singlebtn',
			'group'    => 'style', // a named, picker-driven set (the button's Style axis), keyed variants.<block>.style.
			'label'    => __( 'Style', 'kadence-blocks' ), // the editor picker's control label for the variant axis.
			'bindings' => [
				'button-bg'         => [ 'kadence_slot' => 'palette-btn-bg' ],
				'button-text'       => [ 'kadence_slot' => 'palette-btn' ],
				'button-bg-hover'   => [ 'kadence_slot' => 'palette-btn-bg-hover' ],
				'button-text-hover' => [ 'kadence_slot' => 'palette-btn-hover' ],
				'button-radius'     => [ 'css_var' => 'kb-btn-radius' ], // drives --kb-btn-radius so a variant can vary the radius.
			],
		],
		[
			/**
			 * The core/button block is a pure COLOR axis, like the Kadence button, and reuses the SAME mechanism:
			 * the variant retargets the Kadence theme's button slots (--global-palette-btn-*), and a small
			 * stylesheet (Native\Styles\Button) makes the native button link consume those vars for Fill /
			 * Outline / hover — the core/button analogue of the Kadence button's SCSS. The color variant
			 * is an additive kb-variant-- class (NOT a register_block_style() block style), so it composes with
			 * WordPress's own single-select "Outline" block style; because the consuming CSS is scoped to that
			 * class, an unstyled core/button keeps its native theme look until a variant is selected. These
			 * bindings match the Kadence button's so one retarget path serves both; the per-variant VALUES live
			 * in the baseline document.
			 */
			'block'    => 'core/button',
			'group'    => 'style', // a named, picker-driven set (the button's Style axis), keyed variants.<block>.style.
			'label'    => __( 'Style', 'kadence-blocks' ), // the editor picker's control label for the variant axis.
			'bindings' => [
				'button-bg'         => [ 'kadence_slot' => 'palette-btn-bg' ],
				'button-text'       => [ 'kadence_slot' => 'palette-btn' ],
				'button-bg-hover'   => [ 'kadence_slot' => 'palette-btn-bg-hover' ],
				'button-text-hover' => [ 'kadence_slot' => 'palette-btn-hover' ],
			],
		],
		[
			// Image color/border/shadow/radius: low-specificity block-default-CSS rules on the rendered
			// `<img>`, where KB paints background, border, box-shadow, and border-radius. The projector groups
			// these into one `.wp-block-kadence-image img { ... }` rule (padding gets its own descendant rule
			// below). Each token is seeded to KB's existing default (transparent background, invisible border
			// until a style is set, no shadow, square corners), so a fresh image is unchanged; any value the
			// user sets renders at higher specificity (the `.kb-image<uid>` instance selector) and still wins.
			'block'    => 'kadence/image',
			'bindings' => [
				'background'   => [
					'token'        => 'semantic.color.image-bg',
					'css_prop'     => 'background-color',
					'css_selector' => 'img',
				],
				'border'       => [
					'token'        => 'semantic.color.border',
					'css_prop'     => 'border-color',
					'css_selector' => 'img',
				],
				'borderWidth'  => [
					'token'        => 'semantic.border-width.default',
					'css_prop'     => 'border-width',
					'css_selector' => 'img',
				],
				'borderRadius' => [
					'token'        => 'semantic.radius.media',
					'css_prop'     => 'border-radius',
					'css_selector' => 'img',
				],
				'shadow'       => [
					'token'        => 'semantic.shadow.media',
					'css_prop'     => 'box-shadow',
					'css_selector' => 'img',
				],
				// Padding is rendered on the `.kb-img` wrapper, a descendant of the block root. The leading `*`
				// forces Css_Builder::selector_suffix() to treat `.kb-img` as a descendant (a bare `.kb-img`
				// would compound onto the root and never match) — see the icon color binding for the rationale.
				'padding'      => [
					'token'        => 'semantic.spacing.media-padding',
					'css_prop'     => 'padding',
					'css_selector' => '*.kb-img',
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
