/**
 * A stored shadow item as a `box-shadow` declaration value.
 *
 * This lives beside `shadow-token.js` rather than inside either block that needs it: `kadence/image`
 * and `kadence/singlebtn` both build a canvas `box-shadow` from the same `shadow[0]` shape and must
 * honor a binding identically, and neither block should have to reach into the other for the builder.
 * Like its neighbor it only builds strings, so it pulls in no React and no control barrel.
 */

/**
 * External dependencies
 */
import { KadenceColorOutput } from '@kadence/helpers';

/**
 * Internal dependencies
 */
import { tokenPx } from './token-px';
import { pathOfAlias, resolveTokenAlias } from './alias';
import { isBackedToken } from './backed-tokens';
import { boundShadowToken } from './shadow-token';

/**
 * One shadow axis as a bare pixel number.
 *
 * A {dot.alias} leg is resolved through the token pool the way the PHP renderer's `render_shadow()`
 * does. Concatenated raw it would emit `{alias}px`, which is not valid CSS — and `hasVisibleShadow()`
 * deliberately counts such a leg as visible, so it does reach here.
 *
 * @param {*} raw      The stored axis value.
 * @param {*} fallback What this axis defaults to when unset.
 *
 * @since TBD
 *
 * @return {*} The axis value to serialize.
 */
export function shadowAxisPx(raw, fallback) {
	if (typeof raw === 'string' && raw.trim() !== '' && !Number.isFinite(Number(raw))) {
		const resolved = tokenPx(raw);

		return resolved === null || resolved === undefined ? fallback : resolved;
	}

	return undefined !== raw && null !== raw ? raw : fallback;
}

/**
 * One shadow item as a `box-shadow` declaration value.
 *
 * A `shadowToken` binding backed by the active library wins outright and the stored legs are never
 * read — that is what keeps the value tracking the token. A binding the library no longer backs (a
 * token deleted after the post was saved) renders nothing: the block falls back to its default CSS
 * the same way every other block does when a token disappears, rather than the legs that still hold
 * the value the token resolved to when it was picked — those legs stay stored for readers that do
 * not know the binding key and to seed the Custom tab, but the renderer no longer reads them. An
 * unbound item still builds its literal shorthand from the legs below.
 *
 * @param {?Object} shadowItem      One `shadow[0]`-shaped item.
 * @param {number}  blurFallback    What `blur` defaults to when unset — 14 on every current caller,
 *                                  taken as an argument rather than hard-coded so the historic
 *                                  per-state default stays with the call site that owns it.
 * @param {number}  opacityFallback What `opacity` defaults to when unset. Blocks disagree on this
 *                                  one — `kadence/singlebtn` has always used 1 and `kadence/image`
 *                                  0.2 — so it too stays with the call site.
 *
 * @since TBD
 *
 * @return {string} The `box-shadow` value, or '' when there is no item to render or the item's
 *                   binding is no longer backed by the active library.
 */
export function shadowCss(shadowItem, blurFallback, opacityFallback = 1) {
	if (!shadowItem) {
		return '';
	}

	const bound = boundShadowToken(shadowItem);

	// A bound item renders from its token or not at all. When the token is no longer in the active
	// library the stored legs are deliberately NOT used as a fallback: the value falls back to the
	// block's default CSS instead, which is what every other deleted-token reference already does.
	// The legs still earn their place elsewhere — they keep the item a valid literal shadow for
	// readers that do not know the binding key, and they seed the control's Custom tab.
	if (bound) {
		return isBackedToken(pathOfAlias(bound)) ? resolveTokenAlias(bound) : '';
	}

	return (
		(shadowItem.inset ? 'inset ' : '') +
		shadowAxisPx(shadowItem.hOffset, 0) +
		'px ' +
		shadowAxisPx(shadowItem.vOffset, 0) +
		'px ' +
		shadowAxisPx(shadowItem.blur, blurFallback) +
		'px ' +
		shadowAxisPx(shadowItem.spread, 0) +
		'px ' +
		KadenceColorOutput(
			undefined !== shadowItem.color ? shadowItem.color : '#000000',
			undefined !== shadowItem.opacity ? shadowItem.opacity : opacityFallback
		)
	);
}
