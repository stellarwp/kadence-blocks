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

function paletteListings(state = {}, action) {
	if (action.type !== 'RECEIVE_PALETTE_LISTING') {
		return state;
	}

	return { ...state, [action.key]: action.rows };
}

function feeds(state = {}, action) {
	if (action.type !== 'RECEIVE_DESIGN_TOKENS_FEED') {
		return state;
	}

	return { ...state, [action.slug]: action.feed };
}

/**
 * The Style Library store's root reducer.
 *
 * @since TBD
 */
export const reducer = combineReducers({ libraries, presets, paletteListings, feeds });
