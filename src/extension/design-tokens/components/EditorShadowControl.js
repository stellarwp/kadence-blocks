/**
 * The block editor's adapter for `src/token-controls`' `BoxShadowControl`.
 *
 * A block's native shadow attribute (`kadence/singlebtn`'s `shadow`/`shadowHover`/`shadowTransparent`,
 * `kadence/image`'s `boxShadow`, …) is a one-element array —
 * `[{ color, opacity, hOffset, vOffset, blur, spread, inset }]`. That shape is shared across every
 * shadow-carrying block, confirmed against their `block.json` files rather than assumed.
 * `BoxShadowControl`'s own contract is a *single* value that is either a token alias string or the
 * composite shape `{ color, offsetX, offsetY, blur, spread, inset }` `helpers/shadow.js`/`ShadowField`
 * already use on the Shadow token-library screen. Three shape differences this bridges:
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
 * This control always renders `BoxShadowControl` — there is no separate enable toggle or sibling
 * boolean attribute gating it. Whether a `box-shadow` declaration is emitted is decided purely by
 * inspecting the shadow value's own axes (an all-zero value, including the fixed "None" pick, emits
 * nothing), both on the front end and in the editor-canvas live preview.
 *
 * A whole-shadow token pick (the Style Library tab) is carried on the item's own optional
 * `shadowToken` key. Unlike border, where an alias replaces a single side's width slot, a shadow alias
 * would replace the *entire* value, so it gets a key of its own rather than displacing a leg. The
 * legs are still written with the token's resolved value at pick time: they keep the item a valid
 * literal shadow for readers that do not know the binding key, and they are the fallback a render uses
 * when the bound token is no longer in the active library.
 *
 * Color is out of scope for redesign here, exactly as in `EditorBorderControl` — this component
 * neither builds nor intercepts a color field, it only wires the caller's EXISTING one back in via
 * `renderColor`.
 *
 * This component also wraps itself in `TokenControlRow` (no `heading`, purely for its
 * `.kb-token-control-row` spacing) — every call site is a block inspector sidebar, so it owns that
 * wrapper rather than asking each one to remember it, matching
 * `EditorBorderControl`/`EditorBoxControl`.
 */

/**
 * Internal dependencies
 */
import { BoxShadowControl, DEFAULT_COMPOSITE, parseResolvedShadow } from '../../../token-controls';
import { TokenControlRow } from '../../token-indicators/components/TokenControlRow';
import { isTokenAlias } from '../alias';
import { SHADOW_TOKEN_KEY, boundShadowToken } from '../shadow-token';

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
 * @param {string}  color   The native hex color, an `rgb(...)`/`rgba(...)` literal, or any other CSS
 *                          color literal.
 * @param {?number} opacity The native opacity (0-1), or undefined for fully opaque.
 *
 * @since TBD
 *
 * @return {string} The combined color, `rgba(...)` when partially transparent and `color` is a hex
 * or `rgb(...)`/`rgba(...)` literal (both channel-decodable, so the opacity can be folded in
 * losslessly). A CSS color this module cannot decode into channels — `var(...)`, a named color like
 * `transparent`, `currentColor` — passes through unchanged rather than being corrupted into black;
 * the separate opacity is lost in that one case, a known, accepted limitation (there is no lossless
 * single-string encoding for "an opaque reference plus a multiplier" without `color-mix()`, which
 * `PopColorControl`/`splitColorOpacity` do not parse) — see `splitColorOpacity`'s matching fallback.
 */
export function combineColorOpacity(color, opacity) {
	if (!color) {
		return color || '';
	}

	if (opacity === undefined || opacity === null || Number(opacity) >= 1) {
		return color;
	}

	if (HEX_PATTERN.test(color)) {
		return hexToRgba(color, Number(opacity));
	}

	const rgbMatch = color.match(RGBA_PATTERN);

	if (rgbMatch) {
		const [, r, g, b] = rgbMatch;

		return `rgba(${r}, ${g}, ${b}, ${Number(opacity)})`;
	}

	return color;
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
 * The shadow token a stored native value is bound to.
 *
 * @param {?Array} native The stored native shadow attribute value.
 *
 * @since TBD
 *
 * @return {?string} The bound `{dot.alias}`, or null when the value carries no binding.
 */
export function shadowTokenOf(native) {
	return boundShadowToken(native?.[0]);
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
 * A token alias string (a pick from the Style Library tab) is recorded on the item's `shadowToken` key
 * AND resolved through `tokens` onto the numeric legs, so the item carries both a live link to the
 * token and the literal that link resolved to at pick time. An alias that resolves to nothing (a stale
 * or unmapped id) still records the binding — the token may come back — and falls the legs back to the
 * composite default so the write never corrupts the attribute.
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

	const item = {
		color: color || DEFAULT_COMPOSITE.color,
		opacity,
		hOffset: axisToNative(composite?.offsetX),
		vOffset: axisToNative(composite?.offsetY),
		blur: axisToNative(composite?.blur),
		spread: axisToNative(composite?.spread),
		inset: composite?.inset === true,
	};

	// Only a real `{dot.alias}` binds. The Style Library tab's fixed "None" sentinel arrives here as a
	// literal shorthand string, not an alias, and must stay a plain zero value — binding it would point
	// the item at a token that was never registered.
	return [isTokenAlias(value) ? { ...item, [SHADOW_TOKEN_KEY]: value } : item];
}

/**
 * Whether a native shadow item paints anything visible — the JS counterpart of the block classes'
 * `has_visible_shadow()`, kept in step with it so the editor preview and the rendered page agree on
 * which shadows exist at all.
 *
 * Geometry alone decides it: all-zero offsets, blur, and spread paint nothing whatever the color is,
 * which is exactly what makes an all-zero value usable as the "no shadow" state now that no separate
 * enable boolean carries that meaning. A non-numeric, non-empty leg is a `{dot.alias}` reference
 * resolving to a var() whose value is unknown here, so it counts as visible — read as a zero, a
 * caller would drop a shadow the token does paint.
 *
 * @param {?Object} item One `shadow[0]`-shaped item.
 *
 * @since TBD
 *
 * @return {boolean} Whether the item paints a visible shadow.
 */
export function hasVisibleShadow(item) {
	if (!item) {
		return false;
	}

	return ['hOffset', 'vOffset', 'blur', 'spread'].some((axis) => {
		const value = item[axis] ?? 0;

		if (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value)))) {
			return Number(value) !== 0;
		}

		return typeof value === 'string' && value.trim() !== '';
	});
}

/**
 * Whether a stored native shadow should be treated as "the block sets no shadow of its own".
 *
 * `block.json` registers an all-zero transparent shadow as `shadow`'s own default, so a fresh block
 * arrives byte-identical to an explicit "None" pick. They are separated by consequence, not shape: an
 * invisible shadow is a real override only when there is a preset shadow for it to suppress. With
 * nothing behind it, it suppresses nothing and reads as unset.
 *
 * @param {?Array} native       The stored native shadow attribute value.
 * @param {*}      defaultValue The active preset's own resolved shadow, or nothing when it has none.
 *
 * @since TBD
 *
 * @return {boolean} True when the control should render as unset.
 */
export function isUnsetShadow(native, defaultValue) {
	const source = native?.[0];

	if (!source) {
		return true;
	}

	// A binding, not the geometry, decides here: a token that resolves to a subtle or zero-offset
	// shadow is still a deliberate pick, and reading it as unset would drop its name from the trigger.
	if (shadowTokenOf(native)) {
		return false;
	}

	// A preset shadow behind it makes an invisible shadow a deliberate suppression, not an absence.
	if (defaultValue !== undefined && defaultValue !== null && defaultValue !== '') {
		return false;
	}

	const isTransparent = !source.color || source.color === 'transparent' || Number(source.opacity) === 0;
	const hasNoGeometry = ['hOffset', 'vOffset', 'blur', 'spread'].every((axis) => !parseFloat(source[axis]));

	return isTransparent && hasNoGeometry;
}

/**
 * Render the editor-canvas box-shadow control: `BoxShadowControl` always renders, with no separate
 * enable toggle — whether a `box-shadow` is emitted is decided elsewhere, purely from the value's own
 * axes.
 *
 * @param {Object}    props               The component props.
 * @param {string}    props.label         The control's label.
 * @param {?Array}    props.value         The native shadow attribute value, optionally carrying a
 *                                        `shadowToken` binding.
 * @param {Function}  props.onChange      Called with the next native shadow attribute value.
 * @param {Array}     [props.tokens]      Pickable `shadow`-type tokens, `[{id, label, value, alias}]`.
 * @param {*}         [props.defaultValue] The active preset's own resolved shadow, or nothing when it
 *                                        declares none — shown MUTED while the block stores no shadow
 *                                        of its own, and what decides whether an invisible stored
 *                                        shadow is a real override (see `isUnsetShadow()`).
 * @param {?Function} [props.renderColor] The block's existing color field for the composite's `color`.
 * @param {boolean}   [props.disabled]    Whether the control is read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered control.
 */
export function EditorShadowControl({
	label,
	value,
	onChange,
	tokens = [],
	defaultValue,
	renderColor,
	disabled = false,
}) {
	// A bound value goes down as the bare alias string, which is the shape `BoxShadowControl` already
	// recognizes as a token: it names the token on the trigger, opens on the Style Library tab, and
	// previews the token's own shadow. The stored legs stay untouched behind it.
	const bound = shadowTokenOf(value);

	return (
		<TokenControlRow stacked>
			<BoxShadowControl
				label={label}
				value={isUnsetShadow(value, defaultValue) ? '' : bound || fromNativeShadow(value)}
				onChange={(next) => onChange(toNativeShadow(next, tokens))}
				tokens={tokens}
				defaultValue={defaultValue}
				renderColor={renderColor}
				disabled={disabled}
				// The stored legs are the fallback for a binding whose token has since been deleted — the
				// same snapshot the renderers already fall back to when a binding no longer resolves.
				fallbackShadow={bound ? fromNativeShadow(value) : undefined}
			/>
		</TokenControlRow>
	);
}
