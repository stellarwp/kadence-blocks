/**
 * The native shadow item's optional binding key, and the one function that reads it.
 *
 * A whole-shadow token pick has no home among the item's existing keys — unlike border, where an alias
 * replaces a single side's width slot, a shadow alias would replace the entire value — so it gets a key
 * of its own. The numeric legs are still written with the token's resolved value at pick time: they
 * keep the item a valid literal shadow for readers that do not know this key, and they are what a
 * render falls back to when the bound token is no longer in the active library.
 *
 * This lives apart from `components/EditorShadowControl.js` because the editor-canvas style builder
 * needs the key too, and must not pull a React component, its SCSS, and the `token-controls` barrel
 * into a module that only builds strings.
 */

/**
 * Internal dependencies
 */
import { isTokenAlias } from './alias';

/**
 * The shadow item key that carries a whole-shadow token binding.
 *
 * @since TBD
 */
export const SHADOW_TOKEN_KEY = 'shadowToken';

/**
 * The shadow token one stored shadow item is bound to.
 *
 * @param {?Object} shadowItem One `shadow[0]`-shaped item.
 *
 * @since TBD
 *
 * @return {?string} The bound `{dot.alias}`, or null when the item carries no binding.
 */
export function boundShadowToken(shadowItem) {
	const alias = shadowItem?.[SHADOW_TOKEN_KEY];

	return isTokenAlias(alias) ? alias : null;
}
