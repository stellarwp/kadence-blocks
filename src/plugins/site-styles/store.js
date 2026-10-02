/**
 * The `kadence/site-styles` data store: which block's Kadence panel is open.
 */
import { createReduxStore, register } from '@wordpress/data';

export const STORE_NAME = 'kadence/site-styles';

const store = createReduxStore(STORE_NAME, {
	/**
	 * @param {{blockName: (string|null)}} state  The state.
	 * @param {Object}                     action The action.
	 * @return {{blockName: (string|null)}} The next state.
	 */
	reducer(state = { blockName: null }, action) {
		switch (action.type) {
			case 'OPEN_SITE_STYLES':
				return { blockName: action.blockName };
			case 'CLOSE_SITE_STYLES':
				return { blockName: null };
			default:
				return state;
		}
	},
	actions: {
		/**
		 * Opens the Kadence panel for a block.
		 *
		 * @param {string} blockName Block name, e.g. `kadence/singlebtn`.
		 * @return {Object} The action.
		 */
		openSiteStyles(blockName) {
			return { type: 'OPEN_SITE_STYLES', blockName };
		},
		/**
		 * Closes the Kadence panel.
		 *
		 * @return {Object} The action.
		 */
		closeSiteStyles() {
			return { type: 'CLOSE_SITE_STYLES' };
		},
	},
	selectors: {
		/**
		 * @param {{blockName: (string|null)}} state The state.
		 * @return {string|null} The block whose panel is open, null when it's closed.
		 */
		getOpenBlockName(state) {
			return state.blockName;
		},
	},
});

/**
 * Registers the store.
 */
export function registerSiteStylesStore() {
	register(store);
}
