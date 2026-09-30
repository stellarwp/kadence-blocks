/**
 * Kind-aware normalization for the `shadow` kind — a `box-shadow` value reduced to one canonical string,
 * or to `''` when it paints nothing.
 *
 * A preset stores a shadow as a literal string (`0px 0px 14px 0px rgba(0, 0, 0, 0.2)`), while a block
 * stores it as an array of items with one field per axis. Compared as text those never agree, so a
 * stored shadow is built into its literal first and both sides are canonicalized. A shadow with no
 * geometry, or a fully transparent color, paints nothing and reads as none, which is how a preset that
 * stores `0px 0px 0px 0px transparent` says "no shadow".
 */

/**
 * Internal dependencies
 */
import { pathOfAlias, resolveTokenAlias } from '../../design-tokens/alias';
import { isBackedToken } from '../../design-tokens/backed-tokens';
import { boundShadowToken } from '../../design-tokens/shadow-token';
import { normalizeColor } from './color';

/**
 * What a stored item's `blur` falls back to when unset. `kadence/image`, the block that binds a shadow
 * control attribute, defaults it to 14.
 *
 * @since TBD
 */
const BLUR_FALLBACK = 14;

/**
 * What a stored item's `opacity` falls back to when unset. `kadence/image` defaults it to 0.2.
 *
 * @since TBD
 */
const OPACITY_FALLBACK = 0.2;

/**
 * Canonicalize a `box-shadow` literal.
 *
 * @param {string} css The literal.
 *
 * @since TBD
 *
 * @return {string} The canonical literal, or '' when it paints nothing.
 */
function canonicalize(css) {
	const text = String(css)
		.trim()
		.toLowerCase()
		.replace(/\s+/g, ' ')
		.replace(/\s*,\s*/g, ',')
		.replace(/\(\s+/g, '(')
		.replace(/\s+\)/g, ')');

	if (text === '' || text === 'none') {
		return '';
	}

	const lengths =
		text
			.replace(/(?:rgba?|hsla?)\([^)]*\)|#[0-9a-f]{3,8}\b/g, '')
			.replace('inset', '')
			.match(/-?\d*\.?\d+[a-z%]*/g) || [];
	const hasGeometry = lengths.some((length) => parseFloat(length) !== 0);
	const transparent = /\btransparent\b/.test(text) || /rgba\([^)]*,0(?:\.0+)?\)/.test(text);

	if (!hasGeometry || transparent) {
		return '';
	}

	return text.replace(/\b0(?:px|rem|em)\b/g, '0');
}

/**
 * A stored color and opacity as one CSS color.
 *
 * A six-digit hex plus an opacity becomes `rgba()`, the form a preset literal is written in. Anything
 * else (a resolved palette color, an `rgb()` value) is kept as it resolves.
 *
 * @param {*} color   The stored color.
 * @param {*} opacity The stored opacity.
 *
 * @since TBD
 *
 * @return {string} The CSS color.
 */
function colorLiteral(color, opacity) {
	const resolved = normalizeColor(undefined !== color && color !== '' ? color : '#000000');
	const hex = /^#([0-9a-f]{6})$/.exec(resolved);

	if (!hex) {
		return resolved;
	}

	const channel = (start) => parseInt(hex[1].slice(start, start + 2), 16);
	const alpha = undefined !== opacity && opacity !== '' ? opacity : OPACITY_FALLBACK;

	return `rgba(${channel(0)}, ${channel(2)}, ${channel(4)}, ${alpha})`;
}

/**
 * A stored item as a `box-shadow` literal.
 *
 * A whole-shadow token binding that the active library backs resolves through the token; one it no
 * longer backs paints nothing. An axis that is not a plain number, such as a token alias, cannot be
 * built here, so the item comes back as an opaque string that matches no preset.
 *
 * @param {Object} item One stored shadow item.
 *
 * @since TBD
 *
 * @return {string} The literal.
 */
function itemLiteral(item) {
	const bound = boundShadowToken(item);

	if (bound) {
		return isBackedToken(pathOfAlias(bound)) ? resolveTokenAlias(bound) : '';
	}

	const axes = [item.hOffset ?? 0, item.vOffset ?? 0, item.blur ?? BLUR_FALLBACK, item.spread ?? 0];

	if (axes.some((axis) => axis === '' || !Number.isFinite(Number(axis)))) {
		return `unresolved:${JSON.stringify(item)}`;
	}

	return `${item.inset ? 'inset ' : ''}${axes.map((axis) => `${Number(axis)}px`).join(' ')} ${colorLiteral(
		item.color,
		item.opacity
	)}`;
}

/**
 * Normalize a shadow value — a stored `[item]` array, one item, or a literal — for compare.
 *
 * @param {*} value The stored or preset value.
 *
 * @since TBD
 *
 * @return {string} The canonical literal, or '' when the value paints nothing.
 */
export function normalizeShadow(value) {
	const item = Array.isArray(value) ? value[0] : value;

	if (!item) {
		return '';
	}

	if (typeof item === 'string') {
		return canonicalize(item);
	}

	return canonicalize(itemLiteral(item));
}
