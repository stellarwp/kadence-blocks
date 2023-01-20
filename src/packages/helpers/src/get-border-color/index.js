import {
	useMemo,
 } from '@wordpress/element';
 import KadenceColorOutput from '../kadence-color-output';
 function getInheritBorderColor( device, side, inheritBorder ) {
	const desktopStyle = ( undefined !== inheritBorder?.[0] ? inheritBorder?.[0] : [] );
	const tabletStyle = ( undefined !== inheritBorder?.[1] ? inheritBorder?.[1] : [] );
	const mobileStyle = ( undefined !== inheritBorder?.[2] ? inheritBorder?.[2] : [] );
	return getBorderColor( device, side, desktopStyle, tabletStyle, mobileStyle );
};
function getBorderColor( device, side = 'top', desktopStyle, tabletStyle, mobileStyle, inheritBorder = false ) {
	if ( device === 'Mobile' ) {
		if ( '' !== mobileStyle?.[0]?.[side]?.[0] ) {
			return KadenceColorOutput( mobileStyle?.[0]?.[side]?.[0] );
		} else if ( '' !== tabletStyle?.[0]?.[side]?.[0] ) {
			return KadenceColorOutput( tabletStyle?.[0]?.[side]?.[0] );
		} else if ( inheritBorder && getInheritBorderColor( device, side, inheritBorder ) ) {
			return getInheritBorderColor( device, side, inheritBorder );
		}
	} else if ( device === 'Tablet' ) {
		if ( '' !== tabletStyle?.[0]?.[side]?.[0] ) {
			return KadenceColorOutput( tabletStyle?.[0]?.[side]?.[0] );
		} else if ( inheritBorder && getInheritBorderColor( device, side, inheritBorder ) ) {
			return getInheritBorderColor( device, side, inheritBorder );
		}
	}
	if ( '' !== desktopStyle?.[0]?.[side]?.[0] ) {
		return KadenceColorOutput( desktopStyle?.[0]?.[side]?.[0] );
	} else if ( inheritBorder && getInheritBorderColor( device, side, inheritBorder ) ) {
		return getInheritBorderColor( device, side, inheritBorder );
	}
	return '';
 };
/**
 * Return the proper preview size, given the current preview device
 */
export default ( device, side = 'top', desktopStyle, tabletStyle, mobileStyle, inheritBorder = false ) => {
	return useMemo( () => {
		const borderColor = getBorderColor( device, side, desktopStyle, tabletStyle, mobileStyle, inheritBorder );
		if ( ! borderColor ) {
			return '';
		}
		return borderColor;
	}, [ device, side, desktopStyle, tabletStyle, mobileStyle, inheritBorder ] );
};
