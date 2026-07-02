/**
 * Shared per-block token-set override picker.
 *
 * The catalog ({ active, sets: [{ slug, label }] }) is printed by the server-side editor localizer to
 * `window.kadenceDesignTokensSets`. Both the generic inspector picker (src/early-filters.js) and a block
 * that renders the picker inline in its own Style tab (e.g. kadence/singlebtn) use this so the control
 * stays identical wherever it surfaces.
 *
 * Selecting a set writes its slug to the kbVariant-companion `kbTokenSet` attribute, which the save/preview
 * filters turn into a `data-kb-token-set` attribute on the block. That re-points the block's canonical
 * `--kb-token--*` vars at the chosen set's namespaced vars via the projector's switch selectors. An empty
 * value (the default) leaves the attribute unset, so the block follows the active set.
 */
import { get } from 'lodash';
import { KadenceRadioButtons } from '@kadence/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * The token-set catalog the editor localizer prints, or an empty catalog when the token registry is
 * inactive (no sets offered).
 *
 * @return {Object} The catalog ({ active, sets }).
 */
function tokenSetCatalog() {
	return get(window, 'kadenceDesignTokensSets', {}) || {};
}

/**
 * The selectable token sets ([{ slug, label }]), or an empty array when none are printed.
 *
 * @return {Array} The token sets.
 */
export function selectableSets() {
	return get(tokenSetCatalog(), 'sets', []);
}

/**
 * The per-block token-set override picker. Renders nothing when fewer than two sets exist (there is
 * nothing to override to). Selecting an option writes the kbTokenSet attribute (via onChange); an empty
 * value follows the active set.
 *
 * The currently active set is annotated "(active)" so it reads as a concrete set that happens to be active
 * right now, distinct from "Follow active set" which tracks whichever set is active over time.
 *
 * @param {Object}   props             The component props.
 * @param {string}   props.value       The currently selected set slug.
 * @param {Function} props.onChange    Called with the selected slug.
 * @param {string}   [props.label]     The control label; defaults to "Token Set". Pass "" to omit it when a
 *                                     section heading already supplies the label.
 * @param {string}   [props.className] The control class.
 *
 * @return {Object|null} The picker element, or null when there is nothing to override to.
 */
export function TokenSetPicker({ value, onChange, label = __('Token Set', 'kadence-blocks'), className }) {
	const catalog = tokenSetCatalog();
	const sets = get(catalog, 'sets', []);

	if (sets.length < 2) {
		return null;
	}

	const active = get(catalog, 'active', '');

	const options = [
		{ label: __('Follow active set', 'kadence-blocks'), value: '' },
		...sets.map((set) => ({
			label:
				set.slug === active
					? // translators: %s is the token set name.
						sprintf(__('%s (active)', 'kadence-blocks'), set.label)
					: set.label,
			value: set.slug,
		})),
	];

	return (
		<KadenceRadioButtons
			label={label}
			className={className || 'kb-token-set-picker'}
			value={value || ''}
			options={options}
			wrap={true}
			onChange={onChange}
		/>
	);
}
