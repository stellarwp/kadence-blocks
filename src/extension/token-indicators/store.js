/**
 * A tiny @wordpress/data store holding the editor-wide "highlight edits" flag: when on, controls that
 * have overridden their preset value are visually emphasized. Toggled from the preset picker's
 * actions (Part D) and read by the token indicators (Part C). Editor-session state only — never persisted.
 */

import { createReduxStore, register } from '@wordpress/data';

const STORE_NAME = 'kadence/token-indicators';

const DEFAULT_STATE = { highlightEdits: false };

const actions = {
	/**
	 * Set the highlight-edits flag.
	 *
	 * @param {boolean} on Whether to highlight overridden controls.
	 *
	 * @since TBD
	 *
	 * @return {Object} The action.
	 */
	setHighlightEdits(on) {
		return { type: 'SET_HIGHLIGHT_EDITS', on: !!on };
	},
};

const selectors = {
	/**
	 * Whether highlight-edits is on.
	 *
	 * @param {Object} state The store state.
	 *
	 * @since TBD
	 *
	 * @return {boolean} True when overridden controls should be highlighted.
	 */
	isHighlightingEdits(state) {
		return state.highlightEdits;
	},
};

/**
 * The highlight-edits reducer.
 *
 * @param {Object} state  The current state.
 * @param {Object} action The dispatched action.
 *
 * @since TBD
 *
 * @return {Object} The next state.
 */
function reducer(state = DEFAULT_STATE, action) {
	if (action.type === 'SET_HIGHLIGHT_EDITS') {
		return { ...state, highlightEdits: action.on };
	}

	return state;
}

const store = createReduxStore(STORE_NAME, { reducer, actions, selectors });

register(store);

export const TOKEN_INDICATORS_STORE = STORE_NAME;
