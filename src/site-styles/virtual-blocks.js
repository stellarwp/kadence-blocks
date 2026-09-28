/**
 * Client IDs of blocks that already carry site values (the Kadence panel's
 * virtual block and its preview), which the editor overlay must skip.
 */
const virtualClientIds = new Set();

/**
 * @param {string} clientId A block client ID.
 */
export function addVirtualBlock(clientId) {
	virtualClientIds.add(clientId);
}

/**
 * @param {string} clientId A block client ID.
 */
export function removeVirtualBlock(clientId) {
	virtualClientIds.delete(clientId);
}

/**
 * @param {string} clientId A block client ID.
 * @return {boolean} Whether the block is virtual.
 */
export function isVirtualBlock(clientId) {
	return virtualClientIds.has(clientId);
}
