/**
 * The block editor's color field for one `BorderControl` row.
 *
 * Sits beside `color-literal.js` and `use-color-groups.js`, the two halves of a `ColorControl`'s
 * data in this host, because it is the editor's own adapter rather than part of the host-agnostic
 * control library: it knows how a border side is named in this editor and how a token resolves
 * against this document.
 *
 * Border color is bundled with width and style inside one nested attribute, so it has no
 * `ColorControl` row of its own; this renders the compact `ColorSwatchControl` into the slot
 * `BorderControl` leaves for it, opening the same grouped popover every other color control opens.
 */

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ColorSwatchControl, sideLabel } from '../../../token-controls';
import { resolveColorLiteral } from '../color-literal';

/**
 * Render the color field for one border row.
 *
 * `BorderControl`'s row anatomy calls its `renderColor` once per row with that row's own resolved
 * color scalar (via `readSlot()`), never the whole four-element axis, so this only ever renders a
 * single swatch per call.
 *
 * @param {Object}    props            The component props.
 * @param {*}         props.value      The row's own resolved color scalar.
 * @param {Function}  props.onChange   Called with the next color scalar.
 * @param {?string}   [props.label]    The row's own bare side name (e.g. "top"), or `null` while
 *                                      linked.
 * @param {boolean}   [props.disabled] Whether the row is read-only.
 * @param {Array}     props.groups     The block's effective palette groups, from `useColorGroups()`.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered color field.
 */
export function BorderColorField({ value, onChange, label, disabled = false, groups }) {
	return (
		<ColorSwatchControl
			label={
				label
					? sprintf(
							/* translators: %s: the border side, already translated — Top, Right, Bottom or Left. */
							__('%s Border Color', 'kadence-blocks'),
							sideLabel(label)
						)
					: __('Border Color', 'kadence-blocks')
			}
			value={value || ''}
			groups={groups}
			onPick={onChange}
			onCustom={onChange}
			onClear={() => onChange('')}
			resolveLiteral={resolveColorLiteral}
			disabled={disabled}
		/>
	);
}
