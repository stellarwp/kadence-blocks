/**
 * Per-block color-palette selector.
 *
 * Reads the active library's palettes from the server-localized `window.kadenceDesignTokensPalettes`
 * (`{ active, current, palettes: [ { id, label } ] }`) and lets a block override which palette its subtree
 * renders against, independent of the library's `$current`. The selection lives in the block's `kbPalette`
 * string attribute; the Design Tokens projector emits a `[data-kb-palette="<id>"]` switch layer the block's
 * `data-kb-palette` wrapper hooks. An empty selection inherits the library `$current`.
 */
import { get } from 'lodash';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * The whole palette catalog the editor localizer prints, or an empty shape when the token registry is
 * inactive (no palettes offered).
 *
 * @since TBD
 *
 * @return {Object} The catalog ({ active, current, palettes }).
 */
function paletteCatalog() {
	return get(window, 'kadenceDesignTokensPalettes', {}) || {};
}

/**
 * The active library's palettes as `[ { id, label } ]`, or an empty array when none are offered.
 *
 * @since TBD
 *
 * @return {Array} The palettes.
 */
export function selectablePalettes() {
	const palettes = get(paletteCatalog(), 'palettes', []);

	return Array.isArray(palettes) ? palettes : [];
}

/**
 * The library's `$current` palette id, defaulting to "default".
 *
 * @since TBD
 *
 * @return {string} The current palette id.
 */
export function currentPalette() {
	return get(paletteCatalog(), 'current', 'default') || 'default';
}

/**
 * The per-block palette selector. Renders nothing when the library offers fewer than two palettes (there is
 * nothing to switch between). Selecting an option calls onChange with the chosen palette id (the caller
 * writes it into the block's kbPalette attribute); the empty option inherits the library `$current`.
 *
 * @param {Object}   props          The component props.
 * @param {string}   props.value    The currently selected palette id ('' inherits the library current).
 * @param {Function} props.onChange Called with the selected palette id.
 * @param {string}   [props.label]  The control label.
 *
 * @since TBD
 *
 * @return {Object|null} The selector element, or null when there is nothing to switch between.
 */
export function PalettePicker({ value, onChange, label }) {
	const palettes = selectablePalettes();

	if (palettes.length < 2) {
		return null;
	}

	const current = currentPalette();
	const options = [
		{
			label: inheritLabel(current),
			value: '',
		},
		...palettes.map((palette) => ({ label: palette.label, value: palette.id })),
	];

	return (
		<SelectControl
			label={label || __('Color Palette', 'kadence-blocks')}
			value={value || ''}
			options={options}
			onChange={onChange}
			__nextHasNoMarginBottom
		/>
	);
}

/**
 * The label for the "inherit the library current" option, naming the current palette so the default is legible.
 *
 * @param {string} current The library's current palette id.
 *
 * @since TBD
 *
 * @return {string} The option label.
 */
function inheritLabel(current) {
	const match = selectablePalettes().find((palette) => palette.id === current);
	const name = match ? match.label : current;

	return `${__('Inherit', 'kadence-blocks')} (${name})`;
}
