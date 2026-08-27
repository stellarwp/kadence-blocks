/**
 * The box-shaped token control: one value or four, linked or individual.
 *
 * Backs both the `radius` and `spacing` field types. Radius and spacing are the same component
 * because they are the same value shape — four slots of one dimension. What differs is geometry
 * (corners walk clockwise, sides do not), which token pool is offered, and whether negatives are
 * allowed. Those are settings, not a reason to fork.
 *
 * **Linked state is controlled or uncontrolled, and the choice follows the host's storage.** Pass
 * `onToggleLink` and the host owns it — the block editor does, because its attribute is always a
 * four-element array and "linked" is a UI mode with nowhere to live in the value. Pass nothing and
 * this derives it from the value's shape and collapses a uniform list back to a scalar on write,
 * which is what the Style Library's stored preset shape wants (a scalar there reads as "every
 * slot"). Mixing the two — a host that controls the toggle while values still collapse — would
 * silently rewrite an array attribute into a string, so `collapse` defaults to the safe pairing.
 *
 * **The binding indicator and its reset are opt-in.** They exist for the block editor, where a
 * control can override a selected preset. The Style Library passes no `status` and gets a bare
 * label.
 */

/**
 * Internal dependencies
 */
import { ControlShell } from '../templates/ControlShell';
import { SlotGrid } from '../templates/SlotGrid';
import { TokenSelector } from '../organisms/TokenSelector';
import { isSlotList, readSlot, toShorthand, toSlotList } from '../helpers/value-shapes';

/**
 * The token pool one slot's picker should offer: the shared pool, minus any token another slot
 * currently holds. A caller building `tokens` for the whole control (e.g. the Style Library's
 * `BoxTokenField`) exempts every currently-bound token from its primitives-only narrowing so no
 * slot's own binding silently disappears from the pool — but that exemption is computed once for
 * all four slots together, so the shared list still carries slot B's token when slot A is what's
 * open. Filtering it back out here, per slot, is what keeps a sibling's specific token from showing
 * up as a pickable option in a slot it was never bound to. A token equal to THIS slot's own current
 * value is never dropped, so the field never loses track of its own selection, and the linked
 * slot (`index === null`) needs no filtering at all — there is only one value to compare against.
 *
 * @param {Array}   tokens The shared token pool passed to the whole control.
 * @param {*}       value  The whole box value (a scalar or a four-slot list).
 * @param {?number} index  This slot's index, or `null` for the linked slot.
 * @param {*}       slot   This slot's own current value.
 *
 * @since TBD
 *
 * @return {Array} The token pool this slot's picker should offer.
 */
export function tokensForSlot(tokens, value, index, slot) {
	if (index === null) {
		return tokens;
	}

	const siblingValues = new Set(
		[0, 1, 2, 3]
			.filter((slotIndex) => slotIndex !== index)
			.map((slotIndex) => readSlot(value, slotIndex))
			.filter((siblingValue) => siblingValue && siblingValue !== slot)
	);

	return siblingValues.size ? tokens.filter((token) => !siblingValues.has(token.alias)) : tokens;
}

/**
 * Render a box-shaped token control.
 *
 * @param {Object}    props                      The component props.
 * @param {*}         props.value                A scalar or a `[top, right, bottom, left]` slot list.
 * @param {Function}  props.onChange             Called with the next value.
 * @param {string}    props.label                The control's label.
 * @param {Array}     [props.tokens]             Pickable tokens, `[{ id, label, value, alias }]`.
 * @param {string}    [props.unit]               The unit shared by every slot.
 * @param {Array}     [props.units]              Selectable units for the Custom tab.
 * @param {?Function} [props.onUnit]             Writes the shared unit.
 * @param {*}         [props.defaultValue]       What each slot falls back to when unset. Takes the
 *                                               same shapes as `value` — a scalar answers for every
 *                                               slot, a slot list answers per corner.
 * @param {boolean}   [props.inherited]          Whether that default came from another breakpoint.
 * @param {?Array}    [props.slotIcons]          Per-slot glyphs, in stored order.
 * @param {string}    [props.role]               'sides' or 'corners' — geometry, bound by the registry.
 * @param {?Object}   [props.status]             `{ bound, modified }`; omit for no indicator.
 * @param {?JSX.Element} [props.indicator]      Rendered in the header in place of the built-in
 *                                                indicator, for a host that supplies its own.
 * @param {?Function} [props.onReset]            Reset handler, paired with `status`.
 * @param {boolean}   [props.showReset]          Render the matching glyph and reset button.
 * @param {?Array}    [props.breakpoints]        Breakpoint keys; omit for a non-responsive control.
 * @param {?string}   [props.breakpoint]         The active breakpoint.
 * @param {?Function} [props.onBreakpointChange] Breakpoint-change handler.
 * @param {?boolean}  [props.isLinked]           Linked state, when the host controls it.
 * @param {?Function} [props.onToggleLink]       Link-toggle handler; omit to let this own the state.
 * @param {?boolean}  [props.collapse]           Collapse four identical slots to a scalar on write.
 *                                               Defaults to the safe pairing with `onToggleLink`.
 * @param {boolean}   [props.stacked]            Header above a full-width body instead of beside it.
 * @param {boolean}   [props.disabled]           Whether the control is read-only.
 * @param {?number}   [props.min]                Lowest allowed number on the Custom tab.
 * @param {?number}   [props.max]                Highest allowed number; the slider needs one.
 * @param {number}    [props.step]               Custom tab increment.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered control.
 */
export function BoxControl({
	value,
	onChange,
	label,
	tokens = [],
	unit = '',
	units,
	onUnit,
	defaultValue,
	inherited = false,
	slotIcons = null,
	role = 'sides',
	status = null,
	onReset = null,
	showReset = true,
	indicator = null,
	breakpoints = null,
	breakpoint = null,
	onBreakpointChange = null,
	isLinked = null,
	onToggleLink = null,
	collapse = null,
	stacked = false,
	disabled = false,
	min,
	max,
	step,
}) {
	const controlled = typeof onToggleLink === 'function';
	const linked = controlled ? Boolean(isLinked) : !isSlotList(value);
	const collapseSlots = collapse ?? !controlled;

	// Unlinking seeds every slot from the current value; relinking keeps slot 0 rather than voting
	// on the most common one — "the first side wins" is predictable, a tally is not.
	const toggleLink = controlled ? onToggleLink : () => onChange(linked ? toSlotList(value) : readSlot(value, 0));

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
			isLinked={linked}
			onToggleLink={toggleLink}
			stacked={stacked}
			disabled={disabled}
		>
			<SlotGrid
				value={value}
				onChange={onChange}
				isLinked={linked}
				role={role}
				label={label}
				collapse={collapseSlots}
				renderSlot={({ value: slot, onChange: onSlotChange, index }) => (
					<TokenSelector
						key={index ?? 'linked'}
						value={slot}
						unit={unit}
						units={units}
						onUnit={onUnit}
						// The linked field stands for every side at once, so it states the whole default as CSS
						// shorthand rather than just the first side's share of it. An unlinked slot takes its own.
						defaultValue={index === null ? toShorthand(defaultValue) : readSlot(defaultValue, index)}
						inherited={inherited}
						icon={slotIcons?.[index ?? 0]}
						tokens={tokensForSlot(tokens, value, index, slot)}
						min={min}
						max={max}
						step={step}
						// The field speaks three intents; a slot stores one value, so they collapse
						// here rather than in every host. `onCustom` writes a bare number — the unit
						// is the control's, shared across all four slots, exactly as the editor's
						// measurement control treats it.
						disabled={disabled}
						onPick={(alias) => !disabled && onSlotChange(alias)}
						onClear={() => !disabled && onSlotChange('')}
						onCustom={(next) => !disabled && onSlotChange(next)}
					/>
				)}
			/>
		</ControlShell>
	);
}
