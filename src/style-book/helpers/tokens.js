/**
 * Read the localized design-token feed from the window global.
 *
 * @return {object|null} Feed payload or null when unavailable.
 */
export function getDesignTokensFeed() {
	return window.kadenceDesignTokens ?? null;
}

/**
 * Flatten schema groups into a single token list.
 *
 * @param {{ groups?: Record<string, object[]> }} schema UI schema from the feed.
 * @return {object[]} Token definitions with their group name attached.
 */
export function flattenSchemaTokens( schema ) {
	if ( ! schema?.groups ) {
		return [];
	}

	return Object.entries( schema.groups ).flatMap( ( [ groupName, tokens ] ) =>
		tokens.map( ( token ) => ( {
			...token,
			group: groupName,
		} ) )
	);
}

/**
 * Build a DTCG leaf payload for a token value update.
 *
 * @param {string} type  Token type from the schema (color, dimension, etc.).
 * @param {string} value Raw value string.
 * @return {{ $type: string, $value: string }} DTCG leaf.
 */
export function buildTokenLeaf( type, value ) {
	return {
		$type: type,
		$value: value.trim(),
	};
}

/**
 * Whether a token type supports a color swatch preview.
 *
 * @param {string} type Token type from the schema.
 * @return {boolean}
 */
export function isColorType( type ) {
	return type === 'color';
}

/**
 * Normalize a user-entered color to a hex string when possible.
 *
 * @param {string} value Raw input value.
 * @return {string|null} Hex color or null when not a simple hex value.
 */
export function normalizeHexColor( value ) {
	const trimmed = value.trim();

	if ( /^#[0-9a-fA-F]{3}$/.test( trimmed ) ) {
		const [ , r, g, b ] = trimmed.match( /^#(.)(.)(.)$/ );
		return `#${ r }${ r }${ g }${ g }${ b }${ b }`.toUpperCase();
	}

	if ( /^#[0-9a-fA-F]{6}$/.test( trimmed ) ) {
		return trimmed.toUpperCase();
	}

	return null;
}
