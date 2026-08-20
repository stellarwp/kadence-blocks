/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';

function libraries(state = [], action) {
	return action.type === 'RECEIVE_LIBRARIES' ? action.rows : state;
}

function presets(state = {}, action) {
	if (action.type !== 'RECEIVE_BLOCK_PRESETS') {
		return state;
	}

	return { ...state, [action.key]: action.payload };
}

/**
 * The Style Library store's root reducer.
 *
 * @since TBD
 */
export const reducer = combineReducers({ libraries, presets });
