/**
 * WordPress dependencies
 */
import { useMemo, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { SECTION_OVERVIEW } from '../constants/navigation';
import { buildNavigationSections } from '../helpers/navigation';

/**
 * Track the active Style Book section and derive sidebar items.
 *
 * @param {object[]}              tokens   Flat token list from the feed.
 * @param {Record<string, object>} variants Variants section from the feed.
 * @return {{ section: string, setSection: Function, sections: object[] }}
 */
export function useStyleBookNavigation( tokens, variants ) {
	const sections = useMemo(
		() => buildNavigationSections( tokens, variants ),
		[ tokens, variants ]
	);
	const [ section, setSection ] = useState( SECTION_OVERVIEW );

	return {
		section,
		setSection,
		sections,
	};
}
