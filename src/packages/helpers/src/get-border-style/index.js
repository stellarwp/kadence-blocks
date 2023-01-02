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
 function getInheritBorderFormat( device, side, inheritBorder ) {
	const desktopStyle = ( undefined !== inheritBorder?.[0] ? inheritBorder?.[0] : [] );
	const tabletStyle = ( undefined !== inheritBorder?.[1] ? inheritBorder?.[1] : [] );
	const mobileStyle = ( undefined !== inheritBorder?.[2] ? inheritBorder?.[2] : [] );
	return getBorderFormat( device, side, desktopStyle, tabletStyle, mobileStyle );
};
 function getBorderFormat( device, side = 'top', desktopStyle, tabletStyle, mobileStyle, inheritBorder = false ) {
	if ( device === 'Mobile' ) {
		if ( '' !== mobileStyle?.[0]?.[side]?.[1] ) {
			return mobileStyle?.[0]?.[side]?.[1];
		} else if ( '' !== tabletStyle?.[0]?.[side]?.[1] ) {
			return tabletStyle?.[0]?.[side]?.[1];
		} else if ( inheritBorder && getInheritBorderFormat( device, side, inheritBorder ) ) {
			return getInheritBorderFormat( device, side, inheritBorder );
		}
	} else if ( device === 'Tablet' ) {
		if ( '' !== tabletStyle?.[0]?.[side]?.[1] ) {
			return tabletStyle?.[0]?.[side]?.[1];
		} else if ( inheritBorder && getInheritBorderFormat( device, side, inheritBorder ) ) {
			return getInheritBorderFormat( device, side, inheritBorder );
		}
	}
	if ( '' !== desktopStyle?.[0]?.[side]?.[1] ) {
		return desktopStyle?.[0]?.[side]?.[1];
	} else if ( inheritBorder && getInheritBorderFormat( device, side, inheritBorder ) ) {
		return getInheritBorderFormat( device, side, inheritBorder );
	}
	return '';
 };
 function getInheritBorderWidth( device, side, inheritBorder ) {
	const desktopStyle = ( undefined !== inheritBorder?.[0] ? inheritBorder?.[0] : [] );
	const tabletStyle = ( undefined !== inheritBorder?.[1] ? inheritBorder?.[1] : [] );
	const mobileStyle = ( undefined !== inheritBorder?.[2] ? inheritBorder?.[2] : [] );
	return getBorderWidth( device, side, desktopStyle, tabletStyle, mobileStyle );
};
function getBorderWidth( device, side = 'top', desktopStyle, tabletStyle, mobileStyle, inheritBorder = false ) {
	if ( device === 'Mobile' ) {
		if ( '' !== mobileStyle?.[0]?.[side]?.[2] ) {
			return mobileStyle?.[0]?.[side]?.[2] + ( mobileStyle?.[0]?.['unit'] ? mobileStyle?.[0]?.['unit'] : 'px' );
		} else if ( '' !== tabletStyle?.[0]?.[side]?.[2] ) {
			return tabletStyle?.[0]?.[side]?.[2] + ( tabletStyle?.[0]?.['unit'] ? tabletStyle?.[0]?.['unit'] : 'px' );
		} else if ( inheritBorder && getInheritBorderWidth( device, side, inheritBorder ) ) {
			return getInheritBorderWidth( device, side, inheritBorder );
		}
	} else if ( device === 'Tablet' ) {
		if ( '' !== tabletStyle?.[0]?.[side]?.[2] ) {
			return tabletStyle?.[0]?.[side]?.[2] + ( tabletStyle?.[0]?.['unit'] ? tabletStyle?.[0]?.['unit'] : 'px' );
		} else if ( inheritBorder && getInheritBorderWidth( device, side, inheritBorder ) ) {
			return getInheritBorderWidth( device, side, inheritBorder );
		}
	}
	if ( '' !== desktopStyle?.[0]?.[side]?.[2] ) {
		return desktopStyle?.[0]?.[side]?.[2] + ( desktopStyle?.[0]?.['unit'] ? desktopStyle?.[0]?.['unit'] : 'px' );
	} else if ( inheritBorder && getInheritBorderWidth( device, side, inheritBorder ) ) {
		return getInheritBorderWidth( device, side, inheritBorder );
	}
	return '';
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
		let borderColor = getBorderColor( device, side, desktopStyle, tabletStyle, mobileStyle, inheritBorder );
		if ( ! borderColor ) {
			borderColor = 'transparent';
		}
		let borderStyle = getBorderFormat( device, side, desktopStyle, tabletStyle, mobileStyle, inheritBorder );
		if ( ! borderStyle ) {
			borderStyle = 'solid';
		}
		return borderWidth + ' ' + borderStyle + ' ' + borderColor;
	}, [ device, side, desktopStyle, tabletStyle, mobileStyle, inheritBorder ] );
};
