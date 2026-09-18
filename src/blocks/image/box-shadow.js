/**
 * Internal dependencies
 */
import { hasVisibleShadow } from '../../extension/design-tokens/components/EditorShadowControl';
import { shadowCss } from '../../extension/design-tokens/shadow-css';

/**
 * What `blur` falls back to when the stored item leaves it unset.
 */
const BLUR_FALLBACK = 14;

/**
 * What `opacity` falls back to when the stored item leaves it unset.
 */
const OPACITY_FALLBACK = 0.2;

/**
 * The editor canvas's inline `box-shadow` value for an image.
 *
 * Both halves have to agree before anything is painted: the stored flag, which legacy content may
 * have left false with real values still behind it, and the value's own axes. That pairing, and the
 * shared builder underneath, are what keep this canvas and the front-end renderer in step — including
 * a whole-shadow token binding, which resolves to the token's custom property so editing the token
 * moves the image without the post being re-saved.
 *
 * @param {boolean} displayBoxShadow The block's stored shadow enable flag.
 * @param {?Array}  boxShadow        The stored `boxShadow` attribute value.
 *
 * @since TBD
 *
 * @return {string|undefined} The `box-shadow` value, or undefined when the image paints no shadow.
 */
export function imageBoxShadowCss(displayBoxShadow, boxShadow) {
	if (!displayBoxShadow || !hasVisibleShadow(boxShadow?.[0])) {
		return undefined;
	}

	// A binding whose token has been deleted resolves to nothing rather than to the stored legs, so
	// the image falls back to its default CSS the way every other deleted-token reference does.
	return shadowCss(boxShadow[0], BLUR_FALLBACK, OPACITY_FALLBACK) || undefined;
}
