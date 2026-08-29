/**
 * The public surface of the shared token-control library.
 *
 * Both hosts import from here rather than reaching into `atoms/`, `molecules/`, `organisms/` and
 * `helpers/` individually. The layering underneath is how the library is organized, not a contract
 * its consumers should have to know: a component moving between layers is a refactor, and it should
 * not be a breaking change for the block editor or the Style Library.
 *
 * Anything not exported here is internal. Adding an export is a deliberate act — it is the moment a
 * piece becomes something the other host may depend on.
 */

/**
 * Internal dependencies
 */
export { BindingIndicator } from './atoms/BindingIndicator';
export { TokenChip } from './atoms/TokenChip';
export { TokenPickerButton } from './molecules/TokenPickerButton';
export { TokenPopover } from './molecules/TokenPopover';
export { FontFamilyPopover } from './molecules/FontFamilyPopover';
export { TokenSelector } from './organisms/TokenSelector';
export { FontFamilySelector } from './organisms/FontFamilySelector';
export { ControlShell } from './templates/ControlShell';
export { SlotGrid } from './templates/SlotGrid';
export { BoxControl } from './controls/BoxControl';
export { ColorControl } from './controls/ColorControl';
export { ColorControlGroup } from './controls/ColorControlGroup';
export { ScalarControl } from './controls/ScalarControl';
export { ColorPicker } from './molecules/ColorPicker';

export { BreakpointProvider, useBreakpoint } from './context/breakpoint';

export { CATALOG_RENDER_CAP, filterCatalogOptions } from './helpers/catalog-filter';
export { sameFamily } from './helpers/font-family';
export { FONT_LOAD_TIMEOUT, ensureStylesheet, googleFontHref, loadFontFamily } from './helpers/font-loading';
export { parseCssLength } from './helpers/parse-css-length';
export {
	KADENCE_TOKEN_NAMESPACE,
	ENVELOPE_VALUE_KEY,
	PRESET_BREAKPOINTS,
	isPresetEnvelope,
	readPresetBreakpoint,
	resolvePresetBreakpoint,
	writePresetBreakpoint,
} from './helpers/preset-envelope';
export {
	defaultSummary,
	fieldSummary,
	findTokenEntry,
	isTokenAlias,
	resolveDefaultValue,
} from './helpers/token-summary';
export { autoEntry, noneEntryForRole } from './helpers/fixed-tokens';
export {
	SLOT_COUNT,
	SLOT_LABELS,
	isSlotList,
	isTokenId,
	readSlot,
	toSlotList,
	writeSlot,
} from './helpers/value-shapes';
export { tokenCssVar } from './helpers/token-css-var';
export { mapPaletteToColorControlGroups } from './helpers/palette-groups';
export { DEFAULT_COMPOSITE, parseResolvedShadow } from './helpers/shadow-shorthand';
