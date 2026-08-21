/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { EMPTY_OPTIMISTIC_SWATCH_EDIT, EMPTY_OPTIMISTIC_SCALE_EDIT } from './constants';

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

function optimisticSwatchEdits(state = {}, action) {
	const current = state[action.key] ?? EMPTY_OPTIMISTIC_SWATCH_EDIT;

	switch (action.type) {
		case 'SET_OPTIMISTIC_SWATCH_PATCH':
			return {
				...state,
				[action.key]: { ...current, patches: { ...current.patches, [action.token]: action.patch } },
			};
		case 'CLEAR_OPTIMISTIC_SWATCH_PATCH': {
			const { [action.token]: _removed, ...patches } = current.patches;
			return { ...state, [action.key]: { ...current, patches } };
		}
		case 'SET_OPTIMISTIC_DELETION': {
			const listKey = action.kind === 'group' ? 'deletedGroups' : 'deletedTokens';
			return { ...state, [action.key]: { ...current, [listKey]: [...current[listKey], action.id] } };
		}
		case 'CLEAR_OPTIMISTIC_DELETION': {
			const listKey = action.kind === 'group' ? 'deletedGroups' : 'deletedTokens';
			return {
				...state,
				[action.key]: { ...current, [listKey]: current[listKey].filter((id) => id !== action.id) },
			};
		}
		case 'SET_OPTIMISTIC_ADDITION': {
			const listKey = action.kind === 'group' ? 'addedGroups' : 'addedSwatches';
			return { ...state, [action.key]: { ...current, [listKey]: [...current[listKey], action.entry] } };
		}
		case 'CLEAR_OPTIMISTIC_ADDITION': {
			const listKey = action.kind === 'group' ? 'addedGroups' : 'addedSwatches';
			const idKey = action.kind === 'group' ? 'id' : 'token';
			return {
				...state,
				[action.key]: { ...current, [listKey]: current[listKey].filter((entry) => entry[idKey] !== action.id) },
			};
		}
		default:
			return state;
	}
}

function optimisticScaleEdits(state = {}, action) {
	const current = state[action.slug] ?? EMPTY_OPTIMISTIC_SCALE_EDIT;

	switch (action.type) {
		case 'SET_OPTIMISTIC_SCALE_PATCH':
			return {
				...state,
				[action.slug]: { ...current, patches: { ...current.patches, [action.tokenId]: action.patch } },
			};
		case 'CLEAR_OPTIMISTIC_SCALE_PATCH': {
			const { [action.tokenId]: _removed, ...patches } = current.patches;
			return { ...state, [action.slug]: { ...current, patches } };
		}
		case 'SET_OPTIMISTIC_SCALE_DELETION':
			return {
				...state,
				[action.slug]: { ...current, deletedTokens: [...current.deletedTokens, action.tokenId] },
			};
		case 'CLEAR_OPTIMISTIC_SCALE_DELETION':
			return {
				...state,
				[action.slug]: {
					...current,
					deletedTokens: current.deletedTokens.filter((id) => id !== action.tokenId),
				},
			};
		default:
			return state;
	}
}

function paletteBusy(state = {}, action) {
	if (action.type !== 'SET_PALETTE_BUSY') {
		return state;
	}

	return { ...state, [action.key]: action.isBusy };
}

function scaleBusy(state = {}, action) {
	if (action.type !== 'SET_SCALE_BUSY') {
		return state;
	}

	return { ...state, [action.slug]: action.isBusy };
}

/**
 * The Style Library store's root reducer.
 *
 * @since TBD
 */
export const reducer = combineReducers({
	libraries,
	presets,
	paletteListings,
	feeds,
	optimisticSwatchEdits,
	optimisticScaleEdits,
	paletteBusy,
	scaleBusy,
});
