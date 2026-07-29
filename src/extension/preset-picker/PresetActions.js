/**
 * Create / edit / delete controls for a block's design-token presets, plus the design-system actions:
 * a highlight-edits toggle and a reset-all that clears every mapped override for the block.
 *
 * Renders a "Create new preset" button for every block, and, when the selected preset is a user-created
 * one, "Edit" and "Delete" buttons. Deleting the preset the set currently defaults to first reassigns the
 * default to another preset (so the default is never left dangling), then removes it. Shared by the generic
 * inspector panel and a block's inline picker so the controls stay identical wherever they surface. Renders
 * nothing when the editor lacks the REST descriptor.
 */
import { Button, Notice, ToggleControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { SavePresetModal } from './SavePresetModal';
import { blockPresets, blockDefaultPreset, isUserPreset, removePreset } from './index';
import { capturedTokens } from './capture';
import { deletePreset, setPresetDefault } from '../presets/api/client';
import { hasDesignTokensRest } from '../design-tokens/rest';
import { refreshProjectedCss } from '../design-tokens/live-css';
import { TOKEN_INDICATORS_STORE } from '../token-indicators/store';
import { mappedAttrsFor, resetAttrPatch } from '../token-indicators';

/**
 * The preset create/edit/delete controls, plus the design-system actions: a highlight-edits toggle and a
 * reset-all that clears every mapped override for the block.
 *
 * @param {Object}   props               The component props.
 * @param {string}   props.blockName     The block name.
 * @param {string}   props.set           The token set the block is on.
 * @param {string}   props.selected      The block's currently selected preset slug ('' for the default look).
 * @param {Function} props.onSelect      Called with a preset slug to select it on the block.
 * @param {Object}   props.attributes    The block's current attributes (for reset-all).
 * @param {Function} props.setAttributes The block's setAttributes (for reset-all).
 *
 * @return {Object|null} The controls, or null when the presets REST API is unavailable.
 */
export function PresetActions({ blockName, set, selected, onSelect, attributes, setAttributes }) {
	const [mode, setMode] = useState('none');
	const [confirming, setConfirming] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState('');

	const highlighting = useSelect((select) => select(TOKEN_INDICATORS_STORE).isHighlightingEdits(), []);
	const { setHighlightEdits } = useDispatch(TOKEN_INDICATORS_STORE);

	if (!hasDesignTokensRest()) {
		return null;
	}

	const canManage = selected !== '' && isUserPreset(blockName, set, selected);

	/**
	 * Clear every mapped override for the block, so all mapped controls fall back to the selected
	 * preset's values (served by the existing scoped CSS), then refresh the live preview.
	 *
	 * @since TBD
	 *
	 * @return {void}
	 */
	const onResetAll = () => {
		const patch = mappedAttrsFor(blockName, set).reduce(
			(acc, { attr, kind }) => Object.assign(acc, resetAttrPatch(attr, kind)),
			{}
		);

		setAttributes(patch);
		refreshProjectedCss();
	};

	/**
	 * Delete the selected user preset, first moving the default off it when it is the current default.
	 *
	 * @return {void}
	 */
	const onDelete = () => {
		setBusy(true);
		setError('');

		const isDefault = blockDefaultPreset(blockName, set) === selected;
		const fallback = blockPresets(blockName, set)
			.map((preset) => preset.slug)
			.find((slug) => slug !== selected);

		const reassign = isDefault && fallback ? setPresetDefault(blockName, fallback, set) : Promise.resolve();

		reassign
			.then(() => deletePreset(blockName, selected, set))
			.then(() => {
				removePreset(blockName, set, selected);
				refreshProjectedCss();
				onSelect('');
				setConfirming(false);
				setBusy(false);
			})
			.catch((caught) => {
				setError(caught?.message || __('Could not delete the preset.', 'kadence-blocks'));
				setBusy(false);
			});
	};

	return (
		<>
			{error !== '' && (
				<Notice status="error" onRemove={() => setError('')}>
					{error}
				</Notice>
			)}

			<Button variant="secondary" onClick={() => setMode('create')}>
				{__('Save as a new preset', 'kadence-blocks')}
			</Button>

			{canManage && !confirming && (
				<Button variant="tertiary" isDestructive onClick={() => setConfirming(true)}>
					{__('Delete preset', 'kadence-blocks')}
				</Button>
			)}

			{canManage && confirming && (
				<>
					<p>
						{sprintf(
							/* translators: %s: preset slug. */
							__('Delete the "%s" preset? This cannot be undone.', 'kadence-blocks'),
							selected
						)}
					</p>
					<Button variant="tertiary" onClick={() => setConfirming(false)} disabled={busy}>
						{__('Cancel', 'kadence-blocks')}
					</Button>
					<Button variant="primary" isDestructive isBusy={busy} onClick={onDelete}>
						{__('Delete', 'kadence-blocks')}
					</Button>
				</>
			)}

			<ToggleControl
				label={__('Highlight edits', 'kadence-blocks')}
				help={__('Emphasize controls that override the selected preset.', 'kadence-blocks')}
				checked={highlighting}
				onChange={(on) => setHighlightEdits(on)}
			/>

			<Button variant="tertiary" onClick={onResetAll}>
				{__('Reset all to preset', 'kadence-blocks')}
			</Button>

			{mode !== 'none' && (
				<SavePresetModal
					blockName={blockName}
					set={set}
					tokens={capturedTokens(blockName, set, attributes)}
					existingSlugs={blockPresets(blockName, set).map((preset) => preset.slug)}
					onClose={() => setMode('none')}
					onSaved={(slug) => onSelect(slug)}
				/>
			)}
		</>
	);
}
