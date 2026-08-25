/**
 * The block editor's adapter for `src/token-controls`' `BorderControl`.
 *
 * The Style Library's `BorderField` bridges a different storage shape; this one bridges the
 * editor's own, the same role `EditorBoxControl` plays for radius:
 *
 * - **breakpoints are sibling attributes** — `border`, `tabletBorder`, `mobileBorder` (or whatever
 *   the block calls its own trio) — passed in directly rather than pre-resolved by the caller,
 *   since (unlike radius) there is no single scalar per breakpoint to hand over: each breakpoint's
 *   native value is itself a one-element array of a four-side object, and the color inside it has
 *   to be read back out again on every write (see `toNativeBorder` below). Resolving which sibling
 *   is active is this component's job, not the caller's.
 * - **once a side has ever been written, it stays a four-element array**, never collapsed back to a
 *   scalar — `fromNativeBorder` only answers the empty scalar (`''`/`'none'`) for a breakpoint that
 *   has never been saved at all; the moment any side is written, `toNativeBorder` always fills in
 *   all four. So the linked/unlinked view cannot be read off storage the way `BorderControl`'s own
 *   uncontrolled fallback tries to (it only checks "is this an array", not "do the four elements
 *   agree") — this component owns that view as UI state instead, seeded from whether the stored
 *   sides currently agree (`isUniformBorder`) and overridden per breakpoint once the user explicitly
 *   links or unlinks. This mirrors `singlebtn/edit.js`'s own `borderRadiusModeOverride` for radius,
 *   just owned locally: border's `defaultValue` is always one scalar for every side (see its own
 *   docblock below), so there is no per-side preset difference an early "uniform" read could hide
 *   the way an empty radius corner could.
 * - **the unit lives inside the native value itself** (`source.unit`), not a sibling attribute the
 *   way `BoxControl`'s radius keeps `borderRadiusUnit` — so, unlike `EditorBoxControl`, this
 *   component takes no separate `unit`/`units`/`onUnit` props at all.
 *
 * Color editing itself is untouched — this component neither builds nor redesigns a color field, it
 * only wires the caller's EXISTING one back in via `renderColor` (matching `BorderControl`'s own
 * scope boundary; this plan's color-field redesign work is out of scope entirely). `toNativeBorder`
 * still has to fall back to the native value's stored color when `renderColor` writes nothing for a
 * side — see its docblock for why.
 */

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BreakpointProvider } from '../../../token-controls';
import { BorderControl } from '../../../token-controls/controls/BorderControl';
import { readSlot } from '../../../token-controls/helpers/value-shapes';
import { isTokenAlias } from '../../../token-controls/helpers/token-summary';

const SIDES = ['top', 'right', 'bottom', 'left'];

/**
 * The control's breakpoint key for an editor device name.
 *
 * The editor names its devices `Desktop`/`Tablet`/`Mobile`; the shared control speaks the lowercase
 * keys the token vocabulary uses. Mapping here keeps that spelling difference out of both, matching
 * `EditorBoxControl`'s own table exactly.
 *
 * @since TBD
 *
 * @type {Object<string, string>}
 */
const BREAKPOINT_FOR_DEVICE = {
	Desktop: 'desktop',
	Tablet: 'tablet',
	Mobile: 'mobile',
};

/**
 * The editor device name for a control breakpoint key — the inverse of `BREAKPOINT_FOR_DEVICE`.
 *
 * @param {string} breakpoint The control's breakpoint key (`desktop`/`tablet`/`mobile`).
 *
 * @since TBD
 *
 * @return {string} The matching editor device name, defaulting to `Desktop`.
 */
function deviceForBreakpoint(breakpoint) {
	return Object.keys(BREAKPOINT_FOR_DEVICE).find((name) => BREAKPOINT_FOR_DEVICE[name] === breakpoint) ?? 'Desktop';
}

/**
 * Whether a native border value shows the same color, style, and width on every side — the state a
 * linked view can honestly represent. A breakpoint that has never been written reads as uniform too:
 * there is nothing stored to differ side to side, and (unlike radius corners) a border preset only
 * ever sets one width for every side, so there is no per-side preset difference an early "uniform"
 * read could hide.
 *
 * @param {?Array} native `[{top,right,bottom,left,unit}]` or undefined.
 *
 * @since TBD
 *
 * @return {boolean} Whether every side currently matches.
 */
function isUniformBorder(native) {
	const source = native?.[0];

	if (!source) {
		return true;
	}

	const uniform = (values) => values.every((entry) => entry === values[0]);

	return (
		uniform(SIDES.map((side) => source[side]?.[0] || '')) &&
		uniform(SIDES.map((side) => source[side]?.[1] || 'none')) &&
		uniform(SIDES.map((side) => source[side]?.[2]))
	);
}

/**
 * Convert the native `[{top:[color,style,size],...}]` attribute value to `BorderControl`'s
 * `{ width, style, color }` shape. `size` has no per-side unit in the native shape (one `unit`
 * shared across the whole border) — the converted `width` slot is written as `${size}${unit}` so
 * it round-trips through `BorderControl`'s token-or-literal contract as a plain CSS literal when
 * not a token id.
 *
 * @param {?Array} native `[{top,right,bottom,left,unit}]` or undefined.
 *
 * @since TBD
 *
 * @return {Object} `{ width, style, color }`.
 */
function fromNativeBorder(native) {
	const source = native?.[0];

	if (!source) {
		return { width: '', style: 'none', color: '' };
	}

	const unit = source.unit || 'px';

	return {
		width: SIDES.map((side) => {
			const [, , size] = source[side] || [];

			if (size === '' || size === undefined || size === null) {
				return '';
			}

			// A token alias is already a full id string — never a bare number — so it never gets a
			// unit suffix appended; only a literal numeric width does.
			return isTokenAlias(size) ? size : `${size}${unit}`;
		}),
		style: SIDES.map((side) => source[side]?.[1] || 'none'),
		color: SIDES.map((side) => source[side]?.[0] || ''),
	};
}

/**
 * Split a `BorderControl` width slot (a plain CSS literal like `"2px"`, a token alias like
 * `"{primitive.dimension.border-width.md}"`, or `""`) into a native `(size, unit)` pair. A literal
 * is split on its trailing unit letters; an alias is stored whole in the size position with `unit`
 * left as the shared border unit unchanged — matching `borderRadius`'s own corner slots
 * (`EditorBoxControl`'s caller in `singlebtn/edit.js` stores an alias directly in a corner, with no
 * unit suffix), so a brace-wrapped alias id in the size slot is the established convention here too.
 * Detected with `isTokenAlias()` (checks for the `{...}` wrapper `TokenSelector.onPick` actually
 * passes), not `isTokenId()` (checks for a bare `primitive.`/`semantic.` id, which this slot never
 * holds — using it here silently treated every alias as a literal and dropped its width to `''`).
 *
 * @param {string} slot The width slot's value.
 * @param {string} unit The border's shared unit.
 *
 * @since TBD
 *
 * @return {string|number} The native size value for this slot.
 */
function toNativeSize(slot, unit) {
	if (slot === '' || slot === undefined) {
		return '';
	}

	if (isTokenAlias(slot)) {
		return slot; // alias — see the confirmation note above.
	}

	const literal = String(slot).endsWith(unit) ? slot.slice(0, -unit.length) : slot;
	const numeric = parseFloat(literal);

	return Number.isNaN(numeric) ? '' : numeric;
}

/**
 * Convert `BorderControl`'s `{ width, style, color }` shape back to the native
 * `[{top,right,bottom,left,unit}]` attribute shape.
 *
 * **Color always comes straight from `value.color`, with no fallback.** `value.color` is whatever
 * `BorderControl` currently holds for color — either untouched (in which case it is exactly what
 * `fromNativeBorder` derived from `previousNative`, since a width/style-only edit merges
 * `{ ...value, ...next }` and leaves `color` alone) or freshly written by the caller's `renderColor`
 * (via `BorderControl`'s own `patch({ color: next })`). Either way `value.color` already carries the
 * correct value to write — a stale `nextColor || existingColor`-style fallback would treat an
 * explicit clear (`''`) the same as "nothing changed" and silently write the old color back,
 * making the border color impossible to clear.
 *
 * @param {Object} value  `{ width, style, color }` from `BorderControl`.
 * @param {string} [unit] The border's shared unit (defaults to `'px'`, matching the native default
 *                        in `ResponsiveBorderControl`'s `deskDefault`).
 *
 * @since TBD
 *
 * @return {Array} `[{top,right,bottom,left,unit}]`.
 */
function toNativeBorder(value, unit = 'px') {
	const sides = SIDES.reduce((acc, side, index) => {
		acc[side] = [
			readSlot(value.color, index),
			readSlot(value.style, index) || 'none',
			toNativeSize(readSlot(value.width, index), unit),
		];
		return acc;
	}, {});

	return [{ ...sides, unit }];
}

/**
 * Render the editor-canvas border control.
 *
 * @param {Object}       props                The component props.
 * @param {?Array}       props.value          Desktop border attribute value.
 * @param {?Array}       props.tabletValue    Tablet border attribute value.
 * @param {?Array}       props.mobileValue    Mobile border attribute value.
 * @param {Function}     props.onChange       Desktop attribute setter.
 * @param {Function}     props.onChangeTablet Tablet attribute setter.
 * @param {Function}     props.onChangeMobile Mobile attribute setter.
 * @param {string}       props.previewDevice  The editor's active device (`Desktop`/`Tablet`/`Mobile`).
 * @param {Function}     props.onDeviceChange Called with the next editor device name.
 * @param {string}       props.label          The control's label.
 * @param {Array}        [props.widthTokens]  Pickable border-width tokens.
 * @param {*}            [props.defaultValue] What the width slot falls back to when unset — the
 *                                            active preset's resolved border width, so a cleared
 *                                            width field shows a muted "Default 2px" instead of
 *                                            rendering empty (which collapses the field to zero
 *                                            height, per its own `TokenSelector`'s summary/fallback
 *                                            logic). One scalar for every side: presets set a single
 *                                            border width, never a per-side default.
 * @param {?Function}    [props.renderColor]  The block's existing color field for `value.color`.
 * @param {?JSX.Element} [props.indicator]    The editor's `TokenIndicator`, passed straight through.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered control.
 */
export function EditorBorderControl({
	value,
	tabletValue,
	mobileValue,
	onChange,
	onChangeTablet,
	onChangeMobile,
	previewDevice,
	onDeviceChange,
	label,
	widthTokens = [],
	defaultValue,
	renderColor,
	indicator = null,
}) {
	const breakpoint = BREAKPOINT_FOR_DEVICE[previewDevice] ?? 'desktop';
	// Named once and passed to both `BreakpointProvider` and the switcher below, so the two staying
	// in agreement is structural rather than a convention two separate lambdas could drift out of —
	// matching `EditorBoxControl`'s own wiring exactly.
	const changeBreakpoint = (next) => onDeviceChange(deviceForBreakpoint(next));

	const nativeForBreakpoint = { desktop: value, tablet: tabletValue, mobile: mobileValue };
	const setterForBreakpoint = { desktop: onChange, tablet: onChangeTablet, mobile: onChangeMobile };

	const activeNative = nativeForBreakpoint[breakpoint];
	const activeSetter = setterForBreakpoint[breakpoint];
	// Follows the active device's own stored unit, falling back to the desktop unit (matching
	// `ResponsiveBorderControl`'s own `mobileUnit`/`tabletUnit` fallback), and finally 'px'.
	const activeUnit = activeNative?.[0]?.unit || value?.[0]?.unit || 'px';

	// Per-breakpoint UI override for the linked view — see this file's own docblock for why storage
	// cannot answer it alone. Keyed by breakpoint so switching devices does not carry one device's
	// explicit choice onto another; resets on remount, matching `singlebtn/edit.js`'s
	// `borderRadiusModeOverride` for radius.
	const [linkOverride, setLinkOverride] = useState({});
	const linked = linkOverride[breakpoint] ?? isUniformBorder(activeNative);

	const toggleLink = () => {
		if (linked) {
			setLinkOverride((current) => ({ ...current, [breakpoint]: false }));
			return;
		}

		// Relinking collapses every side to slot 0's value — "the first side wins" is predictable,
		// matching `BorderControl`'s own uncontrolled relink rule and `BoxControl`'s relink comment.
		const current = fromNativeBorder(activeNative);

		activeSetter(
			toNativeBorder(
				{
					width: readSlot(current.width, 0),
					style: readSlot(current.style, 0),
					color: readSlot(current.color, 0),
				},
				activeUnit
			)
		);
		setLinkOverride((next) => ({ ...next, [breakpoint]: true }));
	};

	return (
		<BreakpointProvider value={breakpoint} onChange={changeBreakpoint}>
			<BorderControl
				label={label}
				value={fromNativeBorder(activeNative)}
				onChange={(next) => activeSetter(toNativeBorder(next, activeUnit))}
				widthTokens={widthTokens}
				defaultValue={defaultValue}
				indicator={indicator}
				breakpoints={Object.values(BREAKPOINT_FOR_DEVICE)}
				breakpoint={breakpoint}
				// The switcher lives in `ControlShell`, driven by this prop directly — it does not read
				// the `BreakpointProvider` context above, so both must map back to a device the same way.
				onBreakpointChange={changeBreakpoint}
				renderColor={renderColor}
				isLinked={linked}
				onToggleLink={toggleLink}
				stacked
			/>
		</BreakpointProvider>
	);
}
