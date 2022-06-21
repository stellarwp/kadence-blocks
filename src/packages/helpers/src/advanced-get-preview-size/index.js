/**
 * Return the proper preview size, given the current preview device
 */
export default ( device, index, desktopData, tabletData, mobileData ) => {
	const desktopSize = ( undefined !== desktopData[ index ] ? desktopData[ index ] : '' );
	const tabletSize = ( undefined !== tabletData[ index ] ? tabletData[ index ] : '' );
	const mobileSize = ( undefined !== mobileData[ index ] ? mobileData[ index ] : '' );
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
};
