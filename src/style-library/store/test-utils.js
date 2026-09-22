/**
 * WordPress dependencies
 */
import { createRegistry, createReduxStore } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME, storeConfig } from './index';

/**
 * Build an isolated `@wordpress/data` registry with the Style Library store registered fresh. Every
 * hook test in this app uses this instead of the default registry `index.js` registers into at
 * import time — the default registry is a process-wide singleton, so sharing it across tests would
 * let one test's writes leak into the next test's reads.
 *
 * @since TBD
 *
 * @return {Object} A registry with only this store registered.
 */
export function createTestRegistry() {
	const registry = createRegistry();
	registry.register(createReduxStore(STORE_NAME, storeConfig));
	return registry;
}
