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
import { isUnsetPresetValue } from '../../../helpers/presets';
import {
	PRESET_BREAKPOINTS,
	readPresetBreakpoint,
	resolvePresetBreakpoint,
	writePresetBreakpoint,
} from '../../../../token-controls/helpers/preset-envelope';
import { BorderControl } from '../../../../token-controls/controls/BorderControl';
import { boundTokenIds, withoutSemanticSlots } from './BoxTokenField';
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
 * @param {*}        [props.field.defaultValue] What the width axis falls back to, shown as a muted
 *                                             "Default", when NEITHER the draft nor the preset's own
 *                                             stored value carries anything — passed straight through
 *                                             to `BorderControl`. A reset width whose preset already
 *                                             has its own value shows that instead, as if bound; see
 *                                             `originalValues` below.
 * @param {Object}   props.values             The full draft values, read by dot path.
 * @param {?Object}  [props.originalValues]   The preset's own stored values, unaffected by the
 *                                             draft — read by the same dot paths as `values`, so a
 *                                             reset axis reads as what saving the reset actually
 *                                             resolves to instead of a generic literal fallback.
 *                                             Its `overridden` map gates the substitution to axes the
 *                                             CURRENT preset genuinely has its own stored value for —
 *                                             an axis only inherited from the baseline's own definition
 *                                             of the same preset slug reads as muted "Default" instead.
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

	const originalWidth = getValueAtPath(originalValues, widthPath);
	const originalStyle = getValueAtPath(originalValues, stylePath);
	const originalColor = getValueAtPath(originalValues, colorPath);

	const widthAtBreakpoint = responsive ? readPresetBreakpoint(rawWidth, breakpoint) : rawWidth;
	const styleAtBreakpoint = responsive ? readPresetBreakpoint(rawStyle, breakpoint) : rawStyle;
	// Resolved, not read — see `BoxTokenField`: a desktop-only stored value still resolves at Tablet.
	const originalWidthAtBreakpoint = responsive ? resolvePresetBreakpoint(originalWidth, breakpoint) : originalWidth;
	const originalStyleAtBreakpoint = responsive ? resolvePresetBreakpoint(originalStyle, breakpoint) : originalStyle;

	// A semantic is the block's own default, not a selection, and the pool offers primitives only —
	// left in place it renders as a raw dot-path. Blanked before the effective read below.
	const shownWidth = withoutSemanticSlots(widthAtBreakpoint);

	const isWidthOverridden = originalValues?.overridden?.[widthPath.replace(/^tokens\./, '')] === true;
	const isStyleOverridden = originalValues?.overridden?.[stylePath.replace(/^tokens\./, '')] === true;
	const isColorOverridden = originalValues?.overridden?.[colorPath.replace(/^tokens\./, '')] === true;

	// Display only — every `write*` below targets the raw draft, so a reset stays reset.
	const effectiveWidth = !isUnsetPresetValue(shownWidth)
		? shownWidth
		: isWidthOverridden && !isUnsetPresetValue(originalWidthAtBreakpoint)
			? originalWidthAtBreakpoint
			: shownWidth;
	const effectiveStyle = !isUnsetPresetValue(styleAtBreakpoint)
		? styleAtBreakpoint
		: isStyleOverridden && !isUnsetPresetValue(originalStyleAtBreakpoint)
			? originalStyleAtBreakpoint
			: styleAtBreakpoint;
	const effectiveColor = !isUnsetPresetValue(rawColor)
		? rawColor
		: isColorOverridden && !isUnsetPresetValue(originalColor)
			? originalColor
			: rawColor;

	const writeWidth = (next) =>
		onValueChange(widthPath, responsive ? writePresetBreakpoint(rawWidth, breakpoint, next) : next);
	const writeStyle = (next) =>
		onValueChange(stylePath, responsive ? writePresetBreakpoint(rawStyle, breakpoint, next) : next);
	const writeColor = (next) => onValueChange(colorPath, next);

	// The bound token is exempt from the narrowing, or the field renders its raw id, not its label.
	const widthTokens = widthTokensForField(effectiveWidth);

	// Held rather than inferred from the stored shape — see the module docblock.
	const [unlinked, setUnlinked] = useState({});
	// A list-shaped color forces the unlinked view too, or one swatch would hide four stored colors.
	const storedIsList = isSlotList(effectiveWidth) || isSlotList(effectiveStyle) || isSlotList(effectiveColor);
	const linked = storedIsList ? false : !unlinked[breakpoint];

	const toggleLink = () => {
		setUnlinked((current) => ({ ...current, [breakpoint]: linked }));

		// Seeds from the effective axes, so relinking keeps what the user can actually see.
		if (!linked && storedIsList) {
			writeWidth(readSlot(effectiveWidth, 0));
			writeStyle(readSlot(effectiveStyle, 0));
			writeColor(readSlot(effectiveColor, 0));
		}
	};

	return (
		<BorderControl
			value={{
				width: toControlWidthAxis(effectiveWidth),
				style: toControlStyleAxis(effectiveStyle),
				color: effectiveColor ?? '',
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
			defaultValue={field.defaultValue}
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
