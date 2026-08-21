/**
 * The Style Library's adapter for `src/token-controls`' `BoxControl`.
 *
 * The control is host-agnostic by design, which means it speaks the block editor's storage
 * contract: a slot holds a brace-wrapped alias (`{semantic.dimension.radius-sm}`) or a bare number,
 * with the unit kept alongside as its own value. This app stores neither — a preset slot is one
 * composed string, either a bare token id (`semantic.dimension.radius-sm`, as
 * `presetInitialValues` seeds it) or a literal with its unit baked in (`0.1875rem`).
 *
 * Bridging that is this file's whole job, and it is the reason the adapter exists rather than the
 * registry pointing at `BoxControl` directly:
 *
 * - **reading** wraps a bare id into an alias, and splits a literal into its number;
 * - **writing** unwraps an alias back to a bare id, and rejoins a number with the active unit;
 * - **the unit** has nowhere of its own to live here, so it is read from whichever slot already
 *   carries one and re-applied on write. All four slots share it, exactly as the editor's
 *   measurement control treats a single unit for four sides.
 *
 * Note the two meanings of "role" that meet here: `field.role` narrows the *token pool* (only the
 * radius scale, say), while `slots` picks the control's *geometry*. The registry binds `slots`; a
 * schema sets `role`.
 */

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { pickableTokensForType } from '../../../helpers/tokens';
import {
	PRESET_BREAKPOINTS,
	readPresetBreakpoint,
	resolvePresetBreakpoint,
	writePresetBreakpoint,
} from '../../../../token-controls/helpers/preset-envelope';
import { BoxControl } from '../../../../token-controls/controls/BoxControl';
import { useBreakpoint } from '../../../../token-controls/context/breakpoint';
import { parseCssLength } from '../../../../token-controls/helpers/parse-css-length';
import { isSlotList, readSlot } from '../../../../token-controls/helpers/value-shapes';
import './BoxTokenField.scss';

/**
 * The unit a slot list already uses, so a write does not silently retype every other slot.
 *
 * @param {*}      value    A scalar or slot list of stored values.
 * @param {string} fallback The unit to assume when nothing carries one yet.
 *
 * @since TBD
 *
 * @return {string} The unit in play.
 */
function unitInPlay(value, fallback) {
	const slots = isSlotList(value) ? value : [value];

	for (const slot of slots) {
		const parsed = parseCssLength(slot);

		if (parsed?.unit) {
			return parsed.unit;
		}
	}

	return fallback;
}

/**
 * Convert one stored slot into what the control expects: an alias, a bare number, or ''.
 *
 * @param {*} stored The stored slot value.
 *
 * @since TBD
 *
 * @return {*} The control-shaped value.
 */
export function toControlValue(stored) {
	if (typeof stored !== 'string' || stored === '') {
		return '';
	}

	// A bare token id becomes the alias the control matches its pickable list against.
	if (stored.startsWith('primitive.') || stored.startsWith('semantic.')) {
		return `{${stored}}`;
	}

	const parsed = parseCssLength(stored);

	return parsed ? parsed.size : stored;
}

/**
 * Convert one control slot back into what a preset stores.
 *
 * @param {*}      next The control-shaped value: an alias, a number, or ''.
 * @param {string} unit The unit to rejoin a bare number with.
 *
 * @since TBD
 *
 * @return {*} The stored value.
 */
export function toStoredValue(next, unit) {
	if (next === '' || next === undefined || next === null) {
		return '';
	}

	if (typeof next === 'string' && next.startsWith('{') && next.endsWith('}')) {
		return next.slice(1, -1);
	}

	// Zero stays unitless. The `None` token resolves to a bare `'0'`, so appending a unit here would
	// rewrite a stored value on a no-op round trip — marking a clean preset dirty and breaking the
	// equality that decides whether a slot still matches the design system.
	if (Number(next) === 0) {
		return '0';
	}

	return `${next}${unit || ''}`;
}

/**
 * The numeric bounds a length field offers, which depend on the unit in play.
 *
 * Lifted from how `ResponsiveMeasurementControls` is called for a border radius in the block
 * editor: a relative unit tops out far lower and steps far finer than an absolute one, so a slider
 * calibrated for `px` is unusable in `rem`. A schema may override any of the three.
 *
 * @param {string} unit  The unit currently in play.
 * @param {Object} field The field definition, whose own bounds win when given.
 *
 * @since TBD
 *
 * @return {{min: number, max: number, step: number}} The bounds for this unit.
 */
function boundsForUnit(unit, field) {
	const relative = unit === 'em' || unit === 'rem';

	return {
		min: field.min ?? 0,
		max: field.max ?? (relative ? 24 : 500),
		step: field.step ?? (relative ? 0.1 : 1),
	};
}

/**
 * Every token id a value has bound, so the pool narrowing knows what it must not drop.
 *
 * All of them, not just the first: unlinking gives each corner its own slot, so pointing one at a
 * primitive while the rest still hold a semantic is an ordinary thing to do. Exempting only the first
 * would drop the semantic from the pool, and the corners still holding it would render their raw
 * dot-path instead of the token's name.
 *
 * @param {*} value The stored scalar or slot list.
 *
 * @since TBD
 *
 * @return {Array<string>} The bound token ids, empty when nothing is bound.
 */
export function boundTokenIds(value) {
	const slots = isSlotList(value) ? value : [value];

	return slots.filter(
		(slot) => typeof slot === 'string' && (slot.startsWith('primitive.') || slot.startsWith('semantic.'))
	);
}

/**
 * Map a whole value — scalar or slot list — through a per-slot converter.
 *
 * @param {*}        value   The scalar or slot list.
 * @param {Function} convert The per-slot converter.
 *
 * @since TBD
 *
 * @return {*} The converted value, in the same shape.
 */
function mapSlots(value, convert) {
	return isSlotList(value) ? value.map(convert) : convert(value);
}

/**
 * Render a box-shaped token field from a settings schema entry.
 *
 * @param {Object}   props                  The component props.
 * @param {Object}   props.field            The field definition.
 * @param {string}   props.field.tokenType  The DTCG `$type` the pickable pool is filtered to.
 * @param {?string}  [props.field.role]     Narrows the pool further to one token role.
 * @param {?string}  [props.field.label]    The control's label.
 * @param {boolean}  [props.field.readOnly] Whether the control is non-interactive.
 * @param {boolean}  [props.field.responsive] Whether the field offers a breakpoint switcher.
 * @param {*}        [props.field.defaultValue] What the block renders when the preset sets nothing,
 *                                              shown muted so an unset field is not blank.
 * @param {?Array}   [props.field.units]    Units the Custom tab offers.
 * @param {?number}  [props.field.min]      Lowest allowed number on the Custom tab.
 * @param {?number}  [props.field.max]      Highest allowed number; the slider needs one.
 * @param {?number}  [props.field.step]     Custom tab increment.
 * @param {*}        props.value            The stored value: a scalar or a four-slot list.
 * @param {Function} props.onChange         Called with the next stored value.
 * @param {string}   [props.slots]          'corners' or 'sides' — the control's geometry.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function BoxTokenField({ field, value, onChange, slots = 'sides' }) {
	const units = field.units ?? ['px', 'em', 'rem', '%'];
	const responsive = field.responsive === true;

	// Shared, not local: switching to Tablet here switches every other responsive control in the panel
	// with it, matching the block editor.
	const [breakpoint, setBreakpoint] = useBreakpoint(PRESET_BREAKPOINTS[0]);

	// The breakpoint unwrap wraps the slot conversion rather than sitting inside it: the envelope
	// holds one whole value per breakpoint — scalar or slot list — so a breakpoint is resolved first
	// and the four slots are read out of whatever that breakpoint holds.
	const atBreakpoint = responsive ? readPresetBreakpoint(value, breakpoint) : value;
	const write = (next) => (responsive ? writePresetBreakpoint(value, breakpoint, next) : next);

	// An unset breakpoint shows what is actually in effect rather than reading as empty, and it inherits
	// from the next breakpoint up, not straight from desktop: mobile shows the tablet value whenever
	// tablet is set, because the projected tablet media query also covers mobile widths. Desktop has
	// nothing above it — a preset's base value is the root of that chain.
	//
	// Desktop has no breakpoint above it, but it can still have something to fall back to: a property
	// whose block renders a built-in value when the preset sets nothing (a button's padding comes from
	// its size and style classes) declares that value as the field's default, so an unset field reads as
	// the size actually in effect rather than looking empty. Nothing is stored either way.
	const onDesktop = !responsive || breakpoint === PRESET_BREAKPOINTS[0];
	const fieldDefault = field.defaultValue ?? null;
	const inheritedAbove = onDesktop
		? null
		: resolvePresetBreakpoint(value, PRESET_BREAKPOINTS[PRESET_BREAKPOINTS.indexOf(breakpoint) - 1]);
	const inheritsFromBreakpoint = inheritedAbove !== null && inheritedAbove !== '';

	// An inherited value is shown, not offered. Resolving it to its literal here means the picker can
	// stay exactly the role's scale — the list the token's own screen shows — while a value outside that
	// scale (a semantic alias the preset happens to use) still reads as the size in effect, labelled
	// `Custom`. Exempting it from the narrowing instead would put a row in the list that the screen it
	// mirrors does not have.
	const everyToken = pickableTokensForType(field.tokenType);
	const asLiteral = (slot) =>
		typeof slot === 'string' ? (everyToken.find((token) => token.id === slot)?.value ?? slot) : slot;

	const shownDefault = inheritsFromBreakpoint ? mapSlots(inheritedAbove, asLiteral) : fieldDefault;

	// The unit falls back the same way the value does. With nothing stored there is no unit to read, and
	// defaulting to `units[0]` made the Custom tab open on `px` while the field beside it displayed the
	// default's own `em` — one value described two different ways.
	const stored = unitInPlay(atBreakpoint, unitInPlay(shownDefault, units[0]));

	// A unit the user picked before typing a number has nowhere to persist — no slot carries it yet
	// — so it is held here until a value exists to attach it to. Keyed per breakpoint for the same
	// reason `unlinked` below is: a pending unit picked on one breakpoint must not leak into another
	// that never chose it, which is what keeps the breakpoints independent.
	const [pendingUnit, setPendingUnit] = useState({});
	const unit = pendingUnit[breakpoint] ?? stored;
	const bounds = boundsForUnit(unit, field);

	// Which breakpoints the user has opened up into slots. Held here rather than inferred from the
	// stored shape, because a breakpoint that inherits stores nothing to infer from: unlinking there
	// produces four empty slots, and an override that sets nothing is not written at all. Tracking the
	// choice per breakpoint is also what keeps the breakpoints independent — tablet can be edited as
	// four corners while mobile is still a single value.
	const [unlinked, setUnlinked] = useState({});
	const storedIsList = isSlotList(atBreakpoint);
	const linked = storedIsList ? false : !unlinked[breakpoint];

	const toggleLink = () => {
		setUnlinked((current) => ({ ...current, [breakpoint]: linked }));

		// Relinking keeps the first slot, matching the control's own rule; there is nothing to fold
		// when the breakpoint never held a list.
		if (!linked && storedIsList) {
			onChange(write(readSlot(atBreakpoint, 0)));
		}
	};

	return (
		<BoxControl
			value={mapSlots(atBreakpoint, toControlValue)}
			onChange={(next) => !field.readOnly && onChange(write(mapSlots(next, (slot) => toStoredValue(slot, unit))))}
			label={field.label}
			// The inherited value's token has to be exempt from the narrowing too, not just this
			// breakpoint's own. A breakpoint that inherits binds nothing itself, so without this the
			// semantic it falls back to is filtered out of the pool and the field, finding no entry for
			// it, shows nothing at all instead of the value actually in effect.
			tokens={pickableTokensForType(field.tokenType, field.role, boundTokenIds(atBreakpoint)).map((token) => ({
				...token,
				alias: `{${token.id}}`,
			}))}
			// The two kinds of default are still shaped differently, which is why `shownDefault` resolves
			// them separately above instead of passing either straight through: a value inherited from
			// another breakpoint is stored the way this app stores values, so it is read through `asLiteral`
			// to match what the picker offers, while a field default is already a literal carrying its own
			// unit (`0.4em`) and needs no conversion at all.
			defaultValue={shownDefault ?? undefined}
			inherited={inheritsFromBreakpoint}
			unit={unit}
			units={units}
			onUnit={(next) => {
				setPendingUnit((current) => ({ ...current, [breakpoint]: next }));

				// Retype whatever is already set, so switching unit moves every literal slot at
				// once rather than leaving a mix behind the single shared switcher.
				onChange(
					write(
						mapSlots(atBreakpoint, (slot) => {
							const parsed = parseCssLength(slot);

							return parsed ? `${parsed.size}${next}` : slot;
						})
					)
				);
			}}
			role={slots}
			isLinked={linked}
			onToggleLink={toggleLink}
			// Passed explicitly because supplying `onToggleLink` makes the control's link state
			// caller-owned, which would otherwise turn collapsing off — and this app does collapse: a
			// uniform slot list round-trips as a scalar, the shape a preset uses for "every slot".
			collapse
			breakpoints={responsive ? PRESET_BREAKPOINTS : null}
			breakpoint={breakpoint}
			onBreakpointChange={setBreakpoint}
			disabled={field.readOnly}
			min={bounds.min}
			max={bounds.max}
			step={bounds.step}
		/>
	);
}
