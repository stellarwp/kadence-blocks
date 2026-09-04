/**
 * The block editor's color field for `EditorShadowControl`'s Custom tab.
 *
 * Sits beside `border-color.js`, `color-literal.js` and `use-color-groups.js` because it is the
 * editor's own adapter rather than part of the host-agnostic control library: it knows how a token
 * resolves against this document, and it is handed the block's effective palette groups. A block
 * wires it exactly the way it wires `BorderColorField` — once per render through `useCallback`,
 * closing over `useColorGroups(clientId)` — and passes the result as `renderColor`.
 *
 * Kept out of `EditorShadowControl.js` so that module stays free of `ColorControl`'s `Dropdown` and
 * `react-color` imports; its own suite calls it as a plain function with no `@wordpress/components`
 * stand-in, and pulling the popover in there would force one for no gain.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ColorControl } from '../../../token-controls';
import { resolveColorLiteral } from '../color-literal';

/**
 * Render the color field for a shadow composite's single `color` slot.
 *
 * The composite carries alpha inside the color string itself — an `rgba(...)` literal folded by
 * `fromNativeShadow()`, or the `#rrggbbaa` the shared picker emits — so the value goes to
 * `ColorControl` untouched and every pick comes back through one `onChange`. `toNativeShadow()`
 * splits it back into the native `(color, opacity)` pair; a token alias passes through that split
 * unchanged and renders through the alias-aware color output on both the canvas and the front end.
 *
 * No `onClear`: the composite always has a color. Clearing it to nothing would leave a shadow with
 * geometry and no color, which renders as an opaque black one rather than as no shadow. Removing a
 * shadow is what zeroing its axes, or the Style Library's None pick, is for.
 *
 * @param {Object}   props            The component props.
 * @param {*}        props.value      The composite's current `color` slot: a bracket alias or a raw
 *                                    literal, alpha included.
 * @param {Function} props.onChange   Called with the next `color` slot.
 * @param {boolean}  [props.disabled] Whether the field is read-only.
 * @param {Array}    props.groups     The block's effective palette groups, from `useColorGroups()`.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered color field.
 */
export function ShadowColorField({ value, onChange, disabled = false, groups }) {
	return (
		<ColorControl
			label={__('Color', 'kadence-blocks')}
			value={value || ''}
			groups={groups}
			onPick={onChange}
			onCustom={onChange}
			resolveLiteral={resolveColorLiteral}
			disabled={disabled}
		/>
	);
}
