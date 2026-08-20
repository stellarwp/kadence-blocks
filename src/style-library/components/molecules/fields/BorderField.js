/**
 * The Style Library's adapter for `src/token-controls`' `BorderControl`.
 *
 * Mirrors `BoxTokenField.js` in spirit — bridges the preset's stored shape to the control's plain
 * value contract, owns the breakpoint switcher, and sources `tokens` via `pickableTokensForType` —
 * but the shape being bridged is different. `BorderControl`'s value is `{ width, style, color }`,
 * where `width` and `style` are each independently a scalar or a `[top, right, bottom, left]` slot
 * list, and `color` is always a single value — a border is never a different color per side.
 *
 * The preset stores width and style as one composite per side instead of two parallel slot lists: a
 * scalar `{ width, style, color }` when every side matches, or a four-element list of `{ width,
 * style, color }` when they do not. `isUniformSlotList()` decides which on write — the composite
 * counterpart to the `===` collapse `writeSlot()` already does for a plain scalar slot, and the
 * reason that helper exists. `color` is carried in every slot purely so the composite shape is
 * self-contained; it is always identical across slots because `BorderControl` never varies it by
 * side.
 *
 * Border width has no unit switcher on `BorderControl`'s `Custom` tab — the control passes no
 * `unit`/`units`/`onUnit` to the `TokenSelector` it renders for width, unlike radius/spacing's
 * `BoxControl` — so this adapter fixes the unit at `px` (the only unit the `border-width` scale's
 * tokens use) rather than tracking one the way `BoxTokenField` tracks radius/spacing's unit.
 *
 * Color is out of this plan's scope (see `BorderControl`'s own docblock): `renderColor` wraps the
 * same `TokenColorSelectField` the Button screen's Color panel already renders for text/background,
 * rather than building or importing anything new.
 *
 * Link state is owned here, controlled, exactly the way `BoxTokenField` owns it for radius/spacing
 * — not derived from whether the stored value happens to be a scalar or a four-slot list.
 * `BorderControl` left uncontrolled derives `linked` from the data's shape, and this adapter's own
 * `toStoredValue` collapses a uniform four-slot write straight back to a scalar; wired together
 * uncontrolled, unlinking would expand to four identical slots, get collapsed back to a scalar on
 * the very next write, and re-derive as linked before the user could edit a single side — the
 * toggle would visually snap back on every click. Tracking "the user chose the unlinked view" in
 * its own state (per breakpoint, like `BoxTokenField`'s `unlinked`) and passing it down as
 * `isLinked`/`onToggleLink` decouples that choice from what the data looks like, which is what
 * lets an unlinked, still-uniform value stay unlinked until the user actually diverges a side.
 */

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { pickableTokensForType } from '../../../helpers/tokens';
import {
	PRESET_BREAKPOINTS,
	readPresetBreakpoint,
	writePresetBreakpoint,
} from '../../../../token-controls/helpers/preset-envelope';
import { BorderControl } from '../../../../token-controls/controls/BorderControl';
import { useBreakpoint } from '../../../../token-controls/context/breakpoint';
import { parseCssLength } from '../../../../token-controls/helpers/parse-css-length';
import { isSlotList, isUniformSlotList, toSlotList } from '../../../../token-controls/helpers/value-shapes';
import { TokenColorSelectField } from './TokenColorSelectField';

/**
 * The only unit border width is stored in — the `border-width` scale's tokens (`1px`, `2px`,
 * `4px`) are all pixels, and `BorderControl` offers no switcher to pick another.
 *
 * @since TBD
 */
const WIDTH_UNIT = 'px';

/**
 * One side's default shape, used when nothing is stored yet.
 *
 * @since TBD
 */
const DEFAULT_SIDE = { width: '', style: 'none', color: '' };

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
 * Convert a stored border value — one side's composite, or four — into `BorderControl`'s value.
 *
 * @param {*} stored The stored value: a `{width, style, color}` composite, or a four-slot list of
 *                    them.
 *
 * @since TBD
 *
 * @return {{width: *, style: *, color: string}} The control-shaped value.
 */
export function toControlValue(stored) {
	if (isSlotList(stored)) {
		return {
			width: stored.map((side) => toControlWidth(side?.width ?? '')),
			style: stored.map((side) => side?.style || 'none'),
			// Identical in every slot by construction (see the module docblock); the first slot speaks
			// for all of them.
			color: stored[0]?.color ?? '',
		};
	}

	const side = stored && typeof stored === 'object' ? stored : DEFAULT_SIDE;

	return {
		width: toControlWidth(side.width ?? ''),
		style: side.style || 'none',
		color: side.color ?? '',
	};
}

/**
 * Convert `BorderControl`'s next value back into what a preset stores.
 *
 * @param {{width: *, style: *, color: string}} next The control-shaped value.
 *
 * @since TBD
 *
 * @return {*} The stored value: a `{width, style, color}` composite, collapsed to a scalar when
 *             every side ends up identical.
 */
export function toStoredValue(next) {
	const widths = toSlotList(next.width).map(toStoredWidth);
	const styles = toSlotList(next.style).map((style) => style || 'none');
	const color = next.color ?? '';

	const slots = widths.map((width, index) => ({ width, style: styles[index], color }));

	return isUniformSlotList(slots) ? slots[0] : slots;
}

/**
 * Render a border field from a settings schema entry.
 *
 * @param {Object}  props                    The component props.
 * @param {Object}  props.field              The field definition.
 * @param {?string} [props.field.label]      The control's label.
 * @param {boolean} [props.field.readOnly]   Whether the control is non-interactive.
 * @param {boolean} [props.field.responsive] Whether the field offers a breakpoint switcher.
 * @param {*}       props.value              The stored value: a composite, or a four-slot list of them.
 * @param {Function} props.onChange          Called with the next stored value.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function BorderField({ field, value, onChange }) {
	const responsive = field.responsive === true;

	// Shared, not local: switching to Tablet here switches every other responsive control in the panel
	// with it, matching `BoxTokenField`.
	const [breakpoint, setBreakpoint] = useBreakpoint(PRESET_BREAKPOINTS[0]);

	const atBreakpoint = responsive ? readPresetBreakpoint(value, breakpoint) : value;
	const write = (next) => onChange(responsive ? writePresetBreakpoint(value, breakpoint, next) : next);

	const widthTokens = pickableTokensForType('dimension', 'border-width').map((token) => ({
		...token,
		alias: `{${token.id}}`,
	}));

	// Which breakpoints the user has opened up into per-side editing. Held here rather than inferred
	// from the stored shape — see the module docblock — and per breakpoint for the same reason
	// `BoxTokenField`'s `unlinked` is: a choice made on one breakpoint must not leak into another that
	// never made it, keeping the breakpoints independent.
	const [unlinked, setUnlinked] = useState({});
	const storedIsList = isSlotList(atBreakpoint);
	const linked = storedIsList ? false : !unlinked[breakpoint];

	const toggleLink = () => {
		setUnlinked((current) => ({ ...current, [breakpoint]: linked }));

		// Relinking keeps the first side, matching `BoxTokenField`'s own relink rule; there is nothing
		// to fold when the breakpoint never actually diverged into a list.
		if (!linked && storedIsList) {
			write(atBreakpoint[0]);
		}
	};

	return (
		<BorderControl
			value={toControlValue(atBreakpoint)}
			onChange={(next) => !field.readOnly && write(toStoredValue(next))}
			label={field.label}
			widthTokens={widthTokens}
			renderColor={({ value: color, onChange: onColorChange }) => (
				<TokenColorSelectField
					field={{ label: __('Color', 'kadence-blocks'), readOnly: field.readOnly }}
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
