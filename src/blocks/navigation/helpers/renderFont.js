/**
 * Internal dependencies
 */
import { typographyStyle } from '@kadence/helpers';

/**
 * Splits the body of a CSS rule into declarations at the semicolons that end them.
 *
 * Semicolons inside quoted strings, escape sequences, comments and parentheses do not end a declaration.
 *
 * @param {string} body The declarations of a rule, without the surrounding braces.
 *
 * @since TBD
 *
 * @return {string[]} The declarations, without their terminating semicolon.
 */
function splitDeclarations(body) {
	const declarations = [];
	let current = '';
	let quote = '';
	let depth = 0;

	for (let index = 0; index < body.length; index++) {
		const char = body[index];
		let chunk = char;

		if ('\\' === char) {
			chunk = body.slice(index, index + 2);
		} else if (quote) {
			quote = char === quote ? '' : quote;
		} else if ('/' === char && '*' === body[index + 1]) {
			const end = body.indexOf('*/', index + 2);
			chunk = body.slice(index, -1 === end ? body.length : end + 2);
		} else if ('"' === char || "'" === char) {
			quote = char;
		} else if ('(' === char) {
			depth++;
		} else if (')' === char && depth > 0) {
			depth--;
		} else if (';' === char && 0 === depth) {
			declarations.push(current);
			current = '';
			continue;
		}

		current += chunk;
		index += chunk.length - 1;
	}

	return declarations;
}

/**
 * Returns a copy of the first typography item that `typographyStyle()` can read.
 *
 * @param {Object} item The first item of the typography attribute.
 *
 * @since TBD
 *
 * @return {Object} The item with `letterSpacingType` set, a numeric zero letter spacing as the string '0' and a dash line type as no unit.
 */
function normalizeFirstItem(item) {
	return {
		...item,
		lineType: '-' === item.lineType ? '' : item.lineType,
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
 * `typographyStyle()` reads. A numeric zero letter spacing is kept as '0' and a dash line type means no unit.
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

	splitDeclarations(body).forEach((declaration) => {
		const separator = declaration.indexOf(':');
		if (separator > 0) {
			css.add_property(declaration.slice(0, separator).trim(), declaration.slice(separator + 1).trim());
		}
	});
}
