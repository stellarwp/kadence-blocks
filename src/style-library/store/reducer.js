/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	EMPTY_OPTIMISTIC_SWATCH_EDIT,
	EMPTY_OPTIMISTIC_SCALE_EDIT,
	isLibraryScopedKey,
	isPresetsKeyForLibrary,
} from './constants';

/**
 * Drop every entry of a keyed slice whose key addresses `slug`.
 *
 * Returns the original `state` by reference when nothing matched, so forgetting a library that
 * has no entry in a given slice cannot make `useSelect` see a changed result and re-render every
 * consumer of that slice for nothing.
 *
 * @param {Object}   state   The slice.
 * @param {string}   slug    Token library slug.
 * @param {Function} matches `(key, slug) => boolean`, the predicate for this slice's key shape.
 *
 * @since TBD
 *
 * @return {Object} The slice without the matching entries, or `state` itself when none matched.
 */
function omitLibraryEntries(state, slug, matches) {
	const kept = Object.fromEntries(Object.entries(state).filter(([key]) => !matches(key, slug)));

	return Object.keys(kept).length === Object.keys(state).length ? state : kept;
}

/**
 * The predicate for the slices keyed by the slug alone (`optimisticScaleEdits`, `scaleBusy`).
 *
 * @param {string} key  The state key.
 * @param {string} slug Token library slug.
 *
 * @since TBD
 *
 * @return {boolean} True when the key addresses that library.
 */
function isBareLibraryKey(key, slug) {
	return key === slug;
}

function libraries(state = [], action) {
	return action.type === 'RECEIVE_LIBRARIES' ? action.rows : state;
}

function presets(state = {}, action) {
	if (action.type === 'FORGET_LIBRARY') {
		return omitLibraryEntries(state, action.slug, isPresetsKeyForLibrary);
	}

	if (action.type !== 'RECEIVE_BLOCK_PRESETS') {
		return state;
	}

	return { ...state, [action.key]: action.payload };
}

function paletteListings(state = {}, action) {
	if (action.type === 'FORGET_LIBRARY') {
		return omitLibraryEntries(state, action.slug, isLibraryScopedKey);
	}

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
		case 'FORGET_LIBRARY':
			return omitLibraryEntries(state, action.slug, isLibraryScopedKey);
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
		case 'SET_OPTIMISTIC_SCALE_ADDITION':
			return {
				...state,
				[action.slug]: { ...current, addedTokens: [...current.addedTokens, action.entry] },
			};
		case 'CLEAR_OPTIMISTIC_SCALE_ADDITION':
			return {
				...state,
				[action.slug]: {
					...current,
					addedTokens: current.addedTokens.filter((entry) => entry.id !== action.tokenId),
				},
			};
		case 'FORGET_LIBRARY':
			return omitLibraryEntries(state, action.slug, isBareLibraryKey);
		default:
			return state;
	}
}

function paletteBusy(state = {}, action) {
	if (action.type === 'FORGET_LIBRARY') {
		return omitLibraryEntries(state, action.slug, isLibraryScopedKey);
	}

	if (action.type !== 'SET_PALETTE_BUSY') {
		return state;
	}

	return { ...state, [action.key]: action.isBusy };
}

function scaleBusy(state = {}, action) {
	if (action.type === 'FORGET_LIBRARY') {
		return omitLibraryEntries(state, action.slug, isBareLibraryKey);
	}

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
