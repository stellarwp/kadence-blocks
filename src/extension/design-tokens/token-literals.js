/**
 * Resolved literal lookup for design-token aliases.
 *
 * The editor localizer prints every registered token's resolved literal per library to
 * `window.kadenceDesignTokensPickable.values` (`{ <library>: { <id>: literal } }`). The picker uses it for
 * its preview swatch; this module exposes the same lookup to anything that has to turn an alias back into
 * the literal a resolved-values map stores, without going through the server.
 */
import { get } from 'lodash';
import { isTokenAlias, pathOfAlias } from './alias';

/**
 * The resolved literal map for a token library, or an empty map when the pool is absent.
 *
 * @param {string} library The token library slug.
 *
 * @since TBD
 *
 * @return {Object} id => literal value.
 */
function libraryLiterals(library) {
	const values = get(window, ['kadenceDesignTokensPickable', 'values'], {}) || {};

	return get(values, [library], {}) || {};
}

/**
 * The literal a value resolves to: an alias resolves through the library's token map, anything else is
 * already a literal and passes through. An alias the library does not define also passes through, so a
 * caller never silently swaps a meaningful value for an empty string.
 *
 * @param {*}      value   The value, an alias or a literal.
 * @param {string} library The token library slug.
 *
 * @since TBD
 *
 * @return {*} The resolved literal.
 */
export function tokenLiteral(value, library) {
	if (!isTokenAlias(value)) {
		return value;
	}

	const literal = get(libraryLiterals(library), [pathOfAlias(value)], '');

	return literal === '' ? value : literal;
}
