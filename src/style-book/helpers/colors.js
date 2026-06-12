/**
 * Internal dependencies
 */
import { normalizeHexColor } from './tokens';

/**
 * Normalize a resolved token value for the WordPress ColorPicker.
 *
 * @param {string} value Resolved color string.
 * @return {string} Hex color suitable as a picker default.
 */
export function toPickerColor( value ) {
	return normalizeHexColor( value ) ?? '#000000';
}

/**
 * Extract a hex string from a ColorPicker change payload.
 *
 * @param {{ hex?: string }} color ColorPicker value object.
 * @return {string} Uppercase hex color.
 */
export function fromPickerColor( color ) {
	const hex = color?.hex ?? '';

	if ( hex.length === 9 ) {
		return hex.slice( 0, 7 ).toUpperCase();
	}

	return hex.toUpperCase();
}

/**
 * Sample up to N color token values for overview previews.
 *
 * @param {object[]}              tokens Color token definitions.
 * @param {Record<string, string>} values Resolved values keyed by id.
 * @param {number}                limit  Maximum swatches.
 * @return {string[]} Hex or CSS color strings.
 */
export function sampleColorValues( tokens, values, limit = 8 ) {
	return tokens
		.slice( 0, limit )
		.map( ( token ) => values[ token.id ] ?? '' )
		.filter( Boolean );
}
