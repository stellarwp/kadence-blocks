/**
 * Internal dependencies
 */
import { typographyStyle } from '@kadence/helpers';

/**
 * Matches one CSS token: an escape sequence, a quoted string, a comment, a parenthesis, a semicolon, or a run of
 * other characters. An unclosed string or comment runs to the end of the text.
 */
const TOKEN =
	/\\[\s\S]|"(?:[^"\\]|\\[\s\S])*(?:"|$)|'(?:[^'\\]|\\[\s\S])*(?:'|$)|\/\*[\s\S]*?(?:\*\/|$)|[();]|[^\\"'/();]+|[\s\S]/g;

/**
 * Returns the parenthesis depth after the given token.
 *
 * @param {number} depth The depth before the token.
 * @param {string} token The CSS token.
 *
 * @since TBD
 *
 * @return {number} The depth after the token.
 */
function depthAfter(depth, token) {
	if ('(' === token) {
		return depth + 1;
	}

	if (')' === token) {
		return Math.max(0, depth - 1);
	}

	return depth;
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
	let depth = 0;

	for (const [token] of body.matchAll(TOKEN)) {
		if (';' === token && 0 === depth) {
			declarations.push(current);
			current = '';
			continue;
		}

		depth = depthAfter(depth, token);
		current += token;
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
	const [first] = typography ? typography : [];
	const rule = typographyStyle(first ? [normalizeFirstItem(first)] : [], '', previewDevice);
	const body = rule.replace(/^\s*\{/, '').replace(/\}\s*$/, '');

	splitDeclarations(body).forEach((declaration) => {
		const separator = declaration.indexOf(':');
		if (separator > 0) {
			css.add_property(declaration.slice(0, separator).trim(), declaration.slice(separator + 1).trim());
		}
	});
}

/**
 * Adds the typography declarations of each rule, under that rule's selector.
 *
 * @param {KadenceBlocksCSS} css           The CSS builder.
 * @param {Array}            rules         Pairs of a selector and the typography attribute rendered under it.
 * @param {string}           previewDevice The device being previewed in the editor.
 *
 * @since TBD
 *
 * @return {void}
 */
export function renderFontRules(css, rules, previewDevice) {
	rules.forEach(([selector, typography]) => {
		css.set_selector(selector);
		renderFont(css, typography, previewDevice);
	});
}
