/**
 * The round color mark `ColorControl`'s trigger and `ColorGroupList`'s rows both render.
 *
 * Resolution happens entirely at the CSS layer, never as a JS-computed hex — see the color-control
 * design's "Data contract" section. A swatch backed by a design token renders
 * `var(--kb-token--<id>)`, letting CSS custom-property inheritance under the block's own
 * `data-kb-palette` scope pick the right literal for free; only a Custom-tab literal (no token
 * entry at all) is written to `background` directly.
 */

/**
 * Internal dependencies
 */
import { tokenCssVar } from '../helpers/token-css-var';

/**
 * The swatch's inline style, split out from the component so it can be unit-tested without a
 * renderer — this repo has no `@testing-library/react`/`react-test-renderer` dependency, so a
 * component's actual logic has to live in a plain function the test calls directly (the same split
 * `BoxTokenField.js`'s `toStoredValue`/`toControlValue` use).
 *
 * @param {?Object} entry        The swatch's token entry (`{ id, label, value, alias }`), or null.
 * @param {?string} [value]      A raw literal (hex/rgba), used only when `entry` is null — a
 *                                Custom-tab pick with no backing token entry.
 *
 * @since TBD
 *
 * @return {{background: string}} The swatch's inline style.
 */
export function colorSwatchStyle(entry, value) {
	if (entry) {
		if (entry.value) {
			return { background: entry.value };
		}

		const id = entry.alias ? entry.alias.slice(1, -1) : entry.id;

		return { background: `var(${tokenCssVar(id)})` };
	}

	if (value) {
		return { background: value };
	}

	return { background: 'transparent' };
}

/**
 * The round color swatch.
 *
 * @param {Object}  props
 * @param {?Object} props.entry The swatch's token entry (`{ id, label, value, alias }`), or null.
 * @param {?string} [props.value] A raw literal, used only when `entry` is null.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered swatch.
 */
export function ColorSwatch({ entry, value }) {
	return <span className="kb-color-swatch" style={colorSwatchStyle(entry, value)} />;
}
