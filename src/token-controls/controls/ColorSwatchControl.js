/**
 * The compact color token control: a bare round swatch that opens the same popover `ColorControl`
 * opens, with no label, no value text, and no binding indicator beside it.
 *
 * `BorderControl`'s row is one composite box — swatch, style preview, width field — with no room for
 * `ColorControl`'s full trigger row, and a border's color carries no preset binding of its own, so
 * there is no Reset glyph to render. The field's name therefore rides on `aria-label` rather than on
 * visible text, the way the Style Library's own swatch toggles already name themselves.
 *
 * The popover body itself is `ColorPopover`, shared with `ColorControl` — the two controls differ
 * only in what opens the popover.
 */

/**
 * WordPress dependencies
 */
import { Dropdown } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ColorPopover } from '../molecules/ColorPopover';
import { ColorSwatch } from '../atoms/ColorSwatch';
import { colorSelection } from '../helpers/color-selection';
import { isTokenAlias } from '../helpers/token-summary';
import '../styles/token-controls.scss';

/**
 * Render a compact color token control.
 *
 * @param {Object}    props                  The component props.
 * @param {string}    props.label            The field's accessible name (e.g. "Top Border Color").
 *                                            Never rendered as visible text.
 * @param {*}         props.value            The current slot value: a bracket alias or a raw literal.
 * @param {Array}     props.groups           `[{ id, label, swatches: [{ id, label, value, alias }] }]`
 *                                            — the active palette's groups, host-resolved.
 * @param {?Function} [props.onClear]        Clears the slot back to unset. Omit for no Clear row.
 * @param {Function}  props.onPick           Called with a token entry's `alias` when one is chosen.
 * @param {Function}  props.onCustom         Called with a literal color from the Custom tab.
 * @param {?Function} [props.resolveLiteral] `(entry) => string` — the host's hook for seeding the
 *                                            Custom tab from a currently-bound token entry.
 * @param {boolean}   [props.disabled]       Whether the control is read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered control.
 */
export function ColorSwatchControl({
	label,
	value,
	groups,
	onClear = null,
	onPick,
	onCustom,
	resolveLiteral,
	disabled = false,
}) {
	const selection = colorSelection(groups, value);
	const { entry, selectedLabel } = selection;

	return (
		<Dropdown
			className="kb-color-swatch-control"
			// Deliberately the same class `ColorControl` gives its own popover: it IS the same popover,
			// and a second class would let the two sizings drift apart.
			contentClassName="kb-color-control__popover"
			popoverProps={{ placement: 'left-start' }}
			renderToggle={({ isOpen, onToggle }) => (
				<button
					type="button"
					className="kb-color-swatch-control__button"
					// The trigger renders no visible text, so the current selection has nowhere else to be
					// announced — `ColorControl` shows it as its own `selectedLabel`. Composed into the
					// accessible name so a screen reader hears what is set, not just which field this is.
					aria-label={
						selectedLabel
							? sprintf(
									/* translators: 1: the field's name. 2: the selected color's name. */
									__('%1$s: %2$s', 'kadence-blocks'),
									label,
									selectedLabel
								)
							: label
					}
					aria-expanded={isOpen}
					disabled={disabled}
					onClick={onToggle}
				>
					<ColorSwatch entry={entry} value={!entry && !isTokenAlias(value) ? value : null} />
				</button>
			)}
			renderContent={({ onClose }) => (
				<ColorPopover
					value={value}
					groups={groups}
					selection={selection}
					onClear={onClear}
					onPick={onPick}
					onCustom={onCustom}
					resolveLiteral={resolveLiteral}
					onClose={onClose}
				/>
			)}
		/>
	);
}
