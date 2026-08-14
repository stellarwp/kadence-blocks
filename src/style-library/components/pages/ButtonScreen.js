/**
 * The Button preset screen: `PresetScreen` does the work and `presets/button-preset.js` describes
 * the block, so this file only binds the two together and registers the screen. Its settings panel
 * is `ButtonSettings`, assigned below as `ButtonScreen.SettingsPanel`.
 */

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { PresetScreen } from './PresetScreen';
import { ButtonSettings } from './ButtonSettings';
import { BUTTON_PRESET, BUTTON_BLOCK } from '../../presets/button-preset';
import { PRESET_SCREENS_FILTER } from '../../constants/screens';
import './ButtonScreen.scss';

/**
 * Render the Button preset screen.
 *
 * @param {Object} props The screen props (`label`, `route`, `navigate`, `library`).
 *
 * @since TBD
 *
 * @return {JSX.Element} The screen body.
 */
export function ButtonScreen(props) {
	return <PresetScreen preset={BUTTON_PRESET} {...props} />;
}

ButtonScreen.SettingsPanel = ButtonSettings;

/**
 * Register the Button screen for `kadence/singlebtn` on the public preset-screens filter, exactly
 * as a third party would — the app never imports this component directly, so this module-scope
 * call is the only registration path. `resolveScreen` (`helpers/screens.js`) applies the filter on
 * every render, so a module-scope `addFilter` is race-free regardless of import order.
 *
 * @since TBD
 */
addFilter(PRESET_SCREENS_FILTER, 'kadence-blocks/style-library-button-screen', (screens) => ({
	...screens,
	[BUTTON_BLOCK]: ButtonScreen,
}));
