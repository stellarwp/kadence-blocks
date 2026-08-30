/**
 * The default `renderColor` for `EditorBorderControl`.
 *
 * Kept out of `EditorBorderControl.js` for the reason `shadow-color.js` is kept out of
 * `EditorShadowControl.js`: it is the one piece that reaches for `@kadence/components`, whose
 * `dist/cjs` build ships bare `import` statements Jest cannot parse, so importing it into the
 * component would make that component untestable in isolation.
 */

/**
 * WordPress dependencies
 */
import { PopColorControl } from '@kadence/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * The translated name of one border side.
 *
 * `BorderControl` names its rows in English (`top`, `right`, …) because those are the keys of the
 * value it edits, not display text. Capitalizing the key leaves it in English, so the side is spelled
 * out here per side rather than derived — the four are a closed set, and a translator needs the whole
 * phrase in front of them to render "Top Border Color" naturally in a language that orders it
 * differently.
 *
 * @param {string} side The side key: `top`, `right`, `bottom` or `left`.
 *
 * @since TBD
 *
 * @return {string} The translated side name, or the key itself when it is not one of the four.
 */
function sideLabel(side) {
	const names = {
		top: __('Top', 'kadence-blocks'),
		right: __('Right', 'kadence-blocks'),
		bottom: __('Bottom', 'kadence-blocks'),
		left: __('Left', 'kadence-blocks'),
	};

	return names[side] ?? side;
}

/**
 * Render the shared color field for one border row.
 *
 * `BorderControl`'s row anatomy calls this once per row with that row's own resolved color scalar
 * (via `readSlot()`), never the whole four-element axis, the same way it reads `width` and `style`
 * per row — so this only ever renders a single swatch per call.
 *
 * Border color has no token picker of its own: it is bundled with width and style inside one nested
 * attribute, which a single-value control cannot represent without redesigning `BorderControl`. This
 * wires the existing color-picking mechanism back in unchanged; palette colors still resolve to token
 * aliases through the global `PopColorControl` filter.
 *
 * @param {Object}   props          The render-prop's argument.
 * @param {*}        props.value    The row's own resolved color scalar.
 * @param {Function} props.onChange Called with the next color scalar.
 * @param {?string}  [props.label]  The row's own bare side name (e.g. "top"), or `null` while linked.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered color field.
 */
export function renderBorderColor({ value, onChange, label }) {
	return (
		<PopColorControl
			swatchLabel={
				label
					? sprintf(
							/* translators: %s: the border side, already translated — Top, Right, Bottom or Left. */
							__('%s Border Color', 'kadence-blocks'),
							sideLabel(label)
						)
					: undefined
			}
			value={value || ''}
			default={''}
			hideClear={true}
			onChange={onChange}
		/>
	);
}
