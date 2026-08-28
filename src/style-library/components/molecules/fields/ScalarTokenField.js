/**
 * A responsive, token-aware field for a SCALAR design value — one length, not a four-slot box.
 *
 * The scalar sibling of `BoxTokenField`, and deliberately built the same way: the same responsive
 * envelope, the same breakpoint inheritance, the same picker narrowing, the same stored/control value
 * conversion (reused from that module rather than restated). What it drops is everything that only makes
 * sense for four slots — the link toggle, the per-slot mapping, the slot-list unit sniffing.
 *
 * It exists because `token-select` cannot answer here: that field is a bare picker with nowhere to put a
 * breakpoint switcher, so a property whose block control IS responsive — `kadence/single-icon`'s size,
 * which stores `size`/`tabletSize`/`mobileSize` — could only ever be given one value for every device
 * through it. A preset that cannot say what the block's own control can say is a preset that cannot
 * reproduce the look a site owner built.
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
import { ScalarControl } from '../../../../token-controls/controls/ScalarControl';
import { useBreakpoint } from '../../../../token-controls/context/breakpoint';
import { parseCssLength } from '../../../../token-controls/helpers/parse-css-length';
import { boundTokenIds, semanticDefaultOf, toControlValue, toStoredValue, withoutSemanticSlots } from './BoxTokenField';

/**
 * The unit a stored scalar already carries, so a write does not silently retype it.
 *
 * @param {*}      value    The stored value.
 * @param {string} fallback The unit to assume when nothing carries one yet.
 *
 * @since TBD
 *
 * @return {string} The unit in play.
 */
function unitInPlay(value, fallback) {
	return parseCssLength(value)?.unit || fallback;
}

/**
 * The Custom tab's numeric bounds for the unit in play, so a `rem` field is not offered a 0-200 range
 * meant for pixels. Mirrors `BoxTokenField`'s own rule.
 *
 * @param {string} unit  The unit in play.
 * @param {Object} field The field definition, which may override any bound.
 *
 * @since TBD
 *
 * @return {{min: number, max: number, step: number}} The bounds.
 */
function boundsForUnit(unit, field) {
	const relative = unit === 'em' || unit === 'rem';

	return {
		min: field.min ?? 0,
		max: field.max ?? (relative ? 24 : 200),
		step: field.step ?? (relative ? 0.1 : 1),
	};
}

/**
 * Render a scalar token field.
 *
 * @param {Object}   props                      The component props.
 * @param {Object}   props.field                The field definition.
 * @param {string}   props.field.tokenType      The DTCG `$type` the pickable pool is filtered to.
 * @param {?string}  [props.field.role]         Narrows the pool further to one token role.
 * @param {?string}  [props.field.label]        The control's label.
 * @param {boolean}  [props.field.readOnly]     Whether the control is non-interactive.
 * @param {boolean}  [props.field.responsive]   Whether the field offers a breakpoint switcher.
 * @param {*}        [props.field.defaultValue] What the block renders when the preset sets nothing,
 *                                              shown muted so an unset field is not blank.
 * @param {?Array}   [props.field.units]        Units the Custom tab offers.
 * @param {?number}  [props.field.min]          Lowest allowed number on the Custom tab.
 * @param {?number}  [props.field.max]          Highest allowed number; the slider needs one.
 * @param {?number}  [props.field.step]         Custom tab increment.
 * @param {*}        props.value                The stored value: an alias, a literal, or empty.
 * @param {Function} props.onChange             Called with the next stored value.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function ScalarTokenField({ field, value, onChange }) {
	const units = field.units ?? ['px', 'em', 'rem', '%'];
	const responsive = field.responsive === true;

	// Shared, not local: switching to Tablet here switches every other responsive control in the panel
	// with it, matching the block editor.
	const [breakpoint, setBreakpoint] = useBreakpoint(PRESET_BREAKPOINTS[0]);

	const atBreakpoint = responsive ? readPresetBreakpoint(value, breakpoint) : value;
	const write = (next) => (responsive ? writePresetBreakpoint(value, breakpoint, next) : next);

	// An unset breakpoint shows what is actually in effect rather than reading as empty, and it inherits
	// from the next breakpoint up, not straight from desktop: mobile shows the tablet value whenever
	// tablet is set, because the projected tablet media query also covers mobile widths. Desktop has
	// nothing above it — a preset's base value is the root of that chain, and falls back only to the
	// field's declared default (what the block renders when the preset sets nothing).
	const onDesktop = !responsive || breakpoint === PRESET_BREAKPOINTS[0];
	const inheritedAbove = onDesktop
		? null
		: resolvePresetBreakpoint(value, PRESET_BREAKPOINTS[PRESET_BREAKPOINTS.indexOf(breakpoint) - 1]);
	const inheritsFromBreakpoint = inheritedAbove !== null && inheritedAbove !== '';

	// An inherited value is shown, not offered: resolving it to its literal lets the picker stay exactly
	// the role's scale while a value outside that scale still reads as the size in effect.
	const everyToken = pickableTokensForType(field.tokenType);
	const asLiteral = (stored) =>
		typeof stored === 'string' ? (everyToken.find((token) => token.id === stored)?.value ?? stored) : stored;

	// A semantic-bound value is the block's role-based default, not a selection, so it is blanked for
	// display and its resolved value becomes what this field falls back to — see `withoutSemanticSlots`.
	const shown = withoutSemanticSlots(atBreakpoint);
	const semanticDefault = semanticDefaultOf(atBreakpoint, everyToken);

	const shownDefault = inheritsFromBreakpoint
		? asLiteral(inheritedAbove)
		: (semanticDefault ?? field.defaultValue ?? null);

	// The unit falls back the same way the value does, so the Custom tab never opens on `px` while the
	// field beside it displays the default's own `em`.
	const stored = unitInPlay(shown, unitInPlay(shownDefault, units[0]));

	// A unit picked before a number has nowhere to persist yet, so it is held here until a value exists to
	// attach it to — keyed per breakpoint, so a pending unit picked on one does not leak into another.
	const [pendingUnit, setPendingUnit] = useState({});
	const unit = pendingUnit[breakpoint] ?? stored;
	const bounds = boundsForUnit(unit, field);

	return (
		<ScalarControl
			value={toControlValue(shown)}
			onChange={(next) => !field.readOnly && onChange(write(toStoredValue(next, unit)))}
			label={field.label}
			// Only this breakpoint's own PRIMITIVE bindings are exempt from the narrowing. A semantic is
			// never exempted — it is shown as the default rather than offered as a choice — and an
			// inherited value is resolved to its literal above rather than added to the pool.
			tokens={pickableTokensForType(field.tokenType, field.role, boundTokenIds(shown)).map((token) => ({
				...token,
				alias: `{${token.id}}`,
			}))}
			defaultValue={shownDefault ?? undefined}
			// A field whose tokens resolve to something too long to read in a row opts out of showing
			// values beside their labels. A fluid font size resolves to a whole `clamp()` expression,
			// which overran the row and pushed the label out of view.
			showValue={field.showValue !== false}
			inherited={inheritsFromBreakpoint}
			unit={unit}
			units={units}
			onUnit={(next) => {
				setPendingUnit((current) => ({ ...current, [breakpoint]: next }));

				// Retype a value that already exists; a field with nothing stored has nothing to retype and
				// waits for the pending unit above.
				const parsed = parseCssLength(atBreakpoint);

				if (parsed && parsed.unit) {
					onChange(write(`${parsed.size}${next}`));
				}
			}}
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
