/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	SECTION_OVERVIEW,
	SECTION_VARIANTS,
	TOKEN_TYPE_SECTIONS,
} from '../constants/navigation';

/**
 * Filter tokens to a specific DTCG type.
 *
 * @param {object[]} tokens Flat token list.
 * @param {string}   type   Token type id.
 * @return {object[]} Matching tokens.
 */
export function filterTokensByType( tokens, type ) {
	return tokens.filter( ( token ) => token.type === type );
}

/**
 * Count tokens grouped by type.
 *
 * @param {object[]} tokens Flat token list.
 * @return {Record<string, number>} Counts keyed by type.
 */
export function countTokensByType( tokens ) {
	return tokens.reduce( ( counts, token ) => {
		counts[ token.type ] = ( counts[ token.type ] ?? 0 ) + 1;
		return counts;
	}, {} );
}

/**
 * Build sidebar sections from the available token catalog and variants feed.
 *
 * @param {object[]}              tokens   Flat token list from the feed schema.
 * @param {Record<string, object>} variants Variants section from the feed.
 * @return {object[]} Navigation sections for the sidebar and overview cards.
 */
export function buildNavigationSections( tokens, variants = {} ) {
	const counts = countTokensByType( tokens );
	const foundations = TOKEN_TYPE_SECTIONS.filter( ( section ) => counts[ section.type ] > 0 ).map(
		( section ) => ( {
			id: section.id,
			kind: 'foundation',
			label: section.label(),
			description: section.description(),
			type: section.type,
			count: counts[ section.type ],
		} )
	);

	const sections = [
		{
			id: SECTION_OVERVIEW,
			kind: 'overview',
			label: __( 'Overview', 'kadence-blocks' ),
		},
		...foundations,
	];

	if ( Object.keys( variants ).length > 0 ) {
		sections.push( {
			id: SECTION_VARIANTS,
			kind: 'variants',
			label: __( 'Block Presets', 'kadence-blocks' ),
			description: __(
				'Per-block variant sets such as button styles.',
				'kadence-blocks'
			),
			count: Object.keys( variants ).length,
		} );
	}

	return sections;
}

/**
 * Resolve a section definition by id.
 *
 * @param {object[]} sections Built navigation sections.
 * @param {string}   sectionId Active section id.
 * @return {object|undefined} Section metadata.
 */
export function findSection( sections, sectionId ) {
	return sections.find( ( section ) => section.id === sectionId );
}
