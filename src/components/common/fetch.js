import _zipObject from 'lodash/zipObject';

const { apiFetch } = wp;

/**
 * Fetch JSON.
 *
 * Helper function to return parsed JSON and also the response headers.
 *
 * @param {object} args
 * @param {array} headerKeys Array of headers to include.
 */
export const fetchJson = ( args, headerKeys = [ 'x-wp-totalpages' ] ) => {
	return new Promise( resolve => {
		apiFetch( {
			...args,
			parse: false,
		} ).then( response => Promise.all( [
			response.json ? response.json() : [],
			_zipObject( headerKeys, headerKeys.map( key => response.headers.get( key ) ) ),
		] ) ).then( data => (
			resolve( data )
		) ).catch( () => {} );
	} )
}