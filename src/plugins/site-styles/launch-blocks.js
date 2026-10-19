/**
 * Which Kadence panels a core Styles > Blocks screen opens.
 *
 * Core lists only blocks with core supports, so a supported block without any,
 * such as a wrapper, is reached from the screen of a block it contains.
 */
import { getBlockType, getBlockTypes } from '@wordpress/blocks';
import { getSupportedBlock } from '../../site-styles/supported-blocks';

/**
 * @param {string} name Block name.
 *
 * @since TBD
 *
 * @return {boolean} Whether core lists the block, i.e. it gets core supports.
 */
function isListedByCore(name) {
	return Object.keys(getSupportedBlock(name)?.supports || {}).length > 0;
}

/**
 * The supported block a screen is for, from the screen's title. Only blocks
 * core lists count, so core's own Icon never opens a Kadence panel, and a title
 * another registered block shares matches nothing: the screen can't tell them apart.
 *
 * @param {string|undefined} title The screen's title.
 *
 * @since TBD
 *
 * @return {string|undefined} Block name.
 */
export function screenBlockName(title) {
	const matches = getBlockTypes().filter((type) => type.title === title);

	return matches.length === 1 && isListedByCore(matches[0].name) ? matches[0].name : undefined;
}

/**
 * The panels a block's screen opens: the block's own, then those of the
 * supported blocks it can be placed in that core doesn't list.
 *
 * @param {string} blockName Block name.
 *
 * @since TBD
 *
 * @return {string[]} Block names.
 */
export function launchBlockNames(blockName) {
	const parents = (getBlockType(blockName)?.parent || []).filter(
		(name) => getSupportedBlock(name) && getBlockType(name) && !isListedByCore(name)
	);

	return [blockName, ...parents];
}
