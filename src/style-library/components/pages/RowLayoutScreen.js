/**
 * The Row Layout preset screen: `PresetScreen` does the work and `presets/rowlayout-preset.js`
 * describes the block, so this file only binds the two together and registers the screen. Its
 * settings panel is `RowLayoutSettings`, assigned below as `RowLayoutScreen.SettingsPanel`.
 */

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { PresetScreen } from './PresetScreen';
import { RowLayoutSettings } from './RowLayoutSettings';
import { ROWLAYOUT_PRESET, ROWLAYOUT_BLOCK } from '../../presets/rowlayout-preset';
import { PRESET_SCREENS_FILTER } from '../../constants/screens';
import './RowLayoutScreen.scss';

/**
 * Render the Row Layout preset screen.
 *
 * @param {Object} props The screen props (`label`, `route`, `navigate`, `library`).
 *
 * @since TBD
 *
 * @return {JSX.Element} The screen body.
 */
export function RowLayoutScreen(props) {
	return <PresetScreen {...props} preset={ROWLAYOUT_PRESET} />;
}

RowLayoutScreen.SettingsPanel = RowLayoutSettings;

/**
 * Register the Row Layout screen for `kadence/rowlayout` on the public preset-screens filter,
 * exactly as a third party would — the app never imports this component directly, so this
 * module-scope call is the only registration path.
 *
 * @since TBD
 */
addFilter(PRESET_SCREENS_FILTER, 'kadence-blocks/style-library-rowlayout-screen', (screens) => ({
	...screens,
	[ROWLAYOUT_BLOCK]: RowLayoutScreen,
}));
