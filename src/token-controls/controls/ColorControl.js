/**
 * The color token control: a swatch, the control's own static attribute label, and the currently
 * selected token's own label right-aligned — all inside one clickable trigger, no separate header
 * above it.
 *
 * No `ControlShell` — its header-above-body split does not fit a control whose label lives inside
 * the trigger row itself, the way `BorderControl`'s width `TokenSelector` does. Composes `Dropdown`
 * with `ColorPopover`, the popover body that shows a grouped Style Library tab (Accent/Contrast/
 * Background/Notices) and a Custom tab for raw colors. The popover lives in `ColorPopover` because
 * `ColorSwatchControl` opens the same one behind a different, compact trigger.
 */

/**
 * WordPress dependencies
 */
import { Dropdown } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { BindingIndicator } from '../atoms/BindingIndicator';
import { ColorSwatch } from '../atoms/ColorSwatch';
import { ColorPopover } from '../molecules/ColorPopover';
import { colorSelection } from '../helpers/color-selection';
import { isTokenAlias } from '../helpers/token-summary';
import '../styles/token-controls.scss';

/**
 * Render a color token control.
 *
 * @param {Object}    props                 The component props.
 * @param {string}    props.label           The control's own static attribute label (e.g. "Text"),
 *                                           never changing with the current selection.
 * @param {*}         props.value           The current slot value: a bracket alias
 *                                           (`{token.id}`, a token pick) or a raw literal
 *                                           (hex/rgba, a Custom-tab pick).
 * @param {Array}     props.groups          `[{ id, label, swatches: [{ id, label, value, alias }] }]`
 *                                           — the active palette's groups, host-resolved.
 * @param {?Object}   [props.status]        `{ bound, modified }`; omit for no indicator.
 * @param {?Function} [props.onReset]       Reset handler, paired with `status`.
 * @param {?Function} [props.onClear]       Clears the slot back to unset. Independent of `status`:
 *                                           `BindingIndicator`'s own Reset renders only for a
 *                                           preset-bound slot, so an attribute that no preset binds
 *                                           has no other way back to empty. Omit for no Clear row.
 * @param {Function}  props.onPick          Called with a token entry's `alias` when one is chosen.
 * @param {Function}  props.onCustom        Called with a literal color from the Custom tab.
 * @param {?Function} [props.resolveLiteral] `(entry) => string` — the host's hook for seeding the
 *                                           Custom tab from a currently-bound token entry, letting
 *                                           the block-editor adapter read the token's resolved
 *                                           value under the block's own pinned palette scope.
 * @param {boolean}   [props.disabled]      Whether the control is read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered control.
 */
export function ColorControl({
	label,
	value,
	groups,
	status = null,
	onReset = null,
	onClear = null,
	onPick,
	onCustom,
	resolveLiteral,
	disabled = false,
}) {
	const { entry, selectedLabel } = colorSelection(groups, value);

	return (
		<div className="kb-color-control">
			<div className="kb-color-control__trigger">
				<Dropdown
					className="kb-color-control__dropdown"
					contentClassName="kb-color-control__popover"
					popoverProps={{ placement: 'left-start' }}
					renderToggle={({ isOpen, onToggle }) => (
						<button
							type="button"
							className="kb-color-control__trigger-button"
							aria-expanded={isOpen}
							disabled={disabled}
							onClick={onToggle}
						>
							<ColorSwatch entry={entry} value={!entry && !isTokenAlias(value) ? value : null} />
							<span className="kb-color-control__label">{label}</span>
							{selectedLabel && <span className="kb-color-control__value">{selectedLabel}</span>}
						</button>
					)}
					renderContent={({ onClose }) => (
						<ColorPopover
							value={value}
							groups={groups}
							onClear={onClear}
							onPick={onPick}
							onCustom={onCustom}
							resolveLiteral={resolveLiteral}
							onClose={onClose}
						/>
					)}
				/>
				{/* A sibling of the toggle button, never nested inside it — `BindingIndicator` renders its
				    own `<button>` for Reset once modified, and nesting two buttons would let a Reset
				    click bubble to the toggle's `onClick` and reopen the popover it just closed. */}
				<BindingIndicator status={status} onReset={onReset} showReset disabled={disabled} />
			</div>
		</div>
	);
}
