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
import './AppSidebar.scss';

/**
 * Render the Style Library sidebar navigation.
 *
 * @param {Object}                              props                 The component props.
 * @param {Array<{id: string, label: string}>}   props.baseStylesNav   The BASE STYLES nav entries.
 * @param {Array<{id: string, label: string}>}   props.blockPresetsNav The BLOCK PRESETS nav entries.
 * @param {string}                              props.activeId        The active screen id from the route.
 * @param {Function}                            props.onNavigate      Called with a screen id when an item is clicked.
 *
 * @since TBD
 *
 * @return {JSX.Element} The sidebar.
 */
export function AppSidebar({ baseStylesNav, blockPresetsNav, activeId, onNavigate }) {
	return (
		<div className="kadence-blocks-style-library__nav">
			<NavSection
				label={__('Base Styles', 'kadence-blocks')}
				items={baseStylesNav}
				activeId={activeId}
				onNavigate={onNavigate}
			/>
			<NavSection
				label={__('Block Presets', 'kadence-blocks')}
				items={blockPresetsNav}
				activeId={activeId}
				onNavigate={onNavigate}
			/>
		</div>
	);
}
