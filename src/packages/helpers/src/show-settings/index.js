/**
 * Return boolean about showing settings.
 */
export default ( key, blockName, defaultOn = true ) => {
	const blockSettings = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
	let settings = {};
	if ( blockSettings[ blockName ] !== undefined && typeof blockSettings[ blockName ] === 'object' ) {
		settings = blockSettings[ blockName ];
	}
	const user = ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' );
	if ( undefined === settings[ key ] ) {
		return defaultOn;
	} else if ( 'all' === settings[ key ] ) {
		return true;
	} else if ( 'contributor' === settings[ key ] && ( 'contributor' === user || 'author' === user || 'editor' === user || 'admin' === user ) ) {
		return true;
	} else if ( 'author' === settings[ key ] && ( 'author' === user || 'editor' === user || 'admin' === user ) ) {
		return true;
	} else if ( 'editor' === settings[ key ] && ( 'editor' === user || 'admin' === user ) ) {
		return true;
	} else if ( 'admin' === settings[ key ] && 'admin' === user ) {
		return true;
	}
	return false;
}
