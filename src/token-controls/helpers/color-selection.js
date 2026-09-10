/**
 * The state a color trigger and its popover both derive from the active palette's groups and the
 * slot's current value.
 *
 * A plain function rather than a hook or a component method: this repo ships no
 * `@testing-library/react` / `react-test-renderer` dependency, so a component's real logic has to
 * live somewhere a test can call directly — the same split `colorSwatchStyle` (`atoms/ColorSwatch.js`)
 * and `toStoredValue`/`toControlValue` (`src/style-library/helpers/color-values.js`) already use.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { findTokenEntry, isCssVariableReference, isTokenAlias } from './token-summary';

/**
 * Derive a color control's trigger and popover state.
 *
 * @param {Array} groups `[{ id, label, swatches: [{ id, label, value, alias }] }]` — the active
 *                        palette's groups, host-resolved.
 * @param {*}     value  The current slot value: a bracket alias (`{token.id}`, a token pick) or a
 *                        raw literal (hex/rgba, a Custom-tab pick).
 *
 * @since TBD
 *
 * @return {{allSwatches: Array, entry: ?Object, selectedLabel: ?string, initialTab: string}} The
 *         flattened swatch list, the matched token entry (or null), the label a trigger shows for
 *         the current selection (or null when there is nothing to name), and which tab the popover
 *         opens on.
 */
export function colorSelection(groups, value) {
	const allSwatches = groups.flatMap((group) => group.swatches);
	const entry = findTokenEntry(allSwatches, value);

	return {
		allSwatches,
		entry,
		// A bound alias that resolves to no entry in these groups (e.g. a button preset's default, a
		// token from outside the Accent/Contrast/Background palette) is still a real, working color —
		// just not one this control can name. Reading it back as raw dot-path text would overflow the
		// trigger and read as broken; "Default" matches every other token control's muted fallback.
		selectedLabel: entry ? entry.label : isTokenAlias(value) ? __('Default', 'kadence-blocks') : null,
		// A CSS-variable literal is real and working but `react-color` cannot parse it (it renders
		// black) and there is no path back to the original value once the picker overwrites it — so it
		// is routed to Style Library, never to the destructive Custom tab, exactly like an unresolved
		// alias.
		initialTab: isTokenAlias(value) || isCssVariableReference(value) || !value ? 'style-library' : 'custom',
	};
}
