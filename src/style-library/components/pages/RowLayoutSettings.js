/**
 * The Row Layout preset's settings sidebar: `PresetSidebar` does the work, this binds the block's
 * config to it.
 */

/**
 * Internal dependencies
 */
import { PresetSidebar } from './PresetSidebar';
import { usePresetScreen } from '../../hooks/use-preset-screen';
import { ROWLAYOUT_PRESET } from '../../presets/rowlayout-preset';

/**
 * Render the Row Layout preset's settings sidebar.
 *
 * @param {Object}   props          The component props.
 * @param {Object}   props.route    The current route (`{ screen, item }`).
 * @param {Function} props.navigate The route navigator.
 * @param {Object}   props.library  The design-tokens feed hook's return value.
 *
 * @since TBD
 *
 * @return {?JSX.Element} The sidebar, or null while there is no open preset to edit.
 */
export function RowLayoutSettings({ route, navigate, library }) {
	const screen = usePresetScreen(library, ROWLAYOUT_PRESET);

	return <PresetSidebar route={route} navigate={navigate} screen={screen} preset={ROWLAYOUT_PRESET} />;
}
