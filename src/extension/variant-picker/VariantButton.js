/**
 * The design-token variant button and its dropdown.
 *
 * Renders above a block's inspector tabs (right after the block card) as a row: a button showing the
 * block's current variant — the variant icon plus the variant label, with a muted "(Edited)" suffix and
 * a dot on the icon when any mapped control overrides that variant — followed by a reset button that
 * clears every override. Clicking the variant button opens a dropdown listing the block's variants (the
 * current one checked) and the design-system actions: highlight edits, reset all to the variant, and save
 * the current edits as a new variant.
 *
 * Shared across every variant-enabled block so the control stays identical wherever it surfaces: a block
 * renders it once, above its InspectorControlTabs, passing its name, attributes and setAttributes.
 */
import { Button, Dropdown, MenuGroup, MenuItem } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { Icon, check } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { get } from 'lodash';
import { activeSet, blockVariants, blockDefaultVariant } from './index';
import { variantIcon, resetIcon } from './icons';
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
	 * The setAttributes patch that clears every mapped override back to its preset value, so a control
	 * carries no leftover edit.
	 *
	 * @since TBD
	 *
	 * @return {Object} The reset patch.
	 */
	const resetPatch = () =>
		mappedAttrsFor(blockName, tokenSet).reduce(
			(acc, { attr, kind }) => Object.assign(acc, resetAttrPatch(attr, kind)),
			{}
		);

	/**
	 * Select a preset and clear any overrides in the same write, so the newly selected preset shows its
	 * own values with no edits carried over from the previous selection.
	 *
	 * @param {string} slug The preset slug to select.
	 *
	 * @since TBD
	 *
	 * @return {void}
	 */
	const selectVariant = (slug) => {
		setAttributes({ ...resetPatch(), kbVariant: slug });
		refreshProjectedCss();
	};

	/**
	 * Clear every mapped override for the block, so all mapped controls fall back to the selected
	 * preset's values (served by the existing scoped CSS), then refresh the live preview.
	 *
	 * @since TBD
	 *
	 * @return {void}
	 */
	const onResetAll = () => {
		setAttributes(resetPatch());
		refreshProjectedCss();
	};

	return (
		<>
			<div className="kb-variant-button__row">
				<Dropdown
					className="kb-variant-button__dropdown"
					contentClassName="kb-variant-button__menu"
					popoverProps={{ placement: 'left-start' }}
					renderToggle={({ isOpen, onToggle }) => (
						<Button className="kb-variant-button" aria-expanded={isOpen} onClick={onToggle}>
							<span className="kb-variant-button__label">
								{label}
								{edited && (
									<span className="kb-variant-button__edited">
										{' '}
										{__('(Edited)', 'kadence-blocks')}
									</span>
								)}
							</span>
							<span className="kb-variant-button__icon">
								<Icon icon={variantIcon} />
								{edited && <span className="kb-variant-button__dot" aria-hidden="true" />}
							</span>
						</Button>
					)}
					renderContent={({ onClose }) => (
						<>
							<MenuGroup label={__('Presets', 'kadence-blocks')}>
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
									className="kb-variant-button__action"
									role="menuitemcheckbox"
									aria-checked={highlighting}
									disabled={!edited}
									suffix={
										highlighting ? <Icon className="kb-variant-button__check" icon={check} /> : null
									}
									onClick={() => setHighlightEdits(!highlighting)}
								>
									{__('Highlight Edits', 'kadence-blocks')}
								</MenuItem>
								<MenuItem
									className="kb-variant-button__action"
									disabled={!edited}
									suffix={
										edited ? (
											<Icon className="kb-variant-button__reset-suffix" icon={resetIcon} />
										) : null
									}
									onClick={() => {
										onResetAll();
										onClose();
									}}
								>
									{__('Reset', 'kadence-blocks')}
								</MenuItem>
								<MenuItem
									className="kb-variant-button__action"
									disabled={!edited || !hasDesignTokensRest()}
									onClick={() => {
										setSaving(true);
										onClose();
									}}
								>
									{__('Save As a New Preset', 'kadence-blocks')}
								</MenuItem>
							</MenuGroup>
						</>
					)}
				/>
				<Button
					className="kb-variant-button__reset"
					icon={resetIcon}
					label={__('Reset to preset', 'kadence-blocks')}
					showTooltip
					disabled={!edited}
					onClick={onResetAll}
				/>
			</div>
			{saving && (
				<SaveVariantModal
					blockName={blockName}
					set={tokenSet}
					source={selected}
					onClose={() => setSaving(false)}
					onSaved={(slug) => selectVariant(slug)}
				/>
			)}
		</>
	);
}
