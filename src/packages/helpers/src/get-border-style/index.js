import {
	useMemo,
 } from '@wordpress/element';
 import KadenceColorOutput from '../kadence-color-output';

function getBorderColor( device, side = 'top', desktopStyle, tabletStyle, mobileStyle ) {
	if ( device === 'Mobile' ) {
		if ( '' !== mobileStyle?.[0]?.[side]?.[0] ) {
			return KadenceColorOutput( mobileStyle?.[0]?.[side]?.[0] );
		} else if ( '' !== tabletStyle?.[0]?.[side]?.[0] ) {
			return KadenceColorOutput( tabletStyle?.[0]?.[side]?.[0] );
		}
	} else if ( device === 'Tablet' ) {
		if ( '' !== tabletStyle?.[0]?.[side]?.[0] ) {
			return KadenceColorOutput( tabletStyle?.[0]?.[side]?.[0] );
		}
	}
	if ( '' !== desktopStyle?.[0]?.[side]?.[0] ) {
		return KadenceColorOutput( desktopStyle?.[0]?.[side]?.[0] );
	}
	return '';
 };
 function getBorderFormat( device, side = 'top', desktopStyle, tabletStyle, mobileStyle ) {
	if ( device === 'Mobile' ) {
		if ( '' !== mobileStyle?.[0]?.[side]?.[1] ) {
			return mobileStyle?.[0]?.[side]?.[1];
		} else if ( '' !== tabletStyle?.[0]?.[side]?.[1] ) {
			return tabletStyle?.[0]?.[side]?.[1];
		}
	} else if ( device === 'Tablet' ) {
		if ( '' !== tabletStyle?.[0]?.[side]?.[1] ) {
			return tabletStyle?.[0]?.[side]?.[1];
		}
	}
	if ( '' !== desktopStyle?.[0]?.[side]?.[1] ) {
		return desktopStyle?.[0]?.[side]?.[1];
	}
	return '';
 };
function getBorderWidth( device, side = 'top', desktopStyle, tabletStyle, mobileStyle ) {
	if ( device === 'Mobile' ) {
		if ( '' !== tabletStyle?.[0]?.[side]?.[2] ) {
			return mobileStyle?.[0]?.[side]?.[2] + ( mobileStyle?.[0]?.['unit'] ? mobileStyle?.[0]?.['unit'] : 'px' );
		} else if ( '' !== tabletStyle?.[0]?.[side]?.[2] ) {
			return tabletStyle?.[0]?.[side]?.[2] + ( tabletStyle?.[0]?.['unit'] ? tabletStyle?.[0]?.['unit'] : 'px' );
		}
	} else if ( device === 'Tablet' ) {
		if ( '' !== tabletStyle?.[0]?.[side]?.[2] ) {
			return tabletStyle?.[0]?.[side]?.[2] + ( tabletStyle?.[0]?.['unit'] ? tabletStyle?.[0]?.['unit'] : 'px' );
		}
	}
	if ( '' !== desktopStyle?.[0]?.[side]?.[2] ) {
		return desktopStyle?.[0]?.[side]?.[2] + ( desktopStyle?.[0]?.['unit'] ? desktopStyle?.[0]?.['unit'] : 'px' );
	}
	return '';
};

/**
 * Return the proper preview size, given the current preview device
 */
export default ( device, side = 'top', desktopStyle, tabletStyle, mobileStyle ) => {
	return useMemo( () => {
		const borderWidth = getBorderWidth( device, side, desktopStyle, tabletStyle, mobileStyle );
		if ( ! borderWidth ) {
			return '';
		}
		let borderColor = getBorderColor( device, side, desktopStyle, tabletStyle, mobileStyle );
		if ( ! borderColor ) {
			borderColor = 'transparent';
		}
		let borderStyle = getBorderFormat( device, side, desktopStyle, tabletStyle, mobileStyle );
		if ( ! borderStyle ) {
			borderStyle = 'solid';
		}
		return borderWidth + ' ' + borderStyle + ' ' + borderColor;
	}, [ device, side, desktopStyle, tabletStyle, mobileStyle ] );
};
