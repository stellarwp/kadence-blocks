/**
 * Shared design-token preset picker.
 *
 * The catalog is printed by the server-side editor localizer to `window.kadenceDesignTokensPresets`,
 * keyed by token library then by block:
 * `{ active, sets: { <slug>: { <block>: { default, presets, properties, label } } } }`.
 * Reads take the token library a block is on (its `kbTokenSet`, or the active library). A picker-driven
 * block declares one binding library; its selection lives in the block's `kbPreset` string attribute. Both
 * the generic inspector picker (src/early-filters.js) and a block that renders the picker inline in its own
 * Style tab (e.g. kadence/singlebtn) use this so the control stays identical wherever it surfaces.
 */
import { get } from 'lodash';
import { KadenceRadioButtons } from '@kadence/components';
import { __ } from '@wordpress/i18n';

/**
 * The whole design-token preset catalog the editor localizer prints, or an empty object when the token
 * registry is inactive (no presets offered).
 *
 * @return {Object} The catalog ({ active, sets }).
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
	return get(presetCatalog(), ['sets', library || activeLibrary()], {}) || {};
}

/**
 * The catalog entry for a block's binding library in a token library, or null when it offers none.
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
 * The picker control label a block declares for its binding library (the library's `label` in
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
 * Remove a preset from the in-memory catalog for a block's library, so the picker drops it without a page
 * reload.
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
}

/**
 * The preset picker for a block. Renders nothing when the block has no presets in the library.
 * Selecting an option calls onChange with the chosen preset slug (the caller writes it into the block's
 * kbPreset attribute); an empty value selects the block's $default look.
 *
 * @param {Object}   props             The component props.
 * @param {string}   props.name        The block name, used to read its presets from the catalog.
 * @param {string}   props.value       The currently selected preset slug.
 * @param {Function} props.onChange    Called with the selected slug.
 * @param {string}   [props.library]   The token library the block is on; defaults to the active library.
 * @param {string}   [props.label]     The control label; defaults to the block's declared label, then a generic fallback.
 * @param {string}   [props.className] The control class.
 *
 * @return {Object|null} The picker element, or null when the block has no presets.
 */
export function PresetPicker({ name, value, onChange, library, label, className }) {
	const presets = blockPresets(name, library);

	if (!presets.length) {
		return null;
	}

	const options = [
		{ label: __('Default', 'kadence-blocks'), value: '' },
		...presets.map((preset) => ({ label: preset.label, value: preset.slug })),
	];

	return (
		<KadenceRadioButtons
			label={label || blockPresetLabel(name, library) || __('Preset', 'kadence-blocks')}
			className={className || 'kb-preset-picker'}
			value={value || ''}
			options={options}
			hideLabel={false}
			wrap={true}
			onChange={onChange}
		/>
	);
}
