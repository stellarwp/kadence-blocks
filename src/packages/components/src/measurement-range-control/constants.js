/**
 * Internal block libraries
 */
 import { __ } from '@wordpress/i18n';
export const OPTIONS_MAP = [
	{
		value: '0',
		label: __( 'None', 'kadence-blocks' ),
		size: 0,
		name: __( 'None', 'kadence-blocks' ),
	},
	{
		value: 'xxs',
		output: 'var(--global-kb-spacing-xxs, 0.5rem)',
		size: 8,
		label: __( 'XXS', 'kadence-blocks' ),
		name: __( '2X Small', 'kadence-blocks' ),
	},
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
		value: '3xl',
		output: 'var(--global-kb-spacing-3xl, 6.5rem)',
		size: 104,
		label:  __( '3XL', 'kadence-blocks' ),
		name:  __( '3X Large', 'kadence-blocks' ),
	},
	{
		value: '4xl',
		output: 'var(--global-kb-spacing-4xl, 8rem)',
		size: 128,
		label:  __( '4XL', 'kadence-blocks' ),
		name:  __( '4X Large', 'kadence-blocks' ),
	},
	{
		value: '5xl',
		output: 'var(--global-kb-spacing-5xl, 10rem)',
		size: 160,
		label:  __( '5XL', 'kadence-blocks' ),
		name:  __( '5X Large', 'kadence-blocks' ),
	},
];