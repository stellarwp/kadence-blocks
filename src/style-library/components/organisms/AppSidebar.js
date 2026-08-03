/**
 * The Style Library left navigation: BASE STYLES and BLOCK PRESETS sections.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { NavSection } from '../atoms/NavSection';
import { buildBaseStylesNav, buildBlockPresetsNav } from '../../helpers/screens';
import './AppSidebar.scss';

/**
 * Render the Style Library sidebar navigation.
 *
 * @param {Object}   props            The component props.
 * @param {Object}   props.feed       The design-tokens admin feed.
 * @param {string}   props.activeId   The active screen id from the route.
 * @param {Function} props.onNavigate Called with a screen id when an item is clicked.
 *
 * @since TBD
 *
 * @return {JSX.Element} The sidebar.
 */
export function AppSidebar({ feed, activeId, onNavigate }) {
	return (
		<div className="kadence-blocks-style-library__nav">
			<NavSection
				label={__('Base Styles', 'kadence-blocks')}
				items={buildBaseStylesNav()}
				activeId={activeId}
				onNavigate={onNavigate}
			/>
			<NavSection
				label={__('Block Presets', 'kadence-blocks')}
				items={buildBlockPresetsNav(feed)}
				activeId={activeId}
				onNavigate={onNavigate}
			/>
		</div>
	);
}
