/**
 * Internal block libraries
 */
 import { __ } from '@wordpress/i18n';
export const OPTIONS_MAP = [
	{
		value: 'sm',
		output: 'var(--global-kb-font-size-sm, 0.9rem)',
		size: 14,
		label:  __( 'SM', 'kadence-blocks' ),
		name:  __( 'Small', 'kadence-blocks' ),
	},
	{
		value: 'md',
		output: 'var(--global-kb-font-size-md, 1.2rem)',
		size: 32,
		label:  __( 'MD', 'kadence-blocks' ),
		name:  __( 'Medium', 'kadence-blocks' ),
	},
	{
		value: 'lg',
		output: 'var(--global-kb-font-size-lg, 3rem)',
		size: 48,
		label:  __( 'LG', 'kadence-blocks' ),
		name:  __( 'Large', 'kadence-blocks' ),
	},
	{
		value: 'xl',
		output: 'var(--global-kb-font-size-xl, 4rem)',
		size: 64,
		label:  __( 'XL', 'kadence-blocks' ),
		name:  __( 'X Large', 'kadence-blocks' ),
	},
	{
		value: 'xxl',
		output: 'var(--global-kb-font-size-xxl, 5rem)',
		size: 80,
		label:  __( 'XXL', 'kadence-blocks' ),
		name:  __( '2X Large', 'kadence-blocks' ),
	},
];