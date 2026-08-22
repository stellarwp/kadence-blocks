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
 * unlike border, where an alias replaces a single side's width slot, a shadow alias would replace the
 * *entire* value. Rather than invent a spot to carry a live alias, a pick resolves to its literal
 * composite value immediately, at pick time, using the same `tokens` list `BoxShadowControl` already
 * offers for its trigger label (`[{ id, alias, label, value, type, role }]`). `toNativeShadow` looks
 * up the picked alias's resolved `value` (the feed's `box-shadow` shorthand string) and writes the
 * parsed composite straight into the native item's plain fields — no alias key, no live link back to
 * the token, matching how a per-instance color pick is already handled everywhere else in this plan.
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
 * A 3-, 6-, or 8-digit hex color, with or without a leading `#` — the only shapes `hexToRgba` can
 * safely convert. The 8-digit form's trailing pair is its own embedded alpha.
 *
 * @since TBD
 */
const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

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
 * @return {string} The combined color, `rgba(...)` when partially transparent and `color` is a hex
 * literal `hexToRgba` can parse; any other CSS color literal (`var(...)`, `transparent`, an existing
 * `rgba(...)`) passes through unchanged rather than being corrupted into black.
 */
export function combineColorOpacity(color, opacity) {
	if (!color) {
		return color || '';
	}

	if (opacity === undefined || opacity === null || Number(opacity) >= 1) {
		return color;
	}

	if (!HEX_PATTERN.test(color)) {
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

	const rgbaMatch = combined.match(RGBA_PATTERN);

	if (rgbaMatch) {
		const [, r, g, b, a] = rgbaMatch;

		return {
			color: `#${channelToHex(Number(r))}${channelToHex(Number(g))}${channelToHex(Number(b))}`,
			opacity: a !== undefined ? Number(a) : 1,
		};
	}

	// An 8-digit hex (`#RRGGBBAA`) carries its own alpha in the trailing pair — decode it rather than
	// reading the whole 8-digit string as an opaque color, which `PopColorControl` cannot render.
	const hexAlphaMatch = combined.match(/^#?([0-9a-f]{6})([0-9a-f]{2})$/i);

	if (hexAlphaMatch) {
		const [, rgb, alphaHex] = hexAlphaMatch;

		return { color: `#${rgb}`, opacity: parseInt(alphaHex, 16) / 255 };
	}

	return { color: combined, opacity: 1 };
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
 * The feed's resolved `box-shadow` shorthand grammar, matching what `Css_Renderer::shadow()`
 * produces: an optional leading `inset `, four space-separated dimension tokens (offsetX, offsetY,
 * blur, spread), then the color as the remainder of the string. Capturing the color as "everything
 * after the fourth dimension" (rather than a fifth token) keeps a color with internal spaces —
 * `rgba(23, 23, 23, 0.12)` — intact.
 *
 * @since TBD
 */
const SHADOW_SHORTHAND_PATTERN = /^(inset\s+)?(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+)$/;

/**
 * Parse a resolved `box-shadow` shorthand string into the composite `{ color, offsetX, offsetY, blur,
 * spread, inset }` shape `BoxShadowControl` edits.
 *
 * @param {*} css The resolved shorthand (e.g. `"0px 2px 8px 0px #1717171f"`, with an optional
 *                `inset ` prefix), or anything that fails to parse as one.
 *
 * @since TBD
 *
 * @return {Object} The parsed composite, or the field's default shape when `css` is empty or does
 *                   not match the shorthand grammar.
 */
function parseResolvedShadow(css) {
	const match = typeof css === 'string' ? css.trim().match(SHADOW_SHORTHAND_PATTERN) : null;

	if (!match) {
		return { ...DEFAULT_COMPOSITE };
	}

	const [, insetPrefix, offsetX, offsetY, blur, spread, color] = match;

	return {
		color,
		offsetX,
		offsetY,
		blur,
		spread,
		inset: Boolean(insetPrefix),
	};
}

/**
 * Resolve a picked token alias to its literal composite value, via the same `tokens` list
 * `BoxShadowControl` already offers for its trigger label.
 *
 * @param {string} alias  The picked token alias.
 * @param {Array}  tokens Pickable `shadow`-type tokens, `[{id, label, value, alias}]`.
 *
 * @since TBD
 *
 * @return {?Object} The resolved composite, or `null` when the alias matches no pickable token.
 */
function resolveShadowAlias(alias, tokens) {
	const entry = (tokens || []).find((token) => token.alias === alias);

	return entry ? parseResolvedShadow(entry.value) : null;
}

/**
 * Convert the native `[{ color, opacity, hOffset, vOffset, blur, spread, inset }]` attribute value to
 * the composite `BoxShadowControl` edits.
 *
 * @param {?Array} native The native shadow attribute value.
 *
 * @since TBD
 *
 * @return {Object} The composite `{ color, offsetX, offsetY, blur, spread, inset }` shape.
 */
export function fromNativeShadow(native) {
	const source = native?.[0];

	if (!source) {
		return { ...DEFAULT_COMPOSITE };
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
 * Convert `BoxShadowControl`'s value back to the native
 * `[{ color, opacity, hOffset, vOffset, blur, spread, inset }]` attribute shape.
 *
 * A token alias string (a pick from the Style Library tab) resolves to its literal composite value
 * immediately, through `tokens`, rather than being stored as a live link back to the token — an
 * alias that resolves to nothing (a stale or unmapped id) falls back to the composite default so the
 * write never corrupts the attribute.
 *
 * @param {string|Object} value    The value `BoxShadowControl` reports through `onChange`.
 * @param {Array}         [tokens] Pickable `shadow`-type tokens, `[{id, label, value, alias}]`, used
 *                                 to resolve a picked alias to its literal value.
 *
 * @since TBD
 *
 * @return {Array} `[{ color, opacity, hOffset, vOffset, blur, spread, inset }]`.
 */
export function toNativeShadow(value, tokens = []) {
	const composite = typeof value === 'string' ? resolveShadowAlias(value, tokens) || DEFAULT_COMPOSITE : value;

	const { color, opacity } = splitColorOpacity(composite?.color);

	return [
		{
			color: color || DEFAULT_COMPOSITE.color,
			opacity,
			hOffset: axisToNative(composite?.offsetX),
			vOffset: axisToNative(composite?.offsetY),
			blur: axisToNative(composite?.blur),
			spread: axisToNative(composite?.spread),
			inset: composite?.inset === true,
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
					onChange={(next) => onChange(toNativeShadow(next, tokens))}
					tokens={tokens}
					renderColor={renderColor}
					disabled={disabled}
				/>
			)}
		</div>
	);
}
