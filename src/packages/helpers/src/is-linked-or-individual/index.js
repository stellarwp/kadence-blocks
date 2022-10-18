import { get } from 'lodash';

/**
 * See if variables are linked or individual
 */
export default ( variable, key ) => {

	let value0 = get( variable, [ key, 0 ] );
	let value1 = get( variable, [ key, 1 ] );
	let value2 = get( variable, [ key, 2 ] );
	let value3 = get( variable, [ key, 3 ] );

	if ( value0 === value1 && value0 === value2 && value0 === value3 ) {
		return 'linked';
	}

	return 'individual';
}
