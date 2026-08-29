/**
 * The color token control: a swatch, the control's own static attribute label, and the currently
 * selected token's own label right-aligned — all inside one clickable trigger, no separate header
 * above it.
 *
 * No `ControlShell` — its header-above-body split does not fit a control whose label lives inside
 * the trigger row itself, the way `BorderControl`'s width `TokenSelector` does. Composes `Dropdown`
 * and `TokenPopover` directly, passing `ColorGroupList` through `TokenPopover`'s `renderList` prop
 * for a grouped Style Library tab (Accent/Contrast/Background/Notices) instead of the flat token
 * list every other control shows, and the relocated `ColorPicker` through `renderCustom` for the
 * Custom tab.
 */

/**
 * WordPress dependencies
 */
import { Button, Dropdown } from '@wordpress/components';
import { Icon, undo } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BindingIndicator } from '../atoms/BindingIndicator';
import { ColorSwatch } from '../atoms/ColorSwatch';
import { ColorGroupList } from '../molecules/ColorGroupList';
import { ColorPicker } from '../molecules/ColorPicker';
import { TokenPopover } from '../molecules/TokenPopover';
import { findTokenEntry, isTokenAlias } from '../helpers/token-summary';
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
	const allSwatches = groups.flatMap((group) => group.swatches);
	const entry = findTokenEntry(allSwatches, value);
	// A bound alias that resolves to no entry in this control's own groups (e.g. a button preset's
	// text/background default, a token from outside the Accent/Contrast/Background palette) is still
	// a real, working color — just not one this control can name. Reading it back as raw dot-path
	// text would overflow the trigger and read as broken; "Default" matches every other token
	// control's muted fallback for "set, but not to one of my own pickable options."
	const selectedLabel = entry ? entry.label : isTokenAlias(value) ? __('Default', 'kadence-blocks') : null;
	const initialTab = isTokenAlias(value) || !value ? 'style-library' : 'custom';

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
						<TokenPopover
							value={value}
							tokens={allSwatches}
							initialTab={initialTab}
							renderList={({ onPick: pick, onClose: close }) => (
								<>
									{onClear && (
										<Button
											className="kadence-token-field__reset kb-color-control__clear"
											disabled={!value}
											onClick={() => {
												onClear();
												close();
											}}
										>
											<span className="kadence-token-field__reset-label">
												{__('Clear', 'kadence-blocks')}
											</span>
											<Icon className="kadence-token-field__reset-icon" icon={undo} size={20} />
										</Button>
									)}
									<ColorGroupList groups={groups} value={value} onPick={pick} onClose={close} />
								</>
							)}
							renderCustom={() => (
								<ColorPicker
									color={entry && resolveLiteral ? resolveLiteral(entry) : entry ? '' : value}
									onChange={onCustom}
								/>
							)}
							onPick={onPick}
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
