/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Overview landing section id.
 */
export const SECTION_OVERVIEW = 'overview';

/**
 * Block variants section id.
 */
export const SECTION_VARIANTS = 'variants';

/**
 * Token type ids mapped to sidebar section metadata.
 */
export const TOKEN_TYPE_SECTIONS = [
	{
		id: 'color',
		type: 'color',
		label: () => __('Colors', 'kadence-blocks'),
		description: () => __('Brand and semantic color tokens with live swatch previews.', 'kadence-blocks'),
	},
	{
		id: 'dimension',
		type: 'dimension',
		label: () => __('Spacing & Size', 'kadence-blocks'),
		description: () => __('Spacing, sizing, and radius dimension tokens.', 'kadence-blocks'),
	},
	{
		id: 'typography',
		type: 'typography',
		label: () => __('Typography', 'kadence-blocks'),
		description: () => __('Composite typography styles (family, size, weight).', 'kadence-blocks'),
	},
	{
		id: 'fontFamily',
		type: 'fontFamily',
		label: () => __('Font Families', 'kadence-blocks'),
		description: () => __('Font stack primitives referenced by typography tokens.', 'kadence-blocks'),
	},
	{
		id: 'shadow',
		type: 'shadow',
		label: () => __('Shadows', 'kadence-blocks'),
		description: () => __('Elevation and shadow tokens.', 'kadence-blocks'),
	},
];
