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
