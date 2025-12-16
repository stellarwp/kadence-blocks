import {
	useMemo,
 } from '@wordpress/element';
 import KadenceColorOutput from '../kadence-color-output';
 function getInheritBorderWidth( device, side, inheritBorder ) {
	const desktopStyle = ( undefined !== inheritBorder?.[0] ? inheritBorder?.[0] : [] );
	const tabletStyle = ( undefined !== inheritBorder?.[1] ? inheritBorder?.[1] : [] );
	const mobileStyle = ( undefined !== inheritBorder?.[2] ? inheritBorder?.[2] : [] );
	return getBorderWidth( device, side, desktopStyle, tabletStyle, mobileStyle );
};
function getBorderWidth( device, side = 'top', desktopStyle, tabletStyle, mobileStyle, inheritBorder = false ) {
	if ( device === 'Mobile' ) {
		if ( undefined !== mobileStyle?.[0]?.[side]?.[2] && '' !== mobileStyle?.[0]?.[side]?.[2] ) {
			return mobileStyle?.[0]?.[side]?.[2] + getBorderUnit( device, desktopStyle, tabletStyle, mobileStyle, inheritBorder );
		} else if ( '' !== tabletStyle?.[0]?.[side]?.[2] ) {
			return tabletStyle?.[0]?.[side]?.[2] + getBorderUnit( device, desktopStyle, tabletStyle, mobileStyle, inheritBorder );
		} else if ( inheritBorder && getInheritBorderWidth( device, side, inheritBorder ) ) {
			return getInheritBorderWidth( device, side, inheritBorder );
		}
	} else if ( device === 'Tablet' ) {
		if ( undefined !== tabletStyle?.[0]?.[side]?.[2] && '' !== tabletStyle?.[0]?.[side]?.[2] ) {
			return tabletStyle?.[0]?.[side]?.[2] + getBorderUnit( device, desktopStyle, tabletStyle, mobileStyle, inheritBorder );
		} else if ( inheritBorder && getInheritBorderWidth( device, side, inheritBorder ) ) {
			return getInheritBorderWidth( device, side, inheritBorder );
		}
	}
	if ( undefined !== desktopStyle?.[0]?.[side]?.[2] && '' !== desktopStyle?.[0]?.[side]?.[2] ) {
		return desktopStyle?.[0]?.[side]?.[2] + getBorderUnit( device, desktopStyle, tabletStyle, mobileStyle, inheritBorder );
	} else if ( inheritBorder && getInheritBorderWidth( device, side, inheritBorder ) ) {
		return getInheritBorderWidth( device, side, inheritBorder );
	}
	return '';
};
function getInheritBorderUnit( device, inheritBorder ) {
	const desktopStyle = ( undefined !== inheritBorder?.[0] ? inheritBorder?.[0] : [] );
	const tabletStyle = ( undefined !== inheritBorder?.[1] ? inheritBorder?.[1] : [] );
	const mobileStyle = ( undefined !== inheritBorder?.[2] ? inheritBorder?.[2] : [] );
	return getBorderUnit( device, desktopStyle, tabletStyle, mobileStyle );
 };
 function getBorderUnit( device, desktopStyle, tabletStyle, mobileStyle, inheritBorder = false ) {
	 if ( device === 'Mobile' ) {
		 if ( undefined !== mobileStyle?.[0]?.unit && '' !== mobileStyle?.[0]?.unit ) {
			 return mobileStyle[0].unit;
		 } else if ( undefined !== tabletStyle?.[0]?.unit && '' !== tabletStyle?.[0]?.unit ) {
			 return tabletStyle[0].unit;
		 } else if ( inheritBorder && getInheritBorderUnit( device, inheritBorder ) ) {
			 return getInheritBorderUnit( device, inheritBorder );
		 }
	 } else if ( device === 'Tablet' ) {
		 if ( undefined !== tabletStyle?.[0]?.unit && '' !== tabletStyle?.[0]?.unit ) {
			 return tabletStyle[0].unit;
		 } else if ( inheritBorder && getInheritBorderUnit( device, inheritBorder ) ) {
			 return getInheritBorderUnit( device, inheritBorder );
		 }
	 }
	 if ( undefined !== desktopStyle?.[0]?.unit && '' !== desktopStyle?.[0]?.unit ) {
		 return desktopStyle[0].unit;
	 } else if ( inheritBorder && getInheritBorderUnit( device, inheritBorder ) ) {
		 return getInheritBorderUnit( device, inheritBorder );
	 }
	 return 'px';
 };
/**
 * Return the proper preview size, given the current preview device
 */
export default ( device, side = 'top', desktopStyle, tabletStyle, mobileStyle, inheritBorder = false ) => {
	return useMemo( () => {
		const borderWidth = getBorderWidth( device, side, desktopStyle, tabletStyle, mobileStyle, inheritBorder );
		if ( ! borderWidth ) {
			return '';
		}
		return borderWidth;
	}, [ device, side, desktopStyle, tabletStyle, mobileStyle, inheritBorder ] );
};