import {
	useMemo,
 } from '@wordpress/element';
/**
 * Return the proper preview size, given the current preview device
 */
export default ( device, desktopSize, tabletSize, mobileSize ) => {

	return useMemo( () => {
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
		return undefined !== desktopSize ? desktopSize : '';
	}, [ device, desktopSize, tabletSize, mobileSize ] );

};
