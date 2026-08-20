/**
 * WordPress dependencies
 */
import { createReduxStore, register } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { reducer } from './reducer';
import * as actions from './actions';
import * as resolvers from './resolvers';
import * as selectors from './selectors';

export { STORE_NAME, presetsKey, paletteListingKey, paletteKey } from './constants';

import { STORE_NAME } from './constants';

/**
 * The store's config, exported separately from registration so `test-utils.js` can build the exact
 * same store fresh inside an isolated registry per test, instead of every test sharing the process-
 * wide default registry this module registers into below.
 *
 * @since TBD
 */
export const storeConfig = { reducer, actions, resolvers, selectors };

register(createReduxStore(STORE_NAME, storeConfig));
