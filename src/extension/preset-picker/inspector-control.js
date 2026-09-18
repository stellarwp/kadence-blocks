/**
 * Which Design Tokens control the generic inspector filter renders for a block.
 *
 * Its own module, and pure: `early-filters.js` is the plugin's editor entry point and pulls in the whole
 * filter-registration chain, so a decision that is really a small table would be untestable in isolation
 * there. Here it is the one thing the file does.
 */

/**
 * Decide between the preset row, the palette dropdown on its own, and neither.
 *
 * @param {Object}  options              The block's design-token situation.
 * @param {boolean} options.hasPreset    Whether the block declares `kbPreset` support.
 * @param {boolean} options.hasPalette   Whether the block declares `kbPalette` support.
 * @param {boolean} options.inlinePicker Whether its `kbPreset` support requests `inlinePicker`.
 * @param {number}  options.presetCount  How many presets the active library defines for it.
 * @param {number}  options.paletteCount How many palettes are selectable.
 *
 * @since TBD
 *
 * @return {?string} `'preset'`, `'palette'`, or null when the filter renders nothing.
 */
export function designTokenInspectorControl({ hasPreset, hasPalette, inlinePicker, presetCount, paletteCount }) {
	// A block whose kbPreset support requests `inlinePicker` renders PresetButton from inside its own
	// inspector layout. That is a placement choice, not a different control — the filter renders the same
	// component for every other block — so when a block has opted in, it renders neither control.
	//
	// Qualified on the block actually having presets, because PresetButton renders nothing without them: an
	// inline block whose active library defines none would otherwise lose its palette dropdown too, since
	// PresetButton is what would have carried it.
	if (inlinePicker && presetCount > 0) {
		return null;
	}

	if (hasPreset && presetCount > 0) {
		return 'preset';
	}

	// Reached only when no preset control renders: PresetButton carries the palette dropdown itself, so
	// surfacing it here as well would show it twice.
	return hasPalette && paletteCount >= 2 ? 'palette' : null;
}
