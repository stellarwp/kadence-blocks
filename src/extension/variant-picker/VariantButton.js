/**
 * The design-token variant button and its dropdown.
 *
 * Renders above a block's inspector tabs (right after the block card) as a single button showing the
 * block's current variant — a globe icon plus the variant label, with an "(Edited)" suffix when any
 * mapped control overrides that variant. Clicking it opens a dropdown that lists the block's variants
 * (the current one checked) and the design-system actions: highlight edits, reset all to the variant,
 * and save the current edits as a new variant.
 *
 * Shared across every variant-enabled block so the control stays identical wherever it surfaces: a block
 * renders it once, above its InspectorControlTabs, passing its name, attributes and setAttributes.
 */
import { Button, Dropdown, MenuGroup, MenuItem } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { Icon, check } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';
import { get } from 'lodash';
import { activeSet, blockVariants, blockDefaultVariant } from './index';
import { variantIcon } from './icons';
import { SaveVariantModal } from './SaveVariantModal';
import { hasDesignTokensRest } from '../design-tokens/rest';
import { refreshProjectedCss } from '../design-tokens/live-css';
import { TOKEN_INDICATORS_STORE } from '../token-indicators/store';
import { mappedAttrsFor, resetAttrPatch, useVariantBinding } from '../token-indicators';
import './variant-button.scss';

/**
 * The label for the block's current variant: the selected variant's label, the set's default variant
 * label when none is selected, or a generic "Default" fallback.
 *
 * @param {string} name     The block name.
 * @param {string} set      The token set slug.
 * @param {string} selected The selected variant slug ('' for the default look).
 *
 * @since TBD
 *
 * @return {string} The variant label.
 */
function currentVariantLabel(name, set, selected) {
	const slug = selected || blockDefaultVariant(name, set);
	const variant = blockVariants(name, set).find((candidate) => candidate.slug === slug);

	return variant?.label || __('Default', 'kadence-blocks');
}

/**
 * The variant button and dropdown for a block. Renders nothing when the block offers no variants.
 *
 * @param {Object}   props               The component props.
 * @param {string}   props.blockName     The block name.
 * @param {Object}   props.attributes    The block's current attributes.
 * @param {Function} props.setAttributes The block's setAttributes.
 * @param {string}   [props.set]         The token set the block is on; defaults to kbTokenSet, then the active set.
 *
 * @since TBD
 *
 * @return {Object|null} The button, or null when the block has no variants.
 */
export function VariantButton({ blockName, attributes, setAttributes, set }) {
	const [saving, setSaving] = useState(false);
	const highlighting = useSelect((select) => select(TOKEN_INDICATORS_STORE).isHighlightingEdits(), []);
	const { setHighlightEdits } = useDispatch(TOKEN_INDICATORS_STORE);

	const tokenSet = set || get(attributes, 'kbTokenSet', '') || activeSet();
	const variants = blockVariants(blockName, tokenSet);

	if (!variants.length) {
		return null;
	}

	const selected = get(attributes, 'kbVariant', '');
	const currentSlug = selected || blockDefaultVariant(blockName, tokenSet);
	const label = currentVariantLabel(blockName, tokenSet, selected);
	const edited = Object.values(useVariantBinding(blockName, attributes)).some((entry) => entry.overridden);

	/**
	 * Select a variant on the block by writing its slug into the kbVariant attribute.
	 *
	 * @param {string} slug The variant slug to select.
	 *
	 * @since TBD
	 *
	 * @return {void}
	 */
	const selectVariant = (slug) => setAttributes({ kbVariant: slug });

	/**
	 * Clear every mapped override for the block, so all mapped controls fall back to the selected
	 * variant's values (served by the existing scoped CSS), then refresh the live preview.
	 *
	 * @since TBD
	 *
	 * @return {void}
	 */
	const onResetAll = () => {
		const patch = mappedAttrsFor(blockName, tokenSet).reduce(
			(acc, { attr, kind }) => Object.assign(acc, resetAttrPatch(attr, kind)),
			{}
		);

		setAttributes(patch);
		refreshProjectedCss();
	};

	return (
		<>
			<Dropdown
				className="kb-variant-button__dropdown"
				contentClassName="kb-variant-button__menu"
				popoverProps={{ placement: 'left-start' }}
				renderToggle={({ isOpen, onToggle }) => (
					<Button
						className="kb-variant-button"
						icon={variantIcon}
						iconPosition="right"
						aria-expanded={isOpen}
						onClick={onToggle}
					>
						<span className="kb-variant-button__label">
							{edited
								? sprintf(
										/* translators: %s: the current variant label. */
										__('%s (Edited)', 'kadence-blocks'),
										label
									)
								: label}
						</span>
					</Button>
				)}
				renderContent={({ onClose }) => (
					<>
						<MenuGroup>
							{variants.map((variant) => {
								const isCurrent = variant.slug === currentSlug;

								return (
									<MenuItem
										key={variant.slug}
										role="menuitemradio"
										aria-checked={isCurrent}
										className="kb-variant-button__variant"
										suffix={
											isCurrent ? (
												<Icon className="kb-variant-button__check" icon={check} />
											) : null
										}
										onClick={() => {
											selectVariant(variant.slug);
											onClose();
										}}
									>
										{variant.label}
									</MenuItem>
								);
							})}
						</MenuGroup>
						<MenuGroup>
							<MenuItem
								role="menuitemcheckbox"
								isSelected={highlighting}
								disabled={!edited}
								onClick={() => setHighlightEdits(!highlighting)}
							>
								{__('Highlight Edits', 'kadence-blocks')}
							</MenuItem>
							<MenuItem
								disabled={!edited}
								onClick={() => {
									onResetAll();
									onClose();
								}}
							>
								{__('Reset', 'kadence-blocks')}
							</MenuItem>
							<MenuItem
								disabled={!edited || !hasDesignTokensRest()}
								onClick={() => {
									setSaving(true);
									onClose();
								}}
							>
								{__('Save As a New Variant', 'kadence-blocks')}
							</MenuItem>
						</MenuGroup>
					</>
				)}
			/>
			{saving && (
				<SaveVariantModal
					blockName={blockName}
					set={tokenSet}
					source={selected}
					editSlug=""
					onClose={() => setSaving(false)}
					onSaved={(slug) => selectVariant(slug)}
				/>
			)}
		</>
	);
}
