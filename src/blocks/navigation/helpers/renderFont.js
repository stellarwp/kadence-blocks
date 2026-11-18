/**
 * Internal dependencies
 */
import { typographyStyle } from '@kadence/helpers';

/**
 * Matches one `property:value;` declaration, treating quoted strings, including escaped quotes, as part of the value.
 */
const DECLARATION = /([\w-]+)\s*:\s*((?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^;"'])*);/g;

/**
 * Returns a copy of the first typography item that `typographyStyle()` can read.
 *
 * @param {Object} item The first item of the typography attribute.
 *
 * @since TBD
 *
 * @return {Object} The item with `letterSpacingType` set and a numeric zero letter spacing as the string '0'.
 */
function normalizeFirstItem(item) {
	return {
		...item,
		letterSpacing: Array.isArray(item.letterSpacing)
			? item.letterSpacing.map((value) => (0 === value ? '0' : value))
			: item.letterSpacing,
		letterSpacingType: item.letterSpacingType || item.letterType,
	};
}

/**
 * Adds the typography declarations for the previewed device to the CSS builder's current selector.
 *
 * The letter spacing unit saved as `letterType` is passed on as `letterSpacingType`, which is the key
 * `typographyStyle()` reads. A numeric zero letter spacing is kept as '0'. Semicolons inside quoted values stay part of the value.
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
	const normalized = items.length ? [normalizeFirstItem(items[0]), ...items.slice(1)] : [];
	const rule = typographyStyle(normalized, '', previewDevice);
	const body = rule.replace(/^\s*\{/, '').replace(/\}\s*$/, '');

	for (const [, property, value] of body.matchAll(DECLARATION)) {
		css.add_property(property, value.trim());
	}
}
