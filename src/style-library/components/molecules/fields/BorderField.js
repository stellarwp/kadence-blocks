/**
 * The Style Library's adapter for `src/token-controls`' `BorderControl`.
 *
 * Mirrors `BoxTokenField.js` in spirit — bridges the preset's stored shape to the control's plain
 * value contract, owns the breakpoint switcher, and sources `tokens` via `pickableTokensForType` —
 * but the shape being bridged is different, and split across three sibling stored keys rather than
 * one.
 *
 * PHP declares `button-border-width`/`-style`/`-color` as three separate bound properties (see
 * `declarations.php`), so the preset's `tokens` map stores three independent flat keys —
 * `${field.path}-width` / `-style` / `-color` — not one composite value at `field.path` itself.
 * `BorderControl`'s own value contract already treats width and style as independent axes (each a
 * scalar or a `[top, right, bottom, left]` slot list) and color as always a single value, so this
 * split is a closer fit for the control than a shared composite key ever was — width and style no
 * longer have to share a shape just because they shared a stored key. Because `SettingsForm` only
 * ever binds one `field.path` to one `value`/`onChange` pair, this adapter reads `values`/writes via
 * `onValueChange(path, next)` directly — the two additional props `SettingsForm` hands every field
 * for exactly this case (see its own docblock).
 *
 * Border width has no unit switcher on `BorderControl`'s `Custom` tab — the control passes no
 * `unit`/`units`/`onUnit` to the `TokenSelector` it renders for width, unlike radius/spacing's
 * `BoxControl` — so this adapter fixes the unit at `px` (the only unit the `border-width` scale's
 * tokens use) rather than tracking one the way `BoxTokenField` tracks radius/spacing's unit.
 *
 * Color's own sub-field is the shared `ColorSwatchControl` — `renderColor` wraps it here the same
 * way the block editor's own `BorderControl` host does, so a border's color opens the same grouped
 * Style Library / Custom popover `ColorSelectField` opens, bridged through the
 * `toControlValue`/`toStoredValue`/`resolveLiteral` pair `helpers/color-values.js` shares with that
 * field, since this host stores a bare token id, not a bracket alias. Color's own path carries no
 * breakpoint envelope — a border color has never varied by breakpoint here, so its path always
 * stores the plain value.
 *
 * Link state is owned here, controlled, exactly the way `BoxTokenField` owns it for radius/spacing
 * — not derived from whether the stored value happens to be a scalar or a four-slot list.
 * `BorderControl` left uncontrolled derives `linked` from the data's shape, and this adapter's own
 * axis writes never collapse a four-slot write back to a scalar; wired together uncontrolled,
 * unlinking would expand to four identical slots and re-derive as linked before the user could edit
 * a single side — the toggle would visually snap back on every click. Tracking "the user chose the
 * unlinked view" in its own state (per breakpoint, like `BoxTokenField`'s `unlinked`) and passing it
 * down as `isLinked`/`onToggleLink` decouples that choice from what the data looks like, which is
 * what lets an unlinked, still-uniform value stay unlinked until the user actually diverges a side.
 */

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getValueAtPath } from '../../../helpers/settings-schema';
import { pickableTokensForType } from '../../../helpers/tokens';
import {
	PRESET_BREAKPOINTS,
	readPresetBreakpoint,
	resolvePresetBreakpoint,
	writePresetBreakpoint,
} from '../../../../token-controls/helpers/preset-envelope';
import { BorderControl } from '../../../../token-controls/controls/BorderControl';
import { boundTokenIds, isSemanticSlot, semanticDefaultOf, withoutSemanticSlots } from './BoxTokenField';
import { useBreakpoint } from '../../../../token-controls/context/breakpoint';
import { parseCssLength } from '../../../../token-controls/helpers/parse-css-length';
import { isSlotList, readSlot } from '../../../../token-controls/helpers/value-shapes';
import { ColorSwatchControl, borderColorLabel } from '../../../../token-controls';
import { resolveLiteral, toControlValue, toStoredValue } from '../../../helpers/color-values';
import { useActivePaletteGroups } from '../../../hooks/use-active-palette-groups';

/**
 * The only unit border width is stored in — the `border-width` scale's tokens (`1px`, `2px`,
 * `4px`) are all pixels, and `BorderControl` offers no switcher to pick another.
 *
 * @since TBD
 */
const WIDTH_UNIT = 'px';

/**
 * Convert one stored width into what the control expects: an alias, a bare number, or ''.
 *
 * @param {*} stored The stored width.
 *
 * @since TBD
 *
 * @return {*} The control-shaped width.
 */
export function toControlWidth(stored) {
	if (typeof stored !== 'string' || stored === '') {
		return '';
	}

	if (stored.startsWith('primitive.') || stored.startsWith('semantic.')) {
		return `{${stored}}`;
	}

	const parsed = parseCssLength(stored);

	return parsed ? parsed.size : stored;
}

/**
 * Convert one control width back into what a preset stores.
 *
 * @param {*} next The control-shaped width: an alias, a number, or ''.
 *
 * @since TBD
 *
 * @return {*} The stored width, in `px`.
 */
export function toStoredWidth(next) {
	if (next === '' || next === undefined || next === null) {
		return '';
	}

	if (typeof next === 'string' && next.startsWith('{') && next.endsWith('}')) {
		return next.slice(1, -1);
	}

	// The `None` token resolves to a bare `'0'`; appending `px` would rewrite it on a no-op round trip.
	if (Number(next) === 0) {
		return '0';
	}

	return `${next}${WIDTH_UNIT}`;
}

/**
 * Convert a stored width axis — a scalar side, or a four-slot list of them — into what the control
 * expects.
 *
 * @param {*} stored The stored width axis.
 *
 * @since TBD
 *
 * @return {*} The control-shaped width axis.
 */
export function toControlWidthAxis(stored) {
	return isSlotList(stored) ? stored.map(toControlWidth) : toControlWidth(stored);
}

/**
 * Convert the control's width axis back into what the width path stores.
 *
 * @param {*} next The control-shaped width axis.
 *
 * @since TBD
 *
 * @return {*} The stored width axis.
 */
export function toStoredWidthAxis(next) {
	return isSlotList(next) ? next.map(toStoredWidth) : toStoredWidth(next);
}

/**
 * Convert a stored style axis — a scalar side, or a four-slot list of them — into what the control
 * expects. Style needs no other conversion: the stored keyword and the control's keyword are the
 * same string, only the unset default (`'none'`) needs filling in.
 *
 * @param {*} stored The stored style axis.
 *
 * @since TBD
 *
 * @return {*} The control-shaped style axis.
 */
export function toControlStyleAxis(stored) {
	return isSlotList(stored) ? stored.map((style) => style || 'none') : stored || 'none';
}

/**
 * Convert the control's style axis back into what the style path stores.
 *
 * @param {*} next The control-shaped style axis.
 *
 * @since TBD
 *
 * @return {*} The stored style axis.
 */
export function toStoredStyleAxis(next) {
	return isSlotList(next) ? next.map((style) => style || 'none') : next || 'none';
}

/**
 * The pickable-token list a border-width field offers: the `border-width` role's narrowed pool
 * (plus the shared fixed "None" entry, prepended by `pickableTokensForType()` itself). Pulled out
 * as its own function, mirroring `BoxTokenField`'s `tokensForField`, so it can be unit tested
 * without rendering the component — `BorderField` uses hooks, so it cannot be called directly as a
 * plain function the way a hook-free component can.
 *
 * A `fixed` entry (the shared "None" sentinel `pickableTokensForType()` already prepended) is
 * excluded from the re-bracketing below for the same reason `tokensForField` excludes it: its
 * `alias` is the bare number `0`, and wrapping it in `{${token.id}}` would silently turn it into
 * the string `"{ss-none-border-width}"`, which `toStoredWidth` then unwraps to the garbage id
 * `"ss-none-border-width"` instead of the bare `0` the write path expects.
 *
 * @param {*} atBreakpoint The resolved width value at the active breakpoint, used to exempt any
 *                          already-bound token from the primitive narrowing.
 *
 * @since TBD
 *
 * @return {Array} The pickable-token list.
 */
export function widthTokensForField(atBreakpoint) {
	return pickableTokensForType('dimension', 'border-width', boundTokenIds(atBreakpoint)).map((token) =>
		token.fixed ? token : { ...token, alias: `{${token.id}}` }
	);
}

/**
 * Render a border field from a settings schema entry.
 *
 * @param {Object}   props                    The component props.
 * @param {Object}   props.field              The field definition.
 * @param {string}   props.field.path         The base dot path; the width/style/color axes are
 *                                             stored at `${path}-width` / `-style` / `-color`.
 * @param {?string}  [props.field.label]      The control's label.
 * @param {boolean}  [props.field.readOnly]   Whether the control is non-interactive.
 * @param {boolean}  [props.field.responsive] Whether the field offers a breakpoint switcher.
 * @param {*}        [props.field.defaultValue] What the width axis falls back to at desktop, shown as
 *                                             a muted "Default" whenever the draft carries no width
 *                                             there. Tablet and Mobile show the breakpoint above
 *                                             instead, tagged "Inherited".
 * @param {Object}   props.values             The full draft values, read by dot path.
 * @param {?Object}  [props.originalValues]   The preset's own stored values, unaffected by the
 *                                             draft — read by the same dot paths as `values`. Never
 *                                             shown as bound: the stored width only stands in, muted,
 *                                             for a missing `field.defaultValue`, so a reset width on
 *                                             a schema with no declared default still reads as the
 *                                             value in effect.
 * @param {Function} props.onValueChange      Called with `(path, next)` for any of the three axes.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function BorderField({ field, values, originalValues, onValueChange }) {
	const responsive = field.responsive === true;

	// Shared, not local: this switches every responsive control in the panel at once.
	const [breakpoint, setBreakpoint] = useBreakpoint(PRESET_BREAKPOINTS[0]);

	const groups = useActivePaletteGroups();

	const widthPath = `${field.path}-width`;
	const stylePath = `${field.path}-style`;
	const colorPath = `${field.path}-color`;

	const rawWidth = getValueAtPath(values, widthPath);
	const rawStyle = getValueAtPath(values, stylePath);
	const rawColor = getValueAtPath(values, colorPath);

	const widthAtBreakpoint = responsive ? readPresetBreakpoint(rawWidth, breakpoint) : rawWidth;
	const styleAtBreakpoint = responsive ? readPresetBreakpoint(rawStyle, breakpoint) : rawStyle;

	// A semantic is the block's own default, not a selection, and the pool offers primitives only —
	// left in place it renders as a raw dot-path. Blanked, so the control reads it as unset.
	//
	// The draft is the only value the control ever shows as set. A reset axis reads unset here and
	// falls through to the muted Default/Inherited display below — the preset's previously stored
	// value is never put back in its place, or a Reset would look like it did nothing.
	const shownWidth = withoutSemanticSlots(widthAtBreakpoint);

	// The width an unset breakpoint shows muted, mirroring `BoxTokenField`: Tablet and Mobile inherit
	// from the breakpoint above, tagged "Inherited"; desktop shows the schema's declared default, or,
	// when the schema declares none, the preset's own stored desktop width — what a saved reset resolves
	// back to, so it is honest muted where it would not be bold. A token id in either is resolved to
	// its literal so the picker keeps offering exactly the border-width scale.
	const onDesktop = !responsive || breakpoint === PRESET_BREAKPOINTS[0];
	const inheritedAbove = onDesktop
		? null
		: resolvePresetBreakpoint(rawWidth, PRESET_BREAKPOINTS[PRESET_BREAKPOINTS.indexOf(breakpoint) - 1]);
	const inheritsFromBreakpoint = inheritedAbove !== null && inheritedAbove !== '';

	const everyDimension = pickableTokensForType('dimension');
	const asLiteral = (slot) =>
		typeof slot !== 'string'
			? slot
			: isSemanticSlot(slot)
				? semanticDefaultOf(slot, everyDimension, '')
				: (everyDimension.find((token) => token.id === slot)?.value ?? slot);
	const mapWidthSlots = (axis) => (isSlotList(axis) ? axis.map(asLiteral) : asLiteral(axis));

	const storedWidth = getValueAtPath(originalValues, widthPath);
	const storedDesktopWidth = responsive ? resolvePresetBreakpoint(storedWidth, PRESET_BREAKPOINTS[0]) : storedWidth;
	const storedDefault =
		storedDesktopWidth === undefined || storedDesktopWidth === null || storedDesktopWidth === ''
			? undefined
			: mapWidthSlots(storedDesktopWidth);

	const shownDefault = inheritsFromBreakpoint ? mapWidthSlots(inheritedAbove) : (field.defaultValue ?? storedDefault);

	const writeWidth = (next) =>
		onValueChange(widthPath, responsive ? writePresetBreakpoint(rawWidth, breakpoint, next) : next);
	const writeStyle = (next) =>
		onValueChange(stylePath, responsive ? writePresetBreakpoint(rawStyle, breakpoint, next) : next);
	const writeColor = (next) => onValueChange(colorPath, next);

	// The bound token is exempt from the narrowing, or the field renders its raw id, not its label.
	const widthTokens = widthTokensForField(shownWidth);

	// Held rather than inferred from the stored shape — see the module docblock.
	const [unlinked, setUnlinked] = useState({});
	// A list-shaped color forces the unlinked view too, or one swatch would hide four stored colors.
	const storedIsList = isSlotList(shownWidth) || isSlotList(styleAtBreakpoint) || isSlotList(rawColor);
	const linked = storedIsList ? false : !unlinked[breakpoint];

	const toggleLink = () => {
		setUnlinked((current) => ({ ...current, [breakpoint]: linked }));

		// Seeds from what the user can actually see at this breakpoint.
		if (!linked && storedIsList) {
			writeWidth(readSlot(shownWidth, 0));
			writeStyle(readSlot(styleAtBreakpoint, 0));
			writeColor(readSlot(rawColor, 0));
		}
	};

	return (
		<BorderControl
			value={{
				width: toControlWidthAxis(shownWidth),
				style: toControlStyleAxis(styleAtBreakpoint),
				color: rawColor ?? '',
			}}
			onChange={(next) => {
				if (field.readOnly) {
					return;
				}

				writeWidth(toStoredWidthAxis(next.width));
				writeStyle(toStoredStyleAxis(next.style));
				writeColor(next.color ?? '');
			}}
			label={field.label}
			widthTokens={widthTokens}
			defaultValue={shownDefault}
			inherited={inheritsFromBreakpoint}
			renderColor={({ value: color, onChange: onColorChange, label: side }) => (
				<ColorSwatchControl
					// `side` is the row's bare side name ("top", "right", …), or `null` while linked. Each
					// row gets a distinct accessible name so unlinked mode's four swatches — which carry no
					// visible text at all — do not read as four copies of the same field.
					label={borderColorLabel(side)}
					// This host stores a BARE token id, never a bracket alias, so the value is bridged in
					// both directions with the same pair `ColorSelectField` already uses.
					value={toControlValue(color)}
					groups={groups}
					onPick={(alias) => onColorChange(toStoredValue(alias))}
					onCustom={(literal) => onColorChange(literal)}
					onClear={() => onColorChange('')}
					resolveLiteral={resolveLiteral}
					disabled={field.readOnly}
				/>
			)}
			breakpoints={responsive ? PRESET_BREAKPOINTS : null}
			breakpoint={breakpoint}
			onBreakpointChange={setBreakpoint}
			isLinked={linked}
			onToggleLink={toggleLink}
			disabled={field.readOnly}
		/>
	);
}
