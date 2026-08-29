/**
 * The Advanced Text preset screen: `PresetScreen` does the work and `presets/advancedheading-preset.js`
 * describes the block, so this file only binds the two together and registers the screen. Its settings
 * panel is `HeadingSettings`, assigned below as `HeadingScreen.SettingsPanel`.
 */

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { PresetScreen } from './PresetScreen';
import { HeadingSettings } from './HeadingSettings';
import { HEADING_PRESET, HEADING_BLOCK } from '../../presets/advancedheading-preset';
import { PRESET_SCREENS_FILTER } from '../../constants/screens';
import './HeadingScreen.scss';

/**
 * Render the Advanced Text preset screen.
 *
 * @param {Object} props The screen props (`label`, `route`, `navigate`, `library`).
 *
 * @since TBD
 *
 * @return {JSX.Element} The screen body.
 */
export function HeadingScreen(props) {
	return <PresetScreen {...props} preset={HEADING_PRESET} />;
}

HeadingScreen.SettingsPanel = HeadingSettings;

/**
 * Register the Advanced Text screen for `kadence/advancedheading` on the public preset-screens filter,
 * exactly as a third party would — the app never imports this component directly, so this module-scope
 * call is the only registration path.
 *
 * @since TBD
 */
addFilter(PRESET_SCREENS_FILTER, 'kadence-blocks/style-library-heading-screen', (screens) => ({
	...screens,
	[HEADING_BLOCK]: HeadingScreen,
}));
