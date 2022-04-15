/**
 * Helper functions
 */

/**
 * Return the proper preview size, given the current preview device
 */
export function getPreviewSize( device, desktopSize, tabletSize, mobileSize ) {
	if ( device === 'Mobile' ) {
		if ( undefined !== mobileSize && '' !== mobileSize && null !== mobileSize ) {
			return mobileSize;
		} else if ( undefined !== tabletSize && '' !== tabletSize && null !== tabletSize ) {
			return tabletSize;
		}
	} else if ( device === 'Tablet' ) {
		if ( undefined !== tabletSize && '' !== tabletSize && null !== tabletSize ) {
			return tabletSize;
		}
	}
	return desktopSize;
}

export function showSettings( key, blockName ) {
	const blockSettings = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
	let settings = {};
	if ( blockSettings[ blockName ] !== undefined && typeof blockSettings[ blockName ] === 'object' ) {
		settings = blockSettings[ blockName ];
	}
	const user = ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' );
	if ( undefined === settings[ key ] || 'all' === settings[ key ] ) {
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