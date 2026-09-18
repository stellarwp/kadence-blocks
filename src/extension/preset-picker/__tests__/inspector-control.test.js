/* eslint-env jest */
/**
 * Which Design Tokens control the generic inspector filter renders for a block. The decision is pure, so
 * it is asserted directly rather than through a rendered editor: the rendering in `early-filters.js` has
 * nothing left to decide once this has answered.
 */
import { designTokenInspectorControl } from '../inspector-control';

/**
 * Build the decision input, defaulting to the ordinary case: a block that supports both, has presets
 * and palettes, and does not place the control itself.
 *
 * @param {Object} overrides The fields to override.
 *
 * @since TBD
 *
 * @return {Object} The options object.
 */
function options(overrides = {}) {
	return {
		hasPreset: true,
		hasPalette: true,
		inlinePicker: false,
		presetCount: 2,
		paletteCount: 3,
		...overrides,
	};
}

describe('designTokenInspectorControl', () => {
	/**
	 * Every preset-capable block gets the preset row — the same control the Button has always used —
	 * rather than a second, different presentation.
	 *
	 * @return {void}
	 */
	it('renders the preset row for a preset-capable block', () => {
		expect(designTokenInspectorControl(options())).toBe('preset');
	});

	/**
	 * A single preset is still worth a control: it names what the block is following, and it carries
	 * reset-to-preset and "Save As a New Preset" so a site owner can branch from it.
	 *
	 * @return {void}
	 */
	it('renders the preset row when only the default preset exists', () => {
		expect(designTokenInspectorControl(options({ presetCount: 1 }))).toBe('preset');
	});

	/**
	 * The preset row carries the palette dropdown itself, so the palette must not also be surfaced
	 * separately — that would show it twice.
	 *
	 * @return {void}
	 */
	it('does not surface the palette separately alongside the preset row', () => {
		expect(designTokenInspectorControl(options({ paletteCount: 9 }))).toBe('preset');
	});

	/**
	 * A block that places the control inside its own inspector layout renders it itself.
	 *
	 * @return {void}
	 */
	it('renders nothing for a block that places the control itself', () => {
		expect(designTokenInspectorControl(options({ inlinePicker: true }))).toBeNull();
	});

	/**
	 * An inline-picker block whose library defines no presets renders nothing of its own, because the
	 * component it would render bails without presets — so its palette has to come from here instead.
	 *
	 * @return {void}
	 */
	it('falls back to the palette for an inline-picker block with no presets', () => {
		expect(designTokenInspectorControl(options({ inlinePicker: true, presetCount: 0 }))).toBe('palette');
	});

	/**
	 * A palette-only block gets the palette dropdown.
	 *
	 * @return {void}
	 */
	it('renders the palette for a block that supports palettes alone', () => {
		expect(designTokenInspectorControl(options({ hasPreset: false, presetCount: 0 }))).toBe('palette');
	});

	/**
	 * A preset-capable block whose library defines none for it falls back to its palette.
	 *
	 * @return {void}
	 */
	it('falls back to the palette when the library defines no presets for the block', () => {
		expect(designTokenInspectorControl(options({ presetCount: 0 }))).toBe('palette');
	});

	/**
	 * One palette is not a choice, so no dropdown.
	 *
	 * @return {void}
	 */
	it('renders nothing when there are fewer than two palettes and no presets', () => {
		expect(designTokenInspectorControl(options({ presetCount: 0, paletteCount: 1 }))).toBeNull();
	});

	/**
	 * A block that opts into neither gets nothing.
	 *
	 * @return {void}
	 */
	it('renders nothing for a block that supports neither', () => {
		expect(
			designTokenInspectorControl(
				options({ hasPreset: false, hasPalette: false, presetCount: 0, paletteCount: 0 })
			)
		).toBeNull();
	});
});
