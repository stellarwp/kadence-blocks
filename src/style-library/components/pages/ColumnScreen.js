/**
 * The Section preset screen: `PresetScreen` does the work and `presets/column-preset.js` describes
 * the block, so this file only binds the two together and registers the screen. Its settings panel is
 * `ColumnSettings`, assigned below as `ColumnScreen.SettingsPanel`.
 */

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { PresetScreen } from './PresetScreen';
import { ColumnSettings } from './ColumnSettings';
import { COLUMN_PRESET, COLUMN_BLOCK } from '../../presets/column-preset';
import { PRESET_SCREENS_FILTER } from '../../constants/screens';
import './ColumnScreen.scss';

/**
 * Render the Section preset screen.
 *
 * @param {Object} props The screen props (`label`, `route`, `navigate`, `library`).
 *
 * @since TBD
 *
 * @return {JSX.Element} The screen body.
 */
export function ColumnScreen(props) {
	return <PresetScreen {...props} preset={COLUMN_PRESET} />;
}

ColumnScreen.SettingsPanel = ColumnSettings;

/**
 * Register the Section screen for `kadence/column` on the public preset-screens filter, exactly as a
 * third party would — the app never imports this component directly, so this module-scope call is the
 * only registration path.
 *
 * @since TBD
 */
addFilter(PRESET_SCREENS_FILTER, 'kadence-blocks/style-library-column-screen', (screens) => ({
	...screens,
	[COLUMN_BLOCK]: ColumnScreen,
}));
