/**
 * Return the icon given a unit
 */

/**
 * Import Icons
 */
import {
	percentIcon,
	pxIcon,
	emIcon,
	vhIcon,
	vwIcon,
	remIcon,
} from '@kadence/icons';

export default ( unit ) => {

	const lowerUnit = unit.toLowerCase();

	if ( lowerUnit === '%' ) {
		return percentIcon;
	} else if ( lowerUnit === 'em' ) {
		return emIcon;
	} else if ( lowerUnit === 'vh' ) {
		return vhIcon;
	} else if ( lowerUnit === 'vw' ) {
		return vwIcon;
	} else if ( lowerUnit === 'rem' ) {
		return remIcon;
	}

	return pxIcon;
};
