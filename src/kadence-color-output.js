/**
 * function to return string with var if needed.
 * @param {string} string the word string.
 * @returns {string} with var if needed.
 */
/* global kadence_blocks_params */
import hexToRGBA from './hex-to-rgba';
// eslint-disable-next-line camelcase
const isKadenceT = ( typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.isKadenceT ? true : false );
export default function kadenceColorOutput( string, opacity = null ) {
	if ( isKadenceT && string && string.startsWith( 'palette' ) ) {
		string = 'var(--global-' + string + ')';
	} else if ( opacity !== null && ! isNaN( opacity ) && undefined !== string && '' !== string ) {
		string = hexToRGBA( string, opacity );
	}
	return string;
}
