/**
 * Shared design-token variant picker.
 *
 * The catalog (block name -> { groups: [ { group, implicit, label, default, variants } ] }) is printed by
 * the server-side editor localizer to `window.kadenceDesignTokensVariants`. A block's variants are
 * organized into groups (axes): a flat block surfaces a single group flagged `implicit`, while a grouped
 * block surfaces one entry per axis. {@link VariantPicker} renders one single-select control per group and
 * writes the right attribute for each — the `kbVariant` string for the implicit group (the back-compat
 * single-axis alias), or the group's slot in the `kbVariants` map for an explicit axis. Both the generic
 * inspector picker (src/early-filters.js) and a block that renders the picker inline in its own Style tab
 * (e.g. kadence/singlebtn) use it, so the control stays identical wherever it surfaces.
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
 * The variant groups (axes) defined for a block, or an empty array when it has none.
 *
 * @param {string} name The block name.
 *
 * @return {Array} The block's groups ([{ group, implicit, label, default, variants }]).
 */
export function blockGroups(name) {
	return get(variantCatalog(), [name, 'groups'], []);
}

/**
 * The radio options for a group: a leading "Default" (empty value, the group's $default look) followed by
 * each named variant.
 *
 * @param {Array} variants The group's variants ([{ slug, label }]).
 *
 * @return {Array} The radio options ([{ label, value }]).
 */
function variantOptions(variants) {
	return [
		{ label: __('Default', 'kadence-blocks'), value: '' },
		...variants.map((variant) => ({ label: variant.label, value: variant.slug })),
	];
}

/**
 * The design-token variant picker for a block: one single-select control per variant group (axis). Renders
 * nothing when the block has no groups in the document. Each control reads and writes its own attribute, so
 * the axes are independent and a block stays back-compatible:
 *
 *   - the implicit group (a flat block's single axis) reads/writes the `kbVariant` string;
 *   - an explicit group reads/writes its slot in the `kbVariants` map.
 *
 * An empty value selects that axis's $default look. The save/preview filters turn either attribute into the
 * kb-variant-- classes the projector's scoped CSS hooks.
 *
 * @param {Object}   props               The component props.
 * @param {string}   props.name          The block name, used to read its groups from the catalog.
 * @param {Object}   props.attributes    The block attributes (read for kbVariant / kbVariants).
 * @param {Function} props.setAttributes Called to write the selected attribute(s).
 * @param {string}   [props.className]   The control class.
 *
 * @return {Object|null} The picker elements, or null when the block has no groups.
 */
export function VariantPicker({ name, attributes, setAttributes, className }) {
	const groups = blockGroups(name);

	if (!groups.length) {
		return null;
	}

	const kbVariant = get(attributes, 'kbVariant', '');
	const kbVariants = get(attributes, 'kbVariants', {});

	return (
		<>
			{groups.map((group) => {
				const value = group.implicit ? kbVariant : get(kbVariants, group.group, '');
				const onChange = group.implicit
					? (slug) => setAttributes({ kbVariant: slug })
					: (slug) => setAttributes({ kbVariants: { ...kbVariants, [group.group]: slug } });

				return (
					<KadenceRadioButtons
						key={group.group || '__implicit'}
						label={group.label || group.group || __('Variant', 'kadence-blocks')}
						className={className || 'kb-variant-picker'}
						value={value}
						options={variantOptions(group.variants)}
						hideLabel={false}
						wrap={true}
						onChange={onChange}
					/>
				);
			})}
		</>
	);
}
