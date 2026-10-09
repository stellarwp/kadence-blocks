/**
 * Block Defaults give way to site-level styles for supported blocks in FSE mode.
 */
import { getSupportedBlock, isFseMode } from './supported-blocks';

/**
 * Registers `noCustomDefaults` with a default of `true` on a supported block in
 * FSE mode, so `setBlockDefaults()` / `getBlockDefaults()` skip its stored Block
 * Defaults at insert. The default isn't serialized, so saved markup is
 * unchanged; the stored option is never touched.
 *
 * @param {Object} settings Block settings.
 * @param {string} name     Block name.
 * @return {Object} The settings, with the gate for a supported block.
 */
export function gateBlockDefaults(settings, name) {
	if (!getSupportedBlock(name) || !isFseMode()) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			noCustomDefaults: { ...settings.attributes?.noCustomDefaults, type: 'boolean', default: true },
		},
	};
}
