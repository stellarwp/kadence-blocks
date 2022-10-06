/**
 * Internal block libraries
 */
 import { __ } from '@wordpress/i18n';
 
export const BLEND_OPTIONS = [
	{ value: 'normal', label: __( 'Normal', 'kadence-blocks' ) },
	{ value: 'multiply', label: __( 'Multiply', 'kadence-blocks' ) },
	{ value: 'screen', label: __( 'Screen', 'kadence-blocks' ) },
	{ value: 'overlay', label: __( 'Overlay', 'kadence-blocks' ) },
	{ value: 'darken', label: __( 'Darken', 'kadence-blocks' ) },
	{ value: 'lighten', label: __( 'Lighten', 'kadence-blocks' ) },
	{ value: 'color-dodge', label: __( 'Color Dodge', 'kadence-blocks' ) },
	{ value: 'color-burn', label: __( 'Color Burn', 'kadence-blocks' ) },
	{ value: 'difference', label: __( 'Difference', 'kadence-blocks' ) },
	{ value: 'exclusion', label: __( 'Exclusion', 'kadence-blocks' ) },
	{ value: 'hue', label: __( 'Hue', 'kadence-blocks' ) },
	{ value: 'saturation', label: __( 'Saturation', 'kadence-blocks' ) },
	{ value: 'color', label: __( 'Color', 'kadence-blocks' ) },
	{ value: 'luminosity', label: __( 'Luminosity', 'kadence-blocks' ) },
];
export const SPACING_SIZES_MAP = [
	{
		value: '0',
		label: __( 'None', 'kadence-blocks' ),
		size: 0,
		name: __( 'None', 'kadence-blocks' ),
	},
	// {
	// 	value: 'xxs',
	// 	output: 'var(--global-kb-spacing-xxs, 0.5rem)',
	// 	size: 8,
	// 	label: __( 'XXS', 'kadence-blocks' ),
	// 	name: __( '2X Small', 'kadence-blocks' ),
	// },
	{
		value: 'xs',
		output: 'var(--global-kb-spacing-xs, 1rem)',
		size: 16,
		label: __( 'XS', 'kadence-blocks' ),
		name: __( 'X Small', 'kadence-blocks' ),
	},
	{
		value: 'sm',
		output: 'var(--global-kb-spacing-sm, 1.5rem)',
		size: 24,
		label:  __( 'SM', 'kadence-blocks' ),
		name:  __( 'Small', 'kadence-blocks' ),
	},
	{
		value: 'md',
		output: 'var(--global-kb-spacing-md, 2rem)',
		size: 32,
		label:  __( 'MD', 'kadence-blocks' ),
		name:  __( 'Medium', 'kadence-blocks' ),
	},
	{
		value: 'lg',
		output: 'var(--global-kb-spacing-lg, 3rem)',
		size: 48,
		label:  __( 'LG', 'kadence-blocks' ),
		name:  __( 'Large', 'kadence-blocks' ),
	},
	{
		value: 'xl',
		output: 'var(--global-kb-spacing-xl, 4rem)',
		size: 64,
		label:  __( 'XL', 'kadence-blocks' ),
		name:  __( 'X Large', 'kadence-blocks' ),
	},
	{
		value: 'xxl',
		output: 'var(--global-kb-spacing-xxl, 5rem)',
		size: 80,
		label:  __( 'XXL', 'kadence-blocks' ),
		name:  __( '2X Large', 'kadence-blocks' ),
	},
	{
		value: 'xxxl',
		output: 'var(--global-kb-spacing-xxxl, 6.5rem)',
		size: 104,
		label:  __( '3XL', 'kadence-blocks' ),
		name:  __( '3X Large', 'kadence-blocks' ),
	},
	{
		value: 'xxxxl',
		output: 'var(--global-kb-spacing-xxxxl, 8rem)',
		size: 128,
		label:  __( '4XL', 'kadence-blocks' ),
		name:  __( '4X Large', 'kadence-blocks' ),
	},
];

export const PADDING_RESIZE_MAP = [0, 16, 24, 32, 48, 64, 80, 104, 128];