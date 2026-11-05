/*
 * The blocks a conversion from a core Heading has just created. A converted heading arrives with the
 * default tag and no uniqueID, like a new default block, so the editor can only tell them apart here.
 */
const convertedHeadings = new Set();

/**
 * Remembers a block that was created by converting a core Heading.
 *
 * @param {string} clientId The new block's client ID.
 *
 * @since 3.9.0
 *
 * @return {void}
 */
export function markConvertedHeading(clientId) {
	convertedHeadings.add(clientId);
}

/**
 * Whether a block was created by converting a core Heading.
 *
 * @param {string} clientId The block's client ID.
 *
 * @since 3.9.0
 *
 * @return {boolean} True for a converted heading.
 */
export function isConvertedHeading(clientId) {
	return convertedHeadings.has(clientId);
}
