/**
 * FSE-only core supports for the blocks that take site-level styles.
 */
import { getSupportedBlock, isFseMode } from './supported-blocks';

/**
 * Adds the supported block's core supports in FSE mode, matching the
 * server-side `block_type_metadata` filter. Kadence registers its blocks from
 * their own `block.json` in JS, whose `supports` replace the server's. It
 * declares no `selectors`, so the server's reach the editor unchanged.
 *
 * @param {Object} settings Block settings.
 * @param {string} name     Block name.
 * @return {Object} The settings, with the FSE-only supports for a supported block.
 */
export function addSiteStylesSupports(settings, name) {
	const block = getSupportedBlock(name);

	if (!block || !isFseMode()) {
		return settings;
	}

	return {
		...settings,
		supports: { ...settings.supports, ...block.supports },
	};
}
