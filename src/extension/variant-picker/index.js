/**
 * Shared design-token color-variant picker.
 *
 * The catalog (block name -> { default, variants }) is printed by the server-side editor localizer to
 * `window.kadenceDesignTokensVariants`. Both the generic inspector picker (src/early-filters.js) and a
 * block that renders the picker inline in its own Style tab (e.g. kadence/singlebtn) use this so the
 * control stays identical wherever it surfaces.
 */
import { get } from 'lodash';
import { KadenceRadioButtons } from '@kadence/components';
import { __ } from '@wordpress/i18n';

/**
 * The design-token variant catalog the editor localizer prints, or an empty object when the token
 * registry is inactive (no variants offered).
 *
 * @return {Object} The catalog keyed by block name.
 */
function variantCatalog() {
	return get(window, 'kadenceDesignTokensVariants', {}) || {};
}

/**
 * The variants defined for a block in the design-token document, or an empty array when it has none.
 *
 * @param {string} name The block name.
 *
 * @return {Array} The block's variants ([{ slug, label }]).
 */
export function blockVariants(name) {
	return get(variantCatalog(), [name, 'variants'], []);
}

/**
 * The picker control label a block declares for its variant axis (the variant set's `label` in
 * declarations.php), or an empty string when it declares none.
 *
 * @param {string} name The block name.
 *
 * @return {string} The control label, or an empty string.
 */
export function blockVariantLabel(name) {
	return get(variantCatalog(), [name, 'label'], '');
}

/**
 * The color-variant picker for a block. Renders nothing when the block has no variants in the document.
 * Selecting an option writes the kbVariant attribute (via onChange); an empty value selects the block's
 * $default look.
 *
 * @param {Object}   props           The component props.
 * @param {string}   props.name      The block name, used to read its variants from the catalog.
 * @param {string}   props.value     The currently selected variant slug.
 * @param {Function} props.onChange  Called with the selected slug.
 * @param {string}   [props.label]   The control label; defaults to the block's declared label, then a generic fallback.
 * @param {string}   [props.className] The control class.
 *
 * @return {Object|null} The picker element, or null when the block has no variants.
 */
export function VariantPicker({ name, value, onChange, label, className }) {
	const variants = blockVariants(name);

	if (!variants.length) {
		return null;
	}

	const options = [
		{ label: __('Default', 'kadence-blocks'), value: '' },
		...variants.map((variant) => ({ label: variant.label, value: variant.slug })),
	];

	return (
		<KadenceRadioButtons
			label={label || blockVariantLabel(name) || __('Variant', 'kadence-blocks')}
			className={className || 'kb-variant-picker'}
			value={value || ''}
			options={options}
			hideLabel={false}
			wrap={true}
			onChange={onChange}
		/>
	);
}
