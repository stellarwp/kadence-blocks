/**
 * Shared design-token variant picker.
 *
 * The catalog is printed by the server-side editor localizer to `window.kadenceDesignTokensVariants`,
 * keyed by token set then by block:
 * `{ active, sets: { <slug>: { <block>: { default, variants, properties, label } } } }`.
 * Reads take the token set a block is on (its `kbTokenSet`, or the active set). A picker-driven block
 * declares one variant set; its selection lives in the block's `kbVariant` string attribute. Both the
 * generic inspector picker (src/early-filters.js) and a block that renders the picker inline in its own
 * Style tab (e.g. kadence/singlebtn) use this so the control stays identical wherever it surfaces.
 */
import { get } from 'lodash';
import { KadenceRadioButtons } from '@kadence/components';
import { __ } from '@wordpress/i18n';

/**
 * The whole design-token variant catalog the editor localizer prints, or an empty object when the token
 * registry is inactive (no variants offered).
 *
 * @return {Object} The catalog ({ active, sets }).
 */
function variantCatalog() {
	return get(window, 'kadenceDesignTokensVariants', {}) || {};
}

/**
 * The active token set slug, defaulting to "default".
 *
 * @return {string} The active set slug.
 */
export function activeSet() {
	return get(variantCatalog(), 'active', 'default') || 'default';
}

/**
 * The per-block catalog for a token set, defaulting to the active set.
 *
 * @param {string} [set] The token set slug.
 * @return {Object} The per-block catalog for the set (block => entry).
 */
function setBlocks(set) {
	return get(variantCatalog(), ['sets', set || activeSet()], {}) || {};
}

/**
 * The catalog entry for a block's variant set in a token set, or null when it offers none.
 *
 * @param {string} name  The block name.
 * @param {string} [set] The token set slug; defaults to the active set.
 * @return {Object|null} The set entry ({ default, variants, properties, label }).
 */
function blockEntry(name, set) {
	return get(setBlocks(set), [name], null) || null;
}

/**
 * The variants defined for a block's set, or an empty array when it has none.
 *
 * @param {string} name  The block name.
 * @param {string} [set] The token set slug; defaults to the active set.
 * @return {Array} The block's variants ([{ slug, label, userCreated }]).
 */
export function blockVariants(name, set) {
	return get(blockEntry(name, set), 'variants', []);
}

/**
 * The picker control label a block declares for its variant set (the set's `label` in declarations.php),
 * or an empty string when it declares none.
 *
 * @param {string} name  The block name.
 * @param {string} [set] The token set slug; defaults to the active set.
 * @return {string} The control label, or an empty string.
 */
export function blockVariantLabel(name, set) {
	return get(blockEntry(name, set), 'label', '');
}

/**
 * The controllable surface for a block's set: one { key, kind, token } entry per bound property.
 *
 * @param {string} name  The block name.
 * @param {string} [set] The token set slug; defaults to the active set.
 * @return {Array} The block's surface ([{ key, kind, token }]).
 */
export function blockProperties(name, set) {
	return get(blockEntry(name, set), 'properties', []);
}

/**
 * The block set's default variant slug in a token set.
 *
 * @param {string} name  The block name.
 * @param {string} [set] The token set slug; defaults to the active set.
 * @return {string} The default variant slug, or an empty string.
 */
export function blockDefaultVariant(name, set) {
	return get(blockEntry(name, set), 'default', '');
}

/**
 * Whether a variant slug is a user-created one for a block's set (editable and deletable). A baseline
 * variant, or one that only shadows a baseline variant, is not.
 *
 * @param {string} name The block name.
 * @param {string} set  The token set slug.
 * @param {string} slug The variant slug.
 * @return {boolean} True when the variant is user-created.
 */
export function isUserVariant(name, set, slug) {
	return blockVariants(name, set).some((variant) => variant.slug === slug && variant.userCreated);
}

/**
 * Append a user-created variant to the in-memory catalog for a block's set, so the picker offers it without
 * a page reload. A no-op when the block has no set for the token set.
 *
 * @param {string} name    The block name.
 * @param {string} set     The token set slug.
 * @param {Object} variant The variant to append ({ slug, label, userCreated }).
 * @return {void}
 */
export function appendVariant(name, set, variant) {
	const entry = blockEntry(name, set);

	if (!entry || !Array.isArray(entry.variants)) {
		return;
	}

	if (!entry.variants.some((existing) => existing.slug === variant.slug)) {
		entry.variants.push(variant);
	}
}

/**
 * Remove a variant from the in-memory catalog for a block's set, so the picker drops it without a page
 * reload.
 *
 * @param {string} name The block name.
 * @param {string} set  The token set slug.
 * @param {string} slug The variant slug to remove.
 * @return {void}
 */
export function removeVariant(name, set, slug) {
	const entry = blockEntry(name, set);

	if (!entry || !Array.isArray(entry.variants)) {
		return;
	}

	entry.variants = entry.variants.filter((existing) => existing.slug !== slug);
}

/**
 * The variant picker for a block. Renders nothing when the block has no variants in the set.
 * Selecting an option calls onChange with the chosen variant slug (the caller writes it into the block's
 * kbVariant attribute); an empty value selects the block's $default look.
 *
 * @param {Object}   props             The component props.
 * @param {string}   props.name        The block name, used to read its variants from the catalog.
 * @param {string}   props.value       The currently selected variant slug.
 * @param {Function} props.onChange    Called with the selected slug.
 * @param {string}   [props.set]       The token set the block is on; defaults to the active set.
 * @param {string}   [props.label]     The control label; defaults to the block's declared label, then a generic fallback.
 * @param {string}   [props.className] The control class.
 *
 * @return {Object|null} The picker element, or null when the block has no variants.
 */
export function VariantPicker({ name, value, onChange, set, label, className }) {
	const variants = blockVariants(name, set);

	if (!variants.length) {
		return null;
	}

	const options = [
		{ label: __('Default', 'kadence-blocks'), value: '' },
		...variants.map((variant) => ({ label: variant.label, value: variant.slug })),
	];

	return (
		<KadenceRadioButtons
			label={label || blockVariantLabel(name, set) || __('Variant', 'kadence-blocks')}
			className={className || 'kb-variant-picker'}
			value={value || ''}
			options={options}
			hideLabel={false}
			wrap={true}
			onChange={onChange}
		/>
	);
}
