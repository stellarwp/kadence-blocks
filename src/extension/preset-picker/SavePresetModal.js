/**
 * "Save as a new preset" modal.
 *
 * A single input to name the preset. Saving persists the captured token values (the block's current
 * visual state — see {@see capturedTokens}) under the new name through the presets REST endpoint, then
 * updates the in-memory catalog and selects the new preset on the block. Editing a preset's values happens
 * in a separate UI, so this modal only captures a name.
 */
import { Modal, TextControl, Button, Notice } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { appendPreset, setPresetValues } from './index';
import { capturedCatalogValues } from './capture';
import { createPreset } from '../presets/api/client';
import { refreshProjectedCss } from '../design-tokens/live-css';
import { deriveSlug, dedupeSlug } from '../presets/slug';
import './save-preset-modal.scss';

/**
 * The "save as a new preset" modal.
 *
 * @param {Object}   props               The component props.
 * @param {string}   props.blockName     The block name, e.g. "kadence/singlebtn".
 * @param {string}   props.library       The token library the block is on.
 * @param {Object}   props.tokens        The `{ propertyKey: literal }` token map to save (the captured state).
 * @param {string[]} [props.existingSlugs] The block's existing preset slugs, so the generated slug is deduped.
 * @param {Function} props.onClose       Called to dismiss the modal.
 * @param {Function} props.onSaved       Called with the new preset slug after a successful save.
 *
 * @since TBD
 *
 * @return {Object} The modal element.
 */
export function SavePresetModal({ blockName, library, tokens, existingSlugs = [], onClose, onSaved }) {
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [label, setLabel] = useState('');

	const slug = dedupeSlug(deriveSlug(label), existingSlugs);
	const canSave = !saving && label.trim() !== '' && Object.keys(tokens || {}).length > 0;

	/**
	 * Write the new preset from the captured values, then update the catalog and select it.
	 *
	 * @since TBD
	 *
	 * @return {void}
	 */
	const onSave = () => {
		setSaving(true);
		setError('');

		createPreset(blockName, { preset: slug, label: label.trim(), tokens }, library)
			.then(() => {
				const { values, responsive } = capturedCatalogValues(tokens, library);

				appendPreset(blockName, library, { slug, label: label.trim(), userCreated: true });
				// Must precede onSaved: selecting the preset clears the block's overrides.
				setPresetValues(blockName, library, slug, values, responsive);
				refreshProjectedCss();
				onSaved(slug);
				onClose();
			})
			.catch((caught) => {
				setError(caught?.message || __('Could not save the preset.', 'kadence-blocks'));
				setSaving(false);
			});
	};

	return (
		<Modal
			title={__('Save as a new preset', 'kadence-blocks')}
			onRequestClose={onClose}
			className="kb-save-preset-modal"
		>
			{error !== '' && (
				<Notice status="error" onRemove={() => setError('')}>
					{error}
				</Notice>
			)}

			<TextControl label={__('Preset name', 'kadence-blocks')} value={label} onChange={setLabel} />

			<div className="kb-save-preset-modal__actions">
				<Button variant="tertiary" onClick={onClose} disabled={saving}>
					{__('Cancel', 'kadence-blocks')}
				</Button>
				<Button variant="primary" onClick={onSave} isBusy={saving} disabled={!canSave}>
					{__('Save preset', 'kadence-blocks')}
				</Button>
			</div>
		</Modal>
	);
}
