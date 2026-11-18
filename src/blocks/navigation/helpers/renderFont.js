/**
 * Internal dependencies
 */
import { typographyStyle } from '@kadence/helpers';

/**
 * Adds the typography declarations for the previewed device to the CSS builder's current selector.
 *
 * The letter spacing unit saved as `letterType` is passed on as `letterSpacingType`, which is the key
 * `typographyStyle()` reads. Semicolons inside quoted values stay part of the value.
 *
 * @param {KadenceBlocksCSS} css           The CSS builder, with its selector already set.
 * @param {Array}            typography    The block's typography attribute.
 * @param {string}           previewDevice The device being previewed in the editor.
 *
 * @since TBD
 *
 * @return {void}
 */
export default function renderFont(css, typography, previewDevice) {
	const items = typography ? typography : [];
	const normalized = items.length
		? [{ ...items[0], letterSpacingType: items[0].letterSpacingType || items[0].letterType }, ...items.slice(1)]
		: [];
	const rule = typographyStyle(normalized, '', previewDevice);
	const body = rule.replace(/^\s*\{/, '').replace(/\}\s*$/, '');

	for (const [, property, value] of body.matchAll(/([\w-]+)\s*:\s*((?:"[^"]*"|'[^']*'|[^;"'])*);/g)) {
		css.add_property(property, value.trim());
	}
}
