/**
 * The default `renderColor` for `EditorShadowControl`.
 *
 * Kept out of `EditorShadowControl.js` itself, even though it exists only to be passed to it: this is
 * the one piece that reaches for `@kadence/components`, and that package ships a `dist/cjs` build with
 * bare `import` statements that Jest cannot parse. Every other module under `components/` stays clear
 * of it — `EditorBorderControl` takes its color field as a prop for the same reason — so importing it
 * there would make `EditorShadowControl` untestable in isolation. A separate module keeps the cost on
 * the blocks that render a color field, which are already in that position.
 */

/**
 * WordPress dependencies
 */
import { PopColorControl } from '@kadence/components';

/**
 * Internal dependencies
 */
import { combineColorOpacity, splitColorOpacity } from './EditorShadowControl';

/**
 * Render the shared color field for a shadow composite's single `color` slot.
 *
 * Every block wires this identically, because the shape it bridges belongs to the control rather than
 * to any block: the composite carries alpha inside `color` while the native attribute keeps a separate
 * `opacity`, and `PopColorControl` edits both through its own two channels. A block only needs its own
 * `renderColor` if it wants a different color field here; otherwise it passes this.
 *
 * `hideClear` because the composite always has a color — clearing it to nothing would leave a shadow
 * with geometry and no color, which renders as an opaque black one rather than as no shadow. Removing
 * a shadow is what zeroing its axes is for.
 *
 * @param {Object}   props          The render-prop's argument.
 * @param {string}   props.value    The composite's current `color` slot, alpha included.
 * @param {Function} props.onChange Called with the next `color` slot.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered color field.
 */
export function renderShadowColor({ value, onChange }) {
	const { color, opacity } = splitColorOpacity(value);

	return (
		<PopColorControl
			value={color || ''}
			default={'#000000'}
			hideClear={true}
			opacityValue={opacity}
			onChange={(next) => onChange(combineColorOpacity(next, opacity))}
			onOpacityChange={(next) => onChange(combineColorOpacity(color, next))}
			onArrayChange={(next, nextOpacity) => onChange(combineColorOpacity(next, nextOpacity))}
		/>
	);
}
