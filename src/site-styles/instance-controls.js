/**
 * Keeps core's color controls out of a supported block's own inspector.
 */
import { getSupportedBlock } from './supported-blocks';

/**
 * Turns off core's color settings core also shows on the block's Styles
 * screen, for a block instance of a supported block. Instances keep Kadence's
 * own color controls; core's Styles > Blocks screen reads the Global Styles
 * settings and keeps its panels.
 *
 * @param {*}      value     The setting's value.
 * @param {string} path      The setting path, e.g. `color.background`.
 * @param {string} clientId  The block's client ID.
 * @param {string} blockName The block name.
 * @return {*} `false` for a shared color setting of a supported block, the value otherwise.
 */
export function hideCoreColorControls(value, path, clientId, blockName) {
	const block = getSupportedBlock(blockName);

	if (block && Object.values(block.attributesMap).includes(path)) {
		return false;
	}

	return value;
}
