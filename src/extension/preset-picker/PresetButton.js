/**
 * The design-token preset button and its dropdown.
 *
 * Renders above a block's inspector tabs (right after the block card) as a row: a button showing the
 * block's current preset — the preset icon plus the preset label, with a muted "(Edited)" suffix and
 * a dot on the icon when any mapped control overrides that preset — followed by a reset button that
 * clears every override. Clicking the preset button opens a dropdown listing the block's presets (the
 * current one checked) and the design-system actions: highlight edits, reset all to the preset, and save
 * the current edits as a new preset.
 *
 * Shared across every preset-enabled block so the control stays identical wherever it surfaces: a block
 * renders it once, above its InspectorControlTabs, passing its name, attributes and setAttributes.
 *
 * A "Preset" label sits above the button, and the per-block Color Palette dropdown renders just below it so
 * the two design-token controls stay adjacent at the top of the inspector (the generic sidebar panel skips
 * the palette for inline-picker blocks precisely because it surfaces here instead).
 */
import { Button, Dropdown, MenuGroup, MenuItem } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { Icon, check } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { get } from 'lodash';
import { activeLibrary, activePresetFor, blockPresets } from './index';
import { PalettePicker } from '../palette-picker';
import { presetIcon, resetIcon } from './icons';
import { capturedTokens } from './capture';
import { SavePresetModal } from './SavePresetModal';
import { hasDesignTokensRest } from '../design-tokens/rest';
import { refreshProjectedCss } from '../design-tokens/live-css';
import { TOKEN_INDICATORS_STORE } from '../token-indicators/store';
import { mappedAttrsFor, resetAttrPatch, usePresetBinding } from '../token-indicators';
import './preset-button.scss';

/**
 * The label for a block's resolved preset slug, or a generic "Default" fallback when the slug names no
 * preset (the default look, or a slug the block does not declare).
 *
 * @param {string} name The block name.
 * @param {string} library The token library slug.
 * @param {string} slug The resolved preset slug (see `activePresetFor()`), not a raw `kbPreset` value.
 *
 * @since TBD
 *
 * @return {string} The preset label.
 */
function currentPresetLabel(name, library, slug) {
	const preset = blockPresets(name, library).find((candidate) => candidate.slug === slug);

	return preset?.label || __('Default', 'kadence-blocks');
}

/**
 * The preset button and dropdown for a block, labeled "Preset", with the per-block Color Palette dropdown
 * just below it. Renders nothing when the block offers no presets.
 *
 * @param {Object}   props               The component props.
 * @param {string}   props.blockName     The block name.
 * @param {Object}   props.attributes    The block's current attributes.
 * @param {Function} props.setAttributes The block's setAttributes.
 * @param {string}   [props.library]     The token library the block is on; defaults to the active library.
 *
 * @since TBD
 *
 * @return {Object|null} The button, or null when the block has no presets.
 */
export function PresetButton({ blockName, attributes, setAttributes, library }) {
	const [saving, setSaving] = useState(false);
	const highlighting = useSelect((select) => select(TOKEN_INDICATORS_STORE).isHighlightingEdits(), []);
	const { setHighlightEdits } = useDispatch(TOKEN_INDICATORS_STORE);

	const resolvedLibrary = library || activeLibrary();
	const binding = usePresetBinding(blockName, attributes, resolvedLibrary);
	const edited = Object.values(binding).some((entry) => entry.overridden);

	// With no overrides there is nothing to highlight, so drop the global flag instead of leaving the
	// disabled "Highlight Edits" toggle stuck in the on state after a reset.
	useEffect(() => {
		if (!edited && highlighting) {
			setHighlightEdits(false);
		}
	}, [edited, highlighting, setHighlightEdits]);

	const presets = blockPresets(blockName, resolvedLibrary);

	if (!presets.length) {
		return null;
	}

	const currentSlug = activePresetFor(blockName, attributes, resolvedLibrary);
	const label = currentPresetLabel(blockName, resolvedLibrary, currentSlug);

	/**
	 * The setAttributes patch that clears every mapped override back to its preset value, so a control
	 * carries no leftover edit.
	 *
	 * @since TBD
	 *
	 * @return {Object} The reset patch.
	 */
	const resetPatch = () =>
		mappedAttrsFor(blockName, resolvedLibrary).reduce(
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
	const selectPreset = (slug) => {
		setAttributes({ ...resetPatch(), kbPreset: slug });
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
			<span className="kb-preset-button__control-label">{__('Preset', 'kadence-blocks')}</span>
			<div className="kb-preset-button__row">
				<Dropdown
					className="kb-preset-button__dropdown"
					contentClassName="kb-preset-button__menu"
					popoverProps={{ placement: 'left-start' }}
					renderToggle={({ isOpen, onToggle }) => (
						<Button className="kb-preset-button" aria-expanded={isOpen} onClick={onToggle}>
							<span className="kb-preset-button__label">
								{label}
								{edited && (
									<span className="kb-preset-button__edited">
										{' '}
										{__('(Edited)', 'kadence-blocks')}
									</span>
								)}
							</span>
							<span className="kb-preset-button__icon">
								<Icon icon={presetIcon} />
								{edited && <span className="kb-preset-button__dot" aria-hidden="true" />}
							</span>
						</Button>
					)}
					renderContent={({ onClose }) => (
						<>
							<MenuGroup label={__('Presets', 'kadence-blocks')}>
								{presets.map((preset) => {
									const isCurrent = preset.slug === currentSlug;

									return (
										<MenuItem
											key={preset.slug}
											role="menuitemradio"
											aria-checked={isCurrent}
											className="kb-preset-button__preset"
											suffix={
												isCurrent ? (
													<Icon className="kb-preset-button__check" icon={check} />
												) : null
											}
											onClick={() => {
												selectPreset(preset.slug);
												onClose();
											}}
										>
											{preset.label}
										</MenuItem>
									);
								})}
							</MenuGroup>
							<MenuGroup>
								<MenuItem
									className="kb-preset-button__action"
									role="menuitemcheckbox"
									aria-checked={highlighting}
									disabled={!edited}
									suffix={
										highlighting ? <Icon className="kb-preset-button__check" icon={check} /> : null
									}
									onClick={() => setHighlightEdits(!highlighting)}
								>
									{__('Highlight Edits', 'kadence-blocks')}
								</MenuItem>
								<MenuItem
									className="kb-preset-button__action"
									disabled={!edited}
									suffix={
										edited ? (
											<Icon className="kb-preset-button__reset-suffix" icon={resetIcon} />
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
									className="kb-preset-button__action"
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
					className="kb-preset-button__reset"
					icon={resetIcon}
					label={__('Reset to preset', 'kadence-blocks')}
					showTooltip
					disabled={!edited}
					onClick={onResetAll}
				/>
			</div>
			<PalettePicker
				value={get(attributes, 'kbPalette', '')}
				onChange={(value) => setAttributes({ kbPalette: value })}
			/>
			{saving && (
				<SavePresetModal
					blockName={blockName}
					library={resolvedLibrary}
					tokens={capturedTokens(blockName, resolvedLibrary, attributes)}
					existingSlugs={presets.map((preset) => preset.slug)}
					onClose={() => setSaving(false)}
					onSaved={(slug) => selectPreset(slug)}
				/>
			)}
		</>
	);
}
