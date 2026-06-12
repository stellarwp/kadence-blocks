/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	GROUP_ORDER,
	GROUP_SECTIONS,
	SECTION_OVERVIEW,
	groupSectionId,
} from '../constants/navigation';

/**
 * Filter tokens belonging to a schema group.
 *
 * @param {object[]} tokens    Flat token list.
 * @param {string}   groupName Display group name.
 * @return {object[]} Matching tokens.
 */
export function filterTokensByGroup( tokens, groupName ) {
	return tokens.filter( ( token ) => token.group === groupName );
}

/**
 * Count tokens per schema group.
 *
 * @param {object[]} tokens Flat token list.
 * @return {Record<string, number>} Counts keyed by group label.
 */
export function countTokensByGroup( tokens ) {
	return tokens.reduce( ( counts, token ) => {
		const group = token.group || __( 'Other', 'kadence-blocks' );
		counts[ group ] = ( counts[ group ] ?? 0 ) + 1;
		return counts;
	}, {} );
}

/**
 * Build sidebar sections from token schema groups.
 *
 * @param {object[]} tokens Flat token list from the feed schema.
 * @return {object[]} Navigation sections for the sidebar and overview cards.
 */
export function buildNavigationSections( tokens ) {
	const counts = countTokensByGroup( tokens );

	const foundations = Object.entries( counts ).map( ( [ groupName, count ] ) => {
		const id = groupSectionId( groupName );
		const meta = GROUP_SECTIONS[ id ] ?? {};

		return {
			id,
			kind: 'foundation',
			label: groupName,
			groupName,
			description: meta.description?.() ?? '',
			showColorPreview: Boolean( meta.showColorPreview ),
			count,
		};
	} );

	foundations.sort( ( a, b ) => {
		const aIndex = GROUP_ORDER.indexOf( a.id );
		const bIndex = GROUP_ORDER.indexOf( b.id );

		if ( aIndex === -1 && bIndex === -1 ) {
			return a.label.localeCompare( b.label );
		}

		if ( aIndex === -1 ) {
			return 1;
		}

		if ( bIndex === -1 ) {
			return -1;
		}

		return aIndex - bIndex;
	} );

	return [
		{
			id: SECTION_OVERVIEW,
			kind: 'overview',
			label: __( 'Overview', 'kadence-blocks' ),
		},
		...foundations,
	];
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
