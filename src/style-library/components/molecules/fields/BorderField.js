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
 * Color is out of this plan's scope (see `BorderControl`'s own docblock): `renderColor` wraps the
 * same `TokenColorSelectField` the Button screen's Color panel already renders for text/background,
 * rather than building or importing anything new. Color's own path carries no breakpoint envelope —
 * a border color has never varied by breakpoint here, so its path always stores the plain value.
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
 * External dependencies
 */
import { upperFirst } from 'lodash';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getValueAtPath } from '../../../helpers/settings-schema';
import { pickableTokensForType } from '../../../helpers/tokens';
import {
	PRESET_BREAKPOINTS,
	readPresetBreakpoint,
	writePresetBreakpoint,
} from '../../../../token-controls/helpers/preset-envelope';
import { BorderControl } from '../../../../token-controls/controls/BorderControl';
import { boundTokenIds } from './BoxTokenField';
import { useBreakpoint } from '../../../../token-controls/context/breakpoint';
import { parseCssLength } from '../../../../token-controls/helpers/parse-css-length';
import { isSlotList, readSlot } from '../../../../token-controls/helpers/value-shapes';
import { TokenColorSelectField } from './TokenColorSelectField';

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

	// Zero stays unitless for the same reason `BoxTokenField`'s `toStoredValue` keeps it unitless: the
	// `None` token resolves to a bare `'0'`, so appending `px` here would rewrite a clean value on a
	// no-op round trip.
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
 * Render a border field from a settings schema entry.
 *
 * @param {Object}   props                    The component props.
 * @param {Object}   props.field              The field definition.
 * @param {string}   props.field.path         The base dot path; the width/style/color axes are
 *                                             stored at `${path}-width` / `-style` / `-color`.
 * @param {?string}  [props.field.label]      The control's label.
 * @param {boolean}  [props.field.readOnly]   Whether the control is non-interactive.
 * @param {boolean}  [props.field.responsive] Whether the field offers a breakpoint switcher.
 * @param {Object}   props.values             The full draft values, read by dot path.
 * @param {Function} props.onValueChange      Called with `(path, next)` for any of the three axes.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function BorderField({ field, values, onValueChange }) {
	const responsive = field.responsive === true;

	// Shared, not local: switching to Tablet here switches every other responsive control in the panel
	// with it, matching `BoxTokenField`.
	const [breakpoint, setBreakpoint] = useBreakpoint(PRESET_BREAKPOINTS[0]);

	const widthPath = `${field.path}-width`;
	const stylePath = `${field.path}-style`;
	const colorPath = `${field.path}-color`;

	const rawWidth = getValueAtPath(values, widthPath);
	const rawStyle = getValueAtPath(values, stylePath);
	const rawColor = getValueAtPath(values, colorPath);

	const widthAtBreakpoint = responsive ? readPresetBreakpoint(rawWidth, breakpoint) : rawWidth;
	const styleAtBreakpoint = responsive ? readPresetBreakpoint(rawStyle, breakpoint) : rawStyle;

	const writeWidth = (next) =>
		onValueChange(widthPath, responsive ? writePresetBreakpoint(rawWidth, breakpoint, next) : next);
	const writeStyle = (next) =>
		onValueChange(stylePath, responsive ? writePresetBreakpoint(rawStyle, breakpoint, next) : next);
	const writeColor = (next) => onValueChange(colorPath, next);

	// The bound width token(s) are exempt from the primitive narrowing, the same way `BoxTokenField`
	// exempts a box control's bound corners: without this, the semantic `border-width` token this
	// role's primitives coexist with is filtered out of the pool whenever it is the one actually
	// bound, and the field — finding no matching entry — renders the raw id instead of the token's
	// label. Width is per-slot (a scalar or a four-slot list), which is exactly the shape
	// `boundTokenIds` already handles.
	const widthTokens = pickableTokensForType('dimension', 'border-width', boundTokenIds(widthAtBreakpoint)).map(
		(token) => ({
			...token,
			alias: `{${token.id}}`,
		})
	);

	// Which breakpoints the user has opened up into per-side editing. Held here rather than inferred
	// from the stored shape — see the module docblock — and per breakpoint for the same reason
	// `BoxTokenField`'s `unlinked` is: a choice made on one breakpoint must not leak into another that
	// never made it, keeping the breakpoints independent.
	const [unlinked, setUnlinked] = useState({});
	// `color` can now diverge per side too (`BorderControl` writes it through the same per-slot axis
	// width/style already use), so a list-shaped color has to force the unlinked view exactly like a
	// list-shaped width/style does — otherwise the panel would show one linked swatch while the
	// stored value still carries four different colors.
	const storedIsList = isSlotList(widthAtBreakpoint) || isSlotList(styleAtBreakpoint) || isSlotList(rawColor);
	const linked = storedIsList ? false : !unlinked[breakpoint];

	const toggleLink = () => {
		setUnlinked((current) => ({ ...current, [breakpoint]: linked }));

		// Relinking keeps each axis's first side, matching `BoxTokenField`'s own relink rule; there is
		// nothing to fold when a breakpoint never actually diverged into a list. `color` folds
		// alongside width/style — `readSlot` on an already-scalar color is a no-op, so this is safe to
		// call unconditionally once any axis diverged.
		if (!linked && storedIsList) {
			writeWidth(readSlot(widthAtBreakpoint, 0));
			writeStyle(readSlot(styleAtBreakpoint, 0));
			writeColor(readSlot(rawColor, 0));
		}
	};

	return (
		<BorderControl
			value={{
				width: toControlWidthAxis(widthAtBreakpoint),
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
			renderColor={({ value: color, onChange: onColorChange, label: sideLabel }) => (
				<TokenColorSelectField
					// `sideLabel` is the row's bare side name ("top", "right", …), or `null` while linked.
					// Capitalized and used as the field's own name so unlinked mode's four swatches — one
					// per row now instead of sharing the linked "Color" name — read as distinct fields to
					// a screen reader, matching `styleLabel`'s per-side naming a few lines up in
					// `BorderControl`.
					field={{
						label: sideLabel ? upperFirst(sideLabel) : __('Color', 'kadence-blocks'),
						readOnly: field.readOnly,
					}}
					value={color}
					onChange={onColorChange}
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
