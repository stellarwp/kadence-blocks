/**
 * function to return string with capital letter.
 * @param {string} hex the color hex.
 * @param {number} alpha the alpha number.
 * @returns {string} rgba color.
 */
export default function hexToRGBA( hex, alpha ) {
	if ( null === hex ) {
		return '';
	}
	hex = hex.replace( '#', '' );
	const r = parseInt( hex.length === 3 ? hex.slice( 0, 1 ).repeat( 2 ) : hex.slice( 0, 2 ), 16 );
	const g = parseInt( hex.length === 3 ? hex.slice( 1, 2 ).repeat( 2 ) : hex.slice( 2, 4 ), 16 );
	const b = parseInt( hex.length === 3 ? hex.slice( 2, 3 ).repeat( 2 ) : hex.slice( 4, 6 ), 16 );
	return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
}
