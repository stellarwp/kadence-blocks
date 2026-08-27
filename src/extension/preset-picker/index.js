/**
 * The design-token preset catalog: the accessors every preset surface reads.
 *
 * The catalog is printed by the server-side editor localizer to `window.kadenceDesignTokensPresets`,
 * keyed by token library then by block:
 * `{ active, libraries: { <slug>: { <block>: { default, presets, properties, label } } } }`.
 * Reads take the active token library. A picker-driven block declares one binding set; its selection lives
 * in the block's `kbPreset` string attribute.
 *
 * The control itself is `PresetButton`, rendered either by the generic inspector filter
 * (src/early-filters.js) or, for a block that places it inside its own inspector layout, by that block
 * (e.g. kadence/singlebtn). Both read the catalog through this module, so the control stays identical
 * wherever it surfaces.
 */
import { get } from 'lodash';

/**
 * The whole design-token preset catalog the editor localizer prints, or an empty object when the token
 * registry is inactive (no presets offered).
 *
 * @return {Object} The catalog ({ active, libraries }).
 */
function presetCatalog() {
	return get(window, 'kadenceDesignTokensPresets', {}) || {};
}

/**
 * The active token library slug, defaulting to "default".
 *
 * @return {string} The active library slug.
 */
export function activeLibrary() {
	return get(presetCatalog(), 'active', 'default') || 'default';
}

/**
 * The per-block catalog for a token library, defaulting to the active library.
 *
 * @param {string} [library] The token library slug.
 * @return {Object} The per-block catalog for the library (block => entry).
 */
function libraryBlocks(library) {
	return get(presetCatalog(), ['libraries', library || activeLibrary()], {}) || {};
}

/**
 * The catalog entry for a block's binding set in a token library, or null when it offers none.
 *
 * @param {string} name     The block name.
 * @param {string} [library] The token library slug; defaults to the active library.
 * @return {Object|null} The library entry ({ default, presets, properties, label }).
 */
function blockEntry(name, library) {
	return get(libraryBlocks(library), [name], null) || null;
}

/**
 * The presets defined for a block's library, or an empty array when it has none.
 *
 * @param {string} name     The block name.
 * @param {string} [library] The token library slug; defaults to the active library.
 * @return {Array} The block's presets ([{ slug, label, userCreated }]).
 */
export function blockPresets(name, library) {
	return get(blockEntry(name, library), 'presets', []);
}

/**
 * The picker control label a block declares for its binding set (the set's `label` in
 * declarations.php), or an empty string when it declares none.
 *
 * @param {string} name     The block name.
 * @param {string} [library] The token library slug; defaults to the active library.
 * @return {string} The control label, or an empty string.
 */
export function blockPresetLabel(name, library) {
	return get(blockEntry(name, library), 'label', '');
}

/**
 * The controllable surface for a block's library: one { key, kind, token, control_attr } entry per bound
 * property.
 *
 * @param {string} name     The block name.
 * @param {string} [library] The token library slug; defaults to the active library.
 * @return {Array} The block's surface ([{ key, kind, token, control_attr }]).
 */
export function blockProperties(name, library) {
	return get(blockEntry(name, library), 'properties', []);
}

/**
 * The per-preset resolved values for a block's library: `{ <presetSlug>: { <property>: literalValue } }`.
 * Empty object when the block offers none. Used by the token-indicators hook to compare a control's
 * current value against the selected preset's value.
 *
 * @param {string} name     The block name.
 * @param {string} [library] The token library slug; defaults to the active library.
 *
 * @since TBD
 *
 * @return {Object} The per-preset value map.
 */
export function blockPresetValues(name, library) {
	return get(blockEntry(name, library), 'values', {}) || {};
}

/**
 * The per-preset CSS REFERENCES for a block's library: `{ <presetSlug>: { <property>: 'var(...)' } }` —
 * the same strings the projected CSS uses. Empty object when the block offers none.
 *
 * The sibling of `blockPresetValues`, for a different job. A literal is what a control compares against
 * to decide bound-vs-overridden; a reference is what the editor paints with when it has to apply a preset
 * value itself instead of letting a stylesheet do it. Only the reference follows a per-block color
 * palette: the projector's `[data-kb-palette]` layer redefines the token variables and the editor mirrors
 * the block's palette onto its wrapper, so a `var()` chain resolves through whichever palette the block
 * is on, while a literal was flattened against the default palette before it ever reached the editor.
 *
 * @param {string} name      The block name.
 * @param {string} [library] The token library slug; defaults to the active library.
 *
 * @since TBD
 *
 * @return {Object} The per-preset reference map.
 */
export function blockPresetReferences(name, library) {
	return get(blockEntry(name, library), 'references', {}) || {};
}

/**
 * The per-preset, per-breakpoint resolved values for a block's library:
 * `{ <presetSlug>: { <breakpoint>: { <property>: literalValue } } }`. Empty object when the block
 * offers none, and a preset that declares no breakpoint overrides carries an empty map rather than
 * being absent. The literals are flattened exactly like `blockPresetValues`, so a control can
 * compare and display them the same way at any device.
 *
 * @param {string} name     The block name.
 * @param {string} [library] The token library slug; defaults to the active library.
 *
 * @since TBD
 *
 * @return {Object} The per-preset, per-breakpoint value map.
 */
export function blockPresetResponsive(name, library) {
	return get(blockEntry(name, library), 'responsive', {}) || {};
}

/**
 * The block library's default preset slug in a token library.
 *
 * @param {string} name     The block name.
 * @param {string} [library] The token library slug; defaults to the active library.
 * @return {string} The default preset slug, or an empty string.
 */
export function blockDefaultPreset(name, library) {
	return get(blockEntry(name, library), 'default', '');
}

/**
 * The block's active preset slug for a set of attributes: the explicit `kbPreset` selection when it
 * still names a preset the block declares, otherwise the library's default preset. Mirrors the PHP
 * resolver's `has_preset()` / `default_preset()` fallback (`Preset_Resolver`), so a `kbPreset` left
 * over from a deleted preset degrades here the same way it does server-side, instead of every caller
 * trusting a non-empty string at face value.
 *
 * @param {string} name       The block name.
 * @param {Object} attributes The block's current attributes.
 * @param {string} [library]  The token library slug; defaults to the active library.
 *
 * @since TBD
 *
 * @return {string} The resolved preset slug, or '' when the block declares no default either.
 */
export function activePresetFor(name, attributes, library) {
	const resolvedLibrary = library || activeLibrary();
	const selected = get(attributes, 'kbPreset', '');
	const exists = selected && blockPresets(name, resolvedLibrary).some((preset) => preset.slug === selected);

	return exists ? selected : blockDefaultPreset(name, resolvedLibrary);
}

/**
 * Whether a preset slug is a user-created one for a block's library (editable and deletable). A baseline
 * preset, or one that only shadows a baseline preset, is not.
 *
 * @param {string} name    The block name.
 * @param {string} library The token library slug.
 * @param {string} slug    The preset slug.
 * @return {boolean} True when the preset is user-created.
 */
export function isUserPreset(name, library, slug) {
	return blockPresets(name, library).some((preset) => preset.slug === slug && preset.userCreated);
}

/**
 * Append a user-created preset to the in-memory catalog for a block's library, so the picker offers it
 * without a page reload. A no-op when the block has no entry for the token library.
 *
 * @param {string} name    The block name.
 * @param {string} library The token library slug.
 * @param {Object} preset  The preset to append ({ slug, label, userCreated }).
 * @return {void}
 */
export function appendPreset(name, library, preset) {
	const entry = blockEntry(name, library);

	if (!entry || !Array.isArray(entry.presets)) {
		return;
	}

	if (!entry.presets.some((existing) => existing.slug === preset.slug)) {
		entry.presets.push(preset);
	}
}

/**
 * Seed a preset's resolved values in the in-memory catalog for a block's library.
 *
 * A preset saved from the editor is absent from the localized catalog until the next page load, and the
 * catalog's `values` map is what tells a control it is bound to the preset and which value it inherits.
 * Without this seed the freshly selected preset looks like a preset that defines nothing: every control
 * unbinds, so the block reads as un-edited and its values cannot be edited into a further preset.
 *
 * A no-op when the block has no entry for the token library.
 *
 * @param {string} name       The block name.
 * @param {string} library    The token library slug.
 * @param {string} slug       The preset slug.
 * @param {Object} values     The preset's resolved values ({ property: literal }).
 * @param {Object} responsive The preset's per-breakpoint values ({ breakpoint: { property: literal } }).
 *
 * @since TBD
 *
 * @return {void}
 */
export function setPresetValues(name, library, slug, values, responsive) {
	const entry = blockEntry(name, library);

	if (!entry) {
		return;
	}

	entry.values = { ...(entry.values || {}), [slug]: values || {} };
	entry.responsive = { ...(entry.responsive || {}), [slug]: responsive || {} };
}

/**
 * Remove a preset from the in-memory catalog for a block's library, so the picker drops it without a page
 * reload. Its values go with it, so a later preset reusing the slug never inherits them.
 *
 * @param {string} name    The block name.
 * @param {string} library The token library slug.
 * @param {string} slug    The preset slug to remove.
 * @return {void}
 */
export function removePreset(name, library, slug) {
	const entry = blockEntry(name, library);

	if (!entry || !Array.isArray(entry.presets)) {
		return;
	}

	entry.presets = entry.presets.filter((existing) => existing.slug !== slug);

	delete (entry.values || {})[slug];
	delete (entry.responsive || {})[slug];
}
