import { useMemo } from '@wordpress/element';
/**
 * Return the proper preview size, given the current preview device
 */
export default (device, desktopSize, tabletSize, mobileSize, noHook = false) => {
	if (!noHook) {
		return useMemo(() => {
			return getPreviewSize(device, desktopSize, tabletSize, mobileSize);
		}, [device, desktopSize, tabletSize, mobileSize]);
	} 
		return getPreviewSize(device, desktopSize, tabletSize, mobileSize);
	
};

function getPreviewSize(device, desktopSize, tabletSize, mobileSize) {
	if (device === 'Mobile') {
		if (undefined !== mobileSize && '' !== mobileSize && null !== mobileSize) {
			return mobileSize;
		} else if (undefined !== tabletSize && '' !== tabletSize && null !== tabletSize) {
			return tabletSize;
		}
	} else if (device === 'Tablet') {
		if (undefined !== tabletSize && '' !== tabletSize && null !== tabletSize) {
			return tabletSize;
		}
	}
	return undefined !== desktopSize ? desktopSize : '';
}
