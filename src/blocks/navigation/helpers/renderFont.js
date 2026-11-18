/**
 * Internal dependencies
 */
import { typographyStyle } from '@kadence/helpers';

/**
 * Returns the length of the CSS comment that starts at the given index.
 *
 * @param {string} text  The CSS text.
 * @param {number} index The index of the opening slash.
 *
 * @since TBD
 *
 * @return {number} The length of the comment, up to the end of the text when it is not closed.
 */
function commentLength(text, index) {
	const end = text.indexOf('*/', index + 2);
	return -1 === end ? text.length - index : end + 2 - index;
}

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
	let index = 0;

	while (index < body.length) {
		const char = body[index];
		let length = 1;

		if ('\\' === char) {
			length = 2;
		} else if (quote) {
			quote = char === quote ? '' : quote;
		} else if ('/' === char && '*' === body[index + 1]) {
			length = commentLength(body, index);
		} else if ('"' === char || "'" === char) {
			quote = char;
		} else if ('(' === char) {
			depth++;
		} else if (')' === char && depth > 0) {
			depth--;
		} else if (';' === char && 0 === depth) {
			declarations.push(current);
			current = '';
			index++;
			continue;
		}

		current += body.slice(index, index + length);
		index += length;
	}

	if (current.trim()) {
		declarations.push(current);
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
 * @return {Object} The item with `letterSpacingType` falling back to the saved `letterType`, a numeric zero letter
 *                  spacing as the string '0' and a dash line type as no unit.
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
 * The first typography item is normalized by `normalizeFirstItem()` before `typographyStyle()` reads it.
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
