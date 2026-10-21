/**
 * Which Kadence panels a core Styles > Blocks screen opens.
 *
 * Core lists only blocks with core supports, so a supported block without any,
 * such as a wrapper, is reached from the screen of a block it contains. One no
 * other block's screen opens, such as Spacer, opens from its own screen, which
 * core keeps for every block type even when it doesn't list it.
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
 * @param {string} name Block name.
 *
 * @since TBD
 *
 * @return {boolean} Whether another supported block's screen opens the block's panel: a supported block can be
 * placed in it.
 */
function isOpenedFromAnotherScreen(name) {
	return getBlockTypes().some(
		(type) => type.name !== name && getSupportedBlock(type.name) && (type.parent || []).includes(name)
	);
}

/**
 * The supported block a screen is for, from the screen's title. A block core
 * lists counts, and so does one no other block's screen opens. A block another
 * screen opens doesn't, so core's own Icon never opens the Kadence Icon panel,
 * and a title another registered block shares matches nothing: the screen
 * can't tell them apart.
 *
 * @param {string|undefined} title The screen's title.
 *
 * @since TBD
 *
 * @return {string|undefined} Block name.
 */
export function screenBlockName(title) {
	const matches = getBlockTypes().filter((type) => type.title === title);

	if (matches.length !== 1 || !getSupportedBlock(matches[0].name)) {
		return undefined;
	}

	const { name } = matches[0];

	return isListedByCore(name) || !isOpenedFromAnotherScreen(name) ? name : undefined;
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
