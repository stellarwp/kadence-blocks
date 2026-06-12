/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Overview landing section id.
 */
export const SECTION_OVERVIEW = 'overview';

/**
 * Preferred sidebar order for foundation groups.
 */
export const GROUP_ORDER = [
	'brand',
	'neutral',
	'semantic-colors',
	'spacing',
	'border-radius',
	'border-width',
	'icon-size',
	'font-sizes',
	'font-families',
];

/**
 * Map a UI group label to a stable section slug.
 *
 * @param {string} groupName Display group from the token schema.
 * @return {string} Section slug.
 */
export function groupSectionId( groupName ) {
	switch ( groupName ) {
		case __( 'Brand', 'kadence-blocks' ):
			return 'brand';
		case __( 'Neutral', 'kadence-blocks' ):
			return 'neutral';
		case __( 'Semantic Colors', 'kadence-blocks' ):
			return 'semantic-colors';
		case __( 'Spacing', 'kadence-blocks' ):
			return 'spacing';
		case __( 'Border Radius', 'kadence-blocks' ):
			return 'border-radius';
		case __( 'Border Width', 'kadence-blocks' ):
			return 'border-width';
		case __( 'Icon Size', 'kadence-blocks' ):
			return 'icon-size';
		case __( 'Font Sizes', 'kadence-blocks' ):
			return 'font-sizes';
		case __( 'Font Families', 'kadence-blocks' ):
			return 'font-families';
		default:
			return groupName.toLowerCase().replace( /[^a-z0-9]+/g, '-' );
	}
}

/**
 * Section metadata for known foundation groups.
 */
export const GROUP_SECTIONS = {
	brand: {
		description: () => __( 'Core brand palette primitives.', 'kadence-blocks' ),
		showColorPreview: true,
	},
	neutral: {
		description: () => __( 'Neutral palette steps for surfaces and text.', 'kadence-blocks' ),
		showColorPreview: true,
	},
	'semantic-colors': {
		description: () => __( 'Role-based colors for text, surfaces, links, and controls.', 'kadence-blocks' ),
		showColorPreview: true,
	},
	spacing: {
		description: () => __( 'Spacing scale and semantic layout spacing roles.', 'kadence-blocks' ),
	},
	'border-radius': {
		description: () => __( 'Corner radius primitives and semantic control/media radii.', 'kadence-blocks' ),
	},
	'border-width': {
		description: () => __( 'Border width scale and the default semantic width.', 'kadence-blocks' ),
	},
	'icon-size': {
		description: () => __( 'Icon sizing scale and the default semantic size.', 'kadence-blocks' ),
	},
	'font-sizes': {
		description: () => __( 'Typographic size scale used across the system.', 'kadence-blocks' ),
	},
	'font-families': {
		description: () => __( 'Font stack primitives for sans, serif, and monospace.', 'kadence-blocks' ),
	},
};
