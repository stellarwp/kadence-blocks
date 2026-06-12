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

$group_brand           = __( 'Brand', 'kadence-blocks' );
$group_neutral         = __( 'Neutral', 'kadence-blocks' );
$group_semantic_colors = __( 'Semantic Colors', 'kadence-blocks' );
$group_spacing         = __( 'Spacing', 'kadence-blocks' );
$group_border_radius   = __( 'Border Radius', 'kadence-blocks' );
$group_border_width    = __( 'Border Width', 'kadence-blocks' );
$group_icon_size       = __( 'Icon Size', 'kadence-blocks' );
$group_font_sizes      = __( 'Font Sizes', 'kadence-blocks' );
$group_font_families   = __( 'Font Families', 'kadence-blocks' );

/** @var array<int, array<string, mixed>> $tokens */
$tokens = [];

$push = static function ( array $token ) use ( &$tokens ): void {
	$tokens[] = $token;
};

foreach (
	[
		'primary'   => __( 'Primary', 'kadence-blocks' ),
		'secondary' => __( 'Secondary', 'kadence-blocks' ),
		'accent'    => __( 'Accent', 'kadence-blocks' ),
	] as $key => $label
) {
	$push(
		[
			'id'          => "primitive.color.brand.{$key}",
			'type'        => 'color',
			'label'       => $label,
			'group'       => $group_brand,
			'projections' => [],
		]
	);
}

foreach (
	[
		'0'   => __( 'White', 'kadence-blocks' ),
		'50'  => __( '50', 'kadence-blocks' ),
		'100' => __( '100', 'kadence-blocks' ),
		'200' => __( '200', 'kadence-blocks' ),
		'300' => __( '300', 'kadence-blocks' ),
		'500' => __( '500', 'kadence-blocks' ),
		'700' => __( '700', 'kadence-blocks' ),
		'900' => __( '900', 'kadence-blocks' ),
	] as $key => $label
) {
	$push(
		[
			'id'          => "primitive.color.neutral.{$key}",
			'type'        => 'color',
			'label'       => $label,
			'group'       => $group_neutral,
			'projections' => [],
		]
	);
}

foreach (
	[
		'text'        => __( 'Text', 'kadence-blocks' ),
		'text-muted'  => __( 'Muted Text', 'kadence-blocks' ),
		'surface'     => __( 'Surface', 'kadence-blocks' ),
		'surface-alt' => __( 'Surface Alt', 'kadence-blocks' ),
		'border'      => __( 'Border', 'kadence-blocks' ),
		'link'        => __( 'Link', 'kadence-blocks' ),
		'icon'        => __( 'Icon', 'kadence-blocks' ),
	] as $key => $label
) {
	$push(
		[
			'id'          => "semantic.color.{$key}",
			'type'        => 'color',
			'label'       => $label,
			'group'       => $group_semantic_colors,
			'projections' => [],
		]
	);
}

$push(
	[
		'id'          => 'semantic.color.button-bg',
		'type'        => 'color',
		'label'       => __( 'Button Background', 'kadence-blocks' ),
		'group'       => $group_semantic_colors,
		'projections' => [
			'wp_preset'    => 'color',
			'kadence_slot' => 'palette1',
			'site_editor'  => true,
		],
	]
);

$push(
	[
		'id'          => 'semantic.color.button-text',
		'type'        => 'color',
		'label'       => __( 'Button Text', 'kadence-blocks' ),
		'group'       => $group_semantic_colors,
		'projections' => [
			'wp_preset'    => 'color',
			'kadence_slot' => 'palette2',
			'site_editor'  => true,
		],
	]
);

foreach (
	[
		'xs' => __( 'Extra Small', 'kadence-blocks' ),
		'sm' => __( 'Small', 'kadence-blocks' ),
		'md' => __( 'Medium', 'kadence-blocks' ),
		'lg' => __( 'Large', 'kadence-blocks' ),
		'xl' => __( 'Extra Large', 'kadence-blocks' ),
	] as $key => $label
) {
	$push(
		[
			'id'          => "primitive.dimension.space.{$key}",
			'type'        => 'dimension',
			'label'       => $label,
			'group'       => $group_spacing,
			'projections' => [],
		]
	);
}

foreach (
	[
		'inline'  => __( 'Inline', 'kadence-blocks' ),
		'block'   => __( 'Block', 'kadence-blocks' ),
		'section' => __( 'Section', 'kadence-blocks' ),
	] as $key => $label
) {
	$push(
		[
			'id'          => "semantic.spacing.{$key}",
			'type'        => 'dimension',
			'label'       => $label,
			'group'       => $group_spacing,
			'projections' => [],
		]
	);
}

foreach (
	[
		'none' => __( 'None', 'kadence-blocks' ),
		'sm'   => __( 'Small', 'kadence-blocks' ),
		'md'   => __( 'Medium', 'kadence-blocks' ),
		'lg'   => __( 'Large', 'kadence-blocks' ),
		'full' => __( 'Full', 'kadence-blocks' ),
	] as $key => $label
) {
	$push(
		[
			'id'          => "primitive.dimension.radius.{$key}",
			'type'        => 'dimension',
			'label'       => $label,
			'group'       => $group_border_radius,
			'projections' => [],
		]
	);
}

foreach (
	[
		'control' => __( 'Control', 'kadence-blocks' ),
		'media'   => __( 'Media', 'kadence-blocks' ),
	] as $key => $label
) {
	$push(
		[
			'id'          => "semantic.radius.{$key}",
			'type'        => 'dimension',
			'label'       => $label,
			'group'       => $group_border_radius,
			'projections' => [],
		]
	);
}

foreach (
	[
		'sm' => __( 'Small', 'kadence-blocks' ),
		'md' => __( 'Medium', 'kadence-blocks' ),
		'lg' => __( 'Large', 'kadence-blocks' ),
	] as $key => $label
) {
	$push(
		[
			'id'          => "primitive.dimension.borderWidth.{$key}",
			'type'        => 'dimension',
			'label'       => $label,
			'group'       => $group_border_width,
			'projections' => [],
		]
	);
}

$push(
	[
		'id'          => 'semantic.borderWidth.default',
		'type'        => 'dimension',
		'label'       => __( 'Default', 'kadence-blocks' ),
		'group'       => $group_border_width,
		'projections' => [],
	]
);

foreach (
	[
		'sm' => __( 'Small', 'kadence-blocks' ),
		'md' => __( 'Medium', 'kadence-blocks' ),
		'lg' => __( 'Large', 'kadence-blocks' ),
	] as $key => $label
) {
	$push(
		[
			'id'          => "primitive.dimension.iconSize.{$key}",
			'type'        => 'dimension',
			'label'       => $label,
			'group'       => $group_icon_size,
			'projections' => [],
		]
	);
}

$push(
	[
		'id'          => 'semantic.iconSize.default',
		'type'        => 'dimension',
		'label'       => __( 'Default', 'kadence-blocks' ),
		'group'       => $group_icon_size,
		'projections' => [],
	]
);

foreach (
	[
		'xs'  => __( 'Extra Small', 'kadence-blocks' ),
		'sm'  => __( 'Small', 'kadence-blocks' ),
		'md'  => __( 'Medium', 'kadence-blocks' ),
		'lg'  => __( 'Large', 'kadence-blocks' ),
		'xl'  => __( 'Extra Large', 'kadence-blocks' ),
		'2xl' => __( '2XL', 'kadence-blocks' ),
		'3xl' => __( '3XL', 'kadence-blocks' ),
	] as $key => $label
) {
	$push(
		[
			'id'          => "primitive.fontSize.{$key}",
			'type'        => 'dimension',
			'label'       => $label,
			'group'       => $group_font_sizes,
			'projections' => [],
		]
	);
}

foreach (
	[
		'sans'  => __( 'Sans Serif', 'kadence-blocks' ),
		'serif' => __( 'Serif', 'kadence-blocks' ),
		'mono'  => __( 'Monospace', 'kadence-blocks' ),
	] as $key => $label
) {
	$push(
		[
			'id'          => "primitive.fontFamily.{$key}",
			'type'        => 'fontFamily',
			'label'       => $label,
			'group'       => $group_font_families,
			'projections' => [],
		]
	);
}

return [
	'tokens'       => $tokens,
	'variant_sets' => [
		[
			'block'    => 'kadence/advancedbtn',
			'bindings' => [
				'button-bg'     => [ 'token' => 'semantic.color.button-bg' ],
				'button-text'   => [ 'token' => 'semantic.color.button-text' ],
				'button-border' => [ 'kadence_slot' => 'palette3' ],
				'button-radius' => [ 'css_var' => true ],
			],
		],
	],
];
