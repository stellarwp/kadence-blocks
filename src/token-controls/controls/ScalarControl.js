/**
 * The scalar token control: one value, no slots.
 *
 * This is `BoxControl` with the two corner-specific parts removed — the `SlotGrid` and the
 * linked/individual toggle. A property that holds a single dimension (an icon's size, a stroke
 * width) has one value and nothing to link, so those parts have nothing to do; everything else a
 * box control wears — the label, the breakpoint switcher, the binding indicator and its reset — is
 * already opt-in on `ControlShell` and carries over unchanged.
 *
 * That is the reason this is a sibling of `BoxControl` rather than a mode of it: the difference is
 * *shape* (a scalar versus four slots), which decides whether linking exists at all, not a setting
 * a caller should be able to flip.
 *
 * **The binding indicator and its reset are opt-in**, exactly as in `BoxControl`. They exist for the
 * block editor, where a control can override a selected preset; a host with no preset layer passes
 * no `status` and gets a bare label.
 */

/**
 * Internal dependencies
 */
import { ControlShell } from '../templates/ControlShell';
import { TokenSelector } from '../organisms/TokenSelector';

/**
 * Render a scalar token control.
 *
 * @param {Object}       props                      The component props.
 * @param {*}            props.value                The current value: an alias, a literal, or empty.
 * @param {Function}     props.onChange             Called with the next value.
 * @param {string}       props.label                The control's label.
 * @param {Array}        [props.tokens]             Pickable tokens, `[{ id, label, value, alias }]`.
 * @param {string}       [props.unit]               The value's unit.
 * @param {Array}        [props.units]              Selectable units for the Custom tab. A single-entry
 *                                                  list pins the unit, which is what a host whose
 *                                                  attribute stores a bare number in one fixed unit
 *                                                  wants.
 * @param {?Function}    [props.onUnit]             Writes the unit.
 * @param {*}            [props.defaultValue]       What the value falls back to when unset.
 * @param {boolean}      [props.inherited]          Whether that default came from another breakpoint.
 * @param {?*}           [props.icon]               A glyph shown beside the field.
 * @param {?Object}      [props.status]             `{ bound, modified }`; omit for no indicator.
 * @param {?Function}    [props.onReset]            Reset handler, paired with `status`.
 * @param {boolean}      [props.showReset]          Render the matching glyph and reset button.
 * @param {?JSX.Element} [props.indicator]          Rendered in the header in place of the built-in
 *                                                  indicator, for a host that supplies its own.
 * @param {?Array}       [props.breakpoints]        Breakpoint keys; omit for a non-responsive control.
 * @param {?string}      [props.breakpoint]         The active breakpoint.
 * @param {?Function}    [props.onBreakpointChange] Breakpoint-change handler.
 * @param {boolean}      [props.stacked]            Header above a full-width body instead of beside it.
 * @param {boolean}      [props.disabled]           Whether the control is read-only.
 * @param {?number}      [props.min]                Lowest allowed number on the Custom tab.
 * @param {?number}      [props.max]                Highest allowed number; the slider needs one.
 * @param {number}       [props.step]               Custom tab increment.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered control.
 */
export function ScalarControl({
	value,
	onChange,
	label,
	tokens = [],
	unit = '',
	units,
	onUnit,
	defaultValue,
	inherited = false,
	icon = null,
	status = null,
	onReset = null,
	showReset = true,
	indicator = null,
	breakpoints = null,
	breakpoint = null,
	onBreakpointChange = null,
	stacked = false,
	disabled = false,
	min,
	max,
	step,
	showValue = true,
}) {
	return (
		<ControlShell
			label={label}
			status={status}
			onReset={onReset}
			showReset={showReset}
			indicator={indicator}
			breakpoints={breakpoints}
			breakpoint={breakpoint}
			onBreakpointChange={onBreakpointChange}
			stacked={stacked}
			disabled={disabled}
		>
			<TokenSelector
				value={value}
				unit={unit}
				units={units}
				onUnit={onUnit}
				defaultValue={defaultValue}
				inherited={inherited}
				icon={icon}
				tokens={tokens}
				min={min}
				max={max}
				step={step}
				showValue={showValue}
				disabled={disabled}
				// The field speaks three intents; a scalar stores one value, so they collapse here rather
				// than in every host. `onCustom` writes a bare number — the unit is the control's, exactly
				// as `BoxControl` treats it across its four slots.
				onPick={(alias) => !disabled && onChange(alias)}
				onClear={() => !disabled && onChange('')}
				onCustom={(next) => !disabled && onChange(next)}
			/>
		</ControlShell>
	);
}
