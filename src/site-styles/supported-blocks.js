/**
 * The blocks that take site-level styles, from the data the server adds in FSE mode.
 */

/**
 * @typedef {Object} SupportedBlock
 * @property {string}                 slug      Key under `settings.custom.kadence` in Global Styles.
 * @property {string[]}               exclude   Content attributes that are never stored site-wide.
 * @property {Object<string, string>} attributesMap Block attribute => path in the block's core style, e.g. `color.background`.
 * @property {Object}                 supports  Core supports added in FSE mode.
 */

/**
 * @param {string} name Block name, e.g. `kadence/singlebtn`.
 * @return {SupportedBlock|undefined} The block's entry, undefined when it isn't supported.
 */
export function getSupportedBlock(name) {
	const blocks = getBlocks();

	return Object.prototype.hasOwnProperty.call(blocks, name) ? blocks[name] : undefined;
}

/**
 * @return {string[]} The names of every supported block.
 */
export function getSupportedBlockNames() {
	return Object.keys(getBlocks());
}

/**
 * @return {boolean} Whether the Kadence theme runs in its FSE mode, from the data the server adds.
 */
export function isFseMode() {
	return true === window.kadenceSiteStyles?.isFseMode;
}

/**
 * @return {Object<string, SupportedBlock>} Block name => entry; empty outside FSE mode or without the server data.
 */
function getBlocks() {
	return window.kadenceSiteStyles?.blocks || {};
}
