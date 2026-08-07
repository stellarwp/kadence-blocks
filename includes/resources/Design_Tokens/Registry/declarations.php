<?php declare( strict_types=1 );
// cspell:ignore advancedbtn xxs xxl xxxl .
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
// omitted: it resolves to "auto", not a length. group_key mirrors the radius/border-width scales' mechanism:
// it is the stable machine id the Style Library's Spacing screen's "+ Add Spacing" mints custom tokens into,
// resolved back to the group label at read time by Token_Registry::group_label_for().
$spacing_slugs = [ 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', '3xl', '4xl', '5xl' ];
$gap_slugs     = [ 'none', 'xs', 'sm', 'md', 'lg' ];

$spacing_tokens = array_map(
	static function ( string $slug ): array {
		return [
			'id'          => 'primitive.dimension.spacing.' . $slug,
			'type'        => 'dimension',
			'label'       => strtoupper( $slug ),
			'group'       => __( 'Spacing', 'kadence-blocks' ),
			'group_key'   => 'spacing',
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

// The border-radius scale steps are primitives the Style Library's Border Radius screen lists and
// edits directly (semantic.radius.* already carries the projections that deliver these into blocks,
// so the scale declares none of its own). group_key is the stable machine id "+ Add Border Radius"
// mints custom tokens into — Token_Registry::group_label_for() resolves it back to the group label
// below at read time, so a custom radius token's group survives a site language change instead of
// drifting into its own bucket (see User_Primitive_Registrar::register_entry()).
// The step list mirrors the shipped baseline exactly: the screen renders whatever this group holds, and
// a step declared without a baseline entry would trip Baseline_Guard. Labels are the scale's own, so the
// Style Library and the editor's token picker name each step identically.
$radius_labels = [
	'none' => __( 'None', 'kadence-blocks' ),
	'xs'   => __( 'Extra Small', 'kadence-blocks' ),
	'sm'   => __( 'Small', 'kadence-blocks' ),
	'md'   => __( 'Medium', 'kadence-blocks' ),
	'lg'   => __( 'Large', 'kadence-blocks' ),
	'xl'   => __( 'Extra Large', 'kadence-blocks' ),
	'full' => __( 'Full', 'kadence-blocks' ),
];

$radius_tokens = [];

foreach ( $radius_labels as $slug => $label ) {
	$radius_tokens[] = [
		'id'        => 'primitive.dimension.radius.' . $slug,
		'type'      => 'dimension',
		'label'     => $label,
		'group'     => __( 'Border Radius', 'kadence-blocks' ),
		'group_key' => 'border-radius',
	];
}

// The border-width scale steps are primitives the Style Library's Border Width screen lists and
// edits directly (semantic.border-width.default already carries the projection that delivers the
// "sm" step into the image block, so the scale declares none of its own). group_key mirrors the
// radius scale's mechanism above: it is the stable machine id "+ Add Border Width" mints custom
// tokens into, resolved back to the group label at read time by Token_Registry::group_label_for().
$border_width_slugs = [ 'sm', 'md', 'lg' ];

$border_width_tokens = array_map(
	static function ( string $slug ): array {
		return [
			'id'        => 'primitive.dimension.border-width.' . $slug,
			'type'      => 'dimension',
			'label'     => strtoupper( $slug ),
			'group'     => __( 'Border Width', 'kadence-blocks' ),
			'group_key' => 'border-width',
		];
	},
	$border_width_slugs
);

// The icon-size scale steps are primitives the Style Library's Icon Sizes screen lists and edits
// directly (semantic.icon-size.default already carries the projection that delivers the "md" step
// into the icon block and the button's icon size, so the scale declares none of its own). group_key
// mirrors the radius/border-width scales' mechanism above: it is the stable machine id "+ Add Icon
// Size" mints custom tokens into, resolved back to the group label at read time by
// Token_Registry::group_label_for().
$icon_size_slugs = [ 'sm', 'md', 'lg' ];

$icon_size_tokens = array_map(
	static function ( string $slug ): array {
		return [
			'id'        => 'primitive.dimension.icon-size.' . $slug,
			'type'      => 'dimension',
			'label'     => strtoupper( $slug ),
			'group'     => __( 'Icon Sizes', 'kadence-blocks' ),
			'group_key' => 'icon-sizes',
		];
	},
	$icon_size_slugs
);

// The shadow scale steps are primitives the Style Library's Shadow screen lists and edits
// directly; the shadow semantics (semantic.shadow.card / .media) keep their own curated values and
// declare no projections onto this scale, so re-pointing a semantic at one of these primitives is
// deliberately not done here — semantic.shadow.card's color is aliased to a palette primitive, and
// re-pointing would detach it. group_key mirrors the radius/border-width/icon-size scales'
// mechanism above: it is the stable machine id "+ Add Shadow" mints custom tokens into, resolved
// back to the group label at read time by Token_Registry::group_label_for().
$shadow_slugs = [ 'xs', 'sm', 'md' ];

$shadow_tokens = array_map(
	static function ( string $slug ): array {
		return [
			'id'        => 'primitive.shadow.' . $slug,
			'type'      => 'shadow',
			'label'     => strtoupper( $slug ),
			'group'     => __( 'Shadow', 'kadence-blocks' ),
			'group_key' => 'shadow',
		];
	},
	$shadow_slugs
);

// The fluid font-size scale steps are primitives (the slug IS a scale step), each holding the shipped
// clamp() value from includes/init.php and claiming the Kadence Blocks font-size slug it backs
// (class-kadence-blocks-css.php): the Css_Var builder redefines --global-kb-font-size-<slug> as the
// primitive token, so a block already storing that slug follows it — mirroring spacing/gap. Defaults match
// KB's own values, so registering them changes nothing until overridden. The button's per-instance default
// font size is a separate token, semantic.font-size.control -- not a scale step.
$font_size_slugs = [ 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl' ];

$font_size_primitive_tokens = array_map(
	static function ( string $slug ): array {
		return [
			'id'          => 'primitive.dimension.font-size.' . $slug,
			'type'        => 'dimension',
			'label'       => strtoupper( $slug ),
			'group'       => __( 'Font Size', 'kadence-blocks' ),
			'group_key'   => 'font-size',
			'projections' => [ 'kb_font_size_slot' => $slug ],
		];
	},
	$font_size_slugs
);

// The three preview fonts are primitives the Style Library's Typography screen lists as FONT
// options; the font-family semantics (semantic.font-family.control / .heading) keep their own
// values and already carry whatever projections deliver a family into a block, so these primitives
// declare none of their own. No group_key: the user-primitive backend cannot mint a fontFamily
// token today (its DTCG $type is camelCase, which can never be a valid kebab id segment), so
// nothing can "+ Add Font" into this group until that backend gap is closed.
$font_family_slugs = [
	'sans'  => __( 'Sans', 'kadence-blocks' ),
	'serif' => __( 'Serif', 'kadence-blocks' ),
	'mono'  => __( 'Mono', 'kadence-blocks' ),
];

$font_family_tokens = array_map(
	static function ( string $slug, string $label ): array {
		return [
			'id'    => 'primitive.font-family.' . $slug,
			'type'  => 'fontFamily',
			'label' => $label,
			'group' => __( 'Font Family', 'kadence-blocks' ),
		];
	},
	array_keys( $font_family_slugs ),
	array_values( $font_family_slugs )
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
		],
	];
}

/**
 * Per-preset button color semantics (primary/secondary, resting + hover). The Button preset maps
 * reference these by value and they carry no projections of their own — the Kadence button reads them
 * through the preset's retarget bindings below, so overriding a primary semantic recolors that preset
 * without touching the global palette.
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
		'id'    => 'semantic.color.' . $suffix,
		'type'  => 'color',
		'label' => $label,
		'group' => __( 'Brand', 'kadence-blocks' ),
	];
}

/**
 * Notice / feedback color primitives (success/warning/error/info). Registered so Css_Var emits each
 * --kb-token--primitive--color--notice--* variable and the color palette's "Notices and Feedback" group
 * can name them. Like the semantic colors, they claim NO Kadence palette slot — they deliver at the block
 * level and never re-skin the global palette.
 */
$notice_color_labels = [
	'success' => __( 'Success', 'kadence-blocks' ),
	'warning' => __( 'Warning', 'kadence-blocks' ),
	'error'   => __( 'Error', 'kadence-blocks' ),
	'info'    => __( 'Info', 'kadence-blocks' ),
];

$notice_color_tokens = [];
foreach ( $notice_color_labels as $suffix => $label ) {
	$notice_color_tokens[] = [
		'id'    => 'primitive.color.notice.' . $suffix,
		'type'  => 'color',
		'label' => $label,
		'group' => __( 'Notices', 'kadence-blocks' ),
	];
}

/**
 * Brand + neutral color primitives a color palette exposes as swatches but that claim NO Kadence palette
 * slot: the accent brand color, the button resting/hover colors (the button reads these through its
 * semantics), and the two lighter neutral ramp steps (border / subtle surface). Like the semantic and
 * notice colors they deliver at the block level and never re-skin the --global-paletteN palette. Registered
 * so the palette write guard accepts an edit to them — the palette groups name these tokens, and a full-field
 * palette save submits every swatch it shows, so an unregistered one would reject the whole write.
 */
$palette_delivery_color_tokens = [
	[
		'id'    => 'primitive.color.brand.accent',
		'type'  => 'color',
		'label' => __( 'Brand Accent', 'kadence-blocks' ),
		'group' => __( 'Brand', 'kadence-blocks' ),
	],
	[
		'id'    => 'primitive.color.brand.button',
		'type'  => 'color',
		'label' => __( 'Brand Button', 'kadence-blocks' ),
		'group' => __( 'Brand', 'kadence-blocks' ),
	],
	[
		'id'    => 'primitive.color.brand.button-hover',
		'type'  => 'color',
		'label' => __( 'Brand Button (Hover)', 'kadence-blocks' ),
		'group' => __( 'Brand', 'kadence-blocks' ),
	],
	[
		'id'    => 'primitive.color.neutral.300',
		'type'  => 'color',
		'label' => __( 'Neutral 300', 'kadence-blocks' ),
		'group' => __( 'Palette', 'kadence-blocks' ),
	],
	[
		'id'    => 'primitive.color.neutral.200',
		'type'  => 'color',
		'label' => __( 'Neutral 200', 'kadence-blocks' ),
		'group' => __( 'Palette', 'kadence-blocks' ),
	],
];

return [
	'tokens'          => array_merge(
		[
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
				 * mechanism can't reach it). Resolves to the radius scale's "sm" step, which carries the
				 * button's long-standing 3px radius, so an existing site that never set a radius renders
				 * unchanged. A user's explicit radius still wins by specificity.
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
		$notice_color_tokens,
		$palette_delivery_color_tokens,
		$palette_tokens,
		$spacing_tokens,
		$gap_tokens,
		$font_size_primitive_tokens,
		$font_family_tokens,
		$radius_tokens,
		$border_width_tokens,
		$icon_size_tokens,
		$shadow_tokens
	),
	/**
	 * Preset bindings for the Button block: that it accepts presets, plus the per-property bindings (a
	 * token reference where the property is already a registered token, an inline target otherwise).
	 * The preset NAMES, the default ($default) and the values all live in the baseline document under
	 * $extensions…presets.<block>; this declares only the structural wiring.
	 */
	'preset_bindings' => [
		[
			/**
			 * The preset lives on the child Single Button (each button in a group is skinned individually),
			 * not the advancedbtn container. Presets are a pure COLOR axis: they retarget the Kadence theme's
			 * button-specific palette vars (the exact custom properties the button's render path already
			 * consumes), so a preset composes with the block's existing "Button Inherit Styles" shape (Fill /
			 * Outline / Theme Base) instead of fighting it — Fill reads --global-palette-btn-bg / -btn for its
			 * background + text, Outline reads --global-palette-btn-bg for border + text, and both read the
			 * matching -hover slots on :hover/:focus, so one color preset skins every shape and state. Each
			 * binding names only the slot it retargets; the per-preset VALUE comes from the preset's token
			 * map (which references the per-preset button-color semantics), so primary and secondary are
			 * symmetric and each is overridable on its own semantic. Picking a preset re-skins a button with
			 * zero changes to its render path; a fresh button follows the $default.
			 */
			'block'         => 'kadence/singlebtn',
			'label'         => __( 'Style', 'kadence-blocks' ), // a picker-driven set; this is the editor control's label.
			'style_library' => [
				// The Style Library BLOCK PRESETS nav label — distinct from "label" above, which names the
				// inspector's picker control, not the block.
				'label' => __( 'Button', 'kadence-blocks' ),
			],
			'bindings'      => [
				'button-bg'         => [
					'kadence_slot' => 'palette-btn-bg',
					'control_attr' => 'background',
				],
				'button-text'       => [
					'kadence_slot' => 'palette-btn',
					'control_attr' => 'color',
				],
				'button-bg-hover'   => [
					'kadence_slot' => 'palette-btn-bg-hover',
					'control_attr' => 'backgroundHover',
				],
				'button-text-hover' => [
					'kadence_slot' => 'palette-btn-hover',
					'control_attr' => 'colorHover',
				],
				'button-radius'     => [
					'css_var'          => 'kb-btn-radius', // drives --kb-btn-radius so a preset can vary the radius.
					'control_attr'     => 'borderRadius',
					// The block names its per-device radius attributes by a prefix convention, which is a naming
					// rule rather than something safely derivable, so the editor is told them rather than
					// guessing. Lets a captured preset carry a different radius per breakpoint.
					'responsive_attrs' => [
						'tablet' => 'tabletBorderRadius',
						'mobile' => 'mobileBorderRadius',
					],
				],
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
		[
			// Icon color: the $default binds color to the brand icon-color token. The block-default-CSS
			// projector emits a low-specificity `.wp-block-kadence-single-icon *.kb-svg-icon-wrap
			// { color: var(...) }` rule, so a fresh icon follows the token while any color the user sets
			// still wins (equal specificity, later source order). The binding lives on `single-icon` (the
			// 3.0 child block that actually owns `color`/`size`), not the legacy `kadence/icon` container,
			// which has no top-level color/size attribute of its own to bind.
			//
			// The leading `*` is load-bearing, not decorative: Css_Builder::selector_suffix() treats a
			// selector starting with `.` as an already-attached compound (the same element as the block root,
			// e.g. `.is-style-rounded`), not a descendant — a bare `.kb-svg-icon-wrap` would produce
			// `.wp-block-kadence-single-icon.kb-svg-icon-wrap`, which never matches because the wrap span is a
			// descendant of the block root, not the root itself (and isn't always a direct child either — it
			// sits inside an `<a>` when the icon is linked — so a `>` child combinator would also be wrong).
			// Prefixing with `*` keeps the selector's first character outside selector_suffix()'s
			// attach-verbatim set, so it gets the normal descendant-space treatment; the universal selector
			// contributes no specificity, so this is identical in effect to a hand-written
			// `.wp-block-kadence-single-icon .kb-svg-icon-wrap` descendant rule.
			//
			// `size` is deliberately NOT bound here: it is rendered two incompatible ways (an SVG prop in
			// the editor, a `font-size` CSS rule on the front end) and is never empty, so it cannot use this
			// low-specificity-CSS-default mechanism at all.
			'block'    => 'kadence/single-icon',
			'bindings' => [
				'color' => [
					'token'        => 'semantic.color.icon',
					'css_prop'     => 'color',
					'css_selector' => '*.kb-svg-icon-wrap',
				],
			],
		],
		[
			// Advanced Text (heading) core design properties + typography set: low-specificity
			// block-default-CSS rules on the block root (`.wp-block-kadence-advancedheading`), where every
			// bound attribute is empty by default in block.json — build_css() emits nothing for any of them
			// until a value is set, so the whole 12-property set fits this mechanism directly with no
			// per-block adapter and no build_css()/SCSS/editor-JS change. Typography (font-family,
			// letter-spacing, text-transform) uses the heading's own tokens, kept separate from the
			// form-control family the Button uses; font-size/line-height/font-weight are the heading's
			// own re-skin seeds. The rule also overrides a theme's per-tag element styles (h1/h2/p,
			// specificity 0,0,1), which is what lets the design-system defaults "re-skin" an unset
			// heading. A per-instance value renders at higher specificity (the `.kt-adv-heading<uid>`
			// instance selector) and still wins.
			//
			// In the editor, useBlockProps() puts `.wp-block-kadence-advancedheading` on a wrapper <div>, not
			// on the heading element the bindings above are meant to style — the real heading is a descendant
			// carrying the stable `kadence-advancedheading-text` class. So the editor build of this CSS (see
			// Css_Builder::editor_css()) targets that descendant instead, scoped under `.editor-styles-wrapper`
			// so it still outranks the theme's element styles there too. Per-instance color/font-size render as
			// INLINE styles on that same element (and font-weight inline on its child), so they keep winning
			// regardless of this rule's specificity.
			'block'           => 'kadence/advancedheading',
			'editor_selector' => '.wp-block-kadence-advancedheading .kadence-advancedheading-text',
			'bindings'        => [
				'color'         => [
					'token'    => 'semantic.color.text',
					'css_prop' => 'color',
				],
				'background'    => [
					'token'    => 'semantic.color.heading-bg',
					'css_prop' => 'background-color',
				],
				'typography'    => [
					'token'    => 'semantic.font-family.heading',
					'css_prop' => 'font-family',
				],
				'fontSize'      => [
					'token'    => 'semantic.font-size.heading',
					'css_prop' => 'font-size',
				],
				'fontHeight'    => [
					'token'    => 'semantic.line-height.heading',
					'css_prop' => 'line-height',
				],
				'fontWeight'    => [
					'token'    => 'semantic.font-weight.heading',
					'css_prop' => 'font-weight',
				],
				'letterSpacing' => [
					'token'    => 'semantic.letter-spacing.heading',
					'css_prop' => 'letter-spacing',
				],
				'textTransform' => [
					'token'    => 'semantic.text-transform.heading',
					'css_prop' => 'text-transform',
				],
				'padding'       => [
					'token'    => 'semantic.spacing.heading-padding',
					'css_prop' => 'padding',
				],
				'borderColor'   => [
					'token'    => 'semantic.color.border',
					'css_prop' => 'border-color',
				],
				'borderWidth'   => [
					'token'    => 'semantic.border-width.default',
					'css_prop' => 'border-width',
				],
				'borderRadius'  => [
					'token'    => 'semantic.radius.heading',
					'css_prop' => 'border-radius',
				],
				'borderStyle'   => [
					'token'    => 'semantic.border-style.default',
					'css_prop' => 'border-style',
				],
			],
		],
	],
];
