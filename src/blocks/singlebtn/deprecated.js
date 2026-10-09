/**
 * Deprecated versions of the single button block.
 *
 * The block is dynamic, so a saved version never fails validation; the one entry here exists to run its
 * `migrate` on load, when `isEligible` says the saved attributes still use the retired "Button Inherit
 * Styles" value in place of a preset.
 */

/**
 * Internal dependencies
 */
import metadata from './block.json';
import { LEGACY_PRESETS } from '../../extension/preset-picker/legacy';

/**
 * Whether a saved button still carries a retired inherit style that maps to a preset, and no preset yet.
 * Fill and an empty value map to nothing, so they leave the block as it is.
 *
 * @param {Object} attributes The saved attributes.
 *
 * @since TBD
 *
 * @return {boolean} True when the block needs the migration.
 */
export function needsPresetMigration(attributes) {
	return !attributes?.kbPreset && Boolean(LEGACY_PRESETS[attributes?.inheritStyles]);
}

/**
 * Write the preset the retired inherit style maps to, and clear the retired value, so the picker shows
 * the preset the front end already renders for the button.
 *
 * @param {Object} attributes The saved attributes.
 *
 * @since TBD
 *
 * @return {Object} The migrated attributes.
 */
export function migrateToPreset(attributes) {
	return {
		...attributes,
		kbPreset: LEGACY_PRESETS[attributes.inheritStyles],
		inheritStyles: '',
	};
}

export default [
	{
		attributes: metadata.attributes,
		supports: metadata.supports,
		save: () => null,
		isEligible: needsPresetMigration,
		migrate: migrateToPreset,
	},
];
