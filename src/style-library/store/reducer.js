/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';

function libraries(state = [], action) {
	return action.type === 'RECEIVE_LIBRARIES' ? action.rows : state;
}

/**
 * The Style Library store's root reducer.
 *
 * @since TBD
 */
export const reducer = combineReducers({ libraries });
