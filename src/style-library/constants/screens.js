/**
 * The Style Library screen catalog: the fixed BASE STYLES entries, the sidebar section
 * definitions, and the extension-point names. Screen ids are stable — they are used in the URL
 * (`?kb-screen=<id>`) and by the per-screen modules that claim them.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	advancedImage,
	advancedText,
	borderRadius,
	borderWidth,
	button,
	colorPalette,
	iconSizes,
	rowLayout,
	section,
	shadow,
	singleIcon,
	spacing,
	typography,
} from '../icons';

/**
 * The filter third parties use to register a screen component for their preset-bound block:
 * `addFilter( PRESET_SCREENS_FILTER, 'my-plugin/screens', ( screens ) => ( { ...screens,
 * 'my-vendor/my-block': MyScreen } ) )`. Keyed by block name, valued by component. Resolution runs
 * on every screen render (inside `resolveScreen`), so a listener added after the app has already
 * rendered a screen still takes effect on the next render or navigation.
 *
 * @since TBD
 */
export const PRESET_SCREENS_FILTER = 'kadence_blocks.style_library.preset_screens';

/**
 * The fixed BASE STYLES nav entries, in design order. An entry with no component registered in
 * `StyleLibraryApp` falls back to `PlaceholderScreen`.
 *
 * @since TBD
 */
export const BASE_STYLES_SCREENS = [
	{ id: 'color-palette', label: __('Color Palette', 'kadence-blocks'), icon: colorPalette },
	{ id: 'typography', label: __('Typography', 'kadence-blocks'), icon: typography },
	{ id: 'border-radius', label: __('Border Radius', 'kadence-blocks'), icon: borderRadius },
	{ id: 'border-width', label: __('Border Width', 'kadence-blocks'), icon: borderWidth },
	{ id: 'spacing', label: __('Spacing', 'kadence-blocks'), icon: spacing },
	{ id: 'icon-sizes', label: __('Icon Sizes', 'kadence-blocks'), icon: iconSizes },
	{ id: 'shadow', label: __('Shadow', 'kadence-blocks'), icon: shadow },
];

/**
 * The sidebar icon of each BLOCK PRESETS entry, keyed by block name. The entries themselves come
 * from the admin feed, which carries no icon; a block with no icon here renders its label alone.
 *
 * @since TBD
 */
export const PRESET_SCREEN_ICONS = {
	'kadence/singlebtn': button,
	'kadence/image': advancedImage,
	'kadence/rowlayout': rowLayout,
	'kadence/column': section,
	'kadence/single-icon': singleIcon,
	'kadence/advancedheading': advancedText,
};

/**
 * The screen the app falls back to when the route names no screen or an unknown one.
 *
 * @since TBD
 */
export const DEFAULT_SCREEN_ID = BASE_STYLES_SCREENS[0].id;
