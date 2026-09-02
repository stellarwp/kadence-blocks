/**
 * The Advanced Image preset screen: `PresetScreen` does the work and `presets/image-preset.js`
 * describes the block, so this file only binds the two together and registers the screen. Its
 * settings panel is `ImageSettings`, assigned below as `ImageScreen.SettingsPanel`.
 */

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { PresetScreen } from './PresetScreen';
import { ImageSettings } from './ImageSettings';
import { IMAGE_PRESET, IMAGE_BLOCK } from '../../presets/image-preset';
import { PRESET_SCREENS_FILTER } from '../../constants/screens';
import './ImageScreen.scss';

/**
 * Render the Advanced Image preset screen.
 *
 * @param {Object} props The screen props (`label`, `route`, `navigate`, `library`).
 *
 * @since TBD
 *
 * @return {JSX.Element} The screen body.
 */
export function ImageScreen(props) {
	return <PresetScreen {...props} preset={IMAGE_PRESET} />;
}

ImageScreen.SettingsPanel = ImageSettings;

/**
 * Register the Advanced Image screen for `kadence/image` on the public preset-screens filter, exactly
 * as a third party would — the app never imports this component directly, so this module-scope call is
 * the only registration path.
 *
 * @since TBD
 */
addFilter(PRESET_SCREENS_FILTER, 'kadence-blocks/style-library-image-screen', (screens) => ({
	...screens,
	[IMAGE_BLOCK]: ImageScreen,
}));
