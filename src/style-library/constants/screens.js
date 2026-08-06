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
 * The fixed BASE STYLES nav entries, in design order. Every entry renders `PlaceholderScreen`
 * until its per-screen ticket lands.
 *
 * @since TBD
 */
export const BASE_STYLES_SCREENS = [
	{ id: 'color-palette', label: __('Color Palette', 'kadence-blocks') },
	// @todo SOFT-4077: replace the placeholder with the Typography screen.
	{ id: 'typography', label: __('Typography', 'kadence-blocks') },
	{ id: 'border-radius', label: __('Border Radius', 'kadence-blocks') },
	// @todo SOFT-4079: replace the placeholder with the Border Width screen.
	{ id: 'border-width', label: __('Border Width', 'kadence-blocks') },
	// @todo SOFT-4080: replace the placeholder with the Spacing screen.
	{ id: 'spacing', label: __('Spacing', 'kadence-blocks') },
	// @todo SOFT-4081: replace the placeholder with the Icon Sizes screen.
	{ id: 'icon-sizes', label: __('Icon Sizes', 'kadence-blocks') },
	// @todo SOFT-4082: replace the placeholder with the Shadow screen.
	{ id: 'shadow', label: __('Shadow', 'kadence-blocks') },
];

/**
 * The screen the app falls back to when the route names no screen or an unknown one.
 *
 * @since TBD
 */
export const DEFAULT_SCREEN_ID = BASE_STYLES_SCREENS[0].id;
