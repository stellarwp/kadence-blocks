/**
 * The Single Icon preset screen: `PresetScreen` does the work and `presets/single-icon-preset.js`
 * describes the block, so this file only binds the two together and registers the screen. Its
 * settings panel is `SingleIconSettings`, assigned below as `SingleIconScreen.SettingsPanel`.
 */

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { PresetScreen } from './PresetScreen';
import { SingleIconSettings } from './SingleIconSettings';
import { SINGLE_ICON_PRESET, SINGLE_ICON_BLOCK } from '../../presets/single-icon-preset';
import { PRESET_SCREENS_FILTER } from '../../constants/screens';
import './SingleIconScreen.scss';

/**
 * Render the Single Icon preset screen.
 *
 * @param {Object} props The screen props (`label`, `route`, `navigate`, `library`).
 *
 * @since TBD
 *
 * @return {JSX.Element} The screen body.
 */
export function SingleIconScreen(props) {
	return <PresetScreen {...props} preset={SINGLE_ICON_PRESET} />;
}

SingleIconScreen.SettingsPanel = SingleIconSettings;

/**
 * Register the Single Icon screen for `kadence/single-icon` on the public preset-screens filter,
 * exactly as a third party would — the app never imports this component directly, so this
 * module-scope call is the only registration path.
 *
 * @since TBD
 */
addFilter(PRESET_SCREENS_FILTER, 'kadence-blocks/style-library-single-icon-screen', (screens) => ({
	...screens,
	[SINGLE_ICON_BLOCK]: SingleIconScreen,
}));
