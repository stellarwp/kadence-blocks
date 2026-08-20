/**
 * The block editor's adapter for `src/token-controls`' `BoxShadowControl`.
 *
 * `kadence/singlebtn`'s native shadow attribute (`shadow`, `shadowHover`, `shadowTransparent`, …) is
 * a one-element array — `[{ color, opacity, hOffset, vOffset, blur, spread, inset }]` — confirmed
 * against `src/blocks/singlebtn/block.json` and the six existing `BoxShadowControl` call sites in
 * `src/blocks/singlebtn/edit.js` rather than assumed. `BoxShadowControl`'s (phase 19) own contract is
 * a *single* value that is either a token alias string or the composite shape `{ color, offsetX,
 * offsetY, blur, spread, inset }` `helpers/shadow.js`/`ShadowField` already use on the Shadow
 * token-library screen. Three shape differences this bridges:
 *
 * - **field names**: native `hOffset`/`vOffset` become the composite's `offsetX`/`offsetY`; native's
 *   unitless numbers become the composite's `"Npx"` strings, matching `ShadowField`'s own convention.
 * - **no `opacity` field in the composite** — the Shadow screen's `ColorPicker` carries alpha inside
 *   the color itself. Folding native's separate `opacity` into the composite's `color` (as an
 *   `rgba(...)` string when opacity is less than fully opaque, a plain hex otherwise) is what lets a
 *   caller's `renderColor` edit both through one `PopColorControl`, unchanged, via its existing
 *   `opacityValue`/`onArrayChange` props — the same two-channel mechanism the native
 *   `@kadence/components` `BoxShadowControl` already wires it through
 *   (`node_modules/@kadence/components/src/box-shadow-control/index.js`). `combineColorOpacity`/
 *   `splitColorOpacity` below are exported so a caller's `renderColor` can do that combine/split with
 *   the exact same rules this component uses to read/write the native attribute, keeping both
 *   directions symmetric.
 * - **`enable` lives outside the value entirely** — it is a separate sibling boolean attribute
 *   (`displayShadow`, `displayHoverShadow`, …), not a key inside the shadow array's item. This wrapper
 *   keeps it a plain `ToggleControl` rendered beside `BoxShadowControl`, matching how the native
 *   control also renders its enable toggle as an independent affordance next to the label, hiding the
 *   rest of the control's body while off.
 *
 * A whole-shadow token pick (the Style Library tab) has no home in the native item's existing keys —
 * unlike border, where an alias replaces a single side's width slot, a shadow alias replaces the
 * *entire* value. It is stored as an added `alias` key on the native item (`toNativeShadow` keeps the
 * previous literal fields alongside it as a CSS fallback, never dropping them, so `render_shadow()`
 * still emits valid — if stale until resolved — CSS rather than corrupt placeholder text). Picking a
 * literal value again drops `alias`, returning the item to its original plain shape.
 *
 * Color is out of scope for redesign here, exactly as in `EditorBorderControl` — this component
 * neither builds nor intercepts a color field, it only wires the caller's EXISTING one back in via
 * `renderColor`.
 */

/**
 * WordPress dependencies
 */
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { BoxShadowControl } from '../../../token-controls/controls/BoxShadowControl';

/**
 * The composite's default shape, matching `BoxShadowControl`'s own `DEFAULT_SHADOW` fallback.
 *
 * @since TBD
 */
const DEFAULT_COMPOSITE = {
	color: '#000000',
	offsetX: '0px',
	offsetY: '0px',
	blur: '0px',
	spread: '0px',
	inset: false,
};

/**
 * A CSS `rgba(r, g, b, a)` string, matching `hexToRGBA`'s own output format exactly (comma-space
 * separated, no leading zero normalization) so `splitColorOpacity` can parse back what this component
 * writes without a separate, potentially drifting, format.
 *
 * @since TBD
 */
const RGBA_PATTERN = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/i;

/**
 * A single 0-255 channel as two hex digits.
 *
 * @param {number} channel The channel value.
 *
 * @since TBD
 *
 * @return {string} Two lowercase hex digits.
 */
function channelToHex(channel) {
	return Math.max(0, Math.min(255, Math.round(channel)))
		.toString(16)
		.padStart(2, '0');
}

/**
 * A hex color and an alpha number as an `rgba(r, g, b, a)` string — the format `render_color()`'s own
 * `hexToRGBA` helper (`@kadence/helpers`) produces, matched here rather than imported so this module
 * does not pull in that package's barrel export (which also loads its REST-fetch helper, unusable
 * under Jest) for one small, dependency-free conversion.
 *
 * @param {string} hex   A 3- or 6-digit hex color, with or without a leading `#`.
 * @param {number} alpha The alpha value (0-1).
 *
 * @since TBD
 *
 * @return {string} The `rgba(...)` string.
 */
function hexToRgba(hex, alpha) {
	const stripped = hex.replace('#', '');
	const long = stripped.length === 3 ? stripped.replace(/(.)/g, '$1$1') : stripped;
	const r = parseInt(long.slice(0, 2), 16) || 0;
	const g = parseInt(long.slice(2, 4), 16) || 0;
	const b = parseInt(long.slice(4, 6), 16) || 0;

	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Fold a native hex color and a separate opacity number into the single string `BoxShadowControl`'s
 * composite color slot carries, so a caller's `renderColor` can hand both to one `PopColorControl` via
 * its `value`/`opacityValue` props. Fully opaque (or unset) opacity stays a plain hex literal — no
 * `rgba(...)` wrapping — so the common case round-trips as the same hex string a plain `PopColorControl`
 * without opacity support would also produce.
 *
 * @param {string}  color   The native hex color (or any CSS color literal).
 * @param {?number} opacity The native opacity (0-1), or undefined for fully opaque.
 *
 * @since TBD
 *
 * @return {string} The combined color, `rgba(...)` when partially transparent.
 */
export function combineColorOpacity(color, opacity) {
	if (!color) {
		return color || '';
	}

	if (opacity === undefined || opacity === null || Number(opacity) >= 1) {
		return color;
	}

	return hexToRgba(color, Number(opacity));
}

/**
 * Split a combined color (a plain hex/CSS literal, or the `rgba(...)` string `combineColorOpacity`
 * produces) back into the native `(color, opacity)` pair. Anything that is not an `rgba(...)` string —
 * a plain hex, a `var(...)` reference, an empty string — passes through as fully opaque, matching
 * `combineColorOpacity`'s own choice not to wrap the opaque case.
 *
 * @param {string} combined The composite's color slot value.
 *
 * @since TBD
 *
 * @return {{color: string, opacity: number}} The native color and opacity.
 */
export function splitColorOpacity(combined) {
	if (typeof combined !== 'string' || !combined) {
		return { color: '', opacity: 1 };
	}

	const match = combined.match(RGBA_PATTERN);

	if (!match) {
		return { color: combined, opacity: 1 };
	}

	const [, r, g, b, a] = match;

	return {
		color: `#${channelToHex(Number(r))}${channelToHex(Number(g))}${channelToHex(Number(b))}`,
		opacity: a !== undefined ? Number(a) : 1,
	};
}

/**
 * A native numeric axis (`hOffset`, `vOffset`, `blur`, `spread`) as the composite's `"Npx"` string.
 *
 * @param {?number} axis The native axis value.
 *
 * @since TBD
 *
 * @return {string} The composite's px string for this axis.
 */
function axisToComposite(axis) {
	return `${Number(axis) || 0}px`;
}

/**
 * A composite axis slot (a `"Npx"` string, matching `ShadowCustomTab`'s own `NumberControl` writes)
 * back to the native unitless number.
 *
 * @param {*} slot The composite's axis value.
 *
 * @since TBD
 *
 * @return {number} The native axis value.
 */
function axisToNative(slot) {
	return parseFloat(slot) || 0;
}

/**
 * Convert the native `[{ color, opacity, hOffset, vOffset, blur, spread, inset, alias? }]` attribute
 * value to `BoxShadowControl`'s alias-or-composite contract.
 *
 * @param {?Array} native The native shadow attribute value.
 *
 * @since TBD
 *
 * @return {string|Object} A token alias string, when the item carries one, otherwise the composite
 *                          `{ color, offsetX, offsetY, blur, spread, inset }` shape.
 */
export function fromNativeShadow(native) {
	const source = native?.[0];

	if (!source) {
		return { ...DEFAULT_COMPOSITE };
	}

	if (source.alias) {
		return source.alias;
	}

	return {
		color: combineColorOpacity(source.color || DEFAULT_COMPOSITE.color, source.opacity),
		offsetX: axisToComposite(source.hOffset),
		offsetY: axisToComposite(source.vOffset),
		blur: axisToComposite(source.blur),
		spread: axisToComposite(source.spread),
		inset: source.inset === true,
	};
}

/**
 * Convert `BoxShadowControl`'s alias-or-composite value back to the native
 * `[{ color, opacity, hOffset, vOffset, blur, spread, inset }]` attribute shape.
 *
 * @param {string|Object} value          The value `BoxShadowControl` reports through `onChange`.
 * @param {?Array}        previousNative The attribute's current value, kept as the literal CSS
 *                                       fallback when `value` is a freshly-picked alias.
 *
 * @since TBD
 *
 * @return {Array} `[{ color, opacity, hOffset, vOffset, blur, spread, inset, alias? }]`.
 */
export function toNativeShadow(value, previousNative) {
	if (typeof value === 'string') {
		const previous = previousNative?.[0] || {};

		// Keep the previous literal fields as the CSS fallback — `render_shadow()` does not resolve
		// `alias` and would otherwise have nothing to render until the value is picked again.
		return [{ ...previous, alias: value }];
	}

	const { color, opacity } = splitColorOpacity(value?.color);

	return [
		{
			color: color || DEFAULT_COMPOSITE.color,
			opacity,
			hOffset: axisToNative(value?.offsetX),
			vOffset: axisToNative(value?.offsetY),
			blur: axisToNative(value?.blur),
			spread: axisToNative(value?.spread),
			inset: value?.inset === true,
		},
	];
}

/**
 * Render the editor-canvas box-shadow control: an `enable` toggle (the native attribute's own
 * sibling boolean, kept independent of the shadow value) beside `BoxShadowControl`, shown only while
 * enabled — matching the native `@kadence/components` `BoxShadowControl`'s own layout.
 *
 * @param {Object}    props                The component props.
 * @param {string}    props.label          The control's label.
 * @param {?Array}    props.value          The native shadow attribute value.
 * @param {Function}  props.onChange       Called with the next native shadow attribute value.
 * @param {boolean}   props.enable         Whether the shadow is enabled (the sibling boolean attribute).
 * @param {Function}  props.onEnableChange Called with the next enabled state.
 * @param {Array}     [props.tokens]       Pickable `shadow`-type tokens, `[{id, label, value, alias}]`.
 * @param {?Function} [props.renderColor]  The block's existing color field for the composite's `color`.
 * @param {boolean}   [props.disabled]     Whether the control is read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered control.
 */
export function EditorShadowControl({
	label,
	value,
	onChange,
	enable,
	onEnableChange,
	tokens = [],
	renderColor,
	disabled = false,
}) {
	return (
		<div className="kb-editor-shadow-control">
			<div className="kb-editor-shadow-control__header">
				{label && <span className="kb-editor-shadow-control__label">{label}</span>}
				<ToggleControl checked={!!enable} onChange={onEnableChange} disabled={disabled} />
			</div>
			{enable && (
				<BoxShadowControl
					label={undefined}
					value={fromNativeShadow(value)}
					onChange={(next) => onChange(toNativeShadow(next, value))}
					tokens={tokens}
					renderColor={renderColor}
					disabled={disabled}
				/>
			)}
		</div>
	);
}
