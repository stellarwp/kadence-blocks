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
import { pickableTokensForType, resolvedTokenValue } from '../../../helpers/tokens';
import { isUnsetPresetValue } from '../../../helpers/presets';
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
import { autoEntry } from '../../../../token-controls';
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
 * Whether a stored slot holds a semantic token id.
 *
 * @param {*} slot The stored slot value.
 *
 * @since TBD
 *
 * @return {boolean} True when the slot is bound to a semantic.
 */
export function isSemanticSlot(slot) {
	return typeof slot === 'string' && slot.startsWith('semantic.');
}

/**
 * Blank out every semantic-bound slot, leaving primitives and literals untouched.
 *
 * A semantic is not a value a site owner picked — it cannot be, because the pickers offer only
 * primitives. It is the role-based default the block already renders, so a slot holding one reads as
 * UNSET, and {@see semanticDefaultOf} supplies its resolved value as what the field falls back to. The
 * effect is the one the design asks for: a semantic's name never appears, and its value is what
 * `Default` means.
 *
 * Blanking rather than resolving to the literal is what makes the field read `Default (0)` instead of
 * a custom `0`: a control given a literal treats it as a value the user typed.
 *
 * @param {*} value The stored scalar or slot list.
 *
 * @since TBD
 *
 * @return {*} The value with semantic slots blanked, in the same shape.
 */
export function withoutSemanticSlots(value) {
	if (isSlotList(value)) {
		return value.map((slot) => (isSemanticSlot(slot) ? '' : slot));
	}

	return isSemanticSlot(value) ? '' : value;
}

/**
 * The resolved literal a value's semantic slots fall back to, in the value's own shape, or null when
 * it binds no semantic at all.
 *
 * A partially-semantic slot list resolves only its semantic corners; the rest read from the field's
 * own declared default, so the default describes every corner the way it did before any of them
 * bound a semantic. Resolving the whole list here rather than returning only the semantic corners is
 * what keeps that promise: the caller takes this in place of the declared default, not alongside it,
 * so a corner left empty here would show as blank rather than as the value actually in effect.
 *
 * A semantic is resolved against the RESOLVED library rather than the pickable pool. A binding may
 * point at a semantic that was never declared as a pickable token — eleven of the shipped bindings
 * do — and searching the pickable list for one of those found nothing, blanking the field instead of
 * showing the value in effect. A semantic that resolves nowhere at all falls back to the field's own
 * declared default, so a gap in the data degrades to the documented default rather than to empty.
 *
 * @param {*}     value        The stored scalar or slot list.
 * @param {Array} everyToken   The full token pool, before any role narrowing, used to resolve an id.
 * @param {*}     fieldDefault The field's own declared default, for the corners that bind no semantic.
 *
 * @since TBD
 *
 * @return {*} The resolved default, in the value's shape, or null when no slot binds a semantic.
 */
export function semanticDefaultOf(value, everyToken, fieldDefault = null) {
	const slots = isSlotList(value) ? value : [value];

	if (!slots.some(isSemanticSlot)) {
		return null;
	}

	const ownDefault = (index) => readSlot(fieldDefault, index) ?? '';
	const resolve = (slot, index) =>
		isSemanticSlot(slot)
			? everyToken.find((token) => token.id === slot)?.value || resolvedTokenValue(slot) || ownDefault(index)
			: ownDefault(index);

	return isSlotList(value) ? value.map(resolve) : resolve(value, 0);
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

	// A sentinel keyword carries its own meaning; appending a unit would corrupt it.
	if (typeof next === 'string' && Number.isNaN(Number(next)) && !parseCssLength(next)) {
		return next;
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
 * Every PRIMITIVE token id a value has bound, so the pool narrowing knows what it must not drop.
 *
 * All of them, not just the first: unlinking gives each corner its own slot, so pointing one at a
 * different primitive from its neighbors is an ordinary thing to do, and exempting only the first
 * would drop the others from the pool and leave those corners rendering their raw dot-path.
 *
 * Semantics are deliberately NOT exempted, which is what keeps their names out of the pickers. A
 * semantic is never something a site owner picked — the pool offers primitives only — so a slot
 * holding one is the block's role-based default rather than a selection. {@see withoutSemanticSlots}
 * blanks it for display and {@see semanticDefaultOf} surfaces its value as the field's default, so
 * nothing renders a raw dot-path for want of a pool entry.
 *
 * @param {*} value The stored scalar or slot list.
 *
 * @since TBD
 *
 * @return {Array<string>} The bound primitive token ids, empty when nothing is bound.
 */
export function boundTokenIds(value) {
	const slots = isSlotList(value) ? value : [value];

	return slots.filter((slot) => typeof slot === 'string' && slot.startsWith('primitive.'));
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
 * The pickable-token list a box-token field offers: its role's narrowed, primitive-preferred pool
 * (plus the shared fixed "None" entry, prepended by `pickableTokensForType()` itself), with Margin's
 * "Auto" appended when this is a margin field. Pulled out as its own function so it can be unit
 * tested without rendering the component — `BoxTokenField` uses hooks, so it cannot be called
 * directly as a plain function the way a hook-free component can.
 *
 * Auto is Margin-only; nothing in `field` besides its own path distinguishes a margin field from a
 * padding field (both declare identical `tokenType`/`role`), so the decision is made here rather
 * than inside the shared `pickableTokensForType()` narrowing, which both fields call identically.
 *
 * A `fixed` entry (the shared "None" sentinel `pickableTokensForType()` already prepended) is
 * excluded from the re-bracketing below: its `alias` is the bare number `0`, and wrapping it in
 * `{${token.id}}` would silently turn it into the string `"{ss-none-spacing}"` — a bracket-wrapped
 * id, not the bare `0` the box-control write path expects for a fixed sentinel.
 *
 * @param {Object} field        The field definition (see `BoxTokenField`'s own JSDoc).
 * @param {*}      atBreakpoint The resolved value at the active breakpoint, used to exempt any
 *                               already-bound token from the primitive narrowing.
 *
 * @since TBD
 *
 * @return {Array} The pickable-token list.
 */
export function tokensForField(field, atBreakpoint) {
	const scoped = pickableTokensForType(field.tokenType, field.role, boundTokenIds(atBreakpoint)).map((token) =>
		token.fixed ? token : { ...token, alias: `{${token.id}}` }
	);

	return field.path?.endsWith('margin') ? [...scoped, autoEntry()] : scoped;
}

/**
 * Render a box-shaped token field from a settings schema entry.
 *
 * @param {Object}   props                  The component props.
 * @param {Object}   props.field            The field definition.
 * @param {string}   props.field.path       The field's dot path; a path ending in `margin` gets an
 *                                          "Auto" entry in its token list.
 * @param {string}   props.field.tokenType  The DTCG `$type` the pickable pool is filtered to.
 * @param {?string}  [props.field.role]     Narrows the pool further to one token role.
 * @param {?string}  [props.field.label]    The control's label.
 * @param {boolean}  [props.field.readOnly] Whether the control is non-interactive.
 * @param {boolean}  [props.field.responsive] Whether the field offers a breakpoint switcher.
 * @param {*}        [props.field.defaultValue] What the block itself renders when nothing at all is
 *                                              set, shown muted as a last-resort fallback — only
 *                                              reached when the preset has no value of its own for
 *                                              this property either (see `originalValue` below).
 * @param {?Array}   [props.field.units]    Units the Custom tab offers.
 * @param {?number}  [props.field.min]      Lowest allowed number on the Custom tab.
 * @param {?number}  [props.field.max]      Highest allowed number; the slider needs one.
 * @param {?number}  [props.field.step]     Custom tab increment.
 * @param {*}        props.value            The stored value: a scalar or a four-slot list.
 * @param {*}        [props.originalValue]  The preset's own currently-stored value for this
 *                                          property, unaffected by the draft — shown, as if bound,
 *                                          whenever `value` is reset/unset but this is not, so the
 *                                          field reads as what saving the reset actually resolves to.
 * @param {Function} props.onChange         Called with the next stored value.
 * @param {string}   [props.slots]          'corners' or 'sides' — the control's geometry.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function BoxTokenField({ field, value, originalValue, onChange, slots = 'sides' }) {
	const units = field.units ?? ['px', 'em', 'rem', '%'];
	const responsive = field.responsive === true;

	// Shared, not local: switching to Tablet here switches every other responsive control in the panel
	// with it, matching the block editor.
	const [breakpoint, setBreakpoint] = useBreakpoint(PRESET_BREAKPOINTS[0]);

	// The breakpoint unwrap wraps the slot conversion rather than sitting inside it: the envelope
	// holds one whole value per breakpoint — scalar or slot list — so a breakpoint is resolved first
	// and the four slots are read out of whatever that breakpoint holds.
	const atBreakpoint = responsive ? readPresetBreakpoint(value, breakpoint) : value;
	// Resolved, not read: a preset that stores only a desktop value still resolves to it at Tablet and
	// Mobile, so those breakpoints must fall back the same way a reset actually would.
	const originalAtBreakpoint = responsive ? resolvePresetBreakpoint(originalValue, breakpoint) : originalValue;
	const write = (next) => (responsive ? writePresetBreakpoint(value, breakpoint, next) : next);

	// A semantic's name never shows; its resolved value becomes the field's Default. It outranks
	// `field.defaultValue`, which is a config literal rather than what the active library resolves.
	const shown = withoutSemanticSlots(atBreakpoint);

	// What the field actually shows: the draft when it carries a real edit, else the preset's own
	// currently-stored value (unaffected by this draft) when THAT is real, else genuinely empty. A
	// reset field must not read as a blank, generic "Default" when the preset it belongs to already
	// has its own bound value for this property — that value is exactly what saving the reset (an
	// omitted property) resolves back to, so showing it immediately is showing the truth, not a
	// preview. Read-path only: `write()` above still always targets the true draft `value`, so a
	// reset that is never followed by another edit stays reset.
	const effectiveAtBreakpoint = !isUnsetPresetValue(shown)
		? shown
		: !isUnsetPresetValue(originalAtBreakpoint)
			? originalAtBreakpoint
			: shown;

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

	const semanticDefault = semanticDefaultOf(atBreakpoint, everyToken, fieldDefault);

	const shownDefault = inheritsFromBreakpoint
		? mapSlots(inheritedAbove, asLiteral)
		: (semanticDefault ?? fieldDefault);

	// The unit falls back the same way the value does. With nothing stored there is no unit to read, and
	// defaulting to `units[0]` made the Custom tab open on `px` while the field beside it displayed the
	// default's own `em` — one value described two different ways.
	const stored = unitInPlay(effectiveAtBreakpoint, unitInPlay(shownDefault, units[0]));

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
	const storedIsList = isSlotList(effectiveAtBreakpoint);
	const linked = storedIsList ? false : !unlinked[breakpoint];

	const toggleLink = () => {
		setUnlinked((current) => ({ ...current, [breakpoint]: linked }));

		// Relinking keeps the first slot, matching the control's own rule; there is nothing to fold
		// when the breakpoint never held a list. Reads from the effective (draft-or-preset) value, so
		// relinking a field that is showing the preset's own value seeds from what is actually shown.
		if (!linked && storedIsList) {
			onChange(write(readSlot(effectiveAtBreakpoint, 0)));
		}
	};

	return (
		<BoxControl
			value={mapSlots(effectiveAtBreakpoint, toControlValue)}
			onChange={(next) => !field.readOnly && onChange(write(mapSlots(next, (slot) => toStoredValue(slot, unit))))}
			label={field.label}
			// The inherited value's token has to be exempt from the narrowing too, not just this
			// breakpoint's own. A breakpoint that inherits binds nothing itself, so without this the
			// semantic it falls back to is filtered out of the pool and the field, finding no entry for
			// it, shows nothing at all instead of the value actually in effect.
			tokens={tokensForField(field, effectiveAtBreakpoint)}
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
						mapSlots(effectiveAtBreakpoint, (slot) => {
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
